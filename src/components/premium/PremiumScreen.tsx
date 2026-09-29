import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Crown, CheckCircle2, ShieldCheck, Zap, BookOpen, Clock, Award, Star, ArrowRight } from 'lucide-react';

export const PremiumScreen: React.FC = () => {
  const { currentUser, unlockPremiumForUser, notes, openNoteReader } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<'all_access' | 'single_subject'>('all_access');
  const [showSimulatedCheckout, setShowSimulatedCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const premiumNotes = notes.filter((n) => n.isPremium);

  const handleStartCheckout = (plan: 'all_access' | 'single_subject') => {
    setSelectedPlan(plan);
    setShowSimulatedCheckout(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    // Simulate payment transaction network delay
    setTimeout(() => {
      setIsProcessing(false);
      setPurchaseSuccess(true);
      unlockPremiumForUser(selectedPlan === 'all_access' ? 'HSC 2026 All-Access VIP Pass' : 'Single Subject Booster');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-amber-500 to-indigo-800 text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <Crown className="w-5 h-5 fill-current text-amber-200" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              ShelarBoardWalla VIP Pro
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
            Master HSC Board with Maharashtra's #1 Handwritten Notes
          </h1>
          <p className="text-sm sm:text-base text-amber-100 mb-6 leading-relaxed">
            Step-by-step solved derivations, past 10 years solved board papers with marking rubrics, and high-scoring mnemonics.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-200" />
              <span>100% Maharashtra Board Aligned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-200" />
              <span>Verified by State Board Examiners</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-200" />
              <span>Full Offline Print Support</span>
            </div>
          </div>
        </div>

        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Current User Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your Account Status</div>
          <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
            {currentUser.premiumStatus ? (
              <>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-5 h-5" /> Active Pro Member
                </span>
                <span className="text-xs font-normal text-slate-400">
                  (Valid through {currentUser.premiumExpiresAt || '2027'})
                </span>
              </>
            ) : (
              <>
                <span className="text-slate-700 dark:text-slate-300">Free Tier Student</span>
                <span className="text-xs font-normal text-slate-400">
                  (Standard notes unlocked)
                </span>
              </>
            )}
          </div>
        </div>

        {!currentUser.premiumStatus ? (
          <button
            onClick={() => handleStartCheckout('all_access')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Crown className="w-4 h-4 fill-current" />
            <span>Unlock Pro Access</span>
          </button>
        ) : (
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
            All Features Unlocked
          </div>
        )}
      </div>

      {/* Plan Tiers */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Choose Your Study Plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            One-time payment for the full academic year. No hidden recurring fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Plan 1: All Access */}
          <div className="relative rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
              Recommended by Toppers
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-amber-500 fill-current" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  HSC 12th All-Access VIP Pass
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Full syllabus access for all 4 Science subjects (Physics, Chemistry, Maths, Biology).
              </p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                  ₹499
                </span>
                <span className="text-xs text-slate-400 line-through">₹1,999</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  75% OFF
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 mb-6">
                {[
                  'All 16 Chapters complete handwritten-style notes',
                  'Last 10 Years Solved Board PYQs with step marks',
                  'Board Expected 4-Mark Long Answer Questions',
                  'Chapter Formulae and Reaction Mechanism Sheets',
                  'Full Offline Printable PDF documents',
                  'Teacher Exam Mnemonics & Time Management tips',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleStartCheckout('all_access')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Unlock All Access Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Plan 2: Single Subject Booster */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Single Subject Booster
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Perfect if you need dedicated focus in Physics, Chemistry, or Maths.
              </p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                  ₹199
                </span>
                <span className="text-xs text-slate-400 line-through">₹599</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 mb-6">
                {[
                  'Single subject complete handwritten chapters',
                  'Subject past year questions with answer steps',
                  'Section A, B, C & D chapter blueprint',
                  'Offline PDF viewing & download',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleStartCheckout('single_subject')}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm transition-all"
            >
              Choose Single Subject (₹199)
            </button>
          </div>
        </div>
      </div>

      {/* User's Purchased Content Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Your Purchased / Unlocked Content
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          All unlocked premium chapter notes and question banks available for your account.
        </p>

        {currentUser.premiumStatus || currentUser.purchasedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {premiumNotes.map((note) => (
              <div
                key={note.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">{note.subject}</span>
                    <span>{note.pages} pgs</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                    {note.title}
                  </h4>
                </div>
                <button
                  onClick={() => openNoteReader(note)}
                  className="mt-3 w-full py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Open Notes
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            You haven't unlocked any premium bundles yet. Choose a plan above to get started.
          </div>
        )}
      </div>

      {/* Architecture Disclaimer / Payment Gateway Interface */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Payment Gateway & Security Contract</span>
        </div>
        <p className="leading-relaxed">
          In production, checkout interfaces connect to Razorpay or Cashfree UPI gateways. Order tokens are generated on an authorized server, and payment signatures are verified via webhook endpoints before granting membership access.
        </p>
      </div>

      {/* Simulated Checkout Modal */}
      {showSimulatedCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            {!purchaseSuccess ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500 fill-current" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Confirm Study Pass
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowSimulatedCheckout(false)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>
                      {selectedPlan === 'all_access' ? 'HSC 12th All-Access VIP Pass' : 'Single Subject Booster'}
                    </span>
                    <span className="font-mono">{selectedPlan === 'all_access' ? '₹499' : '₹199'}</span>
                  </div>
                  <div className="text-slate-400">Includes all updates for HSC Board 2026</div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Select Simulated Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['upi', 'card', 'netbanking'] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-2.5 rounded-xl border text-center font-bold capitalize transition-all ${
                          paymentMethod === method
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {method.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                  ⚡ <strong>Sandbox Simulation Mode:</strong> Testing order creation and status resolution without debiting real funds.
                </div>

                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>Verifying with Gateway...</span>
                  ) : (
                    <span>Complete Simulation ({selectedPlan === 'all_access' ? '₹499' : '₹199'})</span>
                  )}
                </button>
              </div>
            ) : (
              /* Success View */
              <div className="text-center space-y-4 py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    VIP Pro Membership Active!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your account has been granted full access to all handwritten notes, formulas, and PYQ solutions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSimulatedCheckout(false);
                    setPurchaseSuccess(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Start Reading Notes Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
