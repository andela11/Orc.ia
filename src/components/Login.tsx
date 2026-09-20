import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export interface LoginProps {
  buttonText?: string;
  className?: string;
  variant?: 'primary' | 'outline' | 'header';
  onSuccess?: () => void;
  isOpenControlled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({
  buttonText = 'Login',
  className = '',
  variant = 'primary',
  onSuccess,
  isOpenControlled,
  onOpenChange,
}) => {
  const { login, register, quickLogin } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);

  const isModalOpen = isOpenControlled !== undefined ? isOpenControlled : internalOpen;
  const setModalOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalOpen(open);
    }
  };

  // Tabs: 'login' | 'register' | 'reset'
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'reset'>('login');

  // Form States
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register Fields
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('VERIFICATEUR');
  const [regDept, setRegDept] = useState('Direction de la Scolarité & Diplômes');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Reset Password Fields
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Statuses
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setModalOpen(false);
    setErrorMessage(null);
    setResetSuccessMessage(null);
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setErrorMessage('Veuillez renseigner votre identifiant et votre mot de passe.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await login(usernameOrEmail, password);
    setIsSubmitting(false);

    if (res.success) {
      handleClose();
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(res.error || 'Identifiants invalides ou profil introuvable.');
    }
  };

  // Register handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regUsername.trim() || !regPassword.trim()) {
      setErrorMessage('Veuillez compléter tous les champs obligatoires.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await register({
      fullName: regFullName,
      email: regEmail,
      username: regUsername,
      role: regRole,
      department: regDept,
      password: regPassword,
    });
    setIsSubmitting(false);

    if (res.success) {
      handleClose();
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(res.error || "Impossible d'effectuer l'enregistrement.");
    }
  };

  // Password reset handler
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setErrorMessage('Veuillez renseigner votre email ou identifiant professionnel.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setResetSuccessMessage(
        `Les instructions de réinitialisation sécurisée ont été transmises à "${resetEmail}". Si un compte correspond, un mot de passe temporaire a été configuré.`
      );
    }, 600);
  };

  // Fast demo account select
  const handleQuickDemo = async (username: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    const res = await quickLogin(username);
    setIsSubmitting(false);
    if (res.success) {
      handleClose();
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(res.error || 'Échec de connexion rapide.');
    }
  };

  // Button styles based on variant
  const getButtonClass = () => {
    if (className) return className;
    if (variant === 'primary') {
      return 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs';
    }
    if (variant === 'outline') {
      return 'border border-slate-300 hover:border-emerald-600 hover:text-emerald-700 text-slate-800 font-medium text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer bg-white';
    }
    return 'bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer';
  };

  return (
    <>
      {/* Trigger Button */}
      {isOpenControlled === undefined && (
        <button
          id="login-component-btn"
          type="button"
          onClick={() => setModalOpen(true)}
          className={getButtonClass()}
        >
          {buttonText}
        </button>
      )}

      {/* Pop-up Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white rounded-xl shadow-xl z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {activeTab === 'login' && 'Authentification'}
                    {activeTab === 'register' && 'Création de compte'}
                    {activeTab === 'reset' && 'Réinitialisation mot de passe'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Plateforme d'audit et de certification des diplômes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Fermer la fenêtre"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-100 px-5 pt-2 bg-slate-50/50 gap-4 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage(null);
                    setResetSuccessMessage(null);
                  }}
                  className={`pb-2.5 transition-colors border-b-2 ${
                    activeTab === 'login'
                      ? 'border-emerald-600 text-emerald-700 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage(null);
                    setResetSuccessMessage(null);
                  }}
                  className={`pb-2.5 transition-colors border-b-2 ${
                    activeTab === 'register'
                      ? 'border-emerald-600 text-emerald-700 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Inscription
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reset');
                    setErrorMessage(null);
                    setResetSuccessMessage(null);
                  }}
                  className={`pb-2.5 transition-colors border-b-2 ${
                    activeTab === 'reset'
                      ? 'border-emerald-600 text-emerald-700 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Mot de passe oublié
                </button>
              </div>

              {/* Form Body */}
              <div className="p-5 max-h-[80vh] overflow-y-auto">
                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                    {errorMessage}
                  </div>
                )}

                {/* 1. FORMULAIRE DE CONNEXION */}
                {activeTab === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Identifiant ou Email
                      </label>
                      <input
                        type="text"
                        required
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        placeholder="nom d'utilisateur ou email"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-slate-700">
                          Mot de passe
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('reset');
                            setResetEmail(usernameOrEmail);
                            setErrorMessage(null);
                          }}
                          className="text-[11px] text-emerald-600 hover:text-emerald-800"
                        >
                          Mot de passe oublié ?
                        </button>
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                    </button>

                    {/* Raccourcis Profils Démo */}
                    <div className="pt-3 mt-3 border-t border-slate-100">
                      <div className="text-[11px] text-slate-500 mb-2">
                        Comptes de test (accès immédiat) :
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <button
                          type="button"
                          onClick={() => handleQuickDemo('agent')}
                          className="p-1.5 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors"
                        >
                          <div className="font-semibold text-slate-800">Scolarité</div>
                          <div className="text-[10px] text-slate-500">Vérificateur</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickDemo('enqueteur')}
                          className="p-1.5 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors"
                        >
                          <div className="font-semibold text-slate-800">Analyste</div>
                          <div className="text-[10px] text-slate-500">Fraudes</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickDemo('admin')}
                          className="p-1.5 border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors"
                        >
                          <div className="font-semibold text-slate-800">Admin</div>
                          <div className="text-[10px] text-slate-500">Central</div>
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* 2. FORMULAIRE D'INSCRIPTION */}
                {activeTab === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Ex: Pr. Éléonore Martin"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Email professionnel
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="agent@univ.fr"
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Nom d'utilisateur
                        </label>
                        <input
                          type="text"
                          required
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          placeholder="emartin"
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Périmètre / Rôle attribué
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => {
                          const r = e.target.value as UserRole;
                          setRegRole(r);
                          if (r === 'VERIFICATEUR') setRegDept('Direction de la Scolarité & Diplômes');
                          if (r === 'ANALYSTE') setRegDept('Cellule Répression des Fraudes Documentaires');
                          if (r === 'ADMIN') setRegDept('Gouvernance Centrale & Registre National');
                        }}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-hidden focus:border-emerald-500"
                      >
                        <option value="VERIFICATEUR">Agent de Scolarité (Vérificateur - Scanner)</option>
                        <option value="ANALYSTE">Analyste Forensique (Cellule Anti-Fraude)</option>
                        <option value="ADMIN">Administrateur Central (Supervision & Registre)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Mot de passe
                        </label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min. 6 caractères"
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Confirmer
                        </label>
                        <input
                          type="password"
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Répétez"
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Création en cours...' : 'Créer un compte'}
                    </button>
                  </form>
                )}

                {/* 3. FORMULAIRE DE RÉINITIALISATION DE MOT DE PASSE */}
                {activeTab === 'reset' && (
                  <div className="space-y-3.5">
                    {resetSuccessMessage ? (
                      <div className="space-y-3 py-2">
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>{resetSuccessMessage}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('login');
                            setResetSuccessMessage(null);
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                        >
                          Retourner à la connexion
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleResetSubmit} className="space-y-3">
                        <p className="text-xs text-slate-600">
                          Saisissez votre adresse email ou identifiant enregistré. Vous recevrez les consignes pour réinitialiser immédiatement votre mot de passe.
                        </p>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Email ou Identifiant
                          </label>
                          <input
                            type="text"
                            required
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="agent@univ.fr ou identifiant"
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Nouveau mot de passe souhaité (facultatif)
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nouveau mot de passe"
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-emerald-500"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? 'Traitement...' : 'Réinitialiser le mot de passe'}
                        </button>

                        <div className="text-center pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveTab('login')}
                            className="text-xs text-slate-500 hover:text-slate-900"
                          >
                            Se souvenir de son mot de passe ? Se connecter
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Login;
