import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS, INITIAL_STUDY_TIPS, INITIAL_DAILY_QUESTION } from '../../data/initialData';
import { NoteItem, SubjectId, CategoryType } from '../../types';
import {
  Search,
  BookOpen,
  HelpCircle,
  FileText,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Flame,
  Clock,
  ArrowRight,
  Bookmark,
  Share2,
  Crown,
  Lock,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    notes,
    selectedClass,
    setActiveTab,
    setSelectedSubjectFilter,
    setSelectedCategoryFilter,
    setSearchQuery,
    openNoteReader,
    toggleBookmark,
    isBookmarked,
    hasAccessToNote,
    setOpenPremiumModal,
    currentUser,
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [showDailySolution, setShowDailySolution] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  // Filter notes by selected class
  const classNotes = notes.filter((n) => n.class === selectedClass && n.isPublished);

  // Sections
  const popularNotes = [...classNotes].sort((a, b) => b.downloadsCount - a.downloadsCount).slice(0, 3);
  const premiumNotes = classNotes.filter((n) => n.isPremium).slice(0, 3);
  const recentNotes = [...classNotes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  const categories: { id: CategoryType; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'notes', label: 'Notes', icon: FileText, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400' },
    { id: 'pyq', label: 'PYQs', icon: Clock, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400' },
    { id: 'important_questions', label: 'Imp Questions', icon: HelpCircle, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400' },
    { id: 'mcq', label: 'MCQs', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400' },
    { id: 'revision', label: 'Revision', icon: RotateCcw, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch);
      setActiveTab('library');
    }
  };

  const handleCategoryClick = (cat: CategoryType) => {
    setSelectedCategoryFilter(cat);
    setSelectedSubjectFilter('all');
    setActiveTab('library');
  };

  const handleSubjectClick = (subId: SubjectId) => {
    setSelectedSubjectFilter(subId);
    setSelectedCategoryFilter('all');
    setActiveTab('library');
  };

  const currentTip = INITIAL_STUDY_TIPS[tipIndex];

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-4">
      {/* Search Bar & Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white p-5 sm:p-7 shadow-md">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 mb-2">
            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[11px]">
              Maharashtra HSC Class {selectedClass}th Science
            </span>
            <span>·</span>
            <span>State Board 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            Crack HSC Board Exam with Topper Handpicked Notes
          </h1>
          <p className="text-sm text-blue-100 mb-5 max-w-xl">
            Formula sheets, derivation step guides, past 10-year question trends, and board-verified marking schemes.
          </p>

          {/* Search Input inside Banner */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search notes, chapters, PYQs (e.g. Rotational Dynamics, Laplace)..."
              className="w-full pl-10 pr-24 py-3 text-sm rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* Progress & Quick Resume Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Study Streak</div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {currentUser.studyStreakDays} Days Consistent
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Saved Bookmarks</div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {currentUser.bookmarks.length} Chapter Notes
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Membership</div>
            <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              {currentUser.premiumStatus ? (
                <span className="text-amber-600 dark:text-amber-400">All Subjects VIP Pro</span>
              ) : (
                <span>Free Plan</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories Bar */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Quick Study Categories
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Class {selectedClass}th</span>
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 hover:shadow-xs transition-all text-left group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {cat.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Syllabus</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Subjects Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Core Science Subjects</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Curated strictly according to State Board Maharashtra Textbook</p>
          </div>
          <button
            onClick={() => setActiveTab('library')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Notes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SUBJECTS.map((sub) => {
            const subjectNotes = notes.filter((n) => n.subject === sub.id && n.class === selectedClass && n.isPublished);
            return (
              <div
                key={sub.id}
                onClick={() => handleSubjectClick(sub.id)}
                className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col"
              >
                {/* Visual Thumbnail */}
                <div className="h-28 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-xs">
                      {sub.code}
                    </span>
                    <span className="text-[11px] font-semibold">
                      {sub.chaptersCount} Chapters
                    </span>
                  </div>
                </div>

                {/* Subject Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {sub.tagline}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      {subjectNotes.length} notes available
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Study Tip & Question of the Day */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Study Tip Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/50 dark:from-slate-900 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>Daily Board Strategy Tip</span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {currentTip.subject}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
              {currentTip.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentTip.tip}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-indigo-100/80 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Tip #{tipIndex + 1} of {INITIAL_STUDY_TIPS.length}</span>
            <button
              onClick={() => setTipIndex((prev) => (prev + 1) % INITIAL_STUDY_TIPS.length)}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Next Tip →
            </button>
          </div>
        </div>

        {/* Important Question of the Day */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                Important Question of the Day
              </span>
              <span className="text-xs text-slate-500 font-mono font-medium">
                {INITIAL_DAILY_QUESTION.boardYear} · {INITIAL_DAILY_QUESTION.marks} Marks
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-500 mb-1">
              {INITIAL_DAILY_QUESTION.chapter}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              {INITIAL_DAILY_QUESTION.question}
            </p>

            {showDailySolution && (
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed border border-slate-200/60 dark:border-slate-700 max-h-48 overflow-y-auto">
                {INITIAL_DAILY_QUESTION.solution}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setShowDailySolution(!showDailySolution)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showDailySolution ? 'Hide Step Solution' : 'View Step Solution & Marking Scheme →'}
            </button>
            <button
              onClick={() => {
                const note = notes.find((n) => n.subject === INITIAL_DAILY_QUESTION.subject);
                if (note) openNoteReader(note);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            >
              Open Chapter Notes
            </button>
          </div>
        </div>
      </section>

      {/* Popular Notes Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popular Notes</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Most downloaded by Class {selectedClass}th Science students</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryFilter('all');
              setSelectedSubjectFilter('all');
              setActiveTab('library');
            }}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {popularNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </section>

      {/* Premium Notes Section (with 👑 badge) */}
      <section className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-purple-500/10 border border-amber-200/80 dark:border-amber-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Crown className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Premium Handwritten & Solved PYQs</span>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">
                  VIP
                </span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                10-Year solved papers, mark-by-mark scheme, handwritten mnemonics
              </p>
            </div>
          </div>
          {!currentUser.premiumStatus && (
            <button
              onClick={() => setOpenPremiumModal(true)}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
            >
              Unlock All Premium (₹499)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {premiumNotes.map((note) => (
            <NoteCard key={note.id} note={note} isPremiumSection />
          ))}
        </div>
      </section>

      {/* Recently Added Notes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recently Added Notes</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest updates for upcoming Maharashtra Board examinations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {recentNotes.map((note) => (
            <NoteCard key={note.id} note={note} compact />
          ))}
        </div>
      </section>
    </div>
  );
};

// Reusable NoteCard Component
export const NoteCard: React.FC<{ note: NoteItem; compact?: boolean; isPremiumSection?: boolean }> = ({
  note,
  compact = false,
  isPremiumSection = false,
}) => {
  const {
    openNoteReader,
    toggleBookmark,
    isBookmarked,
    hasAccessToNote,
    setOpenPremiumModal,
  } = useApp();

  const bookmarked = isBookmarked(note.id);
  const accessible = hasAccessToNote(note);

  const handleAction = () => {
    if (!accessible) {
      setOpenPremiumModal(true);
    } else {
      openNoteReader(note);
    }
  };

  return (
    <div className="group rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400/80 dark:hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-sm">
      <div className="p-3.5">
        {/* Top unboxed metadata row */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <div className="flex items-center gap-1.5 font-medium truncate">
            <span className="capitalize text-blue-600 dark:text-blue-400 font-semibold">{note.subject}</span>
            <span aria-hidden="true">·</span>
            <span>Class {note.class}th</span>
            <span aria-hidden="true">·</span>
            <span>{note.pages} pgs</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {note.isPremium ? (
              <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                <Crown className="w-3 h-3 fill-current" />
                <span>Premium</span>
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Free
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(note.id);
              }}
              className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title={bookmarked ? 'Remove Bookmark' : 'Save Note'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={handleAction}
          className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer line-clamp-2 leading-snug mb-1"
        >
          {note.title}
        </h3>

        {/* Short description */}
        {!compact && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
            {note.description}
          </p>
        )}
      </div>

      {/* Card Action footer */}
      <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        <span className="text-slate-400 truncate">
          {note.downloadsCount} reads · ~{note.readTimeMinutes} min
        </span>

        <button
          onClick={handleAction}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
            accessible
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          {accessible ? (
            <>
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Notes</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Note</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
