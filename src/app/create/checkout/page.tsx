'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '../../components/StepIndicator';
import { getSession } from '../../lib/store';

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/create/upload');
      return;
    }
  }, [router]);

  const handleCheckout = async () => {
    // TODO: Create Stripe Checkout session via API route
    // For now, simulate success
    router.push('/create/success');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <StepIndicator currentStep="checkout" />

      <div className="max-w-lg mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get your book</h1>
        <p className="text-gray-600 mb-8">
          One personalized storybook, ready to download and print.
        </p>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Personalized Storybook</h3>
              <p className="text-sm text-gray-500">Print-ready PDF, A4 format</p>
            </div>
            <span className="text-2xl font-bold text-gray-900">$5</span>
          </div>
          <hr className="my-4 border-gray-100" />
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Custom illustrations based on your photos</li>
            <li>✓ Your family&apos;s names throughout the story</li>
            <li>✓ High-resolution PDF for printing</li>
            <li>✓ Instant download after payment</li>
          </ul>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full py-4 bg-violet-600 text-white text-lg font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
        >
          Pay $5 — Download Book
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Secure payment via Stripe. No account required.
        </p>
      </div>
    </main>
  );
}
