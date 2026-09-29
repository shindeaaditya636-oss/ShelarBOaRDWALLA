import React from 'react';
import { useApp } from '../../context/AppContext';
import { NoteCard } from '../home/HomeScreen';
import {
  User,
  Crown,
  Bookmark,
  Clock,
  Moon,
  Sun,
  Shield,
  GraduationCap,
  LogOut,
  ChevronRight,
  BookOpen,
  Award,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    notes,
    isDarkMode,
    toggleDarkMode,
    setOpenPremiumModal,
    setActiveTab,
    openNoteReader,
  } = useApp();

  // Get bookmarked notes
  const bookmarkedNotes = notes.filter((n) => currentUser.bookmarks.includes(n.id));

  // Get recently viewed notes
  const recentNotesItems = currentUser.recentNotes
    .map((r) => notes.find((n) => n.id === r.noteId))
    .filter((n): n is typeof notes[0] => Boolean(n));

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      {/* Profile Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-2xl font-black flex items-center justify-center shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              {currentUser.role === 'admin' ? (
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              ) : (
                <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> HSC Student
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{currentUser.email}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
              <span>Target: Maharashtra HSC Board 2026</span>
              <span>·</span>
              <span>{currentUser.studyStreakDays} Day Streak 🔥</span>
            </div>
          </div>
        </div>

        {/* Quick Role Switcher for Testing Evaluator */}
        <div className="flex sm:flex-col gap-2 shrink-0">
          <button
            onClick={() => switchUserRole(currentUser.role === 'student' ? 'admin' : 'student')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            {currentUser.role === 'student' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>Switch to Admin Mode</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                <span>Switch to Student Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Membership & Subscription Status */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Membership Tier:</span>
              <span className={currentUser.premiumStatus ? 'text-amber-500' : 'text-slate-500'}>
                {currentUser.premiumStatus ? 'VIP Pro (All Subjects Active)' : 'Standard Free'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser.premiumStatus
                ? `Expires on ${currentUser.premiumExpiresAt || 'March 2027'} · Unlimited downloads`
                : 'Unlock handwritten chapter notes, solved board derivations, and PYQs.'}
            </p>
          </div>
        </div>

        {!currentUser.premiumStatus && (
          <button
            onClick={() => setOpenPremiumModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 shrink-0"
          >
            Upgrade to Pro (₹499)
          </button>
        )}
      </div>

      {/* Saved / Bookmarked Notes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Saved / Bookmarked Notes ({bookmarkedNotes.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">Quick offline reference</span>
        </div>

        {bookmarkedNotes.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No bookmarked notes yet. Tap the bookmark icon on any note card to save it here for fast revision.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {bookmarkedNotes.map((note) => (
              <NoteCard key={note.id} note={note} compact />
            ))}
          </div>
        )}
      </div>

      {/* Recently Viewed Notes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recently Viewed Notes
            </h2>
          </div>
          <span className="text-xs text-slate-400">Resume study where you left off</span>
        </div>

        {recentNotesItems.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No reading history yet. Open any note to start reading.
          </div>
        ) : (
          <div className="space-y-2">
            {recentNotesItems.map((note) => (
              <div
                key={note.id}
                onClick={() => openNoteReader(note)}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {note.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Class {note.class}th · {note.chapter}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-blue-600 font-semibold text-xs">Resume</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* App Preferences & Settings */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">App Preferences</h3>

        <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span className="font-semibold text-slate-800 dark:text-slate-200">Dark Reading Mode</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200 transition-colors"
          >
            {isDarkMode ? 'Disable' : 'Enable'}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs py-2">
          <span className="text-slate-500">Board Format</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Maharashtra State Board of Secondary & Higher Secondary Education (MSBSHSE)
          </span>
        </div>
      </div>
    </div>
  );
};
