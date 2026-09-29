import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { NoteCard } from '../home/HomeScreen';
import { SUBJECTS } from '../../data/initialData';
import { SubjectId, CategoryType, BoardClass } from '../../types';
import { Search, Filter, SlidersHorizontal, X, BookOpen, Layers } from 'lucide-react';

export const NotesLibrary: React.FC = () => {
  const {
    notes,
    selectedClass,
    setSelectedClass,
    selectedSubjectFilter,
    setSelectedSubjectFilter,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [premiumFilter, setPremiumFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');

  // Extract all unique chapters for current subject/class
  const availableChapters = useMemo(() => {
    const list = notes
      .filter((n) => n.class === selectedClass && (selectedSubjectFilter === 'all' || n.subject === selectedSubjectFilter))
      .map((n) => n.chapter);
    return Array.from(new Set(list));
  }, [notes, selectedClass, selectedSubjectFilter]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Must be published
      if (!note.isPublished) return false;

      // Class match
      if (note.class !== selectedClass) return false;

      // Subject match
      if (selectedSubjectFilter !== 'all' && note.subject !== selectedSubjectFilter) return false;

      // Category match
      if (selectedCategoryFilter !== 'all' && note.category !== selectedCategoryFilter) return false;

      // Premium match
      if (premiumFilter === 'free' && note.isPremium) return false;
      if (premiumFilter === 'premium' && !note.isPremium) return false;

      // Chapter match
      if (selectedChapter !== 'all' && note.chapter !== selectedChapter) return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesChapter = note.chapter.toLowerCase().includes(query);
        const matchesSubject = note.subject.toLowerCase().includes(query);
        const matchesDesc = note.description.toLowerCase().includes(query);
        const matchesKeywords = note.sampleContent?.keyPoints?.some((kp) => kp.toLowerCase().includes(query));
        if (!matchesTitle && !matchesChapter && !matchesSubject && !matchesDesc && !matchesKeywords) {
          return false;
        }
      }

      return true;
    });
  }, [notes, selectedClass, selectedSubjectFilter, selectedCategoryFilter, premiumFilter, selectedChapter, searchQuery]);

  const resetFilters = () => {
    setSelectedSubjectFilter('all');
    setSelectedCategoryFilter('all');
    setPremiumFilter('all');
    setSelectedChapter('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedSubjectFilter !== 'all' ||
    selectedCategoryFilter !== 'all' ||
    premiumFilter !== 'all' ||
    selectedChapter !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-5 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-4">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Notes Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Maharashtra Board HSC syllabus · Class {selectedClass}th Science
          </p>
        </div>

        {/* Class switcher buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          {(['12', '11'] as BoardClass[]).map((cls) => (
            <button
              key={cls}
              onClick={() => {
                setSelectedClass(cls);
                setSelectedChapter('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedClass === cls
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Class {cls}th HSC
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by chapter, derivation, law, formula (e.g. Banking, Stokes, FCC, DNA)..."
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Subjects horizontal selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => {
              setSelectedSubjectFilter('all');
              setSelectedChapter('all');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
              selectedSubjectFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Subjects
          </button>
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubjectFilter(sub.id);
                setSelectedChapter('all');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedSubjectFilter === sub.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Secondary filters row (Category, Free/Premium, Chapter) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Free vs Premium segmented control */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setPremiumFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                premiumFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setPremiumFilter('free')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                premiumFilter === 'free'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-500'
              }`}
            >
              Free Only
            </button>
            <button
              onClick={() => setPremiumFilter('premium')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                premiumFilter === 'premium'
                  ? 'bg-amber-500 text-white shadow-xs font-semibold'
                  : 'text-slate-500'
              }`}
            >
              👑 Premium
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value as CategoryType | 'all')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border-0 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Content Types</option>
            <option value="notes">Notes & Derivations</option>
            <option value="pyq">Past Year Questions (PYQ)</option>
            <option value="important_questions">Important Question Sets</option>
            <option value="mcq">MCQs & Tests</option>
            <option value="revision">One-Shot Revision</option>
          </select>

          {/* Chapter Selector */}
          {availableChapters.length > 0 && (
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border-0 focus:ring-1 focus:ring-blue-500 max-w-[200px] truncate"
            >
              <option value="all">All Chapters ({availableChapters.length})</option>
              {availableChapters.map((chap) => (
                <option key={chap} value={chap}>
                  {chap}
                </option>
              ))}
            </select>
          )}

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="ml-auto text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Grid */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span>Showing {filteredNotes.length} notes</span>
          <span>HSC State Board verified format</span>
        </div>

        {filteredNotes.length === 0 ? (
          /* Empty State */
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No notes match your filters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any notes matching "{searchQuery}". Try clearing search keywords or selecting "All Subjects".
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
