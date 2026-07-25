import { NextResponse } from 'next/server';
import { matchComplementaryTeam } from '@/lib/ai-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { skills = [], experienceLevel = 'intermediate', reshuffleCount = 0 } = body;

    if (!Array.isArray(skills)) {
      return NextResponse.json({ error: 'skills must be an array' }, { status: 400 });
    }

    let teamRoster = matchComplementaryTeam(skills, experienceLevel);

    // If reshuffling, rotate order slightly for demo variety
    if (reshuffleCount > 0) {
      teamRoster = [...teamRoster].sort(() => 0.5 - Math.random());
    }

    return NextResponse.json({
      success: true,
      teamRoster,
      matchedSkillsCoverage: ['Frontend', 'Backend', 'AI/ML', 'UX/UI'],
    });
  } catch (error: any) {
    console.error('Error in /api/match-team route:', error);
    return NextResponse.json(
      { error: 'Failed to process team match', details: error.message },
      { status: 500 }
    );
  }
}
