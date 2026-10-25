import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Search, 
  PlusCircle, 
  Database, 
  HelpCircle, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Cpu, 
  MapPin,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: ShieldCheck },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: 'LIVE' },
    { name: 'Threat Map', path: '/map', icon: MapPin },
    { name: 'AI Scanner', path: '/analyze', icon: Cpu, badge: 'AI' },
    { name: 'Check & Search', path: '/search', icon: Search },
    { name: 'Threat Database', path: '/database', icon: Database },
    { name: 'About & Defense', path: '/about', icon: HelpCircle },
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#000000]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#00e5ff] rounded-lg p-1"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#00e5ff] via-[#818cf8] to-[#a855f7] p-0.5 shadow-md shadow-[#00e5ff]/25 group-hover:scale-105 group-hover:shadow-[#00e5ff]/50 transition-all duration-200 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-black stroke-[2.5] group-hover:rotate-6 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-0.5 font-display">
                ScamShield<span className="text-gradient-cyber font-black">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase font-mono">
                Cyber Defense Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                    active
                      ? 'text-cyan-700 dark:text-[#00e5ff] bg-cyan-500/10 dark:bg-[#00e5ff]/10 border border-cyan-500/30 dark:border-[#00e5ff]/35 shadow-sm'
                      : 'text-slate-600 border border-transparent hover:text-slate-950 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-600 dark:text-[#00e5ff]' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-500/20 text-purple-700 dark:bg-[#a855f7]/20 dark:text-[#c084fc] border border-purple-500/30 dark:border-[#a855f7]/30 font-mono tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 transition-all hover:border-[#00e5ff]/40"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" /> : <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0 hover:-rotate-12" />}
            </button>

            {/* High Contrast Report Threat Button */}
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00e5ff] via-[#818cf8] to-[#a855f7] hover:from-[#38bdf8] hover:to-[#c084fc] text-black font-black text-xs shadow-lg shadow-[#00e5ff]/25 active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Report Threat</span>
            </Link>

            {/* Auth section */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-900 dark:text-slate-200 font-bold max-w-[100px] truncate" title={currentUser.name}>
                    {currentUser.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-lg transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Sign In</span>
              </Link>
            )}

          </div>

          {/* Mobile hamburger menu & theme toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <Link
              to="/report"
              className="p-2 rounded-lg bg-slate-900 text-white text-xs font-bold"
            >
              <PlusCircle className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#000000] border-b border-slate-200 dark:border-white/10 px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'text-slate-950 bg-slate-100 dark:text-[#00e5ff] dark:bg-[#00e5ff]/10 font-bold border border-transparent dark:border-[#00e5ff]/30'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-slate-950 dark:text-white' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-[#a855f7]/20 dark:text-[#c084fc]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {isAuthenticated && currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-sm">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold text-sm">{currentUser.name}</p>
                    <p className="text-slate-500 text-xs">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-200 dark:border-rose-500/20 font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors"
              >
                <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

