import React from 'react';
import { useApp } from '../../context/AppContext';
import { Moon, Sun, Shield, GraduationCap, Crown, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    isDarkMode,
    toggleDarkMode,
    selectedClass,
    setSelectedClass,
    setActiveTab,
    setOpenPremiumModal,
    setSearchQuery,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm tracking-wider shadow-sm">
            SBW
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                ShelarBoardWalla
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                HSC Science
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden xs:block">
              Study Smart • Score Better
            </p>
          </div>
        </div>

        {/* Zone 2: Class Segmented Switcher & Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Class Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setSelectedClass('12')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedClass === '12'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Class 12th
            </button>
            <button
              onClick={() => setSelectedClass('11')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedClass === '11'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Class 11th
            </button>
          </div>

          {/* Quick Search trigger */}
          <button
            onClick={() => {
              setActiveTab('library');
              // focus search
            }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors w-48"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Search notes, PYQs...</span>
          </button>
        </div>

        {/* Zone 3: Actions (Theme, Premium CTA, User / Admin toggle) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Role badge and switch for preview testing */}
          <div className="hidden lg:flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-medium">
            <button
              onClick={() => switchUserRole('student')}
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                currentUser.role === 'student'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Test as normal student (Restricted access)"
            >
              <GraduationCap className="w-3 h-3 text-blue-600" />
              Student
            </button>
            <button
              onClick={() => switchUserRole('admin')}
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                currentUser.role === 'admin'
                  ? 'bg-amber-500 text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Switch to Admin mode (Manage & add notes)"
            >
              <Shield className="w-3 h-3" />
              Admin
            </button>
          </div>

          {/* Premium button if not yet unlocked */}
          {!currentUser.premiumStatus ? (
            <button
              onClick={() => setOpenPremiumModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-xs transition-all shrink-0 active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Get Premium</span>
              <span className="sm:hidden">Pro</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800/50">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>VIP Pro</span>
            </div>
          )}

          {/* Dark mode button */}
          <button
            onClick={toggleDarkMode}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Profile / Admin link */}
          <button
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center border border-blue-200 dark:border-blue-800 hover:ring-2 hover:ring-blue-400 transition-all shrink-0"
            title={currentUser.name}
          >
            {currentUser.name.charAt(0)}
          </button>
        </div>
      </div>
    </header>
  );
};
