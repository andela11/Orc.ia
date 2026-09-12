import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, X, ArrowRight, CheckCircle2, Volume2, VolumeX, Eye } from 'lucide-react';
import { FalsifiedDiplomaAlert } from '../types';

interface RealtimeAlertBannerProps {
  alert: FalsifiedDiplomaAlert | null;
  onDismiss: () => void;
  onViewDashboard: (alertId?: string) => void;
  onAcknowledge: (alertId: string) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export const RealtimeAlertBanner: React.FC<RealtimeAlertBannerProps> = ({
  alert,
  onDismiss,
  onViewDashboard,
  onAcknowledge,
  audioEnabled,
  onToggleAudio,
}) => {
  if (!alert) return null;

  return (
    <AnimatePresence>
      <motion.aside
        id="realtime-alert-banner"
        aria-label="Notification d'alerte sécurité"
        initial={{ opacity: 0, y: -40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed top-20 right-4 z-50 max-w-lg w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 text-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Warning Header */}
        <div className="bg-slate-800 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-white" />
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-200">
              Alerte Sécurité Temps Réel — Récidive Détectée
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="btn-toggle-alert-audio"
              type="button"
              onClick={onToggleAudio}
              className="p-1 text-slate-400 hover:text-white rounded transition"
              title={audioEnabled ? 'Désactiver le signal sonore' : 'Activer le signal sonore'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              id="btn-dismiss-alert-banner"
              type="button"
              onClick={onDismiss}
              className="p-1 text-slate-400 hover:text-white rounded transition"
              title="Fermer la notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h4 className="text-base font-semibold text-white tracking-tight">
                {alert.submittedDocument.studentName || 'Titulaire Inconnu'}
              </h4>
              <span className="text-xs font-mono text-slate-400">
                Tentative #{alert.attemptCount}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {alert.submittedDocument.degreeTitle} — {alert.submittedDocument.institution}
            </p>
          </div>

          {/* Trigger Reason */}
          <div className="text-xs bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 space-y-1">
            <div className="text-slate-200 font-medium flex items-center gap-1.5">
              <span>Motif :</span>
              <span className="text-white font-normal">{alert.triggerReason}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono truncate">
              SHA-256 : <span className="text-slate-200">{alert.sha256}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              id="btn-quick-acknowledge-alert"
              type="button"
              onClick={() => {
                onAcknowledge(alert.id);
                onDismiss();
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition"
            >
              Acquitter
            </button>

            <button
              id="btn-open-alert-dashboard"
              type="button"
              onClick={() => {
                onViewDashboard(alert.id);
                onDismiss();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              Ouvrir le Tableau d'Alertes
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
