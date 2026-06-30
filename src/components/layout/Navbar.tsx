import React from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { Activity, Heart, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activePatientKey, 
    setActivePatientKey, 
    activePatient, 
    healthScore, 
    currentScenario,
    patientProfiles
  } = useHealthTwin();

  const getScoreColor = () => {
    if (healthScore >= 85) return 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]';
    if (healthScore >= 70) return 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]';
    return 'text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]';
  };

  const getScoreBg = () => {
    if (healthScore >= 85) return 'border-emerald-500/20 bg-emerald-500/5';
    if (healthScore >= 70) return 'border-amber-500/20 bg-amber-500/5';
    return 'border-rose-500/25 bg-rose-500/5 animate-pulse';
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b bg-slate-950/80 border-slate-800/60 backdrop-blur-md">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <div className="absolute inset-[3px] rounded-full bg-slate-950 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 to-indigo-200 bg-clip-text text-transparent uppercase">
            HealthTwin AI
          </span>
          <span className="text-[10px] text-slate-500 font-mono tracking-widest leading-none">
            PRECISION MEDICINE v1.0
          </span>
        </div>
      </div>

      {/* Patient Profile Dropdown & Telemetry Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 border rounded-full bg-slate-900/40 border-slate-800/80">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col text-left font-sans">
            <select
              value={activePatientKey}
              onChange={(e) => setActivePatientKey(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-200 outline-none cursor-pointer border-none p-0 pr-6 leading-none"
            >
              {Object.values(patientProfiles || {}).map((p: any) => (
                <option key={p.key} value={p.key} className="bg-slate-950 text-slate-200">
                  {p.name}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">
              ID: {activePatient.id} | {activePatient.gender} | Age: {activePatient.age}
            </span>
          </div>
        </div>

        {/* Telemetry Stream Active status */}
        <div className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 border rounded-full text-xs font-mono tracking-wide ${
          currentScenario === 'vtach' || currentScenario === 'hypo' 
            ? 'border-rose-500/25 bg-rose-500/10 text-rose-400' 
            : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
        }`}>
          <span className={`relative flex h-2 w-2`}>
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              currentScenario === 'vtach' || currentScenario === 'hypo' ? 'bg-rose-400' : 'bg-emerald-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              currentScenario === 'vtach' || currentScenario === 'hypo' ? 'bg-rose-500' : 'bg-emerald-500'
            }`}></span>
          </span>
          <span>
            {currentScenario === 'vtach' ? 'ACUTE ANOMALY DETECTED' : currentScenario === 'hypo' ? 'CRITICAL METABOLIC SHOCK' : 'TELEMETRY LIVE'}
          </span>
        </div>
      </div>

      {/* Dynamic Health Score Indicator */}
      <div className={`flex items-center gap-3 px-4 py-2 border rounded-xl ${getScoreBg()}`}>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            Health Score
          </span>
          <div className="flex items-center gap-1">
            {healthScore >= 85 && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
            {healthScore < 70 && <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-bounce" />}
            <span className="text-xs font-mono text-slate-500">Twin:</span>
          </div>
        </div>
        <div className="flex items-baseline">
          <span className={`text-2xl font-black font-mono leading-none ${getScoreColor()}`}>
            {healthScore}
          </span>
          <span className="text-[10px] text-slate-500 ml-0.5">/100</span>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
