import { NextResponse } from 'next/server';
import { evaluateProjectWithLLM } from '@/lib/ai-engine';
import { dbService } from '@/lib/supabase';

async function fetchGitHubRepoSourceFiles(repoUrl: string): Promise<{ filePath: string; content: string }[]> {
  try {
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return [];
    const [, owner, rawRepo] = match;
    const repo = rawRepo.replace(/\.git$/, '');

    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`, {
      headers: { 'User-Agent': 'HackOps-AI-Evaluator' },
    });

    if (!treeRes.ok) return [];

    const treeData = await treeRes.json();
    const sourceFiles = (treeData.tree || [])
      .filter((f: any) => f.type === 'blob' && /\.(ts|tsx|py|js|jsx|go|rs)$/i.test(f.path) && !/node_modules|dist|\.next/i.test(f.path))
      .slice(0, 3);

    const snippets: { filePath: string; content: string }[] = [];
    for (const file of sourceFiles) {
      try {
        const fileRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${file.path}`);
        if (fileRes.ok) {
          const content = await fileRes.text();
          snippets.push({ filePath: file.path, content: content.slice(0, 1200) });
        }
      } catch (e) {}
    }
    return snippets;
  } catch (e) {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, repoUrl, readmeText, fileTree, description, apiKey, groqApiKey } = body;

    const geminiKey = request.headers.get('x-gemini-key') || apiKey;
    const groqKey = request.headers.get('x-groq-key') || groqApiKey;

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    let sourceCodeSnippets: { filePath: string; content: string }[] = [];
    if (repoUrl && repoUrl.includes('github.com')) {
      sourceCodeSnippets = await fetchGitHubRepoSourceFiles(repoUrl);
    }

    const evaluation = await evaluateProjectWithLLM({
      projectId,
      readmeText: readmeText || 'Standard React & Next.js starter repository',
      fileTree: fileTree || 'root/\n├── package.json\n└── README.md',
      description: description || 'AI hackathon submission',
      apiKey: geminiKey,
      groqApiKey: groqKey,
      sourceCodeSnippets,
    });

    // Save to DB / store
    await dbService.saveEvaluation(projectId, evaluation);

    return NextResponse.json({ success: true, evaluation });
  } catch (error: any) {
    console.error('Error in /api/evaluate route:', error);
    return NextResponse.json(
      { error: 'Failed to process evaluation', details: error.message },
      { status: 500 }
    );
  }
}
