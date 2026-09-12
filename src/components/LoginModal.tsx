import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogIn, X, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
}) => {
  const { login, register, quickLogin } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration fields
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('VERIFICATEUR');
  const [regDept, setRegDept] = useState('Service des Admissions & Titres');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError('Veuillez renseigner un identifiant et un mot de passe.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await login(usernameOrEmail, password);
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Échec de connexion.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regPassword || !regFullName) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await register({
      username: regUsername,
      email: regEmail,
      password: regPassword,
      fullName: regFullName,
      role: regRole,
      department: regDept,
    });
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Échec de l'enregistrement.");
    }
  };

  const handleQuickSelect = async (username: string) => {
    setIsSubmitting(true);
    setError(null);
    await quickLogin(username);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {tab === 'login' ? 'Connexion au portail' : 'Création d\'un compte vérificateur'}
              </h2>
              <p className="text-xs text-slate-500">
                {tab === 'login'
                  ? 'Accès au système national de contrôle documentaire'
                  : 'Enregistrement d\'un nouvel agent de scolarité ou auditeur'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="mt-4 flex rounded-lg bg-slate-100 p-1">
          <button
            id="tab-modal-login-btn"
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Se connecter</span>
          </button>
          <button
            id="tab-modal-register-btn"
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
              tab === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Créer un compte</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 rounded-lg bg-slate-100 border border-slate-300 p-2.5 text-xs text-slate-900">
            {error}
          </div>
        )}

        {/* Tab 1: Login Form */}
        {tab === 'login' && (
          <div className="mt-4 space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Identifiant ou Email professionnel
                </label>
                <input
                  id="login-username-input"
                  type="text"
                  placeholder="ex: admin ou claire.fontaine@univ.fr"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="login-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden"
                  required
                />
              </div>

              <button
                id="submit-login-btn"
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Authentification...' : 'Se connecter'}</span>
              </button>
            </form>

            {/* Quick Demo Profiles (Clean, no colored boxes) */}
            <div className="pt-3 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-600 mb-2">
                Profils de test disponibles en un clic :
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSelect('admin')}
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <div className="text-xs font-semibold text-slate-900">Dr. Vernier</div>
                  <div className="text-[11px] text-slate-500">Administrateur</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('agent')}
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <div className="text-xs font-semibold text-slate-900">C. Fontaine</div>
                  <div className="text-[11px] text-slate-500">Admissions</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('enqueteur')}
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <div className="text-xs font-semibold text-slate-900">M. Dupuis</div>
                  <div className="text-[11px] text-slate-500">Analyste anti-fraude</div>
                </button>
              </div>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setTab('register')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Pas encore de compte ? Créer un compte
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Register Form - Adjusted, spacious & clean */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3 max-h-[65vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom d'utilisateur (Identifiant)
                </label>
                <input
                  id="register-username-input"
                  type="text"
                  placeholder="ex: c.fontaine"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom complet & Titre
                </label>
                <input
                  id="register-fullname-input"
                  type="text"
                  placeholder="ex: Dr. Claire Fontaine"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email professionnel institutionnel
              </label>
              <input
                id="register-email-input"
                type="email"
                placeholder="ex: c.fontaine@iai-cameroun.cm"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rôle & Habilitation
                </label>
                <select
                  id="register-role-select"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden bg-white"
                >
                  <option value="VERIFICATEUR">Vérificateur (Admissions & Scolarité)</option>
                  <option value="ANALYSTE">Analyste (Cellule Anti-Fraude)</option>
                  <option value="ADMIN">Administrateur (Complet)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="register-password-input"
                  type="password"
                  placeholder="Minimum 6 caractères"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Établissement ou Département
              </label>
              <input
                id="register-dept-input"
                type="text"
                placeholder="ex: Campus IAI-Cameroun / Direction des Admissions"
                value={regDept}
                onChange={(e) => setRegDept(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
              />
            </div>

            <button
              id="submit-register-btn"
              type="submit"
              disabled={isSubmitting}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Création en cours...' : 'Créer le compte'}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Déjà un compte ? Se connecter
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

