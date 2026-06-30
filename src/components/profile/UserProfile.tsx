import React from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { User, ClipboardList, ShieldAlert, Heart, Dna, FileSpreadsheet } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { activePatient } = useHealthTwin();

  const getLabBadgeColor = (status: string) => {
    switch (status) {
      case 'Normal':
      case 'Optimal':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Pre-Diabetic':
      case 'Elevated':
      case 'Borderline High':
      case 'Borderline Low':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 select-none max-w-[1200px] mx-auto w-full text-left">
      
      {/* View Header */}
      <div className="flex flex-col pb-3 border-b border-slate-900">
        <h2 className="text-xl font-black font-display uppercase tracking-wide text-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-slate-400" />
          Patient Electronic Health Record (EHR)
        </h2>
        <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">
          EHR biometric benchmarks and clinical patient logs
        </span>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Biometric profile card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-5 flex flex-col gap-5">
            
            {/* Patient Name card */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 text-xl font-bold font-mono">
                {activePatient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-slate-200 font-display leading-tight">{activePatient.name}</h3>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {activePatient.id}</span>
                <span className="text-[9.5px] font-semibold text-cyan-400 mt-1 font-mono uppercase bg-cyan-500/5 px-2 py-0.5 border border-cyan-500/10 rounded-full w-max">
                  {activePatient.profileName}
                </span>
              </div>
            </div>

            {/* Biomarker items */}
            <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-950/40 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-950/20">
                <span className="text-slate-500 font-mono">Age:</span>
                <span className="font-bold text-slate-350">{activePatient.age} years</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-950/20">
                <span className="text-slate-500 font-mono">Biological Gender:</span>
                <span className="font-bold text-slate-350">{activePatient.gender}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-950/20">
                <span className="text-slate-500 font-mono">Height Bench:</span>
                <span className="font-bold text-slate-350">{activePatient.height}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-950/20">
                <span className="text-slate-500 font-mono">Weight Bench:</span>
                <span className="font-bold text-slate-350">{activePatient.weight}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-950/20">
                <span className="text-slate-500 font-mono">Blood Group:</span>
                <span className="font-bold text-slate-350">{activePatient.bloodGroup}</span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-2 p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex flex-col gap-1 text-[11px]">
              <span className="text-[9px] uppercase font-bold text-rose-500 font-mono">Emergency Contact</span>
              <span className="font-bold text-slate-300">{activePatient.emergencyContact}</span>
            </div>

          </div>

          {/* Genomic CYP2D6 status block */}
          <div className="glass-panel p-5 flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider font-display text-slate-400 mb-2">
              PGx Genomic Status
            </span>
            <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl flex gap-3 items-start">
              <Dna className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-[9.5px] uppercase font-bold font-mono text-violet-400">CYP2D6 Genotype</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5">{activePatient.cyp2d6Status}</span>
                <p className="text-[10px] text-slate-500 mt-1.5 font-sans leading-relaxed">
                  CYP2D6 poor metabolizers experience drastically reduced clearance rates of metoprolol, increasing risks of beta-blocker accumulation and sudden sinus bradycardia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: EHR records & Labs table */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Diagnoses, Rx & history */}
          <div className="glass-panel p-5 flex flex-col gap-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-900 text-slate-350">
              <ClipboardList className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider font-display">Active EHR Diagnosis & Regimens</span>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">Active Diagnoses</span>
                <p className="text-slate-300 leading-relaxed font-sans">{activePatient.diagnoses}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">Active Pharmacotherapy Regimen</span>
                <p className="text-slate-300 leading-relaxed font-mono bg-slate-950/50 p-3 border border-slate-900 rounded-xl">
                  {activePatient.prescriptions}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">Social History & Lifestyle</span>
                <p className="text-slate-300 leading-relaxed font-sans">{activePatient.history}</p>
              </div>
            </div>
          </div>

          {/* Labs Table */}
          <div className="glass-panel p-5 flex flex-col">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-900 text-slate-350 mb-4">
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider font-display">Biomarker Lab Diagnostic Profile</span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px] tracking-wider">
                    <th className="py-2.5 px-3">Biomarker</th>
                    <th className="py-2.5 px-3">Value</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activePatient.labs.map((lab, index) => (
                    <tr key={index} className="border-b border-slate-900/60 hover:bg-slate-900/10">
                      <td className="py-3 px-3 font-semibold text-slate-300">{lab.name}</td>
                      <td className="py-3 px-3 text-slate-200">{lab.value}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 border rounded-full ${getLabBadgeColor(lab.status)}`}>
                          {lab.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default UserProfile;
