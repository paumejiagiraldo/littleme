'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession } from '../../lib/store';
import { storyTemplates } from '../../lib/stories';
import { generateBookPdf } from '../../lib/pdf';
import { BookSession } from '../../lib/types';

export default function SuccessPage() {
  const [session, setSession] = useState<BookSession | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const s = getSession();
    setSession(s);
  }, []);

  const handleDownload = async () => {
    if (!session?.generatedPages) return;
    setIsDownloading(true);

    try {
      const template = storyTemplates.find((t) => t.id === session.storyTemplateId);
      const lang = session.language || 'en';
      const title = template?.title[lang] || template?.title.en || 'My Storybook';
      const childName = session.familyMembers.find((m) => m.role === 'child')?.name || 'My Child';

      const blob = await generateBookPdf(session.generatedPages, title, childName);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LittleMe - ${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('PDF generation error:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
      <div className="max-w-lg mx-auto px-6 py-8 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your book is ready!</h1>
        <p className="text-gray-600 mb-8">
          Download your personalized storybook and print it at home or your local
          print shop. Enjoy reading it tonight!
        </p>

        <button
          onClick={handleDownload}
          disabled={isDownloading || !session?.generatedPages}
          className="w-full py-4 bg-emerald-500 text-white text-lg font-semibold rounded-xl hover:bg-emerald-600 disabled:bg-gray-300 transition-colors shadow-lg shadow-emerald-200 mb-4"
        >
          {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left mt-8">
          <h3 className="font-semibold text-gray-900 mb-3">🖨️ Printing tips</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Print on A4 or Letter size paper</li>
            <li>• Use &quot;Actual Size&quot; (not &quot;Fit to Page&quot;) for best results</li>
            <li>• Thicker paper (120gsm+) gives a more book-like feel</li>
            <li>• Most local print shops can staple-bind it for you</li>
          </ul>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-violet-600 hover:text-violet-700 font-medium"
          >
            ← Create another book
          </Link>
        </div>
      </div>
    </main>
  );
}
