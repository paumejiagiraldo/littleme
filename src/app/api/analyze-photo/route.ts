import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo') as File;
    const role = formData.get('role') as string;

    if (!file) {
      return NextResponse.json({ error: 'No photo provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = file.type || 'image/jpeg';

    // Call Gemini Vision to analyze the photo
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64,
                  },
                },
                {
                  text: `Look at this photo of a ${role === 'child' ? 'child' : 'person'}. Describe their appearance for a children's book illustrator.

You MUST respond with ONLY a raw JSON object, no markdown, no code fences, no explanation. Example:
{"skinTone":"Medium","hairColor":"Brown","hairStyle":"Curly","eyeColor":"Brown","additionalNotes":"wears glasses"}

Valid values:
- skinTone: Light, Light-medium, Medium, Medium-dark, Dark
- hairColor: Black, Brown, Blonde, Red, Gray, White
- hairStyle: Straight, Wavy, Curly, Coily, Short, Bald
- eyeColor: Brown, Blue, Green, Hazel, Gray
- additionalNotes: brief note about distinctive features (glasses, freckles, etc.) or "none"

Respond with ONLY the JSON object:`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 300,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Gemini API error (${response.status}): ${errorText.slice(0, 200)}` },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Extract text from response, handling possible thinking parts
    let text = '';
    const parts = data.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.text) {
        text = part.text;
        // Use the last text part (thinking comes before the actual answer)
      }
    }

    if (!text) {
      console.error('No text in Gemini response:', JSON.stringify(data).slice(0, 500));
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // Parse JSON - try multiple strategies
    let traits;
    try {
      // Strategy 1: direct parse
      traits = JSON.parse(text.trim());
    } catch {
      try {
        // Strategy 2: extract JSON from markdown code fences
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          traits = JSON.parse(match[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        console.error('Failed to parse traits. Raw response:', text);
        // Strategy 3: return sensible defaults
        traits = {
          skinTone: 'Medium',
          hairColor: 'Brown',
          hairStyle: 'Straight',
          eyeColor: 'Brown',
          additionalNotes: 'Could not detect traits from photo. Please adjust manually.',
        };
      }
    }

    return NextResponse.json({ role, traits });
  } catch (error) {
    console.error('Analyze photo error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
