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
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect scroll to adjust translucent backdrop blur intensity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  interface NavItem {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }

  // Strict Role-Based Tab Filtering: Accueil is always accessible so any operator can view the Hero/Cover
  const getRoleNavItems = (): NavItem[] => {
    const homeTab: NavItem = { id: 'landing', label: 'Accueil', icon: <ShieldCheck className="h-4 w-4" /> };

    if (!user) {
      return [
        homeTab,
      ];
    }

    if (user.role === 'ANALYSTE') {
      return [
        homeTab,
        { id: 'alertes' as ActiveTab, label: 'Cellule Alertes & Fraudes', count: alertsCount, icon: <Bell className="h-4 w-4" /> },
        { id: 'stats' as ActiveTab, label: 'Statistiques Menaces', icon: <BarChart3 className="h-4 w-4" /> },
        { id: 'audit' as ActiveTab, label: 'Audit Judiciaire', icon: <History className="h-4 w-4" /> },
        { id: 'documentation' as ActiveTab, label: 'Spécifications', icon: <FileText className="h-4 w-4" /> },
      ];
    }

    if (user.role === 'VERIFICATEUR') {
      return [
        homeTab,
        { id: 'verifier' as ActiveTab, label: 'Scanner Parchemin', icon: <ShieldCheck className="h-4 w-4" /> },
        { id: 'registry' as ActiveTab, label: 'Registre Scolarité', count: registryCount, icon: <Database className="h-4 w-4" /> },
        { id: 'audit' as ActiveTab, label: 'Audits de Scolarité', icon: <History className="h-4 w-4" /> },
        { id: 'documentation' as ActiveTab, label: 'Spécifications', icon: <FileText className="h-4 w-4" /> },
      ];
    }

    // ADMIN
    return [
      homeTab,
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
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md border-slate-200/90 shadow-xs'
          : 'bg-white/80 backdrop-blur-md border-slate-200/70'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo compact à gauche : icône (bouclier) dans un badge dégradé émeraude + "VD" en gras, avec le nom complet "Vérification & Intégrité de Diplômes" en petit en dessous */}
        <button
          type="button"
          onClick={() => setActiveTab('landing')}
          className="group flex items-center gap-3 shrink-0 text-left cursor-pointer transition-all focus:outline-hidden"
          title="Accueil VD — Vérification & Intégrité de Diplômes"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-sm border border-emerald-400/30 group-hover:scale-105 transition-transform shrink-0">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-bold tracking-tight text-slate-900 font-serif leading-none">
              VD
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight mt-1 whitespace-nowrap">
              Vérification & Intégrité de Diplômes
            </span>
          </div>
        </button>

        {/* Liens de navigation centrés/à droite, épurés, avec un état actif en fond émeraude clair */}
        <nav className="hidden lg:flex items-center gap-1 text-xs shrink-0 px-1 py-1 rounded-lg">
          {user ? (
            navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`tab-${item.id}-btn`}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`relative whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-emerald-900 font-semibold bg-emerald-50 border border-emerald-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-700' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono leading-none ${
                        isActive ? 'bg-emerald-200/90 text-emerald-900 font-semibold' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'landing'
                    ? 'text-emerald-900 bg-emerald-50 border border-emerald-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                Accueil
              </button>
              <a
                href="#fonctionnalites"
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
              >
                Fonctionnalités
              </a>
              <a
                href="#simulateur"
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
              >
                Simulateur
              </a>
              <a
                href="#protocole"
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
              >
                Protocole
              </a>
              <a
                href="#universites"
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
              >
                Universités
              </a>
              <a
                href="#juridique"
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
              >
                Billets & Décrets
              </a>
            </div>
          )}
        </nav>

        {/* Right Section: Bouton Connexion en dégradé émeraude OU Session Opérateur */}
        <div className="flex items-center gap-2.5 shrink-0">
          {user && (
            <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium ${roleStyle.bg}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${roleStyle.dot}`} />
              <span>{roleStyle.label}</span>
            </div>
          )}

          {/* User Session Dropdown or Bouton Connexion */}
          <div ref={dropdownRef} className="relative">
            {user ? (
              <div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  id="user-menu-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                  aria-expanded={showUserDropdown}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-800 text-white text-[10px] font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline font-semibold text-slate-800 max-w-[120px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Session Popover */}
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
                          Votre session est strictement confinée au profil <strong>{user.role}</strong>.
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
                {/* Bouton Connexion */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  id="open-login-btn"
                  type="button"
                  onClick={() => onOpenAuthModal('login')}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
                >
                  <LogIn className="h-3.5 w-3.5 text-slate-600" />
                  <span>Connexion</span>
                </motion.button>

                {/* Bouton Inscription */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  id="open-register-btn"
                  type="button"
                  onClick={() => onOpenAuthModal('register')}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-3.5 py-1.5 text-xs font-bold text-white transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <UserPlus className="h-3.5 w-3.5 text-emerald-100" />
                  <span>Inscription</span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle (Hamburger) */}
          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
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
            className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Espace dédié : {user ? roleStyle.label : 'Navigation générale'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-tab-${item.id}-btn`}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={isActive ? 'text-emerald-700' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono leading-none ${
                          isActive ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {user ? (
              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-lg border border-slate-200/60">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{user.fullName}</span>
                    <span className="text-[10px] text-slate-500">{user.roleLabel || user.role}</span>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {user.badgeNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                    setActiveTab('landing');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200/80 py-2 text-xs font-bold text-rose-700 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Déconnexion de la session</span>
                </button>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuthModal('login');
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 py-2 text-xs font-bold text-slate-800 shadow-2xs"
                >
                  <LogIn className="h-3.5 w-3.5 text-slate-600" />
                  <span>Connexion</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuthModal('register');
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 py-2 text-xs font-bold text-white shadow-sm"
                >
                  <UserPlus className="h-3.5 w-3.5 text-emerald-100" />
                  <span>Inscription</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
