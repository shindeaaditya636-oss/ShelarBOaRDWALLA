import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NoteItem } from '../../types';
import {
  X,
  Bookmark,
  Share2,
  Download,
  BookOpen,
  FileText,
  HelpCircle,
  CheckCircle2,
  Crown,
  Lock,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Printer,
  Copy,
  Check,
} from 'lucide-react';

export const NoteReaderModal: React.FC<{ note: NoteItem; onClose: () => void }> = ({ note, onClose }) => {
  const {
    isBookmarked,
    toggleBookmark,
    hasAccessToNote,
    setOpenPremiumModal,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'summary' | 'formulae' | 'pyqs' | 'mcqs' | 'pdf'>('summary');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const accessible = hasAccessToNote(note);
  const bookmarked = isBookmarked(note.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSelectAnswer = (mcqId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [mcqId]: optionIndex }));
    setShowAnswerFeedback((prev) => ({ ...prev, [mcqId]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[92vh] max-h-[880px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Reader Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Close reader"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="truncate">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {note.title}
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="capitalize text-blue-600 dark:text-blue-400 font-semibold">{note.subject}</span>
                <span>·</span>
                <span>{note.chapter}</span>
                <span>·</span>
                <span>{note.pages} Pages</span>
                {note.isPremium && (
                  <>
                    <span>·</span>
                    <span className="text-amber-500 font-bold flex items-center gap-0.5">
                      <Crown className="w-3 h-3 fill-current" /> Premium
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => toggleBookmark(note.id)}
              className="p-2 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={bookmarked ? 'Remove Bookmark' : 'Bookmark Note'}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Share Note"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => alert(`Downloading verified offline study PDF: "${note.title}.pdf"`)}
              className="p-2 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reader Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 overflow-x-auto no-scrollbar shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'summary'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Smart Notes & Key Points</span>
          </button>

          {note.sampleContent?.formulaeSheet && (
            <button
              onClick={() => setActiveTab('formulae')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'formulae'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Formulae & Derivations</span>
            </button>
          )}

          {note.sampleContent?.pyqExamHits && (
            <button
              onClick={() => setActiveTab('pyqs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'pyqs'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Solved Board PYQs</span>
            </button>
          )}

          {note.sampleContent?.practiceMcqs && (
            <button
              onClick={() => setActiveTab('mcqs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'mcqs'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Practice MCQs</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'pdf'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF Viewer Mode</span>
          </button>
        </div>

        {/* Reader Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-slate-950/50">
          {!accessible ? (
            /* Premium Gate Wall */
            <div className="max-w-md mx-auto my-8 p-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 fill-current" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                This is a Premium Note
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                Unlock full chapter handwritten notes, past 10-year step solutions, and teacher mnemonics for Maharashtra HSC Board.
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-left space-y-2 mb-5 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full {note.pages}-page printable notes with neat diagrams</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Step-wise marks distribution according to HSC board examiners</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>All 16 Chapters for Class 12th Science included</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setOpenPremiumModal(true);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
              >
                Unlock with Premium Pass (₹499)
              </button>
            </div>
          ) : (
            /* Accessible Content */
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Tab 1: Smart Notes & Key Points */}
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  {/* Overview Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Maharashtra State Board Scoring Notes</span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                      {note.sampleContent?.summaryNotes}
                    </p>
                  </div>

                  {/* Key Exam Points */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <span>Key Concept Points for Board Examination</span>
                    </h3>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {note.sampleContent?.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: Formulae Sheet */}
              {activeTab === 'formulae' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Master Formula & Derivation Sheet
                      </h3>
                      <p className="text-xs text-slate-500">
                        Essential formulas tested in HSC Section B, C & D
                      </p>
                    </div>
                    <button
                      onClick={() => alert('Formula list copied to clipboard!')}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Formulas</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {note.sampleContent?.formulaeSheet?.map((formula, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2"
                      >
                        <span className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate">{formula}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Solved PYQs */}
              {activeTab === 'pyqs' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Solved Maharashtra Board Questions</span>
                    <span>100% Textbook Aligned</span>
                  </div>

                  {note.sampleContent?.pyqExamHits?.map((hit, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                        <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                          {hit.year}
                        </span>
                        <span className="text-slate-400 font-mono font-medium">
                          {hit.marks} Marks
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                        {hit.question}
                      </p>
                      <div className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
                        Check Chapter 1 derivation guide for step-by-step diagram, statement, and formula substitution.
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Practice MCQs */}
              {activeTab === 'mcqs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Chapter Section A MCQ Test</span>
                    <span>1 Mark each · No negative marking in HSC</span>
                  </div>

                  {note.sampleContent?.practiceMcqs?.map((mcq, mIndex) => {
                    const selected = selectedAnswers[mcq.id];
                    const feedback = showAnswerFeedback[mcq.id];
                    return (
                      <div
                        key={mcq.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
                      >
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            Q{mIndex + 1}
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {mcq.question}
                          </p>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {mcq.options.map((opt, oIndex) => {
                            const isChosen = selected === oIndex;
                            const isCorrect = oIndex === mcq.answerIndex;
                            let style = 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

                            if (feedback) {
                              if (isCorrect) {
                                style = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold';
                              } else if (isChosen && !isCorrect) {
                                style = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700';
                              }
                            } else if (isChosen) {
                              style = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-400';
                            }

                            return (
                              <button
                                key={oIndex}
                                onClick={() => handleSelectAnswer(mcq.id, oIndex)}
                                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${style}`}
                              >
                                <span className="w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-bold shrink-0">
                                  {String.fromCharCode(65 + oIndex)}
                                </span>
                                <span className="truncate">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Feedback and Explanation */}
                        {feedback && (
                          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs space-y-1">
                            <div className="font-bold flex items-center gap-1.5">
                              {selected === mcq.answerIndex ? (
                                <span className="text-emerald-600 dark:text-emerald-400">✓ Correct Answer!</span>
                              ) : (
                                <span className="text-rose-600 dark:text-rose-400">✗ Incorrect Choice</span>
                              )}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300">
                              {mcq.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 5: PDF Viewer Mode */}
              {activeTab === 'pdf' && (
                <div className="space-y-3">
                  {/* PDF Toolbar */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1 rounded text-slate-500 disabled:opacity-40"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-medium">
                        Page {currentPage} of {note.pages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(note.pages, p + 1))}
                        disabled={currentPage === note.pages}
                        className="p-1 rounded text-slate-500 disabled:opacity-40"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                        className="p-1 rounded text-slate-500 hover:text-slate-800"
                        title="Zoom out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-mono w-10 text-center">{zoomLevel}%</span>
                      <button
                        onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                        className="p-1 rounded text-slate-500 hover:text-slate-800"
                        title="Zoom in"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Simulated High-Res Document Page Canvas */}
                  <div
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                    className="p-6 sm:p-8 bg-white text-slate-900 rounded-xl shadow-md border border-slate-200 space-y-4 font-serif min-h-[500px] transition-transform duration-150"
                  >
                    <div className="flex items-center justify-between border-b pb-2 text-[10px] text-slate-400 font-sans">
                      <span>SHELAR BOARD WALLA · OFFICIAL HSC SERIES</span>
                      <span>PAGE {currentPage}</span>
                    </div>

                    <div className="text-center space-y-1">
                      <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-blue-700">
                        MAHARASHTRA STATE BOARD OF SECONDARY & HIGHER SECONDARY EDUCATION
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 font-sans">
                        {note.chapter}
                      </h2>
                      <div className="text-xs text-slate-500 font-sans">
                        Class {note.class}th Science · Standard Syllabus Reference
                      </div>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed text-slate-800">
                      <p>
                        <strong>1. Concept Overview:</strong> Circular motion is defined as the motion of an object along the circumference of a circle. When the speed of the body remains constant throughout the circular path, it is called Uniform Circular Motion (UCM).
                      </p>
                      <div className="p-3 bg-blue-50/60 rounded border border-blue-200 font-mono text-[11px]">
                        Centripetal Acceleration: a_c = (v² / r) = ω² · r = v · ω [Directed towards center]
                      </div>
                      <p>
                        <strong>2. Banking of Roads Derivation:</strong> To avoid reliance on tire-road friction, roads are tilted at an angle θ with horizontal. Resolving N into components gives N cos θ = mg and N sin θ = m v² / r. Dividing equations results in:
                      </p>
                      <div className="text-center font-bold font-mono py-1 text-blue-900">
                        v = √(r · g · tan θ)
                      </div>
                    </div>

                    <div className="pt-6 border-t text-[10px] text-slate-400 flex items-center justify-between font-sans">
                      <span>Author: ShelarBoardWalla Academic Team</span>
                      <span>Verified for HSC 2026 Examination</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reader Footer Controls */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-400 hidden xs:inline">
            Class {note.class}th · {note.chapter}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors ml-auto"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
