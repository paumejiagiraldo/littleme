'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '../../components/StepIndicator';
import { getSession, updateSession } from '../../lib/store';
import { storyTemplates } from '../../lib/stories';
import { BookSession } from '../../lib/types';

export default function PreviewPage() {
  const router = useRouter();
  const [session, setSession] = useState<BookSession | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push('/create/upload');
      return;
    }
    setSession(s);
  }, [router]);

  if (!session) return null;

  const template = storyTemplates.find((t) => t.id === session.storyTemplateId);
  if (!template) return null;

  const lang = session.language || 'en';
  const child = session.familyMembers.find((m) => m.role === 'child');
  const parent1 = session.familyMembers.find((m) => m.role === 'parent1');

  // Replace placeholders in text
  const renderText = (textTemplate: Record<string, string>) => {
    let text = textTemplate[lang] || textTemplate.en || '';
    text = text.replace(/\{\{childName\}\}/g, child?.name || 'your child');
    text = text.replace(/\{\{parent1Name\}\}/g, parent1?.name || 'Mommy');
    text = text.replace(/\{\{bedNameText\}\}/g, session.contextFields?.bedName ? ` — the "${session.contextFields.bedName}"` : '');
    return text;
  };

  const pages = template.pages.length > 0
    ? template.pages
    : [{ pageNumber: 1, textTemplate: { en: 'Story pages coming soon! This is a preview of the template.', es: 'Las páginas de la historia vienen pronto! Esta es una vista previa.', pt: 'As páginas da história estão chegando! Esta é uma prévia.' }, illustrationPromptTemplate: '' }];

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

        {/* Book preview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[300px] flex flex-col items-center justify-center">
          {/* Placeholder illustration area */}
          <div className="w-full h-48 bg-gradient-to-br from-violet-100 to-amber-50 rounded-xl flex items-center justify-center mb-6">
            <span className="text-6xl">🎨</span>
          </div>

          {/* Story text */}
          <p className="text-lg text-gray-800 text-center leading-relaxed">
            {renderText(pages[currentPage].textTemplate)}
          </p>

          {/* Page navigation */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-400">
              {currentPage + 1} / {pages.length}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))}
              disabled={currentPage === pages.length - 1}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full mt-8 py-4 bg-violet-600 text-white text-lg font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
        >
          Get This Book — $5
        </button>
      </div>
    </main>
  );
}
