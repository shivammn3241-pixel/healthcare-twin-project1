import React, { useState } from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { FileText, Download, Calendar, Activity, ShieldCheck, Heart } from 'lucide-react';

export const ClinicalReports: React.FC = () => {
  const { vitals, activePatient, healthScore } = useHealthTwin();
  const [reportRange, setReportRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handlePrint = () => {
    window.print();
  };

  const getGlucoseTimeInRange = () => {
    if (activePatient.key === 'sammi') return '62%';
    if (activePatient.key === 'balaji') return '84%';
    return '96%';
  };

  return (
    <div className="flex flex-col gap-6 p-6 select-none max-w-[1000px] mx-auto w-full text-left print:p-0 print:max-w-full">
      
      {/* View Header (hidden on print) */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-900 print:hidden">
        <div className="flex flex-col">
          <h2 className="text-xl font-black font-display uppercase tracking-wide text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Clinical Reports
          </h2>
          <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">
            Export physiological logs and twin telemetry parameters
          </span>
        </div>

        <div className="flex gap-2">
          {/* Daily/Weekly/Monthly selector */}
          <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl">
            {(['daily', 'weekly', 'monthly'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setReportRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold capitalize transition-colors ${
                  reportRange === range ? 'bg-slate-850 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-450 hover:to-indigo-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-transform active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Clinical Report Document Container */}
      <div className="glass-panel p-8 flex flex-col gap-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl relative print:bg-transparent print:border-none print:shadow-none print:p-0">
        
        {/* Subtle decorative clinical watermark in top-right */}
        <div className="absolute top-8 right-8 flex flex-col items-end text-right font-mono text-[9px] text-slate-600 print:text-slate-500">
          <span>REPORT ID: HT-2026-RT{activePatient.id.split('-')[1]}</span>
          <span>DATE GENERATED: {new Date().toLocaleDateString()}</span>
          <span>SYSTEM VERDICT: NOMINAL ANALYSIS</span>
        </div>

        {/* 1. Document Branding Header */}
        <div className="flex items-center gap-3.5 pb-6 border-b border-slate-900 print:border-slate-350">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-slate-950" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-md font-black tracking-widest text-slate-100 uppercase font-display leading-none print:text-slate-950">
              HealthTwin AI Portals
            </span>
            <span className="text-[10px] text-slate-500 font-mono tracking-widest leading-none mt-1 uppercase">
              Clinical Biological Simulation Export Summary
            </span>
          </div>
        </div>

        {/* 2. Patient metadata summary grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-950/60 border border-slate-900/80 rounded-2xl print:bg-slate-100 print:border-slate-300 print:text-slate-900 text-xs">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase">Patient Name</span>
            <span className="font-bold text-slate-300 print:text-slate-900">{activePatient.name}</span>
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase">Anatomical ID</span>
            <span className="font-bold text-slate-300 font-mono print:text-slate-900">{activePatient.id}</span>
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase">Clinical Profile</span>
            <span className="font-bold text-slate-300 print:text-slate-900">{activePatient.profileName}</span>
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase">Report Scope</span>
            <span className="font-bold text-slate-300 capitalize print:text-slate-900 font-mono">{reportRange} telemetry</span>
          </div>
        </div>

        {/* 3. Physiological Summary metrics */}
        <div className="flex flex-col gap-3 text-left mt-2">
          <span className="text-[10px] text-slate-500 font-mono tracking-wider font-bold uppercase pb-1 border-b border-slate-950">
            Physiological Telemetry Statistics
          </span>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            
            {/* Cardio Stats */}
            <div className="p-4 bg-slate-950/40 border border-slate-900/60 rounded-xl print:border-slate-300 print:text-slate-900 flex flex-col gap-1.5">
              <span className="text-[9.5px] uppercase font-bold text-slate-400 font-mono tracking-wider">Cardiology Metrics</span>
              <div className="flex justify-between text-xs font-mono mt-1">
                <span className="text-slate-500">Average Heart Rate:</span>
                <span className="font-bold text-slate-300 print:text-slate-900">{vitals.hr} BPM</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Ejection Fraction:</span>
                <span className="font-bold text-slate-300 print:text-slate-900">{vitals.ef}%</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Vascular Stress HRV:</span>
                <span className="font-bold text-slate-300 print:text-slate-900">{vitals.hrv} ms</span>
              </div>
            </div>

            {/* Metabolic Stats */}
            <div className="p-4 bg-slate-950/40 border border-slate-900/60 rounded-xl print:border-slate-300 print:text-slate-900 flex flex-col gap-1.5">
              <span className="text-[9.5px] uppercase font-bold text-slate-400 font-mono tracking-wider">Endocrine Metrics</span>
              <div className="flex justify-between text-xs font-mono mt-1">
                <span className="text-slate-500">Median Glucose:</span>
                <span className="font-bold text-slate-300 print:text-slate-900">{vitals.cgm} mg/dL</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Time-In-Range (CGM):</span>
                <span className="font-bold text-slate-300 print:text-slate-900">{getGlucoseTimeInRange()}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Metabolic Index:</span>
                <span className="font-bold text-slate-300 print:text-slate-900">{vitals.met} METs</span>
              </div>
            </div>

            {/* Lifestyle stats */}
            <div className="p-4 bg-slate-950/40 border border-slate-900/60 rounded-xl print:border-slate-300 print:text-slate-900 flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
              <span className="text-[9.5px] uppercase font-bold text-slate-400 font-mono tracking-wider">Activity Metrics</span>
              <div className="flex justify-between text-xs font-mono mt-1">
                <span className="text-slate-500">Accumulated Steps:</span>
                <span className="font-bold text-slate-300 print:text-slate-900">{vitals.steps} steps</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Caloric Expenditure:</span>
                <span className="font-bold text-slate-300 print:text-slate-900">{vitals.calories} kcal</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Sleep Coefficient:</span>
                <span className="font-bold text-slate-300 print:text-slate-900">92.4%</span>
              </div>
            </div>

          </div>
        </div>

        {/* 4. Active clinical conditions diagnoses summary */}
        <div className="flex flex-col gap-2 text-left mt-2">
          <span className="text-[10px] text-slate-500 font-mono tracking-wider font-bold uppercase pb-1 border-b border-slate-950">
            Active Clinical EHR Records
          </span>
          <div className="p-4 bg-slate-950/20 border border-slate-900/40 rounded-xl print:border-slate-300 print:text-slate-900 text-xs mt-1 leading-relaxed">
            <div className="flex gap-2">
              <strong className="text-slate-400 font-mono w-28 flex-shrink-0">Genomic Profile:</strong>
              <span className="text-slate-300 print:text-slate-800">{activePatient.cyp2d6Status}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <strong className="text-slate-400 font-mono w-28 flex-shrink-0">EHR Diagnosis:</strong>
              <span className="text-slate-300 print:text-slate-800">{activePatient.diagnoses}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <strong className="text-slate-400 font-mono w-28 flex-shrink-0">Prescription Rx:</strong>
              <span className="text-slate-300 print:text-slate-800 font-mono">{activePatient.prescriptions}</span>
            </div>
          </div>
        </div>

        {/* 5. AI Projection Diagnostic Verdict */}
        <div className="flex flex-col gap-2.5 text-left mt-2">
          <span className="text-[10px] text-slate-500 font-mono tracking-wider font-bold uppercase pb-1 border-b border-slate-950">
            Clinical AI Model Verdict
          </span>
          <div className="p-4 border border-indigo-500/25 bg-indigo-500/5 rounded-xl print:border-slate-350 print:text-slate-900 text-xs flex gap-3 items-start leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-slate-200 print:text-slate-950 font-display">In-Silico Simulation Verdict: HOMEOSRITHMIC STABILIZATION</span>
              <p className="text-slate-400 print:text-slate-800 mt-1">
                The Healthcare Digital Twin exhibits stable cellular osmolality, cardiac ventricular conduction, and continuous glycemic ranges. Active CYP2D6 metabolizing coefficients suggest that pharmacological drug clearances are within predicted ranges for patient {activePatient.name}. Twin homeostatic health score is rated at <strong className="text-cyan-400 print:text-indigo-600 font-mono">{healthScore}/100</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 6. Legal / Regulatory Disclaimer */}
        <div className="mt-8 pt-4 border-t border-slate-950 text-[9px] text-slate-600 leading-normal text-left font-mono print:text-slate-500">
          This document is generated by an advanced physiological in-silico simulation (HealthTwin AI) and does not replace real clinical diagnostics or physician assessment. Patient metadata is strictly handled under HIPAA IRB privacy regulations.
        </div>

      </div>

    </div>
  );
};
export default ClinicalReports;
