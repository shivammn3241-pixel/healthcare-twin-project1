import React, { useState, useEffect } from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { OrganName } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, Activity as ActivityIcon } from 'lucide-react';

export const InteractiveBody: React.FC = () => {
  const { 
    vitals, 
    selectedOrgan, 
    setSelectedOrgan, 
    activePatient,
    currentScenario,
    sliders
  } = useHealthTwin();

  const [bodyType, setBodyType] = useState<'male' | 'female' | 'other'>('male');

  // Sync body type with active patient's gender
  useEffect(() => {
    if (activePatient?.gender) {
      const gender = activePatient.gender.toLowerCase();
      if (gender === 'female' || gender === 'girl') {
        setBodyType('female');
      } else if (gender === 'male' || gender === 'boy') {
        setBodyType('male');
      } else {
        setBodyType('other');
      }
    }
  }, [activePatient]);

  // Helper to determine organ color status
  const getOrganStatusColor = (organ: OrganName): string => {
    switch (organ) {
      case 'Brain':
        if (currentScenario === 'stress' || vitals.hrv < 25) return '#f59e0b'; // warning (orange)
        return '#a100ff'; // normal (purple)
      case 'Sleep':
        if (sliders.sleep < 6.0 || vitals.hrv < 30) return '#f59e0b'; // warning
        return '#3b82f6'; // info (blue)
      case 'Heart':
        if (currentScenario === 'vtach' || vitals.hr > 130 || vitals.hr < 45) return '#ef4444'; // critical (red)
        if (vitals.hr > 100 || vitals.hr < 55) return '#eab308'; // warning (yellow)
        return '#10b981'; // healthy (green)
      case 'Lungs':
        if (vitals.spo2 < 93) return '#ef4444';
        if (vitals.spo2 < 95) return '#f59e0b';
        return '#10b981';
      case 'BloodPressure':
        if (vitals.bpSys > 140 || vitals.bpSys < 90) return '#ef4444';
        if (vitals.bpSys > 125 || vitals.bpSys < 95) return '#f59e0b';
        return '#10b981';
      case 'Stress':
        if (currentScenario === 'stress' || vitals.gsr > 3.5) return '#ef4444';
        if (vitals.gsr > 2.2) return '#f59e0b';
        return '#10b981';
      case 'Hydration':
        if (sliders.hydration < 2.0 || vitals.gsr > 3.8) return '#f59e0b';
        return '#06b6d4'; // healthy (cyan)
      case 'Activity':
        if (vitals.steps < 4000) return '#f59e0b';
        return '#10b981';
      default:
        return '#00f2fe';
    }
  };

  const handleOrganClick = (organ: OrganName) => {
    setSelectedOrgan(selectedOrgan === organ ? null : organ);
  };

  // Determine vascular blood flow animation speed (based on Heart Rate)
  const getFlowDuration = () => {
    const hr = vitals.hr;
    if (hr > 120) return '6s';
    if (hr > 85) return '12s';
    if (hr < 55) return '26s';
    return '18s';
  };

  // Hologram active color themes
  const activeColor = bodyType === 'female' ? 'text-pink-400' : 'text-cyan-400';
  const neonStroke = bodyType === 'female' ? 'rgba(236, 72, 153, 0.4)' : 'rgba(6, 182, 212, 0.4)';
  const bodyFill = bodyType === 'female' ? 'rgba(236, 72, 153, 0.03)' : 'rgba(6, 182, 212, 0.03)';
  const glowShadow = bodyType === 'female' ? 'drop-shadow-[0_0_20px_rgba(236,72,153,0.25)]' : 'drop-shadow-[0_0_20px_rgba(6,182,212,0.25)]';

  // Clickable Organs nodes list
  const organsList: { name: OrganName; x: number; y: number; r: number; label: string }[] = [
    { name: 'Brain', x: 100, y: 45, r: 7.5, label: '🧠 Brain' },
    { name: 'Sleep', x: 107, y: 35, r: 5, label: '😴 Sleep' },
    { name: 'Heart', x: 90, y: 115, r: 8.5, label: '❤️ Heart' },
    { name: 'Lungs', x: 112, y: 106, r: 7.5, label: '🫁 Lungs' },
    { name: 'BloodPressure', x: 99, y: 130, r: 6, label: '🩸 Blood Pressure' },
    { name: 'Stress', x: 100, y: 156, r: 6.5, label: '🔥 Stress' },
    { name: 'Hydration', x: 92, y: 192, r: 6.5, label: '💧 Hydration' },
    { name: 'Activity', x: 84, y: 300, r: 6.5, label: '🦵 Activity' },
  ];

  return (
    <div className="relative flex flex-col items-center justify-between h-full w-full select-none py-5 px-4 bg-slate-950/20">
      
      {/* 1. Selector Bar at the top */}
      <div className="w-full max-w-sm flex items-center justify-between p-1 bg-slate-900/60 border border-slate-800/80 rounded-2xl mb-4 z-10">
        <button
          onClick={() => setBodyType('male')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            bodyType === 'male'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-md shadow-cyan-500/5'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Male</span>
        </button>
        <button
          onClick={() => setBodyType('female')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            bodyType === 'female'
              ? 'bg-pink-500/10 text-pink-400 border border-pink-500/25 shadow-md shadow-pink-500/5'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Female</span>
        </button>
        <button
          onClick={() => setBodyType('other')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            bodyType === 'other'
              ? 'bg-slate-800 text-slate-100 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Neutral</span>
        </button>
      </div>

      {/* 2. Visualizer Body Area */}
      <div className="flex-1 w-full flex items-center justify-center relative min-h-[440px]">
        {/* Ambient Grid overlay back-pattern */}
        <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-40"></div>

        {/* SVG Container */}
        <svg 
          className={`w-full max-w-[340px] md:max-w-[360px] h-[92%] max-h-[480px] transition-all duration-500 ${glowShadow}`}
          viewBox="0 0 200 450"
        >
          <defs>
            <linearGradient id="maleHolo" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.01" />
              <stop offset="60%" stopColor="#00f2fe" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.22" />
            </linearGradient>
            <linearGradient id="femaleHolo" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.01" />
              <stop offset="60%" stopColor="#ec4899" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#a100ff" stopOpacity="0.22" />
            </linearGradient>
            
            {/* Holographic Projection Light Cone Gradient */}
            <linearGradient id="projCone" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={bodyType === 'female' ? '#ec4899' : '#00f2fe'} stopOpacity="0.1" />
              <stop offset="40%" stopColor={bodyType === 'female' ? '#ec4899' : '#00f2fe'} stopOpacity="0.03" />
              <stop offset="100%" stopColor={bodyType === 'female' ? '#ec4899' : '#00f2fe'} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Holographic Standing Scanner base under the feet */}
          <g transform="translate(100, 420)" opacity="0.8">
            <ellipse cx="0" cy="5" rx="55" ry="12" fill="none" stroke={neonStroke} strokeWidth="1" strokeDasharray="3,8" className="animate-spin" style={{ animationDuration: '30s' }} />
            <ellipse cx="0" cy="5" rx="42" ry="9" fill="none" stroke={neonStroke} strokeWidth="1.5" />
            <ellipse cx="0" cy="5" rx="28" ry="6" fill={`${bodyType === 'female' ? '#ec4899' : '#00f2fe'}`} opacity="0.12" />
          </g>

          {/* Holographic Projection Light Cone */}
          <polygon points="50,420 100,30 150,420" fill="url(#projCone)" opacity="0.6" pointerEvents="none" />

          {/* Animate entire body container floating (Framer Motion) */}
          <motion.g
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            
            {/* Morph/Fade Body Silhouettes (Cross-fading transition) */}
            <AnimatePresence>
              {bodyType === 'male' && (
                <motion.path
                  key="male-body"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: [1, 1.012, 1] }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ 
                    opacity: { duration: 0.4 },
                    scale: { repeat: Infinity, duration: 8, ease: "easeInOut" }
                  }}
                  d="
                    M 100, 16 
                    C 107, 16 112, 21 112, 30 C 112, 40 106, 50 100, 50 C 94, 50 88, 40 88, 30 C 88, 21 93, 16 100, 16 Z
                    M 96, 50 L 104, 50 L 106, 68 L 94, 68 Z
                    M 94, 68 L 65, 75 C 55, 78 50, 92 48, 105 C 46, 118 47, 130 50, 142 L 53, 165 C 55, 178 59, 185 64, 185 L 68, 185 L 70, 245 L 68, 305 L 76, 365 L 75, 415 L 94, 415 L 98, 335 L 100, 220 L 102, 335 L 106, 415 L 125, 415 L 124, 365 L 132, 305 L 130, 245 L 132, 185 L 136, 185 C 141, 185 145, 178 147, 165 L 150, 142 C 153, 130 154, 118 152, 105 C 150, 92 145, 78 135, 75 L 106, 68 Z
                    M 48, 105 L 30, 160 L 22, 210 C 20, 220 25, 225 32, 222 L 40, 180 L 51, 135 Z
                    M 152, 105 L 170, 160 L 178, 210 C 180, 220 175, 225 168, 222 L 160, 180 L 149, 135 Z
                  "
                  fill="url(#maleHolo)"
                  stroke={neonStroke}
                  strokeWidth="1.5"
                  className="transition-colors duration-500"
                />
              )}

              {bodyType === 'female' && (
                <motion.path
                  key="female-body"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: [1, 1.012, 1] }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ 
                    opacity: { duration: 0.4 },
                    scale: { repeat: Infinity, duration: 8, ease: "easeInOut" }
                  }}
                  d="
                    M 100, 18 
                    C 106, 18 110, 22 110, 30 C 110, 38 106, 46 100, 46 C 94, 46 90, 38 90, 30 C 90, 22 94, 18 100, 18 Z
                    M 96, 46 L 104, 46 L 105, 66 L 95, 66 Z
                    M 95, 66 L 70, 72 C 60, 75 54, 88 52, 100 C 50, 112 51, 128 56, 140 C 60, 150 63, 162 58, 175 C 54, 185 58, 205 68, 220 L 71, 260 L 69, 310 L 76, 365 L 75, 415 L 94, 415 L 98, 335 L 100, 220 L 102, 335 L 106, 415 L 125, 415 L 124, 365 L 131, 310 L 129, 260 L 132, 220 C 142, 205 146, 185 142, 175 C 137, 162 140, 150 144, 140 C 149, 128 150, 112 148, 100 C 146, 88 140, 75 130, 72 L 105, 66 Z
                    M 52, 100 L 36, 155 L 26, 205 C 24, 215 29, 220 36, 217 L 44, 175 L 53, 130 Z
                    M 148, 100 L 164, 155 L 174, 205 C 176, 215 171, 220 164, 217 L 156, 175 L 147, 130 Z
                  "
                  fill="url(#femaleHolo)"
                  stroke={neonStroke}
                  strokeWidth="1.5"
                  className="transition-colors duration-500"
                />
              )}

              {bodyType === 'other' && (
                <motion.path
                  key="other-body"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: [1, 1.012, 1] }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ 
                    opacity: { duration: 0.4 },
                    scale: { repeat: Infinity, duration: 8, ease: "easeInOut" }
                  }}
                  d="
                    M 100, 18 
                    C 106, 18 111, 23 111, 31 C 111, 39 106, 48 100, 48 C 94, 48 89, 39 89, 31 C 89, 23 94, 18 100, 18 Z
                    M 96, 48 L 104, 48 L 105, 66 L 95, 66 Z
                    M 95, 66 L 68, 73 C 58, 76 52, 90 50, 102 C 48, 115 49, 130 53, 142 L 56, 168 C 58, 180 61, 188 66, 188 L 68, 188 L 70, 248 L 68, 308 L 76, 368 L 75, 415 L 94, 415 L 98, 335 L 100, 220 L 102, 335 L 106, 415 L 125, 415 L 124, 368 L 132, 308 L 130, 248 L 132, 188 L 134, 188 C 139, 188 142, 180 144, 168 L 147, 142 C 151, 130 152, 115 150, 102 C 148, 90 142, 76 132, 73 L 105, 66 Z
                    M 50, 102 L 33, 158 L 24, 208 C 22, 218 27, 223 34, 220 L 42, 178 L 52, 133 Z
                    M 150, 102 L 167, 158 L 176, 208 C 178, 218 173, 223 166, 220 L 158, 178 L 148, 133 Z
                  "
                  fill="url(#maleHolo)"
                  stroke={neonStroke}
                  strokeWidth="1.5"
                  className="transition-colors duration-500"
                />
              )}
            </AnimatePresence>

            {/* Moving Laser Scanner Line */}
            <motion.line
              x1="45"
              x2="155"
              stroke={bodyType === 'female' ? 'rgba(236, 72, 153, 0.8)' : 'rgba(6, 182, 212, 0.8)'}
              strokeWidth="1.2"
              animate={{ y1: [40, 420, 40], y2: [40, 420, 40] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
              style={{ filter: `drop-shadow(0 0 5px ${bodyType === 'female' ? '#ec4899' : '#00f2fe'})` }}
            />

            {/* Vascular flow networks */}
            <path className="arteries-flow" d="M 100,115 C 92,118 94,140 100,150 L 100,230 L 88,340 L 84,420 M 100,230 L 112,340 L 116,420" fill="none" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1" style={{ animationDuration: getFlowDuration() }} />
            <path className="veins-flow" d="M 98,115 C 104,116 102,138 98,148 L 97,228 L 86,338 L 82,418 M 97,228 L 109,338 L 113,418" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1" style={{ animationDuration: getFlowDuration() }} />

            {/* Interactive pulsing indicators */}
            {organsList.map((organ) => {
              const organColor = getOrganStatusColor(organ.name);
              const isSelected = selectedOrgan === organ.name;

              return (
                <g 
                  key={organ.name}
                  onClick={() => handleOrganClick(organ.name)}
                  className="cursor-pointer"
                >
                  {/* Concentric Halo Ring 1 */}
                  <circle 
                    className="organ-pulse" 
                    cx={organ.x} 
                    cy={organ.y} 
                    r={organ.r * 2.2} 
                    fill="none" 
                    stroke={organColor} 
                    strokeWidth="0.8" 
                    opacity={isSelected ? 0.8 : 0.3}
                  />

                  {/* Concentric Halo Ring 2 (Staggered Radar Ripple) */}
                  <circle 
                    className="organ-pulse" 
                    cx={organ.x} 
                    cy={organ.y} 
                    r={organ.r * 2.2} 
                    fill="none" 
                    stroke={organColor} 
                    strokeWidth="0.5" 
                    opacity={isSelected ? 0.5 : 0.15}
                    style={{ animationDelay: '1.25s' }}
                  />
                  
                  {/* Center backing glow */}
                  <circle 
                    cx={organ.x} 
                    cy={organ.y} 
                    r={organ.r * 1.3} 
                    fill={organColor} 
                    opacity={isSelected ? 0.3 : 0.08}
                  />

                  {/* Pulsing core dot */}
                  <motion.circle 
                    cx={organ.x} 
                    cy={organ.y} 
                    r={isSelected ? organ.r * 0.65 : organ.r * 0.5} 
                    fill={organColor}
                    animate={organ.name === 'Heart' ? { 
                      scale: [1, 1.25, 1, 1.25, 1] 
                    } : isSelected ? { 
                      scale: [1, 1.2, 1] 
                    } : {}}
                    transition={organ.name === 'Heart' ? {
                      repeat: Infinity,
                      duration: 60 / vitals.hr, // match heartbeat speed in seconds!
                      ease: "easeInOut"
                    } : isSelected ? {
                      repeat: Infinity,
                      duration: 1.5
                    } : {}}
                    style={{ filter: `drop-shadow(0 0 6px ${organColor})` }}
                  />
                </g>
              );
            })}
          </motion.g>
        </svg>
      </div>

      {/* 3. Footer indicator message */}
      <div className="w-full flex items-center justify-center gap-1.5 mt-2 text-[10px] text-slate-500 font-mono">
        <ActivityIcon className={`w-3 h-3 ${activeColor}`} />
        <span>Holographic projection adjusts indices based on physical markers.</span>
      </div>

    </div>
  );
};
export default InteractiveBody;
