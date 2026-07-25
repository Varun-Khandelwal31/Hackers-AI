import { NextResponse } from 'next/server';
import { evaluateProjectWithLLM } from '@/lib/ai-engine';
import { dbService } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, repoUrl, readmeText, fileTree, description, apiKey } = body;

    const authHeaderKey = request.headers.get('x-gemini-key') || apiKey;

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const evaluation = await evaluateProjectWithLLM({
      projectId,
      readmeText: readmeText || 'Standard React & Next.js starter repository',
      fileTree: fileTree || 'root/\n├── package.json\n└── README.md',
      description: description || 'AI hackathon submission',
      apiKey: authHeaderKey,
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
