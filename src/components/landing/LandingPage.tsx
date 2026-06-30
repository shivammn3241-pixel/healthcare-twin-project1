import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Dna, 
  Heart, 
  ShieldCheck, 
  Zap, 
  ServerCrash 
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="bg-slate-950 text-slate-100 flex flex-col min-h-screen relative overflow-hidden bg-grid-dots">
      {/* Background cyber glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-indigo-600/5 to-transparent blur-[120px] pointer-events-none"></div>
      
      {/* 1. Header logo block */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-900 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Heart className="w-4.5 h-4.5 text-slate-950" />
          </div>
          <span className="text-md font-black tracking-widest uppercase bg-gradient-to-r from-cyan-400 to-indigo-200 bg-clip-text text-transparent">
            HealthTwin AI
          </span>
        </div>
        <button
          onClick={onGetStarted}
          className="px-5 py-2 text-xs font-bold font-mono tracking-widest text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/5 rounded-full transition-all duration-200"
        >
          Clinical Portal Sign-In
        </button>
      </nav>

      {/* 2. Hero Section */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-8 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero text content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col text-left"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-cyan-500/25 bg-cyan-500/5 text-cyan-400 rounded-full text-xs font-mono tracking-wider w-max mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bio-Simulation AI Modeling</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-100 leading-tight"
            >
              Next-Generation Healthcare <br/>
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Digital Twins
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed font-sans max-w-2xl"
            >
              Integrating Wearable Sensing, Artificial Intelligence, and Predictive Modeling for Precision Medicine. Simulate metabolic variables and preview physiological states in real-time.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold rounded-2xl shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all group"
              >
                <span>Initialize Dynamic Twin</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#features"
                className="px-8 py-4 bg-slate-900 border border-slate-800/80 hover:bg-slate-900/60 font-semibold rounded-2xl flex items-center justify-center transition-all text-slate-300"
              >
                Research Specifications
              </a>
            </motion.div>
          </motion.div>

          {/* Hero anatomical wireframe illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-5 flex justify-center items-center relative"
          >
            {/* Pulsing glow behind silhouette */}
            <div className="absolute w-72 h-72 rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none animate-pulse-slow"></div>

            <svg className="w-full max-w-[320px] h-auto filter drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]" viewBox="0 0 200 450">
              <defs>
                <linearGradient id="landingGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a100ff" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <g>
                {/* HUD Scan lines */}
                <circle cx="100" cy="115" r="70" fill="none" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="0.8" strokeDasharray="4, 10" />
                <circle cx="100" cy="115" r="45" fill="none" stroke="rgba(161, 0, 255, 0.08)" strokeWidth="0.5" />
                <line x1="100" y1="20" x2="100" y2="430" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="5,5" />
                
                {/* Torso outline */}
                <path 
                  d="M100,20 C112,20 122,30 122,45 C122,60 112,65 100,65 C88,65 78,60 78,45 C78,30 88,20 100,20 Z M95,65 L105,65 L108,78 L92,78 Z M92,78 L65,85 L50,110 L52,125 L72,110 L75,185 L125,185 L128,110 L148,125 L150,110 L135,85 L108,78 Z M75,185 L68,230 L85,340 L80,430 L95,430 L100,340 L105,430 L120,430 L115,340 L132,230 L125,185 Z M50,110 L30,170 L15,225 L25,225 L38,175 L52,125 Z M150,110 L170,170 L185,225 L175,225 L162,175 L148,125 Z" 
                  fill="url(#landingGlow)" 
                  stroke="rgba(0, 242, 254, 0.2)" 
                  strokeWidth="1.2"
                />

                {/* Vascular paths */}
                <path className="arteries-flow" d="M 100,115 C 92,118 94,140 100,150 L 100,230 L 88,340 L 84,420 M 100,230 L 112,340 L 116,420 M 100,115 Q 115,108 124,115 M 100,85 L 94,65 L 95,45" fill="none" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="1" />
                <path className="veins-flow" d="M 98,115 C 104,116 102,138 98,148 L 97,228 L 86,338 L 82,418 M 97,228 L 109,338 L 113,418 M 98,115 Q 83,109 76,115 M 98,85 L 104,65 L 103,45" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" />

                {/* Pulsing Organ dots */}
                <circle cx="100" cy="45" r="5" fill="#a100ff" className="animate-pulse" />
                <circle cx="90" cy="115" r="5.5" fill="#ef4444" className="animate-pulse" />
                <circle cx="112" cy="106" r="4.5" fill="#10b981" />
                <circle cx="100" cy="165" r="4.5" fill="#22d3ee" />
                <circle cx="92" cy="192" r="4" fill="#f59e0b" />
              </g>
            </svg>

            {/* Glowing tech HUD data callout tag */}
            <div className="absolute top-2/3 right-0 bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-[10px] font-mono shadow-md backdrop-blur-sm pointer-events-none select-none">
              <span className="text-cyan-400 block font-bold">ORGANIC ALIGNMENT</span>
              <span className="text-slate-400">Homeostatic Ratio: 98.4%</span>
              <span className="text-slate-500 block mt-1">Simulation Stream: STABLE</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* 3. Features Section */}
      <section id="features" className="py-20 border-t border-slate-900 bg-slate-950/60 relative">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-slate-100 uppercase tracking-wide">
              Advanced Twin Specifications
            </h2>
            <p className="text-sm text-slate-400 font-mono mt-2">
              Clinically verified telemetry loops mapped via deep physiological simulation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 flex flex-col items-start text-left">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-display">Real-Time Telemetry</h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                Stream simulated cardiovascular and metabolic vitals including heart rate, BP, and blood glucose, responding in seconds to stress and workout baselines.
              </p>
            </div>

            <div className="glass-panel p-6 flex flex-col items-start text-left">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-5">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-display">AI Predictive Risk</h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                Continuously compute disease probabilities for diabetes, coronary heart conditions, and hypertension based on historical data and lifestyle inputs.
              </p>
            </div>

            <div className="glass-panel p-6 flex flex-col items-start text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-display">What-If Interventions</h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                Inject virtual drugs (Beta-Blockers, ACE Inhibitors, Insulin) or meals to observe physiological impact, tracking biochemical responses inside simulated organs.
              </p>
            </div>

            <div className="glass-panel p-6 flex flex-col items-start text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                <Dna className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-display">PGx Safety Monitoring</h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                Verify drug metabolism rates based on genetic genotypes (like CYP2D6 Poor Metabolizer) to prevent adverse reactions and adjust pharmacotherapy parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. About Healthcare Digital Twin */}
      <section className="py-20 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-4xl mx-auto px-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 uppercase tracking-wide">
            Precision Medicine Framework
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed text-sm max-w-2xl">
            A digital twin represents an in-silico replication of a patient’s biochemistry, organs, and dynamic vital signs. By connecting real-time wearable telemetry and pharmacokinetics databases, physicians can run predictive what-if trials to adjust clinical prescriptions safely prior to real-world administration.
          </p>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="py-8 border-t border-slate-900 bg-slate-950 font-mono text-[10px] text-slate-600 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>HealthTwin AI © 2026. HIPAA Compliant Telemetry Protocol.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Security Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Clinical Standards</span>
            <span className="hover:text-slate-400 cursor-pointer">Developer API</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
