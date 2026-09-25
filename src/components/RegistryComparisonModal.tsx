import React, { useState, useMemo } from 'react';
import { RegisteredDiploma } from '../types';
import { getDiplomaDataUrl, getDiplomaSvgContent } from '../utils/diplomaVisualizer';
import { SAMPLE_DIPLOMAS, rasterizeSvgToPng } from '../data/sampleDiplomas';

interface RegistryComparisonModalProps {
  registry: RegisteredDiploma[];
  initialDiplomaAId?: string;
  initialDiplomaBId?: string;
  onClose: () => void;
  onLoadIntoVerifier?: (base64: string, fileName: string, mimeType: string, fileSize: string) => void;
}

type ViewMode = 'side-by-side' | 'overlay' | 'diff-table';

export const RegistryComparisonModal: React.FC<RegistryComparisonModalProps> = ({
  registry,
  initialDiplomaAId,
  initialDiplomaBId,
  onClose,
  onLoadIntoVerifier,
}) => {
  // Combine registered diplomas with our sample falsified diploma as an option for comparison
  const fullDiplomaOptions = useMemo(() => {
    const list = [...registry];
    // Add the falsified sample so admins can test comparing authentic vs forged
    const falsifiedSample = SAMPLE_DIPLOMAS.find((s) => s.id === 'sample-2-falsified');
    if (falsifiedSample) {
      list.push({
        id: 'REG-FRAUD-SAMPLE',
        documentId: 'UY1-2023-M8921 (FALSIFIÉ)',
        studentName: 'Alain BIKOI (Altéré / Usurpateur)',
        institution: 'Université de Yaoundé I (UY1)',
        degreeTitle: 'Master en Informatique (Typo altérée)',
        fieldOfStudy: 'Informatique Décisionnelle',
        issueDate: '2023-06-28',
        honors: 'Félicitations du Jury',
        accredited: false,
      });
    }
    return list;
  }, [registry]);

  const [selectedIdA, setSelectedIdA] = useState<string>(
    initialDiplomaAId || fullDiplomaOptions[0]?.id || ''
  );
  const [selectedIdB, setSelectedIdB] = useState<string>(
    initialDiplomaBId || fullDiplomaOptions[1]?.id || fullDiplomaOptions[0]?.id || ''
  );

  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50);
  const [zoomA, setZoomA] = useState<number>(1);
  const [zoomB, setZoomB] = useState<number>(1);
  const [syncZoom, setSyncZoom] = useState<boolean>(true);

  const diplomaA = fullDiplomaOptions.find((d) => d.id === selectedIdA) || fullDiplomaOptions[0];
  const diplomaB = fullDiplomaOptions.find((d) => d.id === selectedIdB) || fullDiplomaOptions[1] || fullDiplomaOptions[0];

  const imageSrcA = useMemo(() => {
    if (!diplomaA) return '';
    if (diplomaA.id === 'REG-FRAUD-SAMPLE') {
      const sample = SAMPLE_DIPLOMAS.find((s) => s.id === 'sample-2-falsified');
      return sample ? sample.svgDataUrl : '';
    }
    return getDiplomaDataUrl(diplomaA);
  }, [diplomaA]);

  const imageSrcB = useMemo(() => {
    if (!diplomaB) return '';
    if (diplomaB.id === 'REG-FRAUD-SAMPLE') {
      const sample = SAMPLE_DIPLOMAS.find((s) => s.id === 'sample-2-falsified');
      return sample ? sample.svgDataUrl : '';
    }
    return getDiplomaDataUrl(diplomaB);
  }, [diplomaB]);

  const handleSwap = () => {
    const temp = selectedIdA;
    setSelectedIdA(selectedIdB);
    setSelectedIdB(temp);
  };

  const handleZoomA = (delta: number) => {
    const newZ = Math.max(0.6, Math.min(2.5, zoomA + delta));
    setZoomA(newZ);
    if (syncZoom) setZoomB(newZ);
  };

  const handleZoomB = (delta: number) => {
    const newZ = Math.max(0.6, Math.min(2.5, zoomB + delta));
    setZoomB(newZ);
    if (syncZoom) setZoomA(newZ);
  };

  const handleSendToVerifier = async (diploma: RegisteredDiploma) => {
    if (!onLoadIntoVerifier) return;
    try {
      let rawSvg = '';
      if (diploma.id === 'REG-FRAUD-SAMPLE') {
        const sample = SAMPLE_DIPLOMAS.find((s) => s.id === 'sample-2-falsified');
        rawSvg = sample ? sample.rawSvg : '';
      } else {
        rawSvg = getDiplomaSvgContent(diploma);
      }
      const rasterized = await rasterizeSvgToPng(rawSvg);
      const isPng = rasterized.startsWith('data:image/png');
      onLoadIntoVerifier(
        rasterized,
        `${diploma.documentId}.${isPng ? 'png' : 'svg'}`,
        isPng ? 'image/png' : 'image/svg+xml',
        '850 Ko'
      );
      onClose();
    } catch (e) {
      console.error('Error loading diploma into verifier:', e);
      onClose();
    }
  };

  // Detailed attribute comparisons
  const diffCriteria = useMemo(() => {
    if (!diplomaA || !diplomaB) return [];

    const isSameDocId = diplomaA.documentId.trim() === diplomaB.documentId.trim();
    const isSameStudent = diplomaA.studentName.trim().toLowerCase() === diplomaB.studentName.trim().toLowerCase();
    const isDocIdCollision = isSameDocId && !isSameStudent;

    return [
      {
        label: "Numéro d'enregistrement",
        valA: diplomaA.documentId,
        valB: diplomaB.documentId,
        isMatch: isSameDocId,
        isAlert: isDocIdCollision,
        alertNote: isDocIdCollision ? "Usurpation potentielle : même identifiant pour 2 titulaires distincts !" : undefined,
      },
      {
        label: 'Titulaire officiel',
        valA: diplomaA.studentName,
        valB: diplomaB.studentName,
        isMatch: isSameStudent,
      },
      {
        label: 'Établissement émetteur',
        valA: diplomaA.institution,
        valB: diplomaB.institution,
        isMatch: diplomaA.institution.trim().toLowerCase() === diplomaB.institution.trim().toLowerCase(),
      },
      {
        label: 'Grade / Titre académique',
        valA: diplomaA.degreeTitle,
        valB: diplomaB.degreeTitle,
        isMatch: diplomaA.degreeTitle.trim().toLowerCase() === diplomaB.degreeTitle.trim().toLowerCase(),
      },
      {
        label: 'Spécialité / Domaine',
        valA: diplomaA.fieldOfStudy,
        valB: diplomaB.fieldOfStudy,
        isMatch: diplomaA.fieldOfStudy.trim().toLowerCase() === diplomaB.fieldOfStudy.trim().toLowerCase(),
      },
      {
        label: 'Date de délivrance',
        valA: diplomaA.issueDate,
        valB: diplomaB.issueDate,
        isMatch: diplomaA.issueDate === diplomaB.issueDate,
      },
      {
        label: 'Distinction / Mention',
        valA: diplomaA.honors || 'Non spécifiée',
        valB: diplomaB.honors || 'Non spécifiée',
        isMatch: (diplomaA.honors || '') === (diplomaB.honors || ''),
      },
      {
        label: "Statut d'accréditation",
        valA: diplomaA.accredited ? 'Accrédité officiel' : 'Non accrédité / Falsifié',
        valB: diplomaB.accredited ? 'Accrédité officiel' : 'Non accrédité / Falsifié',
        isMatch: diplomaA.accredited === diplomaB.accredited,
        isAlert: diplomaA.accredited !== diplomaB.accredited,
      },
    ];
  }, [diplomaA, diplomaB]);

  const hasCriticalConflict = diffCriteria.some((c) => c.isAlert);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative flex flex-col w-full max-w-6xl max-h-[92vh] rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                Comparateur visuel & différentiel de diplômes
              </span>
              <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-700">
                Mode Administrateur
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Examen médico-légal bilatéral, concordance de registre et superposition optique
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Modes */}
            <div className="flex rounded-lg border border-slate-300 bg-white p-0.5 text-xs">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'side-by-side' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Côte à côte
              </button>
              <button
                onClick={() => setViewMode('overlay')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'overlay' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Superposition
              </button>
              <button
                onClick={() => setViewMode('diff-table')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'diff-table' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tableau Diff
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="hidden sm:inline-block rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Imprimer
            </button>

            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 text-lg leading-none"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>

        {/* Selection Bar: Document A and Document B Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 border-b border-slate-200 bg-slate-50/60 p-3 sm:px-4 text-xs items-center">
          {/* Document A Selector */}
          <div className="md:col-span-5 flex items-center gap-2">
            <span className="font-semibold text-slate-700 shrink-0">Document A :</span>
            <select
              value={selectedIdA}
              onChange={(e) => setSelectedIdA(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
            >
              {fullDiplomaOptions.map((item) => (
                <option key={`a-${item.id}`} value={item.id}>
                  {item.studentName} — {item.institution} ({item.documentId})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              onClick={handleSwap}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              title="Inverser les deux documents"
            >
              ⇄ Inverser
            </button>
          </div>

          {/* Document B Selector */}
          <div className="md:col-span-5 flex items-center gap-2">
            <span className="font-semibold text-slate-700 shrink-0">Document B :</span>
            <select
              value={selectedIdB}
              onChange={(e) => setSelectedIdB(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
            >
              {fullDiplomaOptions.map((item) => (
                <option key={`b-${item.id}`} value={item.id}>
                  {item.studentName} — {item.institution} ({item.documentId})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alert Banner if Conflict Detected */}
        {hasCriticalConflict && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between text-xs text-red-900">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-semibold">Alerte de sécurité critique détectée :</span>
              <span>Conflit de numéro d'enregistrement ou discordance d'accréditation entre les deux documents.</span>
            </div>
            <button
              onClick={() => setViewMode('diff-table')}
              className="text-red-700 underline font-medium hover:text-red-950 shrink-0 ml-2"
            >
              Examiner le détail
            </button>
          </div>
        )}

        {/* Main Comparison Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-100/60">
          {/* VIEW MODE 1: SIDE BY SIDE */}
          {viewMode === 'side-by-side' && (
            <div className="space-y-4">
              {/* Synchronized Zoom Toggle */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={syncZoom}
                    onChange={(e) => setSyncZoom(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>Synchroniser le niveau de zoom des deux visualisateurs</span>
                </label>
                <div className="text-[11px] text-slate-500">
                  Résolution vectorielle 1000×700 px (rendu sans perte)
                </div>
              </div>

              {/* Two Column Document Canvas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Column A */}
                <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="rounded bg-slate-900 text-white px-1.5 py-0.5 text-[10px] font-bold">
                        A
                      </span>
                      <span className="font-semibold text-slate-900 truncate">
                        {diplomaA.studentName}
                      </span>
                      <span className="text-slate-500 font-mono text-[10px] truncate">
                        ({diplomaA.documentId})
                      </span>
                    </div>

                    {/* Zoom controls */}
                    <div className="flex items-center rounded border border-slate-200 bg-white text-slate-700">
                      <button
                        onClick={() => handleZoomA(-0.25)}
                        className="px-2 py-0.5 hover:bg-slate-100 font-mono"
                        title="Zoom arrière"
                      >
                        −
                      </button>
                      <span className="px-1.5 font-mono text-[10px] text-slate-600 border-x border-slate-100">
                        {Math.round(zoomA * 100)}%
                      </span>
                      <button
                        onClick={() => handleZoomA(0.25)}
                        className="px-2 py-0.5 hover:bg-slate-100 font-mono"
                        title="Zoom avant"
                      >
                        +
                      </button>
                      <button
                        onClick={() => {
                          setZoomA(1);
                          if (syncZoom) setZoomB(1);
                        }}
                        className="px-1.5 py-0.5 hover:bg-slate-100 text-[10px] border-l border-slate-100 text-slate-500"
                        title="Réinitialiser"
                      >
                        1:1
                      </button>
                    </div>
                  </div>

                  {/* Document Viewport */}
                  <div className="min-h-[260px] sm:min-h-[340px] max-h-[440px] overflow-auto bg-slate-100 p-4 flex items-center justify-center">
                    <div
                      className="transition-transform duration-150 ease-out origin-center"
                      style={{ transform: `scale(${zoomA})` }}
                    >
                      <img
                        src={imageSrcA}
                        alt={`Scan de ${diplomaA.studentName}`}
                        className="max-h-[360px] w-auto rounded border border-slate-300 bg-white object-contain shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="p-3.5 border-t border-slate-200 bg-white space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500">Établissement :</span>
                        <div className="font-semibold text-slate-900 truncate">{diplomaA.institution}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Grade :</span>
                        <div className="font-semibold text-slate-900 truncate">{diplomaA.degreeTitle}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Délivré le :</span>
                        <div className="font-mono text-slate-800">{diplomaA.issueDate}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Statut :</span>
                        <div>
                          {diplomaA.accredited ? (
                            <span className="text-emerald-700 font-medium">● Accrédité</span>
                          ) : (
                            <span className="text-red-700 font-semibold">● Falsifié / Fraude</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {onLoadIntoVerifier && (
                      <button
                        onClick={() => handleSendToVerifier(diplomaA)}
                        className="w-full mt-2 rounded-lg border border-slate-300 bg-white py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        Vérifier le document A avec l'IA
                      </button>
                    )}
                  </div>
                </div>

                {/* Column B */}
                <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="rounded bg-slate-700 text-white px-1.5 py-0.5 text-[10px] font-bold">
                        B
                      </span>
                      <span className="font-semibold text-slate-900 truncate">
                        {diplomaB.studentName}
                      </span>
                      <span className="text-slate-500 font-mono text-[10px] truncate">
                        ({diplomaB.documentId})
                      </span>
                    </div>

                    {/* Zoom controls */}
                    <div className="flex items-center rounded border border-slate-200 bg-white text-slate-700">
                      <button
                        onClick={() => handleZoomB(-0.25)}
                        className="px-2 py-0.5 hover:bg-slate-100 font-mono"
                        title="Zoom arrière"
                      >
                        −
                      </button>
                      <span className="px-1.5 font-mono text-[10px] text-slate-600 border-x border-slate-100">
                        {Math.round(zoomB * 100)}%
                      </span>
                      <button
                        onClick={() => handleZoomB(0.25)}
                        className="px-2 py-0.5 hover:bg-slate-100 font-mono"
                        title="Zoom avant"
                      >
                        +
                      </button>
                      <button
                        onClick={() => {
                          setZoomB(1);
                          if (syncZoom) setZoomA(1);
                        }}
                        className="px-1.5 py-0.5 hover:bg-slate-100 text-[10px] border-l border-slate-100 text-slate-500"
                        title="Réinitialiser"
                      >
                        1:1
                      </button>
                    </div>
                  </div>

                  {/* Document Viewport */}
                  <div className="min-h-[260px] sm:min-h-[340px] max-h-[440px] overflow-auto bg-slate-100 p-4 flex items-center justify-center">
                    <div
                      className="transition-transform duration-150 ease-out origin-center"
                      style={{ transform: `scale(${zoomB})` }}
                    >
                      <img
                        src={imageSrcB}
                        alt={`Scan de ${diplomaB.studentName}`}
                        className="max-h-[360px] w-auto rounded border border-slate-300 bg-white object-contain shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="p-3.5 border-t border-slate-200 bg-white space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500">Établissement :</span>
                        <div className="font-semibold text-slate-900 truncate">{diplomaB.institution}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Grade :</span>
                        <div className="font-semibold text-slate-900 truncate">{diplomaB.degreeTitle}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Délivré le :</span>
                        <div className="font-mono text-slate-800">{diplomaB.issueDate}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Statut :</span>
                        <div>
                          {diplomaB.accredited ? (
                            <span className="text-emerald-700 font-medium">● Accrédité</span>
                          ) : (
                            <span className="text-red-700 font-semibold">● Falsifié / Fraude</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {onLoadIntoVerifier && (
                      <button
                        onClick={() => handleSendToVerifier(diplomaB)}
                        className="w-full mt-2 rounded-lg border border-slate-300 bg-white py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        Vérifier le document B avec l'IA
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: OVERLAY WITH TRANSPARENCY SLIDER */}
          {viewMode === 'overlay' && (
            <div className="space-y-4">
              {/* Opacity Control Slider */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="font-semibold text-slate-800 whitespace-nowrap">
                    Curseur de superposition :
                  </span>
                  <div className="flex items-center gap-2 flex-1 sm:w-64">
                    <span className="text-[10px] text-slate-500">Doc A (0%)</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                      className="w-full accent-slate-900"
                    />
                    <span className="text-[10px] text-slate-500">Doc B (100%)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 min-w-[36px] text-right">
                    {overlayOpacity}%
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setOverlayOpacity(0)}
                    className="rounded border border-slate-200 px-2 py-1 text-[10px] hover:bg-slate-100"
                  >
                    100% Doc A
                  </button>
                  <button
                    onClick={() => setOverlayOpacity(50)}
                    className="rounded border border-slate-200 px-2 py-1 text-[10px] hover:bg-slate-100"
                  >
                    50 / 50
                  </button>
                  <button
                    onClick={() => setOverlayOpacity(100)}
                    className="rounded border border-slate-200 px-2 py-1 text-[10px] hover:bg-slate-100"
                  >
                    100% Doc B
                  </button>
                </div>
              </div>

              {/* Overlay Canvas */}
              <div className="relative min-h-[350px] sm:min-h-[460px] rounded-xl border border-slate-200 bg-white p-6 flex items-center justify-center overflow-auto">
                <div className="relative max-h-[420px]">
                  {/* Base Document A */}
                  <img
                    src={imageSrcA}
                    alt="Document A"
                    className="max-h-[420px] w-auto rounded border border-slate-300 object-contain"
                  />

                  {/* Overlaid Document B */}
                  <div
                    className="absolute inset-0 transition-opacity duration-75"
                    style={{ opacity: overlayOpacity / 100 }}
                  >
                    <img
                      src={imageSrcB}
                      alt="Document B"
                      className="h-full w-full rounded object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500">
                La superposition permet de déceler instantanément les décalages de typographie, de bordure, de signature ou d'alignement de texte.
              </div>
            </div>
          )}

          {/* VIEW MODE 3: DETAILED DIFF TABLE */}
          {viewMode === 'diff-table' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Tableau de concordance analytique des attributs
                  </h3>
                  <span className="text-xs text-slate-500">
                    {diffCriteria.filter((c) => c.isMatch).length} concordances • {diffCriteria.filter((c) => !c.isMatch).length} discordances
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 font-semibold">
                        <th className="px-4 py-3">Critère de contrôle</th>
                        <th className="px-4 py-3">Document A ({diplomaA.studentName})</th>
                        <th className="px-4 py-3">Document B ({diplomaB.studentName})</th>
                        <th className="px-4 py-3 text-right">Diagnostic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {diffCriteria.map((crit, idx) => (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            crit.isAlert ? 'bg-red-50/40' : ''
                          }`}
                        >
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {crit.label}
                            {crit.alertNote && (
                              <div className="text-[10px] text-red-700 font-normal mt-0.5">
                                ⚠ {crit.alertNote}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-800 font-mono">
                            {crit.valA}
                          </td>
                          <td className="px-4 py-3 text-slate-800 font-mono">
                            {crit.valB}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {crit.isAlert ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-800 border border-red-200">
                                Conflit critique
                              </span>
                            ) : crit.isMatch ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                Identique
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                Distinct
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
          <div className="text-[11px] text-slate-500">
            Comparateur médico-légal officiel • VD Registre Central Souverain
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Fermer le comparateur
          </button>
        </div>
      </div>
    </div>
  );
};
