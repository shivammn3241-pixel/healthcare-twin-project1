import React from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { BrainCircuit, Sparkles, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export const InsightsPanel: React.FC = () => {
  const { aiPredictions, activePatient, currentScenario } = useHealthTwin();

  const getTrendIcon = (trend: 'stable' | 'improving' | 'worsening') => {
    if (trend === 'improving') return <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />;
    if (trend === 'worsening') return <TrendingUp className="w-3.5 h-3.5 text-rose-400" />;
    return <RefreshCw className="w-3 h-3 text-slate-500 animate-spin" style={{ animationDuration: '6s' }} />;
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'High':
      case 'Critical':
        return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
      case 'Moderate':
      case 'Elevated':
        return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      default:
        return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    }
  };

  // Get personalized AI engine recommendation summary
  const getBannerRecommendationText = () => {
    if (currentScenario === 'vtach') {
      return 'AI Alert: Ventricular Tachycardia episode identified. Restoring beta-blocker metoprolol levels should be prioritized. Advise visual quietude and immediate physical rest.';
    }
    if (currentScenario === 'hypo') {
      return 'AI Alert: Hypoglycemic glucose threshold breached. Recommend direct administration of fast-acting glucose (bolus or meals) to restore safe glycogen baselines.';
    }
    if (activePatient.key === 'balaji') {
      return 'Cognitive Advice: Cytochrome P450poor metabolizer profile (CYP2D6 *4/*4). Metoprolol clearance is highly reduced. Administer medication doses cautiously to avoid excessive bradycardia.';
    }
    if (activePatient.key === 'sammi') {
      return 'Cognitive Advice: High metabolic volatility detected. Balance carbohydrate digestion indexes with titrated Humalog insulin bolus. Monitor CGM trend lines.';
    }
    return 'Cognitive Advice: Cardiovascular and physiological drive coefficients are holding within baseline parameters. Recommend walking 8000 steps to maintain vascular resilience.';
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto pr-1 h-full select-none">
      <span className="text-[10px] text-slate-500 font-mono tracking-widest font-bold uppercase mb-1">
        Cognitive Insights
      </span>

      {/* AI Cognitive recommendation banner */}
      <div className="p-4 border border-violet-500/20 bg-violet-600/5 rounded-xl text-left flex gap-3 shadow-md shadow-violet-500/5">
        <Sparkles className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider font-mono">
            AI Engine Dispatch
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
            {getBannerRecommendationText()}
          </p>
        </div>
      </div>

      <span className="text-[10px] text-slate-500 font-mono tracking-widest font-bold uppercase mb-0.5 mt-2">
        Neural Projections
      </span>

      {/* Top 3 AI disease risks */}
      <div className="flex flex-col gap-3">
        {aiPredictions.slice(0, 3).map((risk, index) => (
          <div 
            key={index}
            className="p-4 border border-slate-800/80 bg-slate-900/40 rounded-xl flex flex-col gap-2.5 text-left"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300 font-display">
                {risk.disease}
              </span>
              <div className="flex items-center gap-1.5">
                {getTrendIcon(risk.trend)}
                <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${getRiskColor(risk.category)}`}>
                  {risk.category}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-semibold text-slate-500 tracking-wider font-mono">
                  Calculated Risk
                </span>
                <span className="text-2xl font-black font-mono text-slate-200 mt-0.5">
                  {risk.percentage}%
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase font-semibold text-slate-500 tracking-wider font-mono">
                  Confidence
                </span>
                <span className="text-sm font-bold font-mono text-slate-400 mt-1">
                  {risk.confidence}%
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed font-sans pt-2 border-t border-slate-950/40">
              {risk.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default InsightsPanel;
