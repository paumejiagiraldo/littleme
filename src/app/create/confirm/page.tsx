'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '../../components/StepIndicator';
import { getSession, updateSession } from '../../lib/store';
import { FamilyMember, CharacterTraits } from '../../lib/types';

const traitOptions = {
  skinTone: ['Light', 'Light-medium', 'Medium', 'Medium-dark', 'Dark'],
  hairColor: ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White'],
  hairStyle: ['Straight', 'Wavy', 'Curly', 'Coily', 'Short', 'Bald'],
  eyeColor: ['Brown', 'Blue', 'Green', 'Hazel', 'Gray'],
};

export default function ConfirmPage() {
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    const session = getSession();
    if (!session || session.familyMembers.length === 0) {
      router.push('/create/upload');
      return;
    }
    setMembers(session.familyMembers);
  }, [router]);

  const roleLabels: Record<string, string> = {
    child: 'Your child',
    parent1: 'Parent 1',
    parent2: 'Parent 2',
  };

  const updateTrait = (memberIndex: number, trait: keyof CharacterTraits, value: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[memberIndex] = {
        ...updated[memberIndex],
        traits: { ...updated[memberIndex].traits, [trait]: value },
      };
      return updated;
    });
  };

  const handleContinue = () => {
    updateSession({ familyMembers: members, step: 'names' });
    router.push('/create/names');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <StepIndicator currentStep="confirm" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm character details</h1>
        <p className="text-gray-600 mb-8">
          Review the detected traits for each family member. Adjust anything that
          doesn&apos;t look right.
        </p>

        <div className="space-y-8">
          {members.map((member, mIdx) => (
            <div key={member.role} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                {member.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photoUrl}
                    alt={roleLabels[member.role]}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <h3 className="font-semibold text-lg">{roleLabels[member.role]}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(traitOptions) as Array<keyof typeof traitOptions>).map((trait) => (
                  <div key={trait}>
                    <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                      {trait.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <select
                      value={member.traits[trait] || ''}
                      onChange={(e) => updateTrait(mIdx, trait, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                    >
                      <option value="">Select...</option>
                      {traitOptions[trait].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
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
