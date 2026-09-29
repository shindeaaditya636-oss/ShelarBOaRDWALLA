import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS } from '../../data/initialData';
import { NoteItem, SubjectId, BoardClass, CategoryType } from '../../types';
import {
  Shield,
  PlusCircle,
  FileText,
  Users,
  Layers,
  Crown,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Lock,
  Search,
  Upload,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePublishNote,
    openNoteReader,
    switchUserRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'add_note' | 'manage_notes' | 'manage_subjects' | 'users'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<SubjectId | 'all'>('all');

  // Form state for adding/editing note
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formClass, setFormClass] = useState<BoardClass>('12');
  const [formSubject, setFormSubject] = useState<SubjectId>('physics');
  const [formChapter, setFormChapter] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>('notes');
  const [formDescription, setFormDescription] = useState('');
  const [formPages, setFormPages] = useState<number>(10);
  const [formIsPremium, setFormIsPremium] = useState<boolean>(false);
  const [formIsPublished, setFormIsPublished] = useState<boolean>(true);
  const [formPdfUrl, setFormPdfUrl] = useState('');
  const [formKeyPoints, setFormKeyPoints] = useState('');
  const [formFormulae, setFormFormulae] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  // Security Gate: Ensure only Admins can access
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Access Restricted to Authorized Admins
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          You are currently signed in as <strong>{currentUser.name}</strong> ({currentUser.role}). Student accounts cannot view, publish, or modify Maharashtra Board study material.
        </p>

        <div className="pt-2">
          <button
            onClick={() => switchUserRole('admin')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Switch to Admin Demo Account (Prof. Shelar Sir)
          </button>
        </div>
      </div>
    );
  }

  // Admin Stats
  const totalNotes = notes.length;
  const freeNotes = notes.filter((n) => !n.isPremium).length;
  const premiumNotes = notes.filter((n) => n.isPremium).length;
  const publishedNotes = notes.filter((n) => n.isPublished).length;

  const handleEditClick = (note: NoteItem) => {
    setEditingNoteId(note.id);
    setFormTitle(note.title);
    setFormClass(note.class);
    setFormSubject(note.subject);
    setFormChapter(note.chapter);
    setFormCategory(note.category);
    setFormDescription(note.description);
    setFormPages(note.pages);
    setFormIsPremium(note.isPremium);
    setFormIsPublished(note.isPublished);
    setFormPdfUrl(note.pdfUrl);
    setFormKeyPoints(note.sampleContent?.keyPoints?.join('\n') || '');
    setFormFormulae(note.sampleContent?.formulaeSheet?.join('\n') || '');
    setFormSummary(note.sampleContent?.summaryNotes || '');
    setActiveTab('add_note');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formChapter.trim()) {
      alert('Please provide at least a title and chapter name.');
      return;
    }

    const keyPointsArray = formKeyPoints
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const formulaeArray = formFormulae
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: formTitle,
        class: formClass,
        subject: formSubject,
        chapter: formChapter,
        category: formCategory,
        description: formDescription,
        pages: Number(formPages) || 1,
        isPremium: formIsPremium,
        isPublished: formIsPublished,
        pdfUrl: formPdfUrl || 'https://storage.googleapis.com/sbw-notes/demo.pdf',
        sampleContent: {
          keyPoints: keyPointsArray.length > 0 ? keyPointsArray : ['Sample concept note overview.'],
          formulaeSheet: formulaeArray,
          summaryNotes: formSummary || 'Verified chapter notes for Maharashtra HSC Board.',
        },
      });
      setFormSuccessMessage(`Note updated successfully!`);
    } else {
      addNote({
        title: formTitle,
        class: formClass,
        subject: formSubject,
        chapter: formChapter,
        category: formCategory,
        description: formDescription,
        pages: Number(formPages) || 1,
        isPremium: formIsPremium,
        isPublished: formIsPublished,
        pdfUrl: formPdfUrl || 'https://storage.googleapis.com/sbw-notes/demo.pdf',
        thumbnailUrl: SUBJECTS.find((s) => s.id === formSubject)?.image || '',
        readTimeMinutes: Math.ceil(Number(formPages) * 1.5) || 10,
        sampleContent: {
          keyPoints: keyPointsArray.length > 0 ? keyPointsArray : ['Key exam principles for this chapter.'],
          formulaeSheet: formulaeArray,
          summaryNotes: formSummary || 'Maharashtra Board exam ready notes.',
        },
      });
      setFormSuccessMessage(`Note added to library successfully!`);
    }

    // Reset form after short delay
    setTimeout(() => {
      setFormSuccessMessage('');
      setEditingNoteId(null);
      setFormTitle('');
      setFormChapter('');
      setFormDescription('');
      setFormKeyPoints('');
      setFormFormulae('');
      setFormSummary('');
      setActiveTab('manage_notes');
    }, 1200);
  };

  const filteredManageNotes = notes.filter((n) => {
    if (selectedSubjectTab !== 'all' && n.subject !== selectedSubjectTab) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.chapter.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-4">
      {/* Admin Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500 text-white">
              <Shield className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              SBW Academic Administrator Panel
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Content management, publishing controls, and board material catalog
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview' as const, label: 'Overview', icon: Layers },
            { id: 'add_note' as const, label: editingNoteId ? 'Edit Note' : 'Add Note', icon: PlusCircle },
            { id: 'manage_notes' as const, label: 'Manage Notes', icon: FileText },
            { id: 'manage_subjects' as const, label: 'Subjects', icon: Layers },
            { id: 'users' as const, label: 'Students', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Notes in System</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{totalNotes}</div>
              <div className="text-[11px] text-emerald-600 mt-1">{publishedNotes} published live</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Free Notes</div>
              <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">{freeNotes}</div>
              <div className="text-[11px] text-slate-400 mt-1">Available to all students</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Premium Pro Notes</div>
              <div className="text-2xl font-black text-amber-500 mt-1 font-mono">{premiumNotes}</div>
              <div className="text-[11px] text-slate-400 mt-1">VIP Pass protected</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Registered Students</div>
              <div className="text-2xl font-black text-blue-600 mt-1 font-mono">1,482</div>
              <div className="text-[11px] text-slate-400 mt-1">Active HSC Maharashtra batch</div>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Admin Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setEditingNoteId(null);
                  setActiveTab('add_note');
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload New Chapter Note</span>
              </button>
              <button
                onClick={() => setActiveTab('manage_notes')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>View & Edit Notes Database</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Add / Edit Note Form */}
      {activeTab === 'add_note' && (
        <div className="max-w-3xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingNoteId ? 'Edit Chapter Note' : 'Add New Maharashtra Board Note'}
              </h2>
              <p className="text-xs text-slate-500">
                Only authorized academic administrators can publish notes.
              </p>
            </div>
            {editingNoteId && (
              <button
                onClick={() => {
                  setEditingNoteId(null);
                  setFormTitle('');
                }}
                className="text-xs text-slate-400 hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {formSuccessMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{formSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            {/* Title */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Note Title *
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Wave Optics: Derivation of Interference Fringes & Solved PYQs"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Class, Subject & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Class
                </label>
                <select
                  value={formClass}
                  onChange={(e) => setFormClass(e.target.value as BoardClass)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="12">Class 12th HSC</option>
                  <option value="11">Class 11th Science</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Subject
                </label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value as SubjectId)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white capitalize"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as CategoryType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white capitalize"
                >
                  <option value="notes">Notes & Derivations</option>
                  <option value="pyq">PYQs (Past 10 Years)</option>
                  <option value="important_questions">Important Question Sets</option>
                  <option value="mcq">MCQs & Quizzes</option>
                  <option value="revision">One-Shot Revision</option>
                </select>
              </div>
            </div>

            {/* Chapter Name & Pages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Chapter Number & Name *
                </label>
                <input
                  type="text"
                  required
                  value={formChapter}
                  onChange={(e) => setFormChapter(e.target.value)}
                  placeholder="e.g. 07. Wave Optics"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Page Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="150"
                  value={formPages}
                  onChange={(e) => setFormPages(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Short Description
              </label>
              <textarea
                rows={2}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Highlight key derivations, definitions, or marks distribution..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Key Points (one per line) */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Key Exam Points (1 per line)
              </label>
              <textarea
                rows={3}
                value={formKeyPoints}
                onChange={(e) => setFormKeyPoints(e.target.value)}
                placeholder="Huygens wave theory principles&#10;Condition for constructive interference: Δx = nλ&#10;Fringe width formula: β = λD / d"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            {/* Formulae Sheet (one per line) */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Formulae Sheet Entries (1 per line)
              </label>
              <textarea
                rows={2}
                value={formFormulae}
                onChange={(e) => setFormFormulae(e.target.value)}
                placeholder="β = (λ · D) / d&#10;Optical Path: Δ = μ · d"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            {/* Summary / Notes body */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Teacher Revision Summary
              </label>
              <textarea
                rows={3}
                value={formSummary}
                onChange={(e) => setFormSummary(e.target.value)}
                placeholder="State Board examination tips for scoring full marks in Section D..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* PDF URL / File simulator */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                PDF Document Storage Path
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formPdfUrl}
                  onChange={(e) => setFormPdfUrl(e.target.value)}
                  placeholder="https://storage.googleapis.com/sbw-notes/chapter_note.pdf"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setFormPdfUrl(`https://storage.googleapis.com/sbw-notes/${formSubject}_${Date.now()}.pdf`)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Simulate Upload</span>
                </button>
              </div>
            </div>

            {/* Toggles: Premium & Published */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={formIsPremium}
                  onChange={(e) => setFormIsPremium(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                />
                <span>👑 Mark as Premium Content (Requires VIP Pass)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={formIsPublished}
                  onChange={(e) => setFormIsPublished(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span>Publish Immediately to Students</span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                {editingNoteId ? 'Save & Update Note' : 'Add Note to Catalog'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Manage Notes Table */}
      {activeTab === 'manage_notes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter by subject */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
              <button
                onClick={() => setSelectedSubjectTab('all')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedSubjectTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                All Subjects ({notes.length})
              </button>
              {SUBJECTS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectTab(sub.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    selectedSubjectTab === sub.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by title..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>
          </div>

          {/* Notes Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Title & Chapter</th>
                    <th className="px-4 py-3">Subject / Class</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredManageNotes.map((note) => (
                    <tr key={note.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{note.title}</div>
                        <div className="text-[11px] text-slate-400">{note.chapter} · {note.pages} pgs</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">{note.subject}</span>
                        <div className="text-[11px] text-slate-400">Class {note.class}th</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {note.isPremium ? (
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded flex items-center gap-1 w-max">
                            <Crown className="w-3 h-3 fill-current" /> Premium
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded w-max">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => togglePublishNote(note.id)}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            note.isPublished
                              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
                              : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {note.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{note.isPublished ? 'Live' : 'Draft'}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => openNoteReader(note)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 transition-colors"
                          title="Preview in Reader"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(note)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 transition-colors"
                          title="Edit Note"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete note "${note.title}"?`)) {
                              deleteNote(note.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 transition-colors"
                          title="Delete Note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Manage Subjects */}
      {activeTab === 'manage_subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUBJECTS.map((sub) => {
            const subjectNotes = notes.filter((n) => n.subject === sub.id);
            return (
              <div
                key={sub.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-4"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{sub.name}</h3>
                    <span className="font-mono text-xs text-slate-400">{sub.code}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{sub.tagline}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>{sub.chaptersCount} Chapters in Board Syllabus</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {subjectNotes.length} Notes Uploaded
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 5: Manage Students */}
      {activeTab === 'users' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Student Accounts</h3>
              <p className="text-xs text-slate-500">Manage memberships, verify access permissions</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total: 1,482</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Aaditya Shinde (Current Demo Student)</div>
                <div className="text-slate-400">shindeaaditya636@gmail.com · Role: Student</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Free Tier</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Prof. Shelar Sir (Super Admin)</div>
                <div className="text-slate-400">admin@shelarboardwalla.com · Role: Academic Head</div>
              </div>
              <span className="font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                Admin VIP
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
