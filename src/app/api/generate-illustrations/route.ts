import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const IMAGE_MODEL = 'imagen-4.0-generate-001';

export async function POST(req: NextRequest) {
  try {
    const { prompt, pageNumber } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    // Call Imagen 4 to generate illustration
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:predict?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '3:4', // portrait, good for book pages
            personGeneration: 'allow_all',
          },
        }),
      }
    );

    if (!response.ok) {
      // Fallback to Gemini image generation if Imagen doesn't work
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Generate a children's book illustration: ${prompt}. Style: warm, colorful, hand-drawn storybook illustration with soft lines and gentle expressions. Suitable for children ages 1-7.`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ['IMAGE', 'TEXT'],
              temperature: 1.0,
            },
          }),
        }
      );

      if (!geminiResponse.ok) {
        const error = await geminiResponse.text();
        console.error('Gemini Image API error:', error);
        return NextResponse.json({ error: 'Failed to generate illustration' }, { status: 500 });
      }

      const geminiData = await geminiResponse.json();
      const parts = geminiData.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData);

      if (!imagePart) {
        return NextResponse.json({ error: 'No image generated' }, { status: 500 });
      }

      return NextResponse.json({
        pageNumber,
        imageData: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType,
      });
    }

    const data = await response.json();
    const imageData = data.predictions?.[0]?.bytesBase64Encoded;

    if (!imageData) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    return NextResponse.json({
      pageNumber,
      imageData,
      mimeType: 'image/png',
    });
  } catch (error) {
    console.error('Generate illustration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
