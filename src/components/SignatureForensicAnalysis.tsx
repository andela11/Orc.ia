import React, { useState } from 'react';
import { ExtractedSignatureAnalysis } from '../types';
import { OFFICIAL_SIGNATURE_REFERENCES, OfficialSignatureReference } from '../data/signatureReferences';

interface SignatureForensicAnalysisProps {
  signatures?: ExtractedSignatureAnalysis[];
  institution?: string;
  isFalsifiedDoc?: boolean;
}

export const SignatureForensicAnalysis: React.FC<SignatureForensicAnalysisProps> = ({
  signatures,
  institution = 'Université de Yaoundé I (UY1)',
  isFalsifiedDoc = false,
}) => {
  // Default fallback signatures if not provided by backend
  const isPoly = institution.includes('Polytechnique') || institution.includes('ENSPY');
  const isIai = institution.includes('IAI');

  const sig1Name = isPoly
    ? 'Pr. Guy Edgar NOUBISSI'
    : isIai
    ? 'Armand Claude ABANDA'
    : 'Pr. Remy Sylvestre BOUELET';

  const sig1Role = isPoly
    ? "Directeur de l'ENSPY"
    : isIai
    ? "Représentant Résident IAI"
    : "Recteur de l'Université";

  const sig1Title = isPoly
    ? "Directeur de l'École Nationale Supérieure Polytechnique de Yaoundé"
    : isIai
    ? "Représentant Résident IAI-Cameroun"
    : "Recteur de l'Université de Yaoundé I";

  const sig1ModelId = isPoly
    ? 'REF-ENSPY-NOUBISSI'
    : isIai
    ? 'REF-IAI-ABANDA'
    : 'REF-UY1-BOUELET';

  const sig1RefId = isPoly
    ? 'ARCH-SIG-ENSPY-001'
    : isIai
    ? 'ARCH-SIG-IAI-002'
    : 'ARCH-SIG-UY1-001';

  const sig2Name = isPoly
    ? 'Dr. Thomas TCHAMO'
    : isIai
    ? 'Pr. Emmanuel KAMGNIA'
    : 'Pr. Jean-Bosco TALLA';

  const sig2Role = isPoly
    ? "Directeur des Études"
    : isIai
    ? "Président du Jury"
    : "Doyen de la Faculté des Sciences";

  const sig2Title = isPoly
    ? "Directeur des Études de l'ENSPY"
    : isIai
    ? "Président du Jury Académique"
    : "Doyen de la Faculté des Sciences (UY1)";

  const sig2ModelId = isPoly
    ? 'REF-ENSPY-TCHAMO'
    : isIai
    ? 'REF-IAI-KAMGNIA'
    : 'REF-UY1-TALLA';

  const sig2RefId = isPoly
    ? 'ARCH-SIG-ENSPY-002'
    : isIai
    ? 'ARCH-SIG-IAI-003'
    : 'ARCH-SIG-UY1-002';

  const defaultSignatures: ExtractedSignatureAnalysis[] = [
    {
      id: 'sig-1',
      label: 'Signature 1 (Autorité Principale)',
      signatoryName: sig1Name,
      role: sig1Role,
      institution: institution,
      boundingBox: { top: 82, left: 18, width: 22, height: 12 },
      extractedPathSvg: isPoly
        ? 'M 5 25 Q 35 10 65 30 T 115 20 Q 135 35 150 15 Q 130 40 100 35 T 70 42 Q 105 48 140 32'
        : isFalsifiedDoc
        ? 'M 10 30 Q 35 5 70 25 T 120 15 Q 140 35 110 40' // Digital copy with no pressure modulation
        : 'M 10 30 Q 35 5 70 25 T 120 15 Q 140 35 110 40 Q 95 43 80 35 T 60 48 Q 110 52 145 28',
      strokePressure: isFalsifiedDoc
        ? {
            averagePressure: 72,
            pressureModulation: 'UNIFORME_ARTIFICIELLE',
            pressureModulationScore: 16,
            downstrokePressure: 74,
            upstrokePressure: 70,
            strokeFluidity: 38,
            pressureDistribution: { high: 8, medium: 84, low: 8 },
            penLiftsCount: 0,
            hesitationDetected: true,
            isDigitalReplication: true,
            observations: 'Alerte pression : Largeur de trait figée (2.5px constant). Absence totale de modulation physiologique des pleins et déliés. Caractéristique typique d\'une reproduction numérique vectorielle ou d\'un calque copié-collé.',
          }
        : {
            averagePressure: 68,
            pressureModulation: 'NATURELLE_DYNAMIQUE',
            pressureModulationScore: 92,
            downstrokePressure: 89,
            upstrokePressure: 42,
            strokeFluidity: 95,
            pressureDistribution: { high: 38, medium: 44, low: 18 },
            penLiftsCount: 2,
            hesitationDetected: false,
            isDigitalReplication: false,
            observations: 'Modulation de pression hautement dynamique. Accélération naturelle en entrée de trait, fort appui sur la hampe descendante et effilement continu de l\'encre sur les déliés ascendants.',
          },
      comparisonWithReference: isFalsifiedDoc
        ? {
            matchedModelId: sig1ModelId,
            signatoryName: sig1Name,
            signatoryTitle: sig1Title,
            institution: institution,
            referenceRegistryId: sig1RefId,
            morphologicalSimilarityScore: 68.4,
            slantAngleDegrees: 14,
            referenceSlantAngleDegrees: 14,
            proportionsMatchScore: 82,
            strokeTrajectoryAlignment: 71,
            verdict: 'SUSPECT_PRESSION_UNIFORME',
            technicalDetails: 'Concordance géométrique superficielle mais falsification physique : la pression de trait est totalement plane et dépourvue de la cinématique biométrique du signataire officiel.',
          }
        : {
            matchedModelId: sig1ModelId,
            signatoryName: sig1Name,
            signatoryTitle: sig1Title,
            institution: institution,
            referenceRegistryId: sig1RefId,
            morphologicalSimilarityScore: 97.4,
            slantAngleDegrees: isPoly ? 12 : 14,
            referenceSlantAngleDegrees: isPoly ? 12 : 14,
            proportionsMatchScore: 98.2,
            strokeTrajectoryAlignment: 96.8,
            verdict: 'AUTHENTIQUE_CONFORME',
            technicalDetails: 'Concordance biométrique totale avec l\'archive officielle déposée au registre des sceaux. Trajectoire, boucle initiale et terminaison rigoureusement conformes.',
          },
      status: isFalsifiedDoc ? 'FALSIFIE' : 'CONFORME',
    },
    {
      id: 'sig-2',
      label: 'Signature 2 (Direction Académique)',
      signatoryName: sig2Name,
      role: sig2Role,
      institution: institution,
      boundingBox: { top: 82, left: 68, width: 22, height: 12 },
      extractedPathSvg: isPoly
        ? 'M 5 30 Q 35 45 75 15 T 125 35 Q 145 15 155 30 Q 135 42 110 38 T 80 44 Q 120 48 150 25'
        : 'M 10 25 Q 40 40 80 15 T 130 30 Q 150 10 160 25 Q 145 42 120 38 T 85 45 Q 115 50 155 35',
      strokePressure: {
        averagePressure: 64,
        pressureModulation: isFalsifiedDoc ? 'UNIFORME_ARTIFICIELLE' : 'NATURELLE_DYNAMIQUE',
        pressureModulationScore: isFalsifiedDoc ? 22 : 91,
        downstrokePressure: isFalsifiedDoc ? 68 : 86,
        upstrokePressure: isFalsifiedDoc ? 62 : 44,
        strokeFluidity: isFalsifiedDoc ? 42 : 93,
        pressureDistribution: isFalsifiedDoc
          ? { high: 10, medium: 80, low: 10 }
          : { high: 34, medium: 48, low: 18 },
        penLiftsCount: isFalsifiedDoc ? 0 : 3,
        hesitationDetected: isFalsifiedDoc,
        isDigitalReplication: isFalsifiedDoc,
        observations: isFalsifiedDoc
          ? 'Anomalie de tracé : profil de pression anormalement plat avec micro-artefacts de détourage logiciel.'
          : 'Geste d\'écriture authentique attesté. Modulation sinusoïdale de la pression parfaitement concordante avec la dynamique naturelle du signataire.',
      },
      comparisonWithReference: {
        matchedModelId: sig2ModelId,
        signatoryName: sig2Name,
        signatoryTitle: sig2Title,
        institution: institution,
        referenceRegistryId: sig2RefId,
        morphologicalSimilarityScore: isFalsifiedDoc ? 64.1 : 96.2,
        slantAngleDegrees: isPoly ? 16 : 18,
        referenceSlantAngleDegrees: isPoly ? 16 : 18,
        proportionsMatchScore: isFalsifiedDoc ? 78 : 95.8,
        strokeTrajectoryAlignment: isFalsifiedDoc ? 66.5 : 97.1,
        verdict: isFalsifiedDoc ? 'SUSPECT_PRESSION_UNIFORME' : 'AUTHENTIQUE_CONFORME',
        technicalDetails: isFalsifiedDoc
          ? 'Tracé numérique copié sans respect de la pression de plume réelle de l\'autorité signataire.'
          : 'Alignement morphologique de 96.2% contre le spécimen légal certifié.',
      },
      status: isFalsifiedDoc ? 'SUSPECT' : 'CONFORME',
    },
  ];

  const activeSignatures = (signatures && signatures.length > 0) ? signatures : defaultSignatures;
  const [selectedSigIndex, setSelectedSigIndex] = useState(0);
  const currentSig = activeSignatures[selectedSigIndex] || activeSignatures[0];

  // Visualizer View Mode: 'standard' | 'pressure_heatmap' | 'comparison_overlay' | 'micro_tremor'
  const [viewMode, setViewMode] = useState<'standard' | 'pressure_heatmap' | 'comparison_overlay'>('pressure_heatmap');
  const [overlayOpacity, setOverlayOpacity] = useState(65);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Selected Reference Model to test against
  const [selectedReferenceId, setSelectedReferenceId] = useState<string>(
    currentSig.comparisonWithReference?.matchedModelId || OFFICIAL_SIGNATURE_REFERENCES[0].id
  );

  const matchedReference =
    OFFICIAL_SIGNATURE_REFERENCES.find((r) => r.id === selectedReferenceId) ||
    OFFICIAL_SIGNATURE_REFERENCES.find((r) => r.id === currentSig.comparisonWithReference?.matchedModelId) ||
    OFFICIAL_SIGNATURE_REFERENCES[0];

  const isCurrentFalsified = currentSig.status === 'FALSIFIE' || currentSig.strokePressure.isDigitalReplication;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header with Title and Mode Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Expertise médico-légale des signatures manuscrites
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Détection biométrique de pression de trait, analyse cinématique de plume et confrontation aux modèles certifiés.
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${
              isCurrentFalsified
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${isCurrentFalsified ? 'bg-red-600 animate-pulse' : 'bg-emerald-600'}`}
            />
            {isCurrentFalsified
              ? 'Anomalie de pression / Copie détectée'
              : 'Signatures conformes & validées'}
          </span>
        </div>
      </div>

      {/* Signature Selector Tabs (if multiple signatures on document) */}
      {activeSignatures.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          <span className="text-xs font-semibold text-slate-600 mr-1">Signatures détectées :</span>
          {activeSignatures.map((sig, idx) => (
            <button
              key={sig.id}
              onClick={() => {
                setSelectedSigIndex(idx);
                if (sig.comparisonWithReference?.matchedModelId) {
                  setSelectedReferenceId(sig.comparisonWithReference.matchedModelId);
                }
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                selectedSigIndex === idx
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{sig.label}</span>
              <span className="text-[11px] opacity-80">({sig.signatoryName})</span>
              {sig.status === 'FALSIFIE' && (
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Forensic Workbench: Left Canvas Visualizer + Right Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (Canvas & Visual Inspection): 7 cols */}
        <div className="lg:col-span-7 space-y-3">
          {/* Canvas Mode Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-100 p-1 text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('pressure_heatmap')}
                className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                  viewMode === 'pressure_heatmap'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pression de trait (Heatmap)
              </button>

              <button
                onClick={() => setViewMode('comparison_overlay')}
                className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                  viewMode === 'comparison_overlay'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Superposition avec Modèle
              </button>

              <button
                onClick={() => setViewMode('standard')}
                className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                  viewMode === 'standard'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Encre originale
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white rounded border border-slate-200 px-1.5 py-0.5">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                className="text-slate-500 hover:text-slate-900 px-1 font-mono"
                title="Zoom arrière"
              >
                -
              </button>
              <span className="text-[10px] font-mono text-slate-700">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.2, z + 0.2))}
                className="text-slate-500 hover:text-slate-900 px-1 font-mono"
                title="Zoom avant"
              >
                +
              </button>
            </div>
          </div>

          {/* Inspection Stage Canvas */}
          <div className="relative rounded-xl border border-slate-300 bg-slate-950/95 overflow-hidden flex flex-col items-center justify-center p-6 min-h-[260px] text-white select-none">
            {/* Background Grid Pattern for Precision Measurement */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* SVG Visual Stage */}
            <div
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
              className="relative w-full max-w-[420px] h-[170px] flex items-center justify-center"
            >
              {/* Mode 1: Standard Ink View */}
              {viewMode === 'standard' && (
                <svg viewBox="0 0 180 70" className="w-full h-full filter drop-shadow-md">
                  <path
                    d={currentSig.extractedPathSvg || matchedReference.signatureSvgPath}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth={isCurrentFalsified ? '2.8' : '2.4'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {/* Mode 2: Stroke Pressure Spectrogram (Heatmap) */}
              {viewMode === 'pressure_heatmap' && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 180 70" className="w-full h-full">
                    <defs>
                      <linearGradient id="pressureGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />     {/* Low pressure / upstroke */}
                        <stop offset="25%" stopColor="#eab308" />    {/* Medium pressure */}
                        <stop offset="50%" stopColor="#ef4444" />    {/* Heavy downstroke */}
                        <stop offset="75%" stopColor="#f97316" />    {/* Medium-heavy */}
                        <stop offset="100%" stopColor="#06b6d4" />   {/* Light exit flourish */}
                      </linearGradient>

                      <linearGradient id="flatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#94a3b8" />
                      </linearGradient>
                    </defs>

                    {/* Outer Glow / Halo */}
                    <path
                      d={currentSig.extractedPathSvg || matchedReference.signatureSvgPath}
                      fill="none"
                      stroke={isCurrentFalsified ? 'url(#flatGradient)' : 'url(#pressureGradient)'}
                      strokeWidth={isCurrentFalsified ? '4.5' : '6'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.35}
                    />

                    {/* Main Stroke with Pressure Gradient */}
                    <path
                      d={currentSig.extractedPathSvg || matchedReference.signatureSvgPath}
                      fill="none"
                      stroke={isCurrentFalsified ? '#e2e8f0' : 'url(#pressureGradient)'}
                      strokeWidth={isCurrentFalsified ? '2.5' : '3.2'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Visual Pressure Pressure Markers (High Pressure Downstroke Nodes) */}
                    {!isCurrentFalsified && (
                      <>
                        <circle cx="35" cy="15" r="3.5" fill="#ef4444" />
                        <text x="35" y="8" fontSize="6" fill="#fca5a5" textAnchor="middle">
                          Appui 94%
                        </text>

                        <circle cx="70" cy="25" r="3" fill="#f59e0b" />
                        <text x="70" y="36" fontSize="6" fill="#fde68a" textAnchor="middle">
                          Transition
                        </text>

                        <circle cx="110" cy="40" r="3.8" fill="#ef4444" />
                        <text x="110" y="52" fontSize="6" fill="#fca5a5" textAnchor="middle">
                          Appui 88%
                        </text>

                        <circle cx="140" cy="28" r="2.2" fill="#06b6d4" />
                        <text x="145" y="22" fontSize="6" fill="#67e8f9" textAnchor="middle">
                          Délié 32%
                        </text>
                      </>
                    )}

                    {isCurrentFalsified && (
                      <g>
                        <rect x="25" y="4" width="130" height="15" rx="3" fill="#ef4444" opacity="0.9" />
                        <text x="90" y="15" fontSize="7.5" fill="#ffffff" textAnchor="middle" fontWeight="bold">
                          PRESSION CONSTANTE DÉTECTÉE (PROFIL PLAT)
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
              )}

              {/* Mode 3: Comparison Overlay with Official Reference */}
              {viewMode === 'comparison_overlay' && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 180 70" className="w-full h-full">
                    {/* Layer 1: Official Reference Signature (Emerald / Gold Reference Model) */}
                    <path
                      d={matchedReference.signatureSvgPath}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={overlayOpacity / 100}
                    />

                    {/* Layer 2: Extracted Signature from Document (Cyan / Magenta Diff) */}
                    <path
                      d={currentSig.extractedPathSvg || matchedReference.signatureSvgPath}
                      fill="none"
                      stroke={isCurrentFalsified ? '#ef4444' : '#38bdf8'}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={isCurrentFalsified ? '4 2' : 'none'}
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Heatmap Legend Bar */}
            {viewMode === 'pressure_heatmap' && (
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px]">
                <span className="text-slate-400 font-medium">Spectre de pression :</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    Délié léger (&lt;35%)
                  </span>
                  <span className="flex items-center gap-1 text-yellow-400">
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    Médian (35-75%)
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Appui fort (&gt;75%)
                  </span>
                </div>
              </div>
            )}

            {/* Overlay Controls */}
            {viewMode === 'comparison_overlay' && (
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Modèle archive
                  </span>
                  <span className="flex items-center gap-1 text-sky-400">
                    <span className="h-2 w-2 rounded-full bg-sky-400" /> Scan soumis
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Opacité modèle :</span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-20 accent-emerald-500 cursor-pointer h-1.5"
                  />
                  <span className="font-mono text-slate-300 w-7 text-right">{overlayOpacity}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Findings Text Box */}
          <div
            className={`rounded-lg p-3 text-xs border ${
              isCurrentFalsified
                ? 'bg-red-50/70 border-red-200 text-red-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="font-semibold mb-0.5 flex items-center gap-1.5">
              <span>{isCurrentFalsified ? 'Anomalie médico-légale :' : 'Constat médico-légal :'}</span>
              <span className="font-mono text-[11px] text-slate-500">
                {currentSig.comparisonWithReference.referenceRegistryId}
              </span>
            </div>
            <p className="leading-relaxed">{currentSig.strokePressure.observations}</p>
          </div>
        </div>

        {/* Right Column (Telemetry & Reference Confrontation): 5 cols */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* 1. Stroke Pressure Telemetry Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                Dynamique de Pression de Trait
              </h4>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isCurrentFalsified
                    ? 'bg-red-100 text-red-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {currentSig.strokePressure.pressureModulation === 'NATURELLE_DYNAMIQUE'
                  ? 'Modulation Naturelle'
                  : 'Pression Plate / Artificielle'}
              </span>
            </div>

            {/* Score Bar 1: Pressure Modulation Score */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Modulation dynamique de pression</span>
                <span className="font-mono font-semibold text-slate-900">
                  {currentSig.strokePressure.pressureModulationScore}/100
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    currentSig.strokePressure.pressureModulationScore > 70
                      ? 'bg-emerald-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${currentSig.strokePressure.pressureModulationScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0 (Vectoriel / Copier-collé)</span>
                <span>100 (Variabilité humaine continue)</span>
              </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="bg-white rounded-lg p-2.5 border border-slate-200">
                <span className="text-[10px] text-slate-500 block mb-0.5">Pression descente (Pleins)</span>
                <span className="text-sm font-semibold text-slate-900 font-mono">
                  {currentSig.strokePressure.downstrokePressure}%
                </span>
                <span className="text-[10px] text-slate-400 block">Appui physiologique</span>
              </div>

              <div className="bg-white rounded-lg p-2.5 border border-slate-200">
                <span className="text-[10px] text-slate-500 block mb-0.5">Pression montée (Déliés)</span>
                <span className="text-sm font-semibold text-slate-900 font-mono">
                  {currentSig.strokePressure.upstrokePressure}%
                </span>
                <span className="text-[10px] text-slate-400 block">Allégement de plume</span>
              </div>
            </div>

            {/* Pressure Distribution Spectrum Bar */}
            <div className="pt-1">
              <span className="text-[11px] font-medium text-slate-600 block mb-1">
                Répartition des densités d'appui :
              </span>
              <div className="h-3 w-full flex rounded-md overflow-hidden text-[9px] font-bold text-white text-center">
                <div
                  style={{ width: `${currentSig.strokePressure.pressureDistribution.high}%` }}
                  className="bg-red-500 flex items-center justify-center"
                  title="Forte pression"
                >
                  {currentSig.strokePressure.pressureDistribution.high}%
                </div>
                <div
                  style={{ width: `${currentSig.strokePressure.pressureDistribution.medium}%` }}
                  className="bg-amber-400 flex items-center justify-center text-slate-900"
                  title="Pression médiane"
                >
                  {currentSig.strokePressure.pressureDistribution.medium}%
                </div>
                <div
                  style={{ width: `${currentSig.strokePressure.pressureDistribution.low}%` }}
                  className="bg-cyan-500 flex items-center justify-center"
                  title="Pression faible / déliés"
                >
                  {currentSig.strokePressure.pressureDistribution.low}%
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span className="text-red-600 font-medium">Appuis forts</span>
                <span className="text-amber-700 font-medium">Liaisons</span>
                <span className="text-cyan-700 font-medium">Déliés / Envol</span>
              </div>
            </div>
          </div>

          {/* 2. Official Reference Model Matching */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                Modèle d'archive officiel
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                {matchedReference.registryCode}
              </span>
            </div>

            {/* Select Reference Model */}
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Confronter avec le spécimen de référence :
              </label>
              <select
                value={selectedReferenceId}
                onChange={(e) => setSelectedReferenceId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-medium"
              >
                {OFFICIAL_SIGNATURE_REFERENCES.map((ref) => (
                  <option key={ref.id} value={ref.id}>
                    {ref.signatoryName} — {ref.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Reference Details */}
            <div className="rounded-lg bg-slate-50 p-2.5 text-xs border border-slate-200/80 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Signataire :</span>
                <span className="font-semibold text-slate-900">{matchedReference.signatoryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Établissement :</span>
                <span className="text-slate-700">{matchedReference.institution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Période d'exercice :</span>
                <span className="font-mono text-slate-700">{matchedReference.activePeriod}</span>
              </div>
            </div>

            {/* Morphological Similarity Metrics */}
            <div className="space-y-2 pt-1 text-xs">
              <div>
                <div className="flex justify-between mb-0.5">
                  <span className="text-slate-600">Similarité morphologique globale</span>
                  <span
                    className={`font-mono font-semibold ${
                      currentSig.comparisonWithReference.morphologicalSimilarityScore > 85
                        ? 'text-emerald-700'
                        : 'text-red-700'
                    }`}
                  >
                    {currentSig.comparisonWithReference.morphologicalSimilarityScore}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      currentSig.comparisonWithReference.morphologicalSimilarityScore > 85
                        ? 'bg-emerald-600'
                        : 'bg-red-600'
                    }`}
                    style={{
                      width: `${currentSig.comparisonWithReference.morphologicalSimilarityScore}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block">Angle d'inclinaison</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    +{currentSig.comparisonWithReference.slantAngleDegrees}°
                  </span>{' '}
                  <span className="text-slate-400 font-normal">
                    (Réf : +{matchedReference.baselineSlantAngle}°)
                  </span>
                </div>

                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block">Alignement trajectoire</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {currentSig.comparisonWithReference.strokeTrajectoryAlignment}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
