import React, { useEffect, useState } from 'react';

interface Step {
  id: number;
  label: string;
  subtext: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    label: 'Génération de l\'empreinte SHA-256',
    subtext: 'Calcul cryptographique immuable du document source',
  },
  {
    id: 2,
    label: 'Extraction OCR & Transcription Vision',
    subtext: 'Numérisation multimodale des textes, mentions et dates',
  },
  {
    id: 3,
    label: 'Analyse médico-légale des polices et pixels',
    subtext: 'Détection d\'incohérences de typographies et retouches',
  },
  {
    id: 4,
    label: 'Contrôle des sceaux officiels et signatures',
    subtext: 'Vérification de la présence et netteté des cachets',
  },
  {
    id: 5,
    label: 'Interrogation du Registre Académique National',
    subtext: 'Croisement du numéro de série et de l\'identité avec les archives',
  },
];

export const AnalysisProgress: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 400);
    const timer2 = setTimeout(() => setCurrentStep(3), 900);
    const timer3 = setTimeout(() => setCurrentStep(4), 1500);
    const timer4 = setTimeout(() => setCurrentStep(5), 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-900 animate-pulse" />
            <span>Audit médico-légal en cours</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyse optique multimodale et vérification des registres officiels
          </p>
        </div>
        <div className="rounded bg-slate-100 px-2.5 py-1 text-xs font-mono text-slate-700">
          Étape {Math.min(currentStep, 5)} / 5
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-5 overflow-hidden">
        <div
          className="bg-slate-900 h-full rounded-full transition-all duration-400 ease-out"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="space-y-2">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 rounded-lg p-2.5 transition-colors ${
                isCurrent
                  ? 'bg-slate-50 border border-slate-300/80'
                  : isDone
                  ? 'bg-white border border-slate-100'
                  : 'opacity-40 border border-transparent'
              }`}
            >
              <div
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-medium ${
                  isDone
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : isCurrent
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isDone ? '✓' : step.id}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-medium ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
                    {step.label}
                  </p>
                  {isDone && (
                    <span className="text-[10px] text-emerald-700 font-medium">Effectué</span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] text-slate-500 font-mono">En cours...</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate">{step.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
