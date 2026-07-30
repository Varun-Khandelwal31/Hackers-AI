import { NextResponse } from 'next/server';

// ElevenLabs Free-Tier Verified Voice ID Mappings for HackOps AI Mentors
const MENTOR_VOICE_MAP: Record<string, { voiceId: string; description: string }> = {
  'alex rivera': { voiceId: 'pNInz6obpgDQGcFmaJgB', description: 'Adam - Deep & confident technical mentor' },
  'priya sharma': { voiceId: 'cgSgspJ2msm6clMCkdW9', description: 'Jessica - Expressive AI engineer' },
  'marcus chen': { voiceId: 'ErXwobaYiN019PkySvjV', description: 'Antoni - Technical backend lead' },
  'elena rostova': { voiceId: 'EXAVITQu4vr4xnSDxMaL', description: 'Bella - Professional UI/UX lead' },
};

// Default fallback voice ID (Adam)
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, mentorName = 'Alex Rivera', apiKey } = body;

    const elevenLabsKey = request.headers.get('x-elevenlabs-key') || apiKey || process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    if (!elevenLabsKey || elevenLabsKey.includes('placeholder')) {
      return NextResponse.json(
        { error: 'ElevenLabs API key is missing or invalid. Falling back to native Speech Synthesis.' },
        { status: 400 }
      );
    }

    const mentorKey = mentorName.toLowerCase().trim();
    const voiceId = MENTOR_VOICE_MAP[mentorKey]?.voiceId || DEFAULT_VOICE_ID;

    // Call ElevenLabs Text-to-Speech API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsKey,
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5', // Low latency, high-fidelity model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.1,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('ElevenLabs API error response:', errorText);
      return NextResponse.json({ error: 'ElevenLabs API request failed', details: errorText }, { status: response.status });
    }

    const audioArrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioArrayBuffer).toString('base64');
    const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return NextResponse.json({
      success: true,
      audioDataUrl,
      voiceId,
      mentorName,
    });
  } catch (error: any) {
    console.error('Error in /api/tts route:', error);
    return NextResponse.json({ error: 'Internal TTS Server Error', details: error.message }, { status: 500 });
  }
}
