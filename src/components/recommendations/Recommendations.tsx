import React from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { Compass, CheckCircle2, Circle, Flame, Droplet, Moon, Apple, Zap } from 'lucide-react';

export const Recommendations: React.FC = () => {
  const { recommendations, toggleRecommendation, healthScore } = useHealthTwin();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Fitness': return <Flame className="w-4 h-4 text-rose-400" />;
      case 'Hydration': return <Droplet className="w-4 h-4 text-cyan-400" />;
      case 'Sleep': return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'Nutrition': return <Apple className="w-4 h-4 text-amber-400" />;
      default: return <Zap className="w-4 h-4 text-violet-400" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Fitness': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Hydration': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Sleep': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Nutrition': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 select-none max-w-[1200px] mx-auto w-full text-left">
      
      {/* View Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-900">
        <div className="flex flex-col">
          <h2 className="text-xl font-black font-display uppercase tracking-wide text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            AI Lifestyle Interventions
          </h2>
          <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">
            Personalized protocols to improve physiological health markers
          </span>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 border rounded-xl border-cyan-500/10 bg-cyan-500/5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Simulated Health Boost:</span>
          <span className="text-lg font-black font-mono text-cyan-400">{healthScore} / 100</span>
        </div>
      </div>

      {/* Top Banner explaining mechanism */}
      <div className="p-4 border border-slate-800 bg-slate-900/20 rounded-2xl flex flex-col gap-1.5 leading-relaxed text-slate-400 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Clinical Guidance Protocol</span>
        <p>
          Selecting and completing the following clinical interventions will directly modulate the physiological model variables, reducing sympathetic stressors and providing a positive feedback index to the patient’s calculated homeostatic health index.
        </p>
      </div>

      {/* Recommendations card list */}
      <div className="grid md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div 
            key={rec.id}
            onClick={() => toggleRecommendation(rec.id)}
            className={`p-5 border rounded-2xl cursor-pointer flex gap-4 items-start transition-all select-none ${
              rec.completed 
                ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10' 
                : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            {/* Checkbox trigger indicator */}
            <div className="mt-0.5 flex-shrink-0">
              {rec.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Circle className="w-5 h-5 text-slate-500 hover:text-slate-400" />
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <div className="flex justify-between items-center gap-2 flex-wrap">
                <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 border rounded-full ${getCategoryBadge(rec.category)}`}>
                  {rec.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Goal: {rec.value}</span>
              </div>

              <h3 className={`text-sm font-bold leading-normal font-sans ${rec.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                {rec.text}
              </h3>
              
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1 font-mono">
                {getCategoryIcon(rec.category)}
                <span>Intervention Parameter Linked</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
export default Recommendations;
