import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Radio,
  Copy,
  Check,
  AlertTriangle,
  Flame,
  Search,
  PlusCircle,
  Gavel,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  User,
  Hash,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  Trash2,
  Info,
} from 'lucide-react';
import { FalsifiedDiplomaAlert, FalsifiedHashRecord, AlertStatus } from '../types';

interface RealtimeAlertsDashboardProps {
  alerts: FalsifiedDiplomaAlert[];
  blacklistedHashes: FalsifiedHashRecord[];
  isConnected: boolean;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onUpdateStatus: (alertId: string, status: AlertStatus, note?: string, handledBy?: string) => void;
  onAcknowledge: (alertId: string) => void;
  onAddBlacklistHash: (record: {
    sha256: string;
    reason: string;
    studentName?: string;
    institution?: string;
    degreeTitle?: string;
    threatLevel?: 'MAXIMAL' | 'ELEVE' | 'MODERE';
    notes?: string;
  }) => Promise<any>;
  onRemoveBlacklistHash: (sha256: string) => void;
  onSimulateAlert: () => void;
}

export const RealtimeAlertsDashboard: React.FC<RealtimeAlertsDashboardProps> = ({
  alerts,
  blacklistedHashes,
  isConnected,
  audioEnabled,
  onToggleAudio,
  onUpdateStatus,
  onAcknowledge,
  onAddBlacklistHash,
  onRemoveBlacklistHash,
  onSimulateAlert,
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'blacklist'>('alerts');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AlertStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Investigation Note Modal State
  const [investigatingAlertId, setInvestigatingAlertId] = useState<string | null>(null);
  const [investigationNote, setInvestigationNote] = useState('');
  const [investigatorName, setInvestigatorName] = useState('Agent Anti-Fraude');

  // New Blacklist Hash Modal State
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [newHash, setNewHash] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newStudent, setNewStudent] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newDegree, setNewDegree] = useState('');
  const [newThreat, setNewThreat] = useState<'MAXIMAL' | 'ELEVE' | 'MODERE'>('ELEVE');
  const [newNotes, setNewNotes] = useState('');
  const [isSubmittingHash, setIsSubmittingHash] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(key);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Stats calculation
  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE').length;
  const investigatingAlerts = alerts.filter((a) => a.status === 'EN_INVESTIGATION').length;
  const prosecutionAlerts = alerts.filter((a) => a.status === 'TRANSMIS_PARQUET').length;
  const acknowledgedAlerts = alerts.filter((a) => a.status === 'ACQUITTEE').length;

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesStatus = statusFilter === 'ALL' || alert.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStatus;

    const matchesQuery =
      alert.sha256.toLowerCase().includes(query) ||
      alert.submittedDocument.studentName.toLowerCase().includes(query) ||
      alert.submittedDocument.institution.toLowerCase().includes(query) ||
      alert.submittedDocument.degreeTitle.toLowerCase().includes(query) ||
      alert.triggerReason.toLowerCase().includes(query) ||
      alert.id.toLowerCase().includes(query);

    return matchesStatus && matchesQuery;
  });

  // Filter blacklisted hashes
  const filteredHashes = blacklistedHashes.filter((rec) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      rec.sha256.toLowerCase().includes(query) ||
      rec.reason.toLowerCase().includes(query) ||
      (rec.originalStudentName && rec.originalStudentName.toLowerCase().includes(query)) ||
      (rec.originalInstitution && rec.originalInstitution.toLowerCase().includes(query)) ||
      (rec.originalDocumentTitle && rec.originalDocumentTitle.toLowerCase().includes(query))
    );
  });

  const handleSaveInvestigation = () => {
    if (!investigatingAlertId) return;
    onUpdateStatus(
      investigatingAlertId,
      'EN_INVESTIGATION',
      investigationNote.trim() || 'Prise en charge du dossier d’enquête.',
      investigatorName
    );
    setInvestigatingAlertId(null);
    setInvestigationNote('');
  };

  const handleTransmitParquet = (alertId: string) => {
    onUpdateStatus(
      alertId,
      'TRANSMIS_PARQUET',
      'Signalement transmis au Parquet de la République (Article 40 du Code de Procédure Pénale) pour faux et usage de faux.',
      'Direction Juridique'
    );
  };

  const handleCreateBlacklistHash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHash.trim() || !newReason.trim()) return;

    setIsSubmittingHash(true);
    try {
      await onAddBlacklistHash({
        sha256: newHash.trim(),
        reason: newReason.trim(),
        studentName: newStudent.trim(),
        institution: newInstitution.trim(),
        degreeTitle: newDegree.trim(),
        threatLevel: newThreat,
        notes: newNotes.trim(),
      });
      setIsBlacklistModalOpen(false);
      setNewHash('');
      setNewReason('');
      setNewStudent('');
      setNewInstitution('');
      setNewDegree('');
      setNewNotes('');
    } catch {
      // Handled in hook
    } finally {
      setIsSubmittingHash(false);
    }
  };

  return (
    <div id="realtime-alerts-dashboard-container" className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  Tableau de Bord des Alertes en Temps Réel
                  {activeAlerts > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse border border-red-200">
                      {activeAlerts} {activeAlerts === 1 ? 'alerte active' : 'alertes actives'}
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Surveillance des tentatives de vérification frauduleuses & détection automatique des récidives par empreinte SHA-256.
                </p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Connection Status Pill */}
            <div
              id="ws-status-badge"
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isConnected ? 'animate-pulse text-emerald-600' : 'text-amber-600'}`} />
              <span>{isConnected ? 'Flux WebSocket Actif' : 'Reconnexion en cours...'}</span>
            </div>

            {/* Audio Toggle */}
            <button
              id="btn-toggle-dashboard-audio"
              onClick={onToggleAudio}
              className={`p-2 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
                audioEnabled
                  ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
              }`}
              title={audioEnabled ? 'Son d’alerte activé' : 'Son d’alerte coupé'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              <span className="hidden sm:inline">{audioEnabled ? 'Signal sonore ON' : 'Muet'}</span>
            </button>

            {/* Simulate Trigger Button */}
            <button
              id="btn-simulate-alert-trigger"
              onClick={onSimulateAlert}
              className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Simule instantanément la soumission d’un diplôme contrefait dont le hash est déjà signalé"
            >
              <Flame className="w-4 h-4 text-yellow-300" />
              <span>Simuler une Alerte Falsifiée</span>
            </button>

            {/* Add Hash Button */}
            <button
              id="btn-open-blacklist-modal"
              onClick={() => setIsBlacklistModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ficher un Hash</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI summary bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-5 border-t border-gray-100">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Total Incidents</span>
            <span className="text-xl font-bold text-gray-900 mt-1 block">{totalAlerts}</span>
          </div>

          <div className="bg-red-50/80 border border-red-200 rounded-lg p-3">
            <span className="text-[11px] font-semibold text-red-700 uppercase tracking-wider block flex items-center justify-between">
              <span>Critiques Actives</span>
              {activeAlerts > 0 && <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />}
            </span>
            <span className="text-xl font-bold text-red-700 mt-1 block">{activeAlerts}</span>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">En Investigation</span>
            <span className="text-xl font-bold text-amber-700 mt-1 block">{investigatingAlerts}</span>
          </div>

          <div className="bg-purple-50/80 border border-purple-200 rounded-lg p-3">
            <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block">Transmis Parquet</span>
            <span className="text-xl font-bold text-purple-700 mt-1 block">{prosecutionAlerts}</span>
          </div>

          <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3 col-span-2 md:col-span-1">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">Hashes Répertoriés</span>
            <span className="text-xl font-bold text-blue-700 mt-1 block">{blacklistedHashes.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Filters Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        {/* Main View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg w-fit">
          <button
            id="tab-alerts-feed"
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>Flux des Alertes ({alerts.length})</span>
          </button>

          <button
            id="tab-blacklisted-hashes"
            onClick={() => setActiveTab('blacklist')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'blacklist'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Hash className="w-3.5 h-3.5 text-blue-600" />
            <span>Liste Noire des Hashes ({blacklistedHashes.length})</span>
          </button>
        </div>

        {/* Search and Secondary Filter */}
        <div className="flex items-center gap-2">
          {activeTab === 'alerts' && (
            <select
              id="select-filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIVE">Actives uniquement</option>
              <option value="EN_INVESTIGATION">En investigation</option>
              <option value="TRANSMIS_PARQUET">Transmis Parquet</option>
              <option value="ACQUITTEE">Acquittées</option>
            </select>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-alerts"
              type="text"
              placeholder={activeTab === 'alerts' ? 'Rechercher titulaire, hash, université...' : 'Rechercher hash SHA-256 ou motif...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg w-52 sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: ALERTS FEED */}
      {activeTab === 'alerts' && (
        <div id="alerts-feed-section" className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Aucune alerte correspondante</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Aucun incident ne correspond à vos critères de recherche actuels.'
                  : 'Le système de surveillance est opérationnel. Aucune soumission de diplôme falsifié récidiviste n’a été détectée.'}
              </p>
              <button
                id="btn-simulate-alert-empty-state"
                onClick={onSimulateAlert}
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
              >
                <Flame className="w-3.5 h-3.5" />
                Déclencher un test d'alerte simulée
              </button>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCritique = alert.severity === 'CRITIQUE';
              const isActive = alert.status === 'ACTIVE';

              return (
                <motion.div
                  key={alert.id}
                  id={`alert-card-${alert.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-xl border transition shadow-sm overflow-hidden ${
                    isActive
                      ? 'border-red-400 ring-2 ring-red-100'
                      : alert.status === 'TRANSMIS_PARQUET'
                      ? 'border-purple-300'
                      : alert.status === 'EN_INVESTIGATION'
                      ? 'border-amber-300'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Alert Card Header */}
                  <div
                    className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-red-50/70 border-red-200'
                        : alert.status === 'TRANSMIS_PARQUET'
                        ? 'bg-purple-50/50 border-purple-200'
                        : 'bg-gray-50/70 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          isCritique ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {alert.severity}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                          alert.status === 'ACTIVE'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : alert.status === 'EN_INVESTIGATION'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : alert.status === 'TRANSMIS_PARQUET'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {alert.status === 'ACTIVE' && '🔴 Action Requise'}
                        {alert.status === 'EN_INVESTIGATION' && '🟡 En Cours d’Enquête'}
                        {alert.status === 'TRANSMIS_PARQUET' && '⚖️ Dossier Transmis au Parquet'}
                        {alert.status === 'ACQUITTEE' && '🟢 Dossier Acquitté'}
                      </span>

                      <span className="text-xs text-gray-500 font-mono">
                        Réf : <strong className="text-gray-900">{alert.id}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(alert.timestamp).toLocaleString('fr-FR')}
                      </span>
                      {alert.submittedDocument.ipOrigin && (
                        <span className="font-mono bg-gray-200/70 px-2 py-0.5 rounded text-[11px] text-gray-700">
                          IP: {alert.submittedDocument.ipOrigin}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Alert Content Grid */}
                  <div className="p-5 space-y-4">
                    {/* Primary Incident Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Submitted Document Details */}
                      <div className="border border-gray-200 rounded-lg p-3.5 bg-gray-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-gray-600" />
                            Document Soumis à l'Audit
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                            Tentative de soumission #{alert.attemptCount}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex items-baseline gap-2">
                            <span className="text-gray-500 w-24 shrink-0">Titulaire détecté :</span>
                            <span className="font-bold text-gray-900 text-sm">{alert.submittedDocument.studentName}</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-gray-500 w-24 shrink-0">Diplôme :</span>
                            <span className="font-semibold text-gray-800">{alert.submittedDocument.degreeTitle}</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-gray-500 w-24 shrink-0">Établissement :</span>
                            <span className="text-gray-800">{alert.submittedDocument.institution}</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-gray-500 w-24 shrink-0">Fichier source :</span>
                            <span className="font-mono text-gray-600 truncate">{alert.submittedDocument.fileName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Blacklist Reference Match */}
                      <div className="border border-red-200 rounded-lg p-3.5 bg-red-50/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                            Fiche Noire Correspondante (Registre National)
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                            Menace {alert.hashRecord.threatLevel || 'MAXIMALE'}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div>
                            <span className="text-red-900 font-semibold">Motif de fichage initial :</span>
                            <p className="text-gray-800 mt-0.5 font-medium">{alert.hashRecord.reason}</p>
                          </div>
                          <div className="pt-1 flex items-center justify-between text-[11px] text-gray-600">
                            <span>Signalé le : {new Date(alert.hashRecord.flaggedDate).toLocaleDateString('fr-FR')}</span>
                            <span>Source : <strong className="text-gray-900">{alert.hashRecord.detectionSource}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cryptographic SHA-256 Fingerprint Bar */}
                    <div className="bg-gray-900 text-white rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Hash className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="text-xs text-gray-400 shrink-0">Empreinte Falsifiée SHA-256 :</span>
                        <code className="text-xs font-mono text-amber-300 truncate max-w-md">
                          {alert.sha256}
                        </code>
                      </div>

                      <button
                        id={`btn-copy-hash-${alert.id}`}
                        onClick={() => copyToClipboard(alert.sha256, alert.id)}
                        className="px-2.5 py-1 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 rounded flex items-center gap-1 self-start sm:self-auto transition shrink-0"
                      >
                        {copiedHash === alert.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copier l'empreinte</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Transmission ref if sent to parquet */}
                    {alert.lawEnforcementTransmissionId && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs flex items-center justify-between text-purple-900">
                        <div className="flex items-center gap-2">
                          <Gavel className="w-4 h-4 text-purple-700 shrink-0" />
                          <span>
                            Dossier instruit et transmis à l'autorité judiciaire — Réf. Parquet :{' '}
                            <strong className="font-mono font-bold text-purple-950">{alert.lawEnforcementTransmissionId}</strong>
                          </span>
                        </div>
                        <span className="text-[11px] bg-purple-200/80 px-2 py-0.5 rounded font-semibold">
                          Procédure Art. 40 CPP
                        </span>
                      </div>
                    )}

                    {/* Investigation Notes / Timeline */}
                    {alert.investigationNotes && alert.investigationNotes.length > 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-1.5">
                        <span className="font-bold text-gray-700 block">Historique d'Investigation & Actions Administrateur :</span>
                        <ul className="space-y-1">
                          {alert.investigationNotes.map((note, idx) => (
                            <li key={idx} className="text-gray-600 flex items-start gap-1.5">
                              <span className="text-red-500 font-bold">•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        {alert.handledBy ? (
                          <span>
                            Pris en charge par <strong className="text-gray-800">{alert.handledBy}</strong>
                            {alert.handledAt && ` (${new Date(alert.handledAt).toLocaleTimeString('fr-FR')})`}
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                            En attente de traitement par l'administrateur
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Investigate Button */}
                        <button
                          id={`btn-investigate-${alert.id}`}
                          onClick={() => {
                            setInvestigatingAlertId(alert.id);
                            setInvestigationNote('');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 transition flex items-center gap-1.5"
                        >
                          <Info className="w-3.5 h-3.5 text-amber-600" />
                          <span>Ajouter une note d'enquête</span>
                        </button>

                        {/* Parquet Button */}
                        {alert.status !== 'TRANSMIS_PARQUET' && (
                          <button
                            id={`btn-transmit-parquet-${alert.id}`}
                            onClick={() => handleTransmitParquet(alert.id)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition flex items-center gap-1.5"
                            title="Signaler la fraude documentaire au Parquet Judiciaire"
                          >
                            <Gavel className="w-3.5 h-3.5 text-purple-700" />
                            <span>Transmettre au Parquet</span>
                          </button>
                        )}

                        {/* Acknowledge Button */}
                        {alert.status !== 'ACQUITTEE' && (
                          <button
                            id={`btn-acknowledge-${alert.id}`}
                            onClick={() => onAcknowledge(alert.id)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Acquitter l'Alerte</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: BLACKLISTED HASHES REGISTRY */}
      {activeTab === 'blacklist' && (
        <div id="blacklisted-hashes-section" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Registre des Empreintes Cryptographiques Falsifiées (Liste Noire)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Tout diplôme téléversé dont le SHA-256 correspond à une entrée de cette liste déclenche instantanément une alerte WebSocket.
              </p>
            </div>
            <button
              id="btn-add-hash-table"
              onClick={() => setIsBlacklistModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Ajouter une empreinte</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/70 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3">Empreinte SHA-256</th>
                  <th className="p-3">Titulaire & Document Signalé</th>
                  <th className="p-3">Motif de Falsification</th>
                  <th className="p-3 text-center">Niveau de Menace</th>
                  <th className="p-3 text-center">Récidives</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHashes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Aucune empreinte falsifiée répertoriée dans cette sélection.
                    </td>
                  </tr>
                ) : (
                  filteredHashes.map((record) => (
                    <tr key={record.sha256} className="hover:bg-red-50/30 transition">
                      <td className="p-3 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-red-700 font-bold truncate max-w-[200px]" title={record.sha256}>
                            {record.sha256}
                          </span>
                          <button
                            id={`btn-copy-tbl-hash-${record.sha256.slice(0, 8)}`}
                            onClick={() => copyToClipboard(record.sha256, record.sha256)}
                            className="text-gray-400 hover:text-gray-700 p-1 rounded"
                            title="Copier le SHA-256"
                          >
                            {copiedHash === record.sha256 ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Inscrit le {new Date(record.flaggedDate).toLocaleDateString('fr-FR')} • {record.detectionSource}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-gray-900 block">{record.originalStudentName || 'Non renseigné'}</span>
                        <span className="text-gray-600 block text-[11px]">{record.originalDocumentTitle}</span>
                        <span className="text-gray-400 text-[10px] block">{record.originalInstitution}</span>
                      </td>

                      <td className="p-3 max-w-xs">
                        <p className="text-gray-700 line-clamp-2" title={record.reason}>
                          {record.reason}
                        </p>
                        {record.notes && (
                          <span className="text-[10px] text-gray-400 italic block mt-0.5">{record.notes}</span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            record.threatLevel === 'MAXIMAL'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : record.threatLevel === 'ELEVE'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {record.threatLevel || 'ELEVE'}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <span className="inline-block px-2 py-1 rounded bg-gray-100 font-mono font-bold text-gray-900">
                          {record.totalSubmissionAttempts}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          id={`btn-delete-hash-${record.sha256.slice(0, 8)}`}
                          onClick={() => {
                            if (confirm(`Retirer l'empreinte ${record.sha256.slice(0, 12)}... de la liste noire ?`)) {
                              onRemoveBlacklistHash(record.sha256);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded transition"
                          title="Supprimer cette empreinte de la liste noire"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD INVESTIGATION NOTE */}
      <AnimatePresence>
        {investigatingAlertId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden"
            >
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600" />
                  Ajouter une note d'enquête & prise en charge
                </h3>
                <button
                  onClick={() => setInvestigatingAlertId(null)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nom de l'agent / enquêteur</label>
                  <input
                    type="text"
                    value={investigatorName}
                    onChange={(e) => setInvestigatorName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="Ex: Direction de la Sécurité Académique"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Observations d'investigation</label>
                  <textarea
                    rows={4}
                    value={investigationNote}
                    onChange={(e) => setInvestigationNote(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="Ex: Contact pris avec l'université émettrice pour confirmer le signalement initial. Titulaire récidiviste sous surveillance..."
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInvestigatingAlertId(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveInvestigation}
                  className="px-4 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Enregistrer l'enquête
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ADD HASH TO BLACKLIST */}
      <AnimatePresence>
        {isBlacklistModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden"
            >
              <form onSubmit={handleCreateBlacklistHash}>
                <div className="bg-red-600 px-5 py-3 text-white flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    Inscrire une Empreinte dans la Liste Noire
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsBlacklistModalOpen(false)}
                    className="text-white/80 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-5 space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Empreinte SHA-256 du document falsifié <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newHash}
                      onChange={(e) => setNewHash(e.target.value)}
                      placeholder="Ex: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                      className="w-full font-mono border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Motif de la falsification <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      placeholder="Ex: Modification du nom du titulaire, typographie incohérente et faux sceau d’État."
                      className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Titulaire suspecté / Usurpateur</label>
                      <input
                        type="text"
                        value={newStudent}
                        onChange={(e) => setNewStudent(e.target.value)}
                        placeholder="Ex: Marc Lefebvre"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Établissement académique</label>
                      <input
                        type="text"
                        value={newInstitution}
                        onChange={(e) => setNewInstitution(e.target.value)}
                        placeholder="Ex: Sorbonne Université"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Intitulé du diplôme</label>
                      <input
                        type="text"
                        value={newDegree}
                        onChange={(e) => setNewDegree(e.target.value)}
                        placeholder="Ex: Master en Informatique"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Niveau de menace</label>
                      <select
                        value={newThreat}
                        onChange={(e) => setNewThreat(e.target.value as any)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                      >
                        <option value="MAXIMAL">MAXIMAL (Fraude confirmée)</option>
                        <option value="ELEVE">ELEVE (Altération détectée)</option>
                        <option value="MODERE">MODERE (Signalement sous réserve)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Notes administratives internes</label>
                    <input
                      type="text"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Ex: Signalé par le Rectorat d'Île-de-France (Dossier Réf: REC-2026-09)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBlacklistModalOpen(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingHash}
                    className="px-4 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
                  >
                    {isSubmittingHash ? 'Enregistrement...' : 'Enregistrer dans la Liste Noire'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
