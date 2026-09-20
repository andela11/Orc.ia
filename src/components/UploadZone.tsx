import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  Camera,
  FileCheck2,
  ShieldAlert,
  Scan,
  ArrowRight,
  CheckCircle2,
  X,
  FileText,
  Lock,
} from 'lucide-react';
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Banc d'Acquisition Optique & Analyse Médico-Légale</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Vérification d'authenticité académique
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Déposez un parchemin pour contrôle optique, analyse typographique ELA, détection de retouches et recoupement dans le registre d'État.
        </p>
      </div>

      {/* Main Upload Area */}
      <motion.div
        id="drop-zone-container"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.002 }}
        className={`relative overflow-hidden rounded-xl border p-8 sm:p-12 text-center transition-all shadow-xs ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/60 shadow-lg'
            : 'border-slate-200 bg-white hover:border-slate-300'
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

        {/* Clean Icon without blinking ping */}
        <div className="relative mx-auto w-14 h-14 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-4 shadow-xs">
          <UploadCloud className="h-7 w-7 text-emerald-700" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 font-serif">
          Glissez-déposez le diplôme officiel à certifier
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Formats acceptés : PDF haute définition, PNG, JPEG ou WebP (jusqu'à 30 Mo)
        </p>

        {/* Modern Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto max-w-sm sm:max-w-none mx-auto">
          <motion.button
            id="browse-files-btn"
            type="button"
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isAnalyzing}
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-slate-800 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="h-4 w-4 text-emerald-400" />
            <span>Sélectionner un fichier</span>
          </motion.button>

          <motion.button
            id="open-camera-btn"
            type="button"
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isAnalyzing}
            onClick={startCamera}
            className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Camera className="h-4 w-4 text-slate-600" />
            <span>Scanner avec la caméra</span>
          </motion.button>
        </div>

        {/* Footnote specs */}
        <div className="mt-8 border-t border-slate-100 pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Analyse médico-légale ELA
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Empreinte cryptographique SHA-256
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Recoupement du registre officiel
          </span>
        </div>
      </motion.div>

      {/* Preset Test Scenarios with modern reactive cards */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Documents d'essai immédiats
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono font-medium text-slate-600">
                Simulateur de tests
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Testez directement les contrôles d'authenticité et les filtres de conformité académique :
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {SAMPLE_DIPLOMAS.map((sample, idx) => {
            const isExclusion = sample.expectedStatus === 'NON_CONFORME';
            const isFraud = sample.expectedStatus === 'FALSIFIE';
            return (
              <motion.button
                key={sample.id}
                id={`test-${sample.id}-btn`}
                type="button"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLoadSample(idx)}
                className={`group rounded-lg border p-4 text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isFraud
                    ? 'border-rose-200 bg-rose-50/20 hover:border-rose-400 hover:bg-rose-50/40'
                    : isExclusion
                    ? 'border-amber-200 bg-amber-50/20 hover:border-amber-400 hover:bg-amber-50/40'
                    : 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-400 hover:bg-emerald-50/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 truncate pr-2">
                      {sample.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase border ${
                        isFraud
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : isExclusion
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {isExclusion ? 'Exclusion' : isFraud ? 'Fraude' : 'Conforme'}
                    </span>
                  </div>
                  <h4 className="text-xs text-slate-800 font-semibold line-clamp-1">
                    {sample.degreeTitle}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                    {sample.scenarioDescription}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[11px] font-semibold text-slate-900 flex items-center justify-between group-hover:text-emerald-700 transition-colors">
                  <span>{isExclusion ? 'Tester le rejet' : 'Tester ce parchemin'}</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Live Camera Scanner Modal */}
      <AnimatePresence>
        {isCameraActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 font-serif">
                    Détection & Scan Vidéo de Parchemin
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 mb-3 bg-emerald-50 border border-emerald-200/70 rounded-lg p-3 text-xs text-emerald-950 flex items-center gap-2">
                <span className="font-semibold text-emerald-800 shrink-0">Filtre académique :</span>
                <span>L'objectif capture le document et le moteur vérifie la présence des sceaux et signatures d'État. Tout document non-diplôme sera exclu.</span>
              </div>

              {cameraError ? (
                <div className="my-5 rounded-lg bg-red-50 p-4 text-xs text-red-700 border border-red-200">
                  {cameraError}
                </div>
              ) : (
                <div className="my-3 relative rounded-xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center border border-slate-800 shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Visual reticle */}
                  <div className="absolute inset-5 border-2 border-dashed border-emerald-400/90 rounded-lg pointer-events-none flex flex-col justify-between p-3 text-center shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-500/40">
                        Zone Diplôme / Titre
                      </span>
                      <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                        HD 1080p
                      </span>
                    </div>

                    <div className="self-center flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full border border-emerald-400/60 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[11px] text-white font-medium bg-black/70 px-3 py-1 rounded-full shadow-xs">
                        Cadrez le parchemin complet avec le sceau
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        Sceau d'État obligatoire
                      </span>
                      <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        Contrôle IA Strict
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                {!cameraError && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={capturePhoto}
                    className="rounded-lg bg-slate-950 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Capturer & Analyser le diplôme
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
