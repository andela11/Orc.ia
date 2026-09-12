import React, { useState } from 'react';
import { VerificationResult, SuspiciousZone } from '../types';

interface DocumentViewerProps {
  imageSrc: string;
  fileName: string;
  fileSize?: string;
  verificationResult?: VerificationResult | null;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  imageSrc,
  fileName,
  fileSize,
  verificationResult,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showOverlays, setShowOverlays] = useState(true);
  const [showRegulatoryMarks, setShowRegulatoryMarks] = useState(true);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.6));
  const handleResetZoom = () => {
    setZoom(1);
    setSelectedZoneId(null);
  };

  const copySha256 = () => {
    if (!verificationResult?.sha256) return;
    navigator.clipboard.writeText(verificationResult.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const isFalsified = verificationResult?.status === 'FALSIFIE';
  const suspiciousZones: SuspiciousZone[] = verificationResult?.suspiciousZones || [];
  const hasSuspiciousZones = suspiciousZones.length > 0;

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/80 px-3.5 py-2.5 gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-slate-800 truncate max-w-[150px] sm:max-w-xs">
            {fileName}
          </span>
          {fileSize && (
            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">
              {fileSize}
            </span>
          )}

          {/* Status Indicator */}
          {verificationResult && (
            <div className="ml-1 text-xs text-slate-700">
              {hasSuspiciousZones ? (
                <span className="font-semibold text-slate-900">
                  {suspiciousZones.length} zone{suspiciousZones.length > 1 ? 's' : ''} suspecte{suspiciousZones.length > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="font-medium text-slate-700">
                  Aucune anomalie détectée
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Overlays toggle */}
          {verificationResult && (
            <div className="flex items-center gap-1">
              <button
                id="toggle-suspicious-overlays-btn"
                type="button"
                onClick={() => setShowOverlays(!showOverlays)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  showOverlays
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
                title="Afficher ou masquer la surbrillance des zones suspectes"
              >
                {showOverlays ? 'Zones suspectes activées' : 'Afficher zones'}
              </button>

              <button
                onClick={() => setShowRegulatoryMarks(!showRegulatoryMarks)}
                className={`hidden sm:inline-block rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                  showRegulatoryMarks
                    ? 'bg-slate-200 text-slate-800'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
                title="Afficher ou masquer les repères réglementaires (sceau, signatures)"
              >
                Repères officiels
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div className="flex items-center rounded-md bg-white border border-slate-200 text-slate-700">
            <button
              onClick={handleZoomOut}
              className="px-2 py-0.5 hover:bg-slate-100 rounded-l font-mono text-sm"
              title="Zoom arrière"
            >
              −
            </button>
            <span className="px-1.5 text-[10px] font-mono font-medium text-slate-600 border-x border-slate-100">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="px-2 py-0.5 hover:bg-slate-100 font-mono text-sm"
              title="Zoom avant"
            >
              +
            </button>
            <button
              onClick={handleResetZoom}
              className="px-1.5 py-0.5 hover:bg-slate-100 rounded-r text-[10px] font-medium text-slate-500 border-l border-slate-100"
              title="Réinitialiser le zoom"
            >
              1:1
            </button>
          </div>
        </div>
      </div>

      {/* Main Document Inspection Canvas */}
      <div className="relative min-h-[280px] sm:min-h-[380px] max-h-[500px] overflow-auto bg-slate-100/90 p-4 sm:p-6 flex items-center justify-center select-none">
        <div
          className="relative transition-transform duration-150 ease-out origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <img
            src={imageSrc}
            alt="Scan du diplôme académique"
            className="max-h-[420px] w-auto rounded border border-slate-300 bg-white object-contain shadow-sm"
          />

          {/* Visual Detection Overlays */}
          {verificationResult && showOverlays && (
            <div className="absolute inset-0">
              {/* Suspicious Zones (Extracted by AI) */}
              {suspiciousZones.map((zone) => {
                const isSelected = selectedZoneId === zone.id;
                const { top, left, width, height } = zone.boundingBox;

                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZoneId(isSelected ? null : zone.id)}
                    style={{
                      top: `${top}%`,
                      left: `${left}%`,
                      width: `${width}%`,
                      height: `${height}%`,
                    }}
                    className={`absolute rounded cursor-pointer transition-all duration-200 pointer-events-auto group ${
                      isSelected
                        ? 'border-2 border-red-600 bg-red-600/30 ring-4 ring-red-400/40 z-30'
                        : 'border-2 border-dashed border-red-600 bg-red-500/20 hover:bg-red-500/30 z-20'
                    }`}
                  >
                    {/* Badge on top of the zone */}
                    <div className="absolute -top-6 left-0 flex items-center gap-1 rounded bg-red-700 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs whitespace-nowrap">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      <span>{zone.label}</span>
                      <span className="font-mono text-[8px] opacity-80 ml-0.5">
                        [{Math.round(left)}%, {Math.round(top)}%]
                      </span>
                    </div>

                    {/* Expandable / Hover anomaly card */}
                    <div
                      className={`absolute left-0 top-full mt-1.5 w-64 rounded-lg bg-slate-900/95 text-white p-2.5 shadow-xl backdrop-blur-xs text-left z-40 transition-all pointer-events-none ${
                        isSelected ? 'block' : 'hidden group-hover:block'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-700/80 pb-1 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                          Zone suspecte identifiée
                        </span>
                        <span className="text-[9px] font-mono text-slate-300">
                          Coord: X:{Math.round(left)}% Y:{Math.round(top)}%
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-100 leading-tight mb-1">
                        {zone.detectedAnomaly}
                      </p>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        {zone.description}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800">
                        <span>Gravité : {zone.severity === 'CRITICAL' ? 'Critique' : 'Majeure'}</span>
                        <span className="text-slate-300">Zone #{zone.id}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Standard Regulatory Marks (Optional / Contextual) */}
              {showRegulatoryMarks && !hasSuspiciousZones && (
                <>
                  {/* Verified Student Name Zone */}
                  <div
                    style={{ top: '55%', left: '24%', width: '52%', height: '8%' }}
                    className="absolute rounded border-2 border-emerald-600 bg-emerald-500/15 pointer-events-none"
                  >
                    <span className="absolute -top-5 left-1 text-[9px] font-bold bg-emerald-700 text-white px-1.5 py-0.2 rounded shadow-xs">
                      Titulaire certifié conforme
                    </span>
                  </div>

                  {/* Sceau officiel */}
                  <div
                    style={{ top: '75%', left: '44%', width: '12%', height: '16%' }}
                    className="absolute rounded-full border border-slate-700 bg-slate-700/15 pointer-events-none"
                  >
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-medium bg-slate-800 text-white px-1.5 py-0.2 rounded whitespace-nowrap">
                      Sceau officiel
                    </span>
                  </div>

                  {/* Signatures */}
                  <div
                    style={{ top: '80%', left: '12%', width: '25%', height: '13%' }}
                    className="absolute rounded border border-slate-700/60 bg-slate-700/10 pointer-events-none"
                  >
                    <span className="absolute -top-4 left-1 text-[9px] font-medium bg-slate-800 text-white px-1.5 py-0.2 rounded">
                      Signature autorité
                    </span>
                  </div>

                  <div
                    style={{ top: '80%', right: '8%', width: '25%', height: '13%' }}
                    className="absolute rounded border border-slate-700/60 bg-slate-700/10 pointer-events-none"
                  >
                    <span className="absolute -top-4 right-1 text-[9px] font-medium bg-slate-800 text-white px-1.5 py-0.2 rounded">
                      Signature chancelier
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Suspicious Zones Inspector Panel */}
      {hasSuspiciousZones && (
        <div className="border-t border-slate-200 bg-slate-50/50 p-3 sm:p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900">
                Zones suspectes identifiées ({suspiciousZones.length})
              </span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              Cliquer sur une zone pour cibler sa surbrillance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suspiciousZones.map((zone) => {
              const isSelected = selectedZoneId === zone.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZoneId(isSelected ? null : zone.id)}
                  className={`text-left rounded-lg p-2.5 transition-colors text-xs border ${
                    isSelected
                      ? 'bg-slate-100 border-slate-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{zone.label}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      X: {Math.round(zone.boundingBox.left)}% • Y: {Math.round(zone.boundingBox.top)}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700 mt-1 leading-snug">
                    {zone.description}
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium mt-1">
                    Anomalie : {zone.detectedAnomaly}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Hash Bar */}
      {verificationResult?.sha256 && (
        <div className="flex flex-wrap items-center justify-between border-t border-slate-200 bg-slate-50 px-3.5 py-2 text-xs gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-500 font-medium">SHA-256 :</span>
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-800 truncate max-w-[180px] sm:max-w-sm border border-slate-200">
              {verificationResult.sha256}
            </code>
          </div>

          <button
            onClick={copySha256}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
          >
            {copiedHash ? 'Copié' : "Copier l'empreinte"}
          </button>
        </div>
      )}
    </div>
  );
};
