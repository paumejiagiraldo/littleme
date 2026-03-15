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
                  text: `Analyze this photo of a ${role === 'child' ? 'child' : 'person'} and extract their visual traits for creating a children's book illustration character. Return ONLY a JSON object with these exact fields:
{
  "skinTone": "one of: Light, Light-medium, Medium, Medium-dark, Dark",
  "hairColor": "one of: Black, Brown, Blonde, Red, Gray, White",
  "hairStyle": "one of: Straight, Wavy, Curly, Coily, Short, Bald",
  "eyeColor": "one of: Brown, Blue, Green, Hazel, Gray",
  "additionalNotes": "brief description of any distinctive features like glasses, freckles, etc."
}
Return ONLY the JSON, no markdown, no explanation.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 256,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return NextResponse.json({ error: 'Failed to analyze photo' }, { status: 500 });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON from response (handle possible markdown wrapping)
    let traits;
    try {
      const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      traits = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse traits:', text);
      return NextResponse.json({ error: 'Failed to parse traits', raw: text }, { status: 500 });
    }

    return NextResponse.json({ role, traits });
  } catch (error) {
    console.error('Analyze photo error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
