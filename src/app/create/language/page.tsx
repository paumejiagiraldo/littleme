'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '../../components/StepIndicator';
import { getSession, updateSession } from '../../lib/store';

const languages = [
  { code: 'en' as const, label: 'English', flag: '🇺🇸' },
  { code: 'es' as const, label: 'Español', flag: '🇪🇸' },
  { code: 'pt' as const, label: 'Português', flag: '🇧🇷' },
];

export default function LanguagePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<'en' | 'es' | 'pt'>('en');

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/create/upload');
      return;
    }
    setSelected(session.language || 'en');
  }, [router]);

  const handleContinue = () => {
    updateSession({ language: selected, step: 'preview' });
    router.push('/create/preview');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <StepIndicator currentStep="language" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Story language</h1>
        <p className="text-gray-600 mb-8">
          Choose the language for your storybook. Your child will hear the story
          in your home language.
        </p>

        <div className="space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`w-full text-left p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                selected === lang.code
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-violet-200'
              }`}
            >
              <span className="text-3xl">{lang.flag}</span>
              <span className="text-lg font-medium text-gray-900">{lang.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="w-full mt-8 py-4 bg-violet-600 text-white text-lg font-semibold rounded-xl hover:bg-violet-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
