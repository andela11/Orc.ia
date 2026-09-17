import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface PerimeterBarrierScreenProps {
  user: UserProfile;
  requiredRole: string;
  onRedirectToPost: () => void;
}

export const PerimeterBarrierScreen: React.FC<PerimeterBarrierScreenProps> = ({
  user,
  requiredRole,
  onRedirectToPost,
}) => {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'ANALYSTE':
        return "Agent Analyste Anti-Fraude (Cellule Répression)";
      case 'VERIFICATEUR':
        return "Agent de Scolarité (Contrôle Optique & Registre)";
      case 'ADMIN':
        return "Administrateur Central";
      default:
        return role;
    }
  };

  const getRoleDestination = (role: UserRole) => {
    switch (role) {
      case 'ANALYSTE':
        return "la Cellule de Traitement des Alertes & Fraudes";
      case 'VERIFICATEUR':
        return "le Poste de Scanner & Vérification de Scolarité";
      case 'ADMIN':
        return "la Console Centrale d'Administration";
      default:
        return "votre poste";
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="max-w-xl w-full rounded-xl border border-rose-200 bg-white p-6 sm:p-8 shadow-sm text-center"
      >
        <div className="relative mx-auto w-14 h-14 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 mb-5 shadow-xs">
          <Lock className="w-7 h-7 text-rose-600" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-50 border border-rose-200 text-[11px] font-bold uppercase tracking-wider text-rose-800 mb-3 font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Périmètre Hermétique • Habilitation Non Autorisée</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight">
          Accès Réservé — Espace Verrouillé
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Cet espace est strictement réservé au profil <strong>{requiredRole}</strong>.
          Votre compte est accrédité en tant que <strong>{user.fullName}</strong> avec le rôle{' '}
          <span className="font-semibold text-slate-900">{getRoleLabel(user.role)}</span>.
        </p>

        <div className="mt-5 rounded-lg bg-slate-50 border border-slate-200/80 p-4 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Principe de Cloisonnement & Règle Métier Souveraine :</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Pour assurer l'indépendance de la chaîne de vérification académique et la conformité légale, chaque agent est strictement isolé dans son interface d'intervention. Aucun compte n'a de visibilité sur les modules hors de son périmètre d'habilitation.
          </p>
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Matricule : #{user.badgeNumber || 'ACCR-2026'}</span>
            <span>Département : {user.department}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onRedirectToPost}
            className="flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-slate-800 transition-all cursor-pointer"
          >
            <span>Rejoindre {getRoleDestination(user.role)}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
