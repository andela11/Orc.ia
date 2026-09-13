import React, { useState, useRef, useCallback } from 'react';
import { SAMPLE_DIPLOMAS, rasterizeSvgToPng } from '../data/sampleDiplomas';

interface UploadZoneProps {
  onFileSelected: (base64: string, fileName: string, mimeType: string, fileSize: string) => void;
  isAnalyzing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
      const isSvgFile = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
      if (!allowedTypes.includes(file.type) && !isSvgFile) {
        alert('Format non pris en charge. Veuillez fournir une image (JPEG, PNG, WebP, SVG) ou un scan PDF.');
        return;
      }

      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} Mo`;

      if (isSvgFile) {
        const textReader = new FileReader();
        textReader.onload = async (e) => {
          const svgText = e.target?.result as string;
          if (svgText) {
            try {
              const pngDataUrl = await rasterizeSvgToPng(svgText);
              const isPng = pngDataUrl.startsWith('data:image/png');
              onFileSelected(
                pngDataUrl,
                file.name.replace(/\.svg$/i, isPng ? '.png' : '.svg'),
                isPng ? 'image/png' : 'image/svg+xml',
                sizeStr
              );
            } catch {
              onFileSelected(
                `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`,
                file.name,
                'image/svg+xml',
                sizeStr
              );
            }
          }
        };
        textReader.readAsText(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onFileSelected(result, file.name, file.type, sizeStr);
        }
      };
      reader.readAsDataURL(file);
    },
    [onFileSelected]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError("Impossible d'accéder à la caméra. Vérifiez les autorisations de votre navigateur.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      stopCamera();
      onFileSelected(dataUrl, `Scan_Camera_${new Date().toISOString().slice(0, 10)}.jpg`, 'image/jpeg', '1.8 Mo');
    }
  };

  const handleLoadSample = async (index: number) => {
    const sample = SAMPLE_DIPLOMAS[index];
    if (sample) {
      try {
        const rasterized = await rasterizeSvgToPng(sample.rawSvg);
        const isPng = rasterized.startsWith('data:image/png');
        onFileSelected(
          rasterized,
          `${sample.id}.${isPng ? 'png' : 'svg'}`,
          isPng ? 'image/png' : 'image/svg+xml',
          '850 Ko'
        );
      } catch {
        onFileSelected(sample.svgDataUrl, `${sample.id}.svg`, 'image/svg+xml', '45 Ko');
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-2 sm:pt-4 px-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          Vérification d'authenticité académique
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Déposez un diplôme pour analyse optique, contrôle de typographie, détection des retouches et vérification dans le registre officiel.
        </p>
      </div>

      {/* Main Upload Area */}
      <div
        id="drop-zone-container"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl border border-slate-300 bg-white p-6 sm:p-12 text-center transition-colors ${
          isDragging
            ? 'border-slate-900 bg-slate-50'
            : 'hover:border-slate-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={handleFileInputChange}
          className="hidden"
          id="diploma-file-input"
        />

        <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 mb-3 text-lg font-mono">
          ↓
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-slate-900">
          Glissez-déposez le document ici
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Formats acceptés : PDF, PNG, JPEG ou WebP (max 30 Mo)
        </p>

        {/* Action buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <button
            id="browse-files-btn"
            type="button"
            disabled={isAnalyzing}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
          >
            Sélectionner un fichier
          </button>

          <button
            id="open-camera-btn"
            type="button"
            disabled={isAnalyzing}
            onClick={startCamera}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Scanner avec la caméra
          </button>
        </div>

        {/* Footnote specs */}
        <div className="mt-6 border-t border-slate-100 pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
          <span>Analyse médico-légale ELA</span>
          <span className="text-slate-300">•</span>
          <span>Empreinte cryptographique SHA-256</span>
          <span className="text-slate-300">•</span>
          <span>Contrôle croisé du registre d'État</span>
        </div>
      </div>

      {/* Preset Test Scenarios */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-1 mb-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Documents d'essai immédiats
            </h3>
            <p className="text-xs text-slate-500">
              Testez directement les contrôles d'authenticité et les filtres de conformité académique :
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {SAMPLE_DIPLOMAS.map((sample, idx) => {
            const isExclusion = sample.expectedStatus === 'NON_CONFORME';
            const isFraud = sample.expectedStatus === 'FALSIFIE';
            return (
              <button
                key={sample.id}
                id={`test-${sample.id}-btn`}
                type="button"
                onClick={() => handleLoadSample(idx)}
                className="rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-400 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-900">
                      {sample.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {isExclusion ? 'Exclusion' : isFraud ? 'Fraude' : 'Conforme'}
                    </span>
                  </div>
                  <h4 className="text-xs text-slate-700 font-medium">
                    {sample.degreeTitle}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                    {sample.scenarioDescription}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-900 flex items-center justify-between">
                  <span>{isExclusion ? 'Tester le rejet' : 'Tester ce document'}</span>
                  <span>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Camera Scanner Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Numérisation par caméra
              </h3>
              <button
                onClick={stopCamera}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 text-lg leading-none"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            {cameraError ? (
              <div className="my-5 rounded-lg bg-red-50 p-3.5 text-xs text-red-700 border border-red-200">
                {cameraError}
              </div>
            ) : (
              <div className="my-4 relative rounded-lg overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-4 border border-dashed border-white/60 rounded-md pointer-events-none flex flex-col justify-between p-2 text-center">
                  <span className="text-[10px] text-white/90 bg-black/50 px-2 py-0.5 rounded self-center">
                    Alignez les contours du diplôme dans le cadre
                  </span>
                  <span className="text-[10px] text-white/90 bg-black/50 px-2 py-0.5 rounded self-center">
                    Veillez à la lisibilité des textes et du sceau
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>
              {!cameraError && (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Prendre la photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
