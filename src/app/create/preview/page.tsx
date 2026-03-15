'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '../../components/StepIndicator';
import { getSession, updateSession } from '../../lib/store';
import { storyTemplates } from '../../lib/stories';
import { BookSession, BookPage } from '../../lib/types';

export default function PreviewPage() {
  const router = useRouter();
  const [session, setSession] = useState<BookSession | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [generatedPages, setGeneratedPages] = useState<BookPage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push('/create/upload');
      return;
    }
    setSession(s);

    // If we already have generated pages, use them
    if (s.generatedPages && s.generatedPages.length > 0) {
      setGeneratedPages(s.generatedPages);
    }
  }, [router]);

  const buildTraitsDescription = useCallback((session: BookSession, role: string) => {
    const member = session.familyMembers.find((m) => m.role === role);
    if (!member) return 'a person';
    const t = member.traits;
    return `${t.skinTone} skin, ${t.hairColor} ${t.hairStyle} hair, ${t.eyeColor} eyes${t.additionalNotes ? `, ${t.additionalNotes}` : ''}`;
  }, []);

  const generateIllustrations = useCallback(async () => {
    if (!session) return;

    const template = storyTemplates.find((t) => t.id === session.storyTemplateId);
    if (!template || template.pages.length === 0) return;

    setIsGenerating(true);
    setError(null);
    setProgress(0);

    const lang = session.language || 'en';
    const child = session.familyMembers.find((m) => m.role === 'child');
    const childTraits = buildTraitsDescription(session, 'child');
    const parent1Traits = buildTraitsDescription(session, 'parent1');

    const pages: BookPage[] = [];

    for (let i = 0; i < template.pages.length; i++) {
      const page = template.pages[i];
      setProgress(Math.round(((i) / template.pages.length) * 100));

      // Build illustration prompt
      const prompt = page.illustrationPromptTemplate
        .replace(/\{\{traits\}\}/g, childTraits)
        .replace(/\{\{parent1Traits\}\}/g, parent1Traits);

      // Build text
      let text = page.textTemplate[lang] || page.textTemplate.en || '';
      text = text.replace(/\{\{childName\}\}/g, child?.name || 'the child');
      const parent1 = session.familyMembers.find((m) => m.role === 'parent1');
      text = text.replace(/\{\{parent1Name\}\}/g, parent1?.name || 'Mommy');
      text = text.replace(/\{\{bedNameText\}\}/g,
        session.contextFields?.bedName ? ` — the "${session.contextFields.bedName}"` : ''
      );

      try {
        const res = await fetch('/api/generate-illustrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, pageNumber: page.pageNumber }),
        });

        if (!res.ok) throw new Error('Failed to generate illustration');

        const data = await res.json();
        pages.push({
          pageNumber: page.pageNumber,
          text,
          illustrationUrl: `data:${data.mimeType};base64,${data.imageData}`,
        });
      } catch (err) {
        console.error(`Error generating page ${i + 1}:`, err);
        // Add page with placeholder on error
        pages.push({
          pageNumber: page.pageNumber,
          text,
          illustrationUrl: '',
        });
      }
    }

    setGeneratedPages(pages);
    updateSession({ generatedPages: pages });
    setProgress(100);
    setIsGenerating(false);
  }, [session, buildTraitsDescription]);

  if (!session) return null;

  const template = storyTemplates.find((t) => t.id === session.storyTemplateId);
  if (!template) return null;

  const lang = session.language || 'en';
  const child = session.familyMembers.find((m) => m.role === 'child');

  const hasGeneratedPages = generatedPages.length > 0;
  const currentBookPage = hasGeneratedPages ? generatedPages[currentPage] : null;

  // For templates without pages yet, show a message
  const hasStoryPages = template.pages.length > 0;

  const handleCheckout = () => {
    updateSession({ step: 'checkout' });
    router.push('/create/checkout');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <StepIndicator currentStep="preview" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {template.title[lang] || template.title.en}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Starring {child?.name || 'your child'} ✨
        </p>

        {!hasStoryPages ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <span className="text-6xl mb-4 block">📖</span>
            <p className="text-gray-600">
              This story template is coming soon! Try &quot;My Big Kid Bed&quot; for the full experience.
            </p>
          </div>
        ) : !hasGeneratedPages ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            {isGenerating ? (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-violet-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gray-600">
                  Creating illustrations... Page {Math.floor((progress / 100) * template.pages.length) + 1} of {template.pages.length}
                </p>
                <p className="text-sm text-gray-400 mt-2">This takes about 30-60 seconds</p>
              </>
            ) : (
              <>
                <span className="text-6xl mb-4 block">🎨</span>
                <p className="text-gray-600 mb-6">
                  Ready to create your personalized illustrations!
                </p>
                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                <button
                  onClick={generateIllustrations}
                  className="px-8 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors"
                >
                  Generate Illustrations
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Book preview with generated illustrations */}
            <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[400px]">
              {currentBookPage?.illustrationUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentBookPage.illustrationUrl}
                  alt={`Page ${currentPage + 1}`}
                  className="w-full h-64 object-contain rounded-xl mb-6"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-violet-100 to-amber-50 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-6xl">🎨</span>
                </div>
              )}

              <p className="text-lg text-gray-800 text-center leading-relaxed">
                {currentBookPage?.text || ''}
              </p>

              {/* Page navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                >
                  ← Previous
                </button>
                <span className="text-sm text-gray-400">
                  {currentPage + 1} / {generatedPages.length}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(generatedPages.length - 1, p + 1))}
                  disabled={currentPage === generatedPages.length - 1}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={generateIllustrations}
                className="flex-1 py-4 border-2 border-violet-200 text-violet-600 font-semibold rounded-xl hover:bg-violet-50 transition-colors"
              >
                🔄 Regenerate
              </button>
              <button
                onClick={handleCheckout}
                className="flex-[2] py-4 bg-violet-600 text-white text-lg font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
              >
                Get This Book — $5
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
