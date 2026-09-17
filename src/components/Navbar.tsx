import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  LogIn,
  LogOut,
  ChevronDown,
  UserPlus,
  Menu,
  X,
  ShieldCheck,
  Database,
  History,
  BarChart3,
  Bell,
  FileText,
  Shield,
  Lock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export type ActiveTab = 'landing' | 'verifier' | 'registry' | 'audit' | 'stats' | 'alertes' | 'admin' | 'documentation';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  registryCount: number;
  alertsCount?: number;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  registryCount,
  alertsCount = 0,
  onOpenAuthModal,
}) => {
  const { user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Strict Role-Based Tab Filtering: Each role ONLY gets access to their specialized tabs
  const getRoleNavItems = () => {
    if (!user) {
      return [
        { id: 'landing' as ActiveTab, label: 'Accueil', icon: <ShieldCheck className="h-4 w-4" /> },
        { id: 'documentation' as ActiveTab, label: 'Spécifications', icon: <FileText className="h-4 w-4" /> },
      ];
    }

    if (user.role === 'ANALYSTE') {
      return [
        { id: 'alertes' as ActiveTab, label: 'Cellule Alertes & Fraudes', count: alertsCount, icon: <Bell className="h-4 w-4" /> },
        { id: 'stats' as ActiveTab, label: 'Statistiques Menaces', icon: <BarChart3 className="h-4 w-4" /> },
        { id: 'audit' as ActiveTab, label: 'Audit Judiciaire', icon: <History className="h-4 w-4" /> },
        { id: 'documentation' as ActiveTab, label: 'Spécifications', icon: <FileText className="h-4 w-4" /> },
      ];
    }

    if (user.role === 'VERIFICATEUR') {
      return [
        { id: 'verifier' as ActiveTab, label: 'Scanner Parchemin', icon: <ShieldCheck className="h-4 w-4" /> },
        { id: 'registry' as ActiveTab, label: 'Registre Scolarité', count: registryCount, icon: <Database className="h-4 w-4" /> },
        { id: 'audit' as ActiveTab, label: 'Audits de Scolarité', icon: <History className="h-4 w-4" /> },
        { id: 'documentation' as ActiveTab, label: 'Spécifications', icon: <FileText className="h-4 w-4" /> },
      ];
    }

    // ADMIN
    return [
      { id: 'admin' as ActiveTab, label: 'Console Centrale', icon: <Shield className="h-4 w-4" /> },
      { id: 'registry' as ActiveTab, label: 'Registre National', count: registryCount, icon: <Database className="h-4 w-4" /> },
      { id: 'alertes' as ActiveTab, label: 'Supervision Fraudes', count: alertsCount, icon: <Bell className="h-4 w-4" /> },
      { id: 'verifier' as ActiveTab, label: 'Banc Scanner', icon: <ShieldCheck className="h-4 w-4" /> },
      { id: 'stats' as ActiveTab, label: 'Statistiques', icon: <BarChart3 className="h-4 w-4" /> },
      { id: 'audit' as ActiveTab, label: 'Journal d’État', icon: <History className="h-4 w-4" /> },
      { id: 'documentation' as ActiveTab, label: 'Spécifications', icon: <FileText className="h-4 w-4" /> },
    ];
  };

  const navItems = getRoleNavItems();

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const getRoleBadgeStyle = (role?: UserRole) => {
    switch (role) {
      case 'ANALYSTE':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-800',
          dot: 'bg-rose-500',
          label: 'Cellule Fraude (Analyste)',
        };
      case 'VERIFICATEUR':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          dot: 'bg-emerald-500',
          label: 'Scolarité (Vérificateur)',
        };
      case 'ADMIN':
        return {
          bg: 'bg-purple-50 border-purple-200 text-purple-800',
          dot: 'bg-purple-500',
          label: 'Admin Central',
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200 text-slate-700',
          dot: 'bg-slate-400',
          label: 'Visiteur',
        };
    }
  };

  const roleStyle = getRoleBadgeStyle(user?.role);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <button
          type="button"
          onClick={() => setActiveTab(user ? (user.role === 'ANALYSTE' ? 'alertes' : user.role === 'VERIFICATEUR' ? 'verifier' : 'admin') : 'landing')}
          className="group flex items-center gap-2.5 shrink-0 text-left cursor-pointer transition-all"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-white text-xs font-bold tracking-wider shadow-sm group-hover:scale-105 transition-transform border border-emerald-700/50">
            <span className="font-serif font-black text-sm">VD</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900 font-serif">
                VD<span className="text-emerald-700 font-sans font-semibold text-[11px] ml-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">d'État</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block leading-none mt-0.5 font-medium">
              Vérification Documentaire & Intégrité
            </p>
          </div>
        </button>

        {/* Desktop Navigation Tabs (Filtered strictly by role) */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs shrink-0 p-1 bg-slate-100 rounded-lg border border-slate-200">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}-btn`}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`relative whitespace-nowrap rounded-md px-3 py-1.5 font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-md bg-slate-950 shadow-xs"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.icon}
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono leading-none ${
                        isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: User Session & Role Confinement Tag */}
        <div className="flex items-center gap-2.5 shrink-0">
          {user && (
            <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium ${roleStyle.bg}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${roleStyle.dot}`} />
              <span>{roleStyle.label}</span>
            </div>
          )}

          {/* User Session Dropdown */}
          <div ref={dropdownRef} className="relative">
            {user ? (
              <div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  id="user-menu-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs"
                  aria-expanded={showUserDropdown}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-950 text-white text-[10px] font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline font-semibold text-slate-800 max-w-[120px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Session Popover (STRICTLY SECURE: No account-switching allowed) */}
                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 text-xs"
                    >
                      <div className="border-b border-slate-100 pb-3 mb-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Session Opérateur Scellée
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200/60">
                            <span className="h-1 w-1 rounded-full bg-emerald-500" />
                            Actif
                          </span>
                        </div>
                        <div className="mt-2 font-bold text-slate-900 text-sm">{user.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="font-semibold text-slate-800">Poste :</span>
                          <span className="truncate">{user.department}</span>
                        </div>
                        <div className="mt-1 text-[10px] text-slate-400 font-mono">
                          Matricule : #{user.badgeNumber || 'ACCR-2026-99'}
                        </div>
                      </div>

                      {/* Boundary status badge */}
                      <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-2.5 mb-2.5">
                        <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-[11px]">
                          <Lock className="h-3 w-3 text-emerald-600" />
                          <span>Périmètre Hermétique Actif</span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">
                          Votre session est strictement confinée au profil <strong>{user.role}</strong>. Les consoles étrangères sont inaccessibles.
                        </p>
                      </div>

                      {/* User Actions */}
                      <div className="pt-1 flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('landing');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-between"
                        >
                          <span>Voir la page d'accueil</span>
                          <ArrowRight className="h-3 w-3 text-slate-400" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                            setActiveTab('landing');
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50 rounded-lg font-medium transition-colors flex items-center justify-between mt-1"
                        >
                          <span className="flex items-center gap-1.5">
                            <LogOut className="h-3.5 w-3.5" />
                            <span>Déconnexion de la session</span>
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  id="open-login-btn"
                  type="button"
                  onClick={() => onOpenAuthModal('login')}
                  className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5 text-slate-600" />
                  <span>Connexion</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  id="open-register-btn"
                  type="button"
                  onClick={() => onOpenAuthModal('register')}
                  className="flex items-center gap-1.5 rounded-md bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-all cursor-pointer shadow-2xs"
                >
                  <UserPlus className="h-3.5 w-3.5 text-emerald-100" />
                  <span className="hidden sm:inline">Créer un compte</span>
                  <span className="sm:hidden">Inscription</span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Menu principal"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Filtered by role) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            id="mobile-nav-drawer"
            className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Espace dédié : {user ? roleStyle.label : 'Navigation générale'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-tab-${item.id}-btn`}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono leading-none ${
                          isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
