import React from 'react';
import { VerificationResult } from '../types';

interface OfficialAttestationModalProps {
  result: VerificationResult;
  onClose: () => void;
}

export const OfficialAttestationModal: React.FC<OfficialAttestationModalProps> = ({
  result,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const isAuthentic = result.status === 'AUTHENTIQUE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden print:border-none print:shadow-none print:w-full print:max-w-none my-auto">
        {/* Modal Header Controls (hidden when printing) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 print-hidden">
          <span className="text-xs font-semibold text-slate-900">
            Attestation officielle de contrôle d'authenticité
          </span>
          <div className="flex items-center gap-2">
            <button
              id="print-certificate-btn"
              onClick={handlePrint}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Imprimer / Exporter PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 text-lg leading-none"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div
          id="printable-attestation"
          className="p-6 sm:p-10 bg-white text-slate-900 print:p-6"
        >
          <div className="border border-slate-300 p-5 sm:p-8 relative">
            {/* Header */}
            <div className="text-center pb-5 border-b border-slate-200">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                SYSTÈME NATIONAL DE VÉRIFICATION ACADÉMIQUE
              </div>
              <h1 className="mt-1.5 text-xl sm:text-2xl font-semibold tracking-tight text-slate-950 uppercase">
                Attestation de Vérification
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Contrôle médico-légal et cryptographique d'intégrité documentaire
              </p>
            </div>

            {/* Certificate Identifier & Metadata */}
            <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded border border-slate-200">
              <div>
                <span className="text-slate-500 font-medium">Référence d'attestation :</span>
                <div className="font-mono font-semibold text-slate-900 mt-0.5">{result.verificationId}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Horodatage de certification :</span>
                <div className="font-mono text-slate-800 mt-0.5">
                  {new Date(result.timestamp).toLocaleString('fr-FR')}
                </div>
              </div>
            </div>

            {/* Core Attestation Statement */}
            <div className="my-5 text-xs leading-relaxed text-slate-800">
              <p>
                Il est certifié que le document soumis a fait l'objet d'un audit complet d'authenticité portant sur le titre suivant :
              </p>

              <div className="my-3 rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2">
                <div className="flex justify-between items-baseline border-b border-slate-200/80 pb-1.5">
                  <span className="text-slate-500 font-medium">Titulaire :</span>
                  <span className="text-sm font-semibold text-slate-950">
                    {result.diplomaData.studentName}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-slate-200/80 pb-1.5">
                  <span className="text-slate-500 font-medium">Grade décerné :</span>
                  <span className="font-semibold text-slate-900">
                    {result.diplomaData.degreeTitle}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-slate-200/80 pb-1.5">
                  <span className="text-slate-500 font-medium">Spécialité :</span>
                  <span className="text-slate-800 font-medium">
                    {result.diplomaData.fieldOfStudy}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-slate-200/80 pb-1.5">
                  <span className="text-slate-500 font-medium">Établissement :</span>
                  <span className="text-slate-900 font-medium">
                    {result.diplomaData.institution}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500 font-medium">Numéro de série :</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {result.diplomaData.documentId}
                  </span>
                </div>
              </div>
            </div>

            {/* Verdict Box */}
            <div
              className={`my-5 rounded-lg p-3.5 border text-center ${
                isAuthentic
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                  : 'bg-red-50/60 border-red-300 text-red-950'
              }`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider">
                Résultat de l'audit
              </div>
              <div className="text-base font-semibold mt-1">
                {isAuthentic ? 'Titre académique certifié authentique' : 'Anomalie / Falsification détectée'}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                Score d'authenticité : <strong>{result.confidenceScore}%</strong>
              </div>
            </div>

            {/* Cryptographic SHA-256 Signature */}
            <div className="my-5 border-t border-slate-200 pt-3 text-[11px] text-slate-600">
              <div className="font-medium text-slate-700 mb-1">
                Empreinte cryptographique immuable (SHA-256) :
              </div>
              <div className="break-all bg-slate-50 p-2 rounded border border-slate-200 text-slate-800 font-mono text-[10px]">
                {result.sha256}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
              <div className="text-[10px] text-slate-500">
                Document certifié électroniquement • VD Souverain d'État
              </div>
              <div className="text-right">
                <div className="font-medium text-slate-800">Cachet de conformité</div>
                <div className="text-[10px] text-slate-500">Signé numériquement</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
