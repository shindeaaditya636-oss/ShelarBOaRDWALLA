import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Crown, CheckCircle2, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const PremiumModal: React.FC = () => {
  const { openPremiumModal, setOpenPremiumModal, unlockPremiumForUser } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<'all_access' | 'single_subject'>('all_access');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!openPremiumModal) return null;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      unlockPremiumForUser(selectedPlan === 'all_access' ? 'HSC 2026 All-Access VIP Pass' : 'Single Subject Booster');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 relative">
        <button
          onClick={() => {
            setOpenPremiumModal(false);
            setIsSuccess(false);
          }}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <Crown className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Unlock ShelarBoardWalla VIP Pro
                </h3>
                <p className="text-xs text-slate-500">Maharashtra State Board Class 12th & 11th Science</p>
              </div>
            </div>

            {/* Plan selection */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div
                onClick={() => setSelectedPlan('all_access')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPlan === 'all_access'
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                  All 4 Subjects
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                  ₹499
                </div>
                <div className="text-[11px] text-slate-400 line-through">₹1,999</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
                  Full 1-Year Pass
                </div>
              </div>

              <div
                onClick={() => setSelectedPlan('single_subject')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPlan === 'single_subject'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                  1 Subject
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                  ₹199
                </div>
                <div className="text-[11px] text-slate-400 line-through">₹599</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
                  Single Booster
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-2 text-xs py-2">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Complete chapter handwritten notes with diagrams</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Last 10 Years Solved Maharashtra Board PYQs</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Download & print unlimited offline PDF booklets</span>
              </div>
            </div>

            {/* Simulated Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Activating Membership...</span>
              ) : (
                <>
                  <span>Unlock Instant Access ({selectedPlan === 'all_access' ? '₹499' : '₹199'})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Razorpay / UPI sandbox simulator. Real backend webhook ready.</span>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Pro Access Unlocked!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You now have full VIP privileges to all chapter notes, formulas, and PYQs.
              </p>
            </div>
            <button
              onClick={() => {
                setOpenPremiumModal(false);
                setIsSuccess(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Start Studying
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
