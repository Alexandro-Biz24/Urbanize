interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-6 text-xs flex rounded bg-slate-200">
          <div
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black transition-all duration-500"
          ></div>
        </div>
      </div>
      
      {/* Step labels */}
      <div className="flex justify-between items-center text-xs text-slate-600">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              index + 1 <= currentStep ? 'text-black font-semibold' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                index + 1 <= currentStep
                  ? 'bg-black text-white'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              {index + 1}
            </div>
            <span className="hidden sm:block text-center">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
