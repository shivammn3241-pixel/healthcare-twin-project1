import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Fingerprint, Lock, ArrowRight, Dna, Activity } from 'lucide-react';

interface WelcomeScreenProps {
  onSignIn: () => void;
  onRegister: () => void;
  onBackToHome: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSignIn, onRegister, onBackToHome }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Dynamic Animated Central Hub */}
      <div className="relative mb-6 flex justify-center items-center">
        {/* Glow rings */}
        <div className="absolute w-24 h-24 rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-xl pointer-events-none animate-pulse-slow"></div>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 dark:shadow-cyan-500/10">
          <Fingerprint className="w-8 h-8 text-slate-950 dark:text-slate-900" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-4 border border-dashed border-cyan-500/20 dark:border-cyan-500/10 rounded-full"
        />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-display">
          Clinical Security Gateway
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center font-mono max-w-sm">
          Aetheris bio-telemetry database mapping and precision simulation workspace access.
        </p>
      </div>

      {/* HIPAA Compliance Status Indicator */}
      <div className="w-full mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <div className="text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 font-mono block">
            System Security Protocol
          </span>
          <span className="text-xs text-slate-700 dark:text-slate-350">
            256-bit AES EHR Encrypted & HIPAA Compliant
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3.5 w-full">
        <button
          onClick={onSignIn}
          className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 dark:text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group text-sm"
        >
          <Lock className="w-4 h-4 text-slate-950" />
          <span>Clinical Portal Sign-In</span>
          <ArrowRight className="w-4 h-4 text-slate-950 transition-transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={onRegister}
          className="w-full border border-slate-250 dark:border-slate-800 bg-white/50 hover:bg-slate-50/80 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 text-slate-700 dark:text-slate-250 font-bold py-3.5 px-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
        >
          <Dna className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          <span>Register New Patient Twin</span>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-900/60 w-full text-center">
        <button
          onClick={onBackToHome}
          className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 font-mono transition-colors"
        >
          ← Return to Public Homepage
        </button>
      </div>
    </div>
  );
};
export default WelcomeScreen;
