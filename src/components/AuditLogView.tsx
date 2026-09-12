import React, { useState } from 'react';
import { VerificationStatus } from '../types';

export interface AuditEntry {
  verificationId: string;
  timestamp: string;
  studentName: string;
  institution: string;
  degreeTitle: string;
  status: VerificationStatus;
  confidenceScore: number;
  sha256: string;
}

interface AuditLogViewProps {
  auditLogs: AuditEntry[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ auditLogs }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesStatus = filterStatus === 'ALL' || log.status === filterStatus;
    const matchesSearch =
      log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.verificationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sha256.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `journal_audit_diplomes_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'AUTHENTIQUE':
        return <span className="text-[11px] font-medium text-slate-800">Authentique</span>;
      case 'FALSIFIE':
        return <span className="text-[11px] font-medium text-slate-800">Falsifié</span>;
      case 'SUSPECT':
        return <span className="text-[11px] font-medium text-slate-800">Suspect</span>;
      default:
        return <span className="text-[11px] font-medium text-slate-800">Non conforme</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Journal d'audit des vérifications
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Historique horodaté et immuable des analyses effectuées, avec empreinte SHA-256 et score d'authenticité.
          </p>
        </div>

        <button
          id="export-audit-json-btn"
          onClick={exportAsJson}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 shrink-0 self-start sm:self-auto"
        >
          Exporter le journal JSON
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="w-full sm:flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrer par titulaire, établissement, référence d'audit ou empreinte..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'Tous' },
            { id: 'AUTHENTIQUE', label: 'Authentiques' },
            { id: 'FALSIFIE', label: 'Falsifiés' },
            { id: 'SUSPECT', label: 'Suspects' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                filterStatus === st.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-medium">
                <th className="px-4 py-3">Réf. Audit</th>
                <th className="px-4 py-3">Horodatage</th>
                <th className="px-4 py-3">Titulaire</th>
                <th className="px-4 py-3">Établissement</th>
                <th className="px-4 py-3">Empreinte SHA-256</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((entry) => (
                <tr key={entry.verificationId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-slate-900">
                    {entry.verificationId}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono">
                    {new Date(entry.timestamp).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {entry.studentName}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {entry.institution}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                    {entry.sha256.substring(0, 8)}...{entry.sha256.substring(entry.sha256.length - 6)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-slate-900">
                    {entry.confidenceScore}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    {getStatusBadge(entry.status)}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Aucun événement d'audit ne correspond à la sélection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
