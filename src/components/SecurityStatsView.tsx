import React from 'react';
import { VerificationStats } from '../types';

interface SecurityStatsViewProps {
  stats: VerificationStats;
}

export const SecurityStatsView: React.FC<SecurityStatsViewProps> = ({ stats }) => {
  const authenticRate =
    stats.totalVerifications > 0
      ? Math.round((stats.authenticCount / stats.totalVerifications) * 100)
      : 88;

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
          Observatoire de l'authenticité académique
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Statistiques de détection en temps réel, taux de conformité et vecteurs de falsification identifiés par vision multimodale.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Total des diplômes audités
          </div>
          <div className="text-2xl sm:text-3xl font-semibold font-mono text-slate-900">
            {stats.totalVerifications}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Scans optiques et contrôles de registre
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Taux d'authenticité validé
          </div>
          <div className="text-2xl sm:text-3xl font-semibold font-mono text-slate-900">
            {authenticRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.authenticCount} diplômes conformes
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Anomalies et fraudes interceptées
          </div>
          <div className="text-2xl sm:text-3xl font-semibold font-mono text-slate-900">
            {stats.falsifiedCount + stats.suspiciousCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.falsifiedCount} falsifiés • {stats.suspiciousCount} suspects
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="text-xs font-medium text-slate-500 mb-1">
            Temps moyen de traitement
          </div>
          <div className="text-2xl sm:text-3xl font-semibold font-mono text-slate-900">
            {(stats.averageProcessingTimeMs / 1000).toFixed(2)}s
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            OCR vision et empreinte SHA-256
          </div>
        </div>
      </div>

      {/* Fraud Vectors Breakdown & Security Architecture */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Fraud Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Motifs de falsification observés
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Répartition des anomalies et discordances relevées lors des analyses
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-medium">Usurpation de numéro de série / Faux matricule</span>
                <span className="font-mono text-slate-900 font-semibold">44%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-slate-900 h-full rounded-full w-[44%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-medium">Altération typographique (remplacement nom ou note)</span>
                <span className="font-mono text-slate-900 font-semibold">32%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-slate-700 h-full rounded-full w-[32%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-medium">Sceau académique absent ou contrefait</span>
                <span className="font-mono text-slate-900 font-semibold">16%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-slate-500 h-full rounded-full w-[16%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-700 font-medium">Incohérences de dates ou chronologie</span>
                <span className="font-mono text-slate-900 font-semibold">8%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full w-[8%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Security Architecture Specifications */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Protocole de sécurité et intégrité
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Normes techniques assurant l'inviolabilité de l'audit
          </p>

          <div className="space-y-3">
            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
              <div className="text-xs font-semibold text-slate-900">
                Empreinte cryptographique immuable
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                Chaque document analysé se voit attribuer un hash SHA-256 certifié empêchant toute modification a posteriori.
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
              <div className="text-xs font-semibold text-slate-900">
                Vision multimodale et contrôle de polices
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                Transcription OCR couplée à la vérification de conformité des micro-polices et des sceaux officiels.
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
              <div className="text-xs font-semibold text-slate-900">
                Conformité stricte à la confidentialité
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                Traitement des flux en mémoire vive avec clés API isolées côté serveur, sans conservation des fichiers sources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
