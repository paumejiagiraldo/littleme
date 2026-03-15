'use client';

const steps = [
  { key: 'upload', label: 'Photos' },
  { key: 'confirm', label: 'Confirm' },
  { key: 'names', label: 'Names' },
  { key: 'story', label: 'Story' },
  { key: 'language', label: 'Language' },
  { key: 'preview', label: 'Preview' },
  { key: 'checkout', label: 'Get Book' },
];

interface StepIndicatorProps {
  currentStep: string;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index < currentIndex
                    ? 'bg-emerald-500 text-white'
                    : index === currentIndex
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentIndex ? '✓' : index + 1}
              </div>
              <span
                className={`text-xs mt-1 hidden sm:block ${
                  index === currentIndex ? 'text-violet-600 font-medium' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-6 sm:w-12 mx-1 ${
                  index < currentIndex ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
