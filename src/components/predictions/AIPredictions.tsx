import React from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { BrainCircuit, TrendingUp, TrendingDown, RefreshCw, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export const AIPredictions: React.FC = () => {
  const { aiPredictions, healthScore, activePatient } = useHealthTwin();

  const getRiskBadge = (category: string) => {
    switch (category) {
      case 'High':
      case 'Critical':
        return 'border-rose-500/25 bg-rose-500/10 text-rose-400';
      case 'Elevated':
      case 'Moderate':
        return 'border-amber-500/20 bg-amber-500/10 text-amber-400';
      default:
        return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
    }
  };

  const getTrendIcon = (trend: 'stable' | 'improving' | 'worsening') => {
    if (trend === 'improving') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
          <TrendingDown className="w-3.5 h-3.5" /> Improving
        </span>
      );
    }
    if (trend === 'worsening') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono text-rose-400">
          <TrendingUp className="w-3.5 h-3.5" /> Worsening
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
        <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> Stable
      </span>
    );
  };

  // Convert risk percentages to a Recharts RadarChart format
  const radarData = aiPredictions.map(risk => ({
    subject: risk.disease.replace(' Risk', ''),
    percentage: risk.percentage,
    fullMark: 100,
  }));

  return (
    <div className="flex flex-col gap-6 p-6 select-none max-w-[1400px] mx-auto w-full text-left">
      
      {/* View Header */}
      <div className="flex flex-col">
        <h2 className="text-xl font-black font-display uppercase tracking-wide text-slate-100 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-violet-400" />
          Predictive AI Diagnostics
        </h2>
        <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">
          Neural networks projection models & disease risk assessments
        </span>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: AI predictions overview cards */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Master Health score forecasting module */}
          <div className="p-5 border border-slate-800 bg-slate-900/40 rounded-2xl flex flex-col sm:flex-row gap-5 items-center justify-between backdrop-blur-xl">
            <div className="flex flex-col gap-1 max-w-md">
              <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider font-mono">
                Projected Biomarker Summary
              </span>
              <h3 className="text-md font-bold text-slate-200 mt-1">
                Homeostatic Vital Integrations
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                The twin is currently exhibiting a calculated Health Score of <strong className="text-cyan-400">{healthScore}/100</strong>. AI predictions are derived from genetic PGx data (CYP2D6 status), continuous clinical telemetry (ECG baseline, SpO2 boundaries), and real-time what-if physiological parameters.
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 border border-violet-500/10 bg-violet-500/5 rounded-2xl min-w-[140px]">
              <span className="text-[9px] uppercase font-mono text-violet-400 font-bold">Risk Forecast</span>
              <span className="text-4xl font-black font-mono text-slate-100 mt-1">{100 - healthScore}%</span>
              <span className="text-[9px] uppercase text-slate-500 font-mono mt-0.5">Deficit Probability</span>
            </div>
          </div>

          {/* Disease cards grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {aiPredictions.map((risk, index) => (
              <div 
                key={index} 
                className="glass-panel p-5 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold text-slate-200 font-display">
                      {risk.disease}
                    </span>
                    <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 border rounded-full ${getRiskBadge(risk.category)}`}>
                      {risk.category}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Risk Level</span>
                      <span className="text-3xl font-black font-mono text-slate-100 tracking-tight mt-0.5">
                        {risk.percentage}%
                      </span>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Confidence</span>
                      <span className="text-xs font-bold font-mono text-slate-400 mt-1.5">
                        {risk.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-900/60 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Trend Indicator</span>
                    {getTrendIcon(risk.trend)}
                  </div>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans mt-1">
                    {risk.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: AI radar and PGx genomic profile */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Radar Chart mapping risk */}
          <div className="glass-panel p-5 flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider font-display text-slate-400 self-start mb-4">
              AI Risk Topology Map
            </span>
            <div className="w-full h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: '#64748b' }} />
                  <Radar 
                    name="Risk" 
                    dataKey="percentage" 
                    stroke="#a100ff" 
                    fill="#a100ff" 
                    fillOpacity={0.2} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <span className="text-[10px] text-slate-500 font-mono text-center mt-3">
              Radar plots showing risk parameters for patient {activePatient.name}.
            </span>
          </div>

          {/* Genomic PGx profile summary */}
          <div className="glass-panel p-5 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider font-display text-slate-400 mb-3">
              Genomic Biomarker Profiles
            </span>
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 flex-shrink-0 animate-ping"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-violet-400 uppercase">Genotype: CYP2D6 Status</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5">{activePatient.cyp2d6Status}</span>
                  <p className="text-[10px] text-slate-500 mt-1 font-sans leading-normal">
                    This gene metabolizes 25% of clinical drugs, including Beta-Blockers. Poor metabolizers accumulate compounds rapidly.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Active Diagnostics Protocol</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5">HIPAA Simulated Telemetry Stream</span>
                  <p className="text-[10px] text-slate-500 mt-1 font-sans leading-normal">
                    AI models recalculate cardiac, respiratory, and metabolic load margins every 1.0 second.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default AIPredictions;
