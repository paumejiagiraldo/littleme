import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight">
          Turn your child&apos;s milestones into{' '}
          <span className="text-violet-600">magical stories</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          Upload a photo, pick a milestone, and get a personalized storybook
          starring your kid. Illustrated, named after your family, ready to print.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create/upload"
            className="px-8 py-4 bg-violet-600 text-white text-lg font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
          >
            Create a Book — $5
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📸</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">1. Upload photos</h3>
            <p className="text-gray-600">
              Upload a photo of your child (and parents too). Our AI creates
              illustrated characters that look like your family.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📖</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">2. Pick a story</h3>
            <p className="text-gray-600">
              Choose from milestone stories: new bed, new sibling, first day of
              school. Add your family&apos;s names and details.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎨</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">3. Get your book</h3>
            <p className="text-gray-600">
              Preview your personalized book, pay $5, and download a
              print-ready PDF. Read it tonight!
            </p>
          </div>
        </div>
      </section>

      {/* Emotional hook */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <blockquote className="text-2xl text-gray-700 italic">
          &ldquo;Camila giggled seeing herself in the story and immediately
          asked to read it again.&rdquo;
        </blockquote>
        <p className="mt-4 text-gray-500">
          — Valentina, mom of 3-year-old Camila
        </p>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-8 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>LittleMe © {new Date().getFullYear()}. Made with ❤️ for families everywhere.</p>
        <p className="mt-1">Photos are deleted after character extraction. We never store your images.</p>
      </footer>
    </main>
  );
}
