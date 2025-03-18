import { NextResponse, NextRequest } from 'next/server';
import fetch from 'node-fetch';

interface GeminiResponse {
  candidates?: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  error?: {
    message: string;
    code: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt: ps } = body;

    if (!ps) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const prompt = `
      topic:${ps}

      Generate a compelling and engaging WhatsApp message body that is concise,
      friendly, and encourages the recipient to take action.
      The message should be informal, direct, and suitable for a mobile audience.
      Keep it very brief Add emojicons a lot.
    `;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const contentType = geminiResponse.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const htmlText = await geminiResponse.text();
      console.error('Received HTML response instead of JSON:', htmlText.substring(0, 200) + '...');
      return NextResponse.json({ 
        error: 'Received HTML response from API instead of JSON. Check API endpoint and credentials.' 
      }, { status: 500 });
    }

    let geminiData: GeminiResponse;
    try {
      geminiData = await geminiResponse.json() as GeminiResponse;
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      const rawResponse = await geminiResponse.text();
      console.error('Raw response:', rawResponse.substring(0, 200) + '...');
      return NextResponse.json({ 
        error: 'Invalid JSON response from Gemini API' 
      }, { status: 500 });
    }
    
    if (!geminiResponse.ok || geminiData.error) {
      console.error('Gemini API error:', geminiData.error || geminiResponse.statusText);
      return NextResponse.json({ 
        error: geminiData.error?.message || 'Failed to generate WhatsApp message' 
      }, { status: geminiResponse.status || 500 });
    }

    if (!geminiData.candidates || !geminiData.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected Gemini API response structure:', JSON.stringify(geminiData));
      return NextResponse.json({ error: 'Invalid response from Gemini API' }, { status: 500 });
    }

    const generatedWhatsappBody = geminiData.candidates[0].content.parts[0].text.trim();

    return NextResponse.json({ body: generatedWhatsappBody }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, { status: 500 });
  }
}