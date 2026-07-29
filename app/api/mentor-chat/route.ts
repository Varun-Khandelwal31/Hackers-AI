import { NextResponse } from 'next/server';
import { triageMentorRequest } from '@/lib/ai-engine';
import { dbService } from '@/lib/supabase';
import { MentorRequest } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, participantId = 'user-participant-1', participantName = 'Hackathon Developer', apiKey, groqApiKey } = body;

    const geminiKey = request.headers.get('x-gemini-key') || apiKey;
    const groqKey = request.headers.get('x-groq-key') || groqApiKey;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const { category, aiResponse, matchedMentor, overlapScore } = await triageMentorRequest(message, participantId, geminiKey, groqKey);

    const mentorRequestRecord: MentorRequest = {
      id: `req-${Date.now()}`,
      participant_id: participantId,
      participant_name: participantName,
      category,
      message,
      ai_response: aiResponse,
      matched_mentor_id: matchedMentor.id,
      matched_mentor: matchedMentor,
      status: 'open',
      created_at: new Date().toISOString(),
    };

    await dbService.saveMentorRequest(mentorRequestRecord);

    return NextResponse.json({
      success: true,
      request: mentorRequestRecord,
      category,
      aiResponse,
      ai_response: aiResponse,
      matchedMentor,
      overlapScore,
    });
  } catch (error: any) {
    console.error('Error in /api/mentor-chat route:', error);
    return NextResponse.json(
      { error: 'Failed to process mentor triage', details: error.message },
      { status: 500 }
    );
  }
}

