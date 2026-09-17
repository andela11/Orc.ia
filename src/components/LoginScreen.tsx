import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Building2,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  Shield,
  GraduationCap,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface LoginScreenProps {
  onBackToLanding: () => void;
  onSuccess: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBackToLanding, onSuccess }) => {
  const { login, quickLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!email.trim() || !password.trim()) {
      setLocalError('Veuillez renseigner votre identifiant et votre mot de passe.');
      return;
    }

    const res = await login(email.trim(), password);
    if (!res.success) {
      setLocalError(res.error || 'Identifiants incorrects ou compte non habilité.');
    } else {
      if (res.user?.role) {
        onSuccess(res.user.role);
      } else {
        const lower = email.trim().toLowerCase();
        if (lower.includes('alexandre.vernier') || lower.includes('admin')) {
          onSuccess('ADMIN');
        } else if (lower.includes('dupuis') || lower.includes('police') || lower.includes('enqueteur') || lower.includes('analyste')) {
          onSuccess('ANALYSTE');
        } else {
          onSuccess('VERIFICATEUR');
        }
      }
    }
  };

  const handleDemoLogin = async (type: 'admin' | 'verificateur' | 'analyste') => {
    setLocalError(null);
    const roleKey = type === 'verificateur' ? 'agent' : type === 'analyste' ? 'enqueteur' : 'admin';
    await quickLogin(roleKey);
    if (type === 'admin') onSuccess('ADMIN');
    else if (type === 'analyste') onSuccess('ANALYSTE');
    else onSuccess('VERIFICATEUR');
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900 flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Banner */}
      <div className="bg-emerald-800 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-emerald-100 border border-emerald-600">
          PORTAIL D'AUTHENTIFICATION D'ÉTAT
        </span>
        <span>Connexion requise pour accéder aux registres officiels et au scanner</span>
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-emerald-100 bg-white shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-700/20 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 font-serif">VD</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                SÉCURISÉ
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Système National d'Authentification Médico-Légale & Registre Universitaire
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition-all shadow-2xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour à l'Accueil</span>
        </button>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-10">
        {/* Left Column: Context & Explanations */}
        <div className="lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 shadow-2xs">
            <Lock className="h-3.5 w-3.5 text-emerald-700" />
            Accès Strictement Réservé aux Utilisateurs Habilités
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 font-serif leading-tight">
            Connectez-vous pour accéder à votre interface dédiée.
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            En fonction de votre habilitation d'État, vous serez automatiquement orienté vers l'interface correspondant à vos attributions :
          </p>

          <div className="space-y-3 pt-1 text-xs text-slate-700">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 font-bold">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900">Rôle Scolarité / Vérificateur</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Accès direct au <strong>Scanner Optique Caméra</strong> et au <strong>Vérificateur médico-légal</strong> de diplômes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 font-bold">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900">Rôle Administrateur Central</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Accès direct à la <strong>Console d'Administration</strong>, accréditation des universités et gestion des registres SQLite.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 font-bold">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900">Rôle Analyste Judiciaire</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Accès direct au <strong>Tableau de Bord des Alertes & Réquisitions Judiciaires</strong> (Art. 441-1 C. Pén.).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Secure Form Card */}
        <div className="lg:w-1/2 w-full max-w-md">
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8 shadow-xl shadow-emerald-900/5">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-emerald-800 uppercase tracking-wide">
                  IDENTIFICATION REQUISE
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-950 font-serif tracking-tight mt-1">
                Espace de Connexion
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Saisissez vos identifiants institutionnels ou cliquez sur un profil d'accès rapide ci-dessous.
              </p>
            </div>

            {localError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{localError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Identifiant ou E-mail officiel
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex: admin ou claire.fontaine@sorbonne-universite.fr"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Mot de passe
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-md shadow-emerald-700/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Contrôle des habilitations...
                  </span>
                ) : (
                  <>
                    <span>Valider & Accéder à mon Espace</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Profile Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-emerald-700" />
                <span>Accès Rapide par Rôle (Connexion en 1 Clic) :</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('verificateur')}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-emerald-100 bg-[#fbfdfc] hover:bg-emerald-50/80 hover:border-emerald-300 text-left transition-all group shadow-2xs"
                >
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-700" />
                    <span className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-950">
                      Scolarité
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">Vérification & Scan</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-emerald-100 bg-[#fbfdfc] hover:bg-emerald-50/80 hover:border-emerald-300 text-left transition-all group shadow-2xs"
                >
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-950">
                      Admin
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">Console Centrale</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('analyste')}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-emerald-100 bg-[#fbfdfc] hover:bg-emerald-50/80 hover:border-emerald-300 text-left transition-all group shadow-2xs"
                >
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-950">
                      Enquêteur
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">Alertes Parquet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-500 border-t border-emerald-100 bg-white">
        VD • Solution d'État certifiée pour l'Enseignement Supérieur • Base de données SQLite Sécurisée
      </footer>
    </div>
  );
};
export default LoginScreen;
