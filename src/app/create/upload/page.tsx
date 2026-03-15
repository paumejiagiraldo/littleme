'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '../../components/StepIndicator';
import { createSession, getSession, updateSession } from '../../lib/store';

interface UploadSlot {
  role: 'child' | 'parent1' | 'parent2';
  label: string;
  required: boolean;
  file: File | null;
  preview: string | null;
}

export default function UploadPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<UploadSlot[]>([
    { role: 'child', label: 'Your child', required: true, file: null, preview: null },
    { role: 'parent1', label: 'Parent 1 (you)', required: false, file: null, preview: null },
    { role: 'parent2', label: 'Parent 2 (optional)', required: false, file: null, preview: null },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((index: number, file: File | null) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        file,
        preview: file ? URL.createObjectURL(file) : null,
      };
      return updated;
    });
    setError(null);
  }, []);

  const handleContinue = async () => {
    const childSlot = slots.find((s) => s.role === 'child');
    if (!childSlot?.file) return;

    setIsAnalyzing(true);
    setError(null);

    // Create or get session
    let session = getSession();
    if (!session) session = createSession();

    try {
      // Analyze each uploaded photo via Gemini Vision
      const slotsWithFiles = slots.filter((s) => s.file);
      const members = await Promise.all(
        slotsWithFiles.map(async (slot) => {
          const formData = new FormData();
          formData.append('photo', slot.file!);
          formData.append('role', slot.role);

          const res = await fetch('/api/analyze-photo', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            throw new Error(`Failed to analyze ${slot.label} photo`);
          }

          const data = await res.json();
          return {
            role: slot.role as 'child' | 'parent1' | 'parent2',
            name: '',
            photoUrl: slot.preview || '',
            traits: data.traits,
          };
        })
      );

      updateSession({ familyMembers: members, step: 'confirm' });
      router.push('/create/confirm');
    } catch (err) {
      console.error('Photo analysis error:', err);
      setError('Something went wrong analyzing the photos. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <StepIndicator currentStep="upload" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload family photos</h1>
        <p className="text-gray-600 mb-8">
          We&apos;ll create illustrated characters that look like your family. Photos are
          deleted right after — we never store them.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {slots.map((slot, index) => (
            <div
              key={slot.role}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-violet-300 transition-colors"
            >
              {slot.preview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slot.preview}
                    alt={slot.label}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-3"
                  />
                  <button
                    onClick={() => handleFileChange(index, null)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl text-gray-400">+</span>
                  </div>
                  <p className="font-medium text-gray-700">
                    {slot.label} {slot.required && <span className="text-red-400">*</span>}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Click to upload a clear photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!slots[0].file || isAnalyzing}
          className="w-full mt-8 py-4 bg-violet-600 text-white text-lg font-semibold rounded-xl hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing photos with AI...
            </span>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </main>
  );
}
