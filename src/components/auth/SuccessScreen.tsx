import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Heart, Sparkles, Cpu, Activity, User } from 'lucide-react';

interface SuccessScreenProps {
  name: string;
  onEnterPortal: () => void;
}

interface LogLine {
  text: string;
  done: boolean;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ name, onEnterPortal }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogLine[]>([
    { text: 'Configuring secure JWT session...', done: false },
    { text: 'Syncing biological EHR baseline...', done: false },
    { text: 'Mapping metabolic rate equations (in-silico)...', done: false },
    { text: 'Calibrating sympathovagal balance ratios...', done: false },
    { text: 'Launching real-time clinical telemetry loops...', done: false }
  ]);
  const [currentLogIdx, setCurrentLogIdx] = useState(0);

  // Speed up progress bar and log ticks sequentially
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1.25;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Mark all logs complete
      setLogs((prev) => prev.map((log) => ({ ...log, done: true })));
      return;
    }

    const targetIdx = Math.min(
      Math.floor((progress / 100) * logs.length),
      logs.length - 1
    );

    if (targetIdx !== currentLogIdx) {
      setCurrentLogIdx(targetIdx);
      setLogs((prev) =>
        prev.map((log, idx) => {
          if (idx < targetIdx) return { ...log, done: true };
          return log;
        })
      );
    }
  }, [progress, currentLogIdx, logs.length]);

  return (
    <div className="flex flex-col items-center text-center py-4 select-none">
      {/* Biometric Scan Circle */}
      <div className="relative mb-6 flex justify-center items-center">
        <div className="absolute w-28 h-28 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-xl pointer-events-none animate-pulse-slow"></div>
        
        {/* Nested animating scanner circles */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20"
        >
          <ShieldCheck className="w-10 h-10 text-slate-950 dark:text-slate-900" />
        </motion.div>

        {/* Circular Scanning border */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-3 border-2 border-dashed border-emerald-500/20 dark:border-emerald-500/30 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-5 border border-cyan-500/10 dark:border-cyan-500/15 rounded-full"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">
          Biometrics Verified
        </h2>
        <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mt-1 uppercase tracking-widest font-semibold block">
          Welcome, {name}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-6 text-left">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1.5 px-1">
          <span>COMPILING DYNAMIC BIO-TWIN</span>
          <span className="font-bold text-slate-600 dark:text-slate-350">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Dynamic Terminal Calibration Logs */}
      <div className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 text-left font-mono text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 mb-6 min-h-[145px]">
        <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 dark:border-slate-900/60 pb-1">
          System Calibration Stream
        </div>
        <div className="flex flex-col gap-1.5">
          {logs.map((log, idx) => {
            const isCurrent = idx === currentLogIdx && progress < 100;
            const isCompleted = log.done || idx < currentLogIdx;
            
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'text-slate-700 dark:text-slate-300' 
                    : isCurrent 
                    ? 'text-cyan-600 dark:text-cyan-400 animate-pulse font-semibold' 
                    : 'text-slate-300 dark:text-slate-800'
                }`}
              >
                <span className="flex-shrink-0">
                  {isCompleted ? (
                    <span className="text-emerald-500 font-bold">[✓]</span>
                  ) : isCurrent ? (
                    <span className="text-cyan-500 animate-spin inline-block">⏱</span>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-800">[ ]</span>
                  )}
                </span>
                <span className="truncate">{log.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action button */}
      <AnimatePresence>
        {progress >= 100 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={onEnterPortal}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-450 hover:to-cyan-400 text-slate-950 dark:text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4.5 h-4.5 text-slate-950" />
            <span>Launch Twin Workspace</span>
            <Activity className="w-4 h-4 text-slate-950 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
export default SuccessScreen;
