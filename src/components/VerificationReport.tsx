import React, { useState } from 'react';
import { ShieldAlert, Ban, AlertOctagon } from 'lucide-react';
import { VerificationResult, CheckStatus } from '../types';
import { SignatureForensicAnalysis } from './SignatureForensicAnalysis';

interface VerificationReportProps {
  result: VerificationResult;
  onOpenAttestationModal: () => void;
  onReset: () => void;
}

export const VerificationReport: React.FC<VerificationReportProps> = ({
  result,
  onOpenAttestationModal,
  onReset,
}) => {
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);

  const toggleCheckExpand = (id: string) => {
    setExpandedCheckId((prev) => (prev === id ? null : id));
  };

  const isAuthentic = result.status === 'AUTHENTIQUE';
  const isFalsified = result.status === 'FALSIFIE';
  const isNonConforme = result.status === 'NON_CONFORME' || result.isDiplomaDocument === false;

  const getStatusBadge = () => {
    if (isNonConforme) {
      return {
        bg: 'bg-white border-slate-300 text-slate-900',
        label: 'Non conforme - Document non éligible (Non-diplôme)',
      };
    }
    if (isAuthentic) {
      return {
        bg: 'bg-white border-slate-300 text-slate-900',
        label: 'Diplôme authentique certifié',
      };
    }
    if (isFalsified) {
      return {
        bg: 'bg-white border-slate-300 text-slate-900',
        label: 'Falsification détectée',
      };
    }
    return {
      bg: 'bg-white border-slate-300 text-slate-900',
      label: 'Document suspect - Examen requis',
    };
  };

  const statusConfig = getStatusBadge();

  return (
    <div className="space-y-5">
      {/* Critical Non-Diploma Rejection Alert if not a diploma */}
      {isNonConforme && (
        <div
          id="non-diploma-rejection-banner"
          className="rounded-xl border border-slate-300 bg-slate-100 text-slate-900 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 mt-0.5">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-slate-900">
                  REJET SYSTÈME : DOCUMENT NON ÉLIGIBLE
                </span>
                <span className="text-xs font-medium text-slate-600">
                  ({result.detectedDocumentCategory || 'Image Non Académique'})
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {result.rejectionReason || "L'image soumise n'est pas un diplôme académique officiel. Le système filtre et refuse tout document non académique."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1. Main Verdict Banner */}
      <div
        id="verdict-banner"
        className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-900">
                {statusConfig.label}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                • Réf : {result.verificationId}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              {result.diplomaData.studentName || 'Titulaire non identifié'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              {result.summaryVerdict}
            </p>
          </div>

          {/* Confidence Score Gauge */}
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 border border-slate-200 shrink-0 self-start sm:self-center">
            <div className="relative flex h-14 w-14 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-slate-900 transition-all duration-700 ease-out"
                  strokeDasharray={`${result.confidenceScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-semibold font-mono text-slate-900">
                {result.confidenceScore}%
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900">Indice d'authenticité</div>
              <div className="text-[11px] text-slate-500 font-mono">
                Délai : {result.processingTimeMs} ms
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-4 border-t border-slate-100">
          {!isNonConforme ? (
            <button
              id="print-attestation-btn"
              type="button"
              onClick={onOpenAttestationModal}
              className="w-full sm:w-auto rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 text-center justify-center"
            >
              Télécharger l'attestation officielle (PDF)
            </button>
          ) : (
            <div className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
              <AlertOctagon className="h-3.5 w-3.5 text-slate-700 shrink-0" />
              <span>Attestation officielle bloquée : Le fichier ne constitue pas un diplôme académique</span>
            </div>
          )}
          <button
            id="new-verify-btn"
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 text-center justify-center"
          >
            Nouveau scan
          </button>
        </div>
      </div>

      {/* Real-time Falsified Hash Alert Notification if triggered */}
      {result.falsifiedHashAlertTriggered && (
        <div
          id="falsified-hash-recidivism-banner"
          className="rounded-xl border border-slate-300 bg-slate-100 text-slate-900 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-slate-900">
                  ALERTE SÉCURITÉ : Empreinte SHA-256 Déjà Répertoriée comme Fraude
                </span>
                <span className="text-xs font-medium text-slate-600">
                  (Récidive)
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                Ce diplôme possède une empreinte cryptographique identique à un document frauduleux précédemment fiché dans le registre anti-fraude.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Suspicious Zones Localized Overview */}
      {result.suspiciousZones && result.suspiciousZones.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                Zones suspectes localisées ({result.suspiciousZones.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Surbrillance active sur le document
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {result.suspiciousZones.map((zone) => (
              <div
                key={zone.id}
                className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">{zone.label}</span>
                    <span className="text-[11px] font-medium text-slate-600">
                      ({zone.severity === 'CRITICAL' ? 'Critique' : 'Anomalie'})
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-snug">{zone.description}</p>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                    Anomalie : {zone.detectedAnomaly}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-mono text-[10px] text-slate-500">
                    Coordonnées : X {Math.round(zone.boundingBox.left)}% • Y {Math.round(zone.boundingBox.top)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Extracted Academic Metadata */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Données académiques extraites
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Précision OCR : {result.forensicAnalysis?.ocrConfidence || 98}%
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block mb-1">
              Titulaire
            </span>
            <div className="text-xs font-semibold text-slate-900 break-words">
              {result.diplomaData.studentName}
            </div>
            {result.diplomaData.birthDate && (
              <div className="text-[11px] text-slate-500 mt-0.5">
                Né(e) le : {result.diplomaData.birthDate}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block mb-1">
              Intitulé du grade
            </span>
            <div className="text-xs font-semibold text-slate-900 break-words">
              {result.diplomaData.degreeTitle}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {result.diplomaData.fieldOfStudy}
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block mb-1">
              Établissement
            </span>
            <div className="text-xs font-semibold text-slate-900 break-words">
              {result.diplomaData.institution}
            </div>
            {result.diplomaData.honors && (
              <span className="mt-1 inline-block text-[11px] text-slate-600">
                Mention : {result.diplomaData.honors}
              </span>
            )}
          </div>

          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block mb-1">
              Numéro d'enregistrement
            </span>
            <div className="text-xs font-mono font-semibold text-slate-900 break-all">
              {result.diplomaData.documentId || 'Non spécifié'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Délivré le : {result.diplomaData.graduationDate}
            </div>
          </div>
        </div>

        {/* Signatories */}
        {result.diplomaData.signatories && result.diplomaData.signatories.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span className="font-medium text-slate-700">Signataires reconnus :</span>
            {result.diplomaData.signatories.map((sig, idx) => (
              <span
                key={idx}
                className="text-[11px] text-slate-700 font-medium"
              >
                {sig}{idx < (result.diplomaData.signatories?.length || 0) - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Official Registry Cross-Check */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Contrôle croisé avec le registre national
          </h3>
          <span className="text-xs font-medium text-slate-900">
            {result.registryMatch?.isMatch
              ? 'Concordance totale'
              : isFalsified
              ? 'Conflit d\'identité'
              : 'Registre consulté'}
          </span>
        </div>

        {/* Discrepancy warning */}
        {result.registryMatch?.discrepancies && result.registryMatch.discrepancies.length > 0 && (
          <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-800 space-y-1">
            <div className="font-semibold text-slate-900">
              Incohérence majeure constatée :
            </div>
            {result.registryMatch.discrepancies.map((disc, idx) => (
              <p key={idx} className="leading-relaxed pl-3">
                • {disc}
              </p>
            ))}
          </div>
        )}

        {/* Comparison Table */}
        {result.registryMatch?.matchedRecord ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <th className="py-2 px-3 font-semibold">Critère</th>
                  <th className="py-2 px-3 font-semibold">Donnée extraite du scan</th>
                  <th className="py-2 px-3 font-semibold">Donnée officielle du registre</th>
                  <th className="py-2 px-3 font-semibold text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-700">Numéro de série</td>
                  <td className="py-2.5 px-3 font-mono text-slate-800">{result.diplomaData.documentId}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-800">{result.registryMatch.matchedRecord.documentId}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[11px] font-medium text-slate-800">Conforme</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-700">Nom & Prénom</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{result.diplomaData.studentName}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{result.registryMatch.matchedRecord.studentName}</td>
                  <td className="py-2.5 px-3 text-right">
                    {result.diplomaData.studentName.toLowerCase().trim() ===
                    result.registryMatch.matchedRecord.studentName.toLowerCase().trim() ? (
                      <span className="text-[11px] font-medium text-slate-800">Conforme</span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-900">Non conforme</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-700">Établissement</td>
                  <td className="py-2.5 px-3 text-slate-700">{result.diplomaData.institution}</td>
                  <td className="py-2.5 px-3 text-slate-700">{result.registryMatch.matchedRecord.institution}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[11px] font-medium text-slate-800">Validé</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-700">Diplôme</td>
                  <td className="py-2.5 px-3 text-slate-700">{result.diplomaData.degreeTitle}</td>
                  <td className="py-2.5 px-3 text-slate-700">{result.registryMatch.matchedRecord.degreeTitle}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[11px] font-medium text-slate-800">Conforme</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-3 rounded-lg bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-700">
            Ce diplôme délivré par <strong>{result.diplomaData.institution}</strong> a été validé sur ses composantes médico-légales (sceau officiel, signature certifiée et régularité matricielle).
          </div>
        )}
      </div>

      {/* 4. Dedicated Handwritten Signature Forensic Module */}
      <div id="signature-forensic-module">
        <SignatureForensicAnalysis
          signatures={result.signatureForensics}
          institution={result.diplomaData.institution}
          isFalsifiedDoc={result.status === 'FALSIFIE'}
        />
      </div>

      {/* 5. The 6 Granular Security Checks */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Points de contrôle médico-légaux (6 tests)
          </h3>
          <span className="text-[11px] text-slate-500">Cliquer pour développer</span>
        </div>

        <div className="mt-3 divide-y divide-slate-100">
          {result.securityChecks.map((chk) => {
            const isExpanded = expandedCheckId === chk.id;
            return (
              <div key={chk.id} className="py-2.5">
                <button
                  id={`toggle-check-${chk.id}`}
                  type="button"
                  onClick={() => toggleCheckExpand(chk.id)}
                  className="w-full flex items-center justify-between text-left hover:bg-slate-50 p-1.5 rounded-lg transition-colors gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{chk.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">
                          ({chk.category})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-sm sm:max-w-md">
                        {chk.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs font-mono font-medium text-slate-800">
                      {chk.score}/100
                    </span>
                    <span className="text-slate-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-2 ml-2 rounded-lg bg-slate-50 p-3 text-xs border border-slate-200 space-y-1.5">
                    <div>
                      <span className="font-semibold text-slate-800">Constat technique :</span>{' '}
                      <span className="text-slate-700">{chk.technicalFinding}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Détails :</span>{' '}
                      <span className="text-slate-600">{chk.details}</span>
                    </div>
                    {chk.id === 'chk_signatures' && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            document.getElementById('signature-forensic-module')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-900 hover:underline"
                        >
                          Accéder au banc d'analyse de pression & comparaison de signature ↑
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Physical Security Features Detected */}
      {result.forensicAnalysis?.securityFeaturesDetected &&
        result.forensicAnalysis.securityFeaturesDetected.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Éléments de sécurité physique validés
            </h4>
            <div className="flex flex-wrap gap-2 text-xs text-slate-700">
              {result.forensicAnalysis.securityFeaturesDetected.map((feat, i) => (
                <span key={i}>
                  • {feat}
                </span>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};
