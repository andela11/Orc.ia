import React, { useState, useEffect } from 'react';
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
  UserPlus,
  User,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface LoginScreenProps {
  initialMode?: 'login' | 'register';
  onBackToLanding: () => void;
  onSuccess: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  initialMode = 'login',
  onBackToLanding,
  onSuccess,
}) => {
  const { login, register, quickLogin, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    setMode(initialMode);
    setLocalError(null);
    setLocalSuccess(null);
  }, [initialMode]);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('VERIFICATEUR');
  const [regOrganization, setRegOrganization] = useState('Sorbonne Université');
  const [regDepartment, setRegDepartment] = useState('Direction de la Scolarité & Diplômes');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);

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
        } else if (
          lower.includes('dupuis') ||
          lower.includes('police') ||
          lower.includes('enqueteur') ||
          lower.includes('analyste')
        ) {
          onSuccess('ANALYSTE');
        } else {
          onSuccess('VERIFICATEUR');
        }
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLocalSuccess(null);

    if (!regFullName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setLocalError('Veuillez renseigner tous les champs obligatoires (*).');
      return;
    }

    if (regPassword.length < 6) {
      setLocalError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setLocalError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    const usernameGenerated =
      regUsername.trim() ||
      regEmail.trim().split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '') ||
      `agent_${Date.now().toString(36)}`;

    const res = await register({
      fullName: regFullName.trim(),
      username: usernameGenerated,
      email: regEmail.trim(),
      password: regPassword,
      role: regRole,
      department:
        regDepartment.trim() ||
        (regRole === 'VERIFICATEUR'
          ? 'Service des Admissions & Titres'
          : regRole === 'ANALYSTE'
          ? 'Cellule Répression des Fraudes Documentaires'
          : 'Direction Centrale des Registres'),
    });

    if (!res.success) {
      setLocalError(res.error || "Erreur lors de la création du compte.");
    } else {
      setLocalSuccess("Compte créé avec succès ! Redirection vers votre espace...");
      setTimeout(() => {
        onSuccess(res.user?.role || regRole);
      }, 600);
    }
  };

  const handleDemoLogin = async (type: 'admin' | 'verificateur' | 'analyste') => {
    setLocalError(null);
    setLocalSuccess(null);
    const roleKey = type === 'verificateur' ? 'agent' : type === 'analyste' ? 'enqueteur' : 'admin';
    const res = await quickLogin(roleKey);
    if (res.success && res.user?.role) {
      onSuccess(res.user.role);
    } else if (res.success) {
      if (type === 'admin') onSuccess('ADMIN');
      else if (type === 'analyste') onSuccess('ANALYSTE');
      else onSuccess('VERIFICATEUR');
    } else {
      setLocalError(res.error || 'Impossible de se connecter au compte de démonstration.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900 flex flex-col justify-between font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Banner */}
      <div className="bg-emerald-800 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-emerald-100 border border-emerald-600 font-mono">
          PORTAIL D'AUTHENTIFICATION D'ÉTAT
        </span>
        <span>Accès sécurisé réservé aux agents universitaires, analystes judiciaires et administrateurs</span>
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-emerald-100 bg-white shadow-2xs">
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
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour à l'Accueil</span>
        </button>
      </header>

      {/* Main Login / Register Card */}
      <main className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-10 flex flex-col lg:flex-row items-center justify-center gap-10">
        {/* Left Column: Context & Explanations */}
        <div className="lg:w-1/2 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 shadow-2xs">
            <Lock className="h-3.5 w-3.5 text-emerald-700" />
            Accès Strictement Réservé aux Utilisateurs Habilités
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 font-serif leading-tight">
            {mode === 'login' ? 'Espace de Connexion Sécurisé' : 'Création de Compte Habilité'}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            {mode === 'login'
              ? 'Connectez-vous pour accéder à votre poste de contrôle scellé, vos registres d’archives ou votre cellule d’alertes médico-légales.'
              : 'Enregistrez votre profil professionnel pour obtenir vos clés de scellement et accéder au scanner ou à la supervision des parchemins.'}
          </p>

          <div className="space-y-3 pt-1 text-xs text-slate-700">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 font-bold">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900">Rôle Scolarité / Vérificateur</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Accès direct au <strong>Scanner Optique Caméra 300 DPI</strong> et à l’analyse médico-légale de parchemins.
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
                  Accès direct à la <strong>Cellule Alertes & Réquisitions Judiciaires</strong> (Art. 441-1 C. Pén.).
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
                  Accès direct à la <strong>Console Centrale</strong>, habilitation des universités et partitions SQLite.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Secure Form Card */}
        <div className="lg:w-1/2 w-full max-w-md">
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-7 shadow-xl shadow-emerald-900/5">
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-5 border border-slate-200/80">
              <button
                type="button"
                id="tab-mode-login"
                onClick={() => {
                  setMode('login');
                  setLocalError(null);
                  setLocalSuccess(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-slate-950 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="h-3.5 w-3.5 text-emerald-700" />
                <span>Connexion</span>
              </button>
              <button
                type="button"
                id="tab-mode-register"
                onClick={() => {
                  setMode('register');
                  setLocalError(null);
                  setLocalSuccess(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-slate-950 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5 text-emerald-700" />
                <span>Inscription</span>
              </button>
            </div>

            {/* Form Title & Context */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-950 font-serif tracking-tight">
                {mode === 'login' ? 'Connexion à votre Espace' : 'Créer un Compte Opérateur'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {mode === 'login'
                  ? 'Saisissez vos identifiants ou utilisez un accès démo 1-clic ci-dessous.'
                  : 'Renseignez les informations de votre établissement pour créer votre session.'}
              </p>
            </div>

            {localError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{localError}</span>
              </div>
            )}

            {localSuccess && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{localSuccess}</span>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* FORMULAIRE DE CONNEXION */}
            {/* ------------------------------------------------------------- */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-md shadow-emerald-700/20 disabled:opacity-50 cursor-pointer"
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

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setLocalError(null);
                    }}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                  >
                    Pas encore de compte habilité ? <span className="underline">S'inscrire</span>
                  </button>
                </div>
              </form>
            ) : (
              /* ------------------------------------------------------------- */
              /* FORMULAIRE D'INSCRIPTION */
              /* ------------------------------------------------------------- */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom & Prénom complet <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="ex: Dr. Christian Manga"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Identifiant unique
                    </label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="ex: cmanga"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rôle souhaité <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                    >
                      <option value="VERIFICATEUR">Scolarité / Vérificateur</option>
                      <option value="ANALYSTE">Analyste Fraudes / Enquêteur</option>
                      <option value="ADMIN">Administrateur Central</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mail officiel / institutionnel <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="christian.manga@iai-cameroun.int"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Établissement / Département
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      placeholder="ex: IAI-Cameroun • Service de Scolarité"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mot de passe <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 6 car."
                        className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirmer <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Identique"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 px-4 py-3 text-xs font-bold text-white hover:from-emerald-800 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-md shadow-emerald-700/20 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Création du compte d'État...
                    </span>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      <span>Créer mon Compte Habilité</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setLocalError(null);
                    }}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                  >
                    Vous disposez déjà d'un compte ? <span className="underline">Se connecter</span>
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Access Profile Buttons */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-emerald-700" />
                <span>Accès Rapide par Rôle (Connexion en 1 Clic) :</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('verificateur')}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-emerald-100 bg-[#fbfdfc] hover:bg-emerald-50/80 hover:border-emerald-300 text-left transition-all group shadow-2xs cursor-pointer"
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
                  className="flex flex-col items-start p-2.5 rounded-xl border border-emerald-100 bg-[#fbfdfc] hover:bg-emerald-50/80 hover:border-emerald-300 text-left transition-all group shadow-2xs cursor-pointer"
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
                  className="flex flex-col items-start p-2.5 rounded-xl border border-emerald-100 bg-[#fbfdfc] hover:bg-emerald-50/80 hover:border-emerald-300 text-left transition-all group shadow-2xs cursor-pointer"
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

