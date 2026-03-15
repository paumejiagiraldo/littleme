'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '../../components/StepIndicator';
import { getSession, updateSession } from '../../lib/store';
import { storyTemplates } from '../../lib/stories';

export default function StoryPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'es' | 'pt'>('en');

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/create/upload');
      return;
    }
    if (session.language) setLanguage(session.language);
  }, [router]);

  const handleContinue = () => {
    if (!selectedId) return;
    updateSession({ storyTemplateId: selectedId, step: 'language' });
    router.push('/create/language');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <StepIndicator currentStep="story" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose a story</h1>
        <p className="text-gray-600 mb-8">
          Each story is designed to help your child navigate a real milestone.
          Pick the one that fits your family right now.
        </p>

        <div className="space-y-4">
          {storyTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedId(template.id)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                selectedId === template.id
                  ? 'border-violet-500 bg-violet-50 shadow-md'
                  : 'border-gray-200 hover:border-violet-200 hover:bg-gray-50'
              }`}
            >
              <h3 className="font-semibold text-lg text-gray-900">
                {template.title[language] || template.title.en}
              </h3>
              <p className="text-gray-600 mt-1 text-sm">
                {template.synopsis[language] || template.synopsis.en}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedId}
          className="w-full mt-8 py-4 bg-violet-600 text-white text-lg font-semibold rounded-xl hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
