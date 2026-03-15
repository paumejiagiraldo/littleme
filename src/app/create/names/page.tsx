'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '../../components/StepIndicator';
import { getSession, updateSession } from '../../lib/store';
import { FamilyMember } from '../../lib/types';

export default function NamesPage() {
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/create/upload');
      return;
    }
    setMembers(session.familyMembers);
  }, [router]);

  const roleLabels: Record<string, string> = {
    child: "Child's name",
    parent1: 'Your name',
    parent2: "Partner's name",
    sibling: "Sibling's name",
  };

  const updateName = (index: number, name: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name };
      return updated;
    });
  };

  const handleContinue = () => {
    const child = members.find((m) => m.role === 'child');
    if (!child?.name.trim()) return;

    updateSession({ familyMembers: members, step: 'story' });
    router.push('/create/story');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <StepIndicator currentStep="names" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Family names</h1>
        <p className="text-gray-600 mb-8">
          These names will appear throughout the story. Your child will hear their
          own name in every page!
        </p>

        <div className="space-y-5">
          {members.map((member, index) => (
            <div key={member.role}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {roleLabels[member.role] || member.role}
                {member.role === 'child' && <span className="text-red-400 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => updateName(index, e.target.value)}
                placeholder={member.role === 'child' ? 'e.g., Camila' : 'e.g., Valentina'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-lg"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!members.find((m) => m.role === 'child')?.name.trim()}
          className="w-full mt-8 py-4 bg-violet-600 text-white text-lg font-semibold rounded-xl hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
