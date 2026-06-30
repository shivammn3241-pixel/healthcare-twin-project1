import React, { useEffect, useRef, useState } from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  Activity, Heart, Droplet, Thermometer, Zap, Wind, ShieldAlert, 
  Apple, Syringe, Terminal, Sliders, Play, Pause, RefreshCw 
} from 'lucide-react';

export const ClinicalDashboard: React.FC = () => {
  const { 
    vitals, 
    sliders, 
    setSliders, 
    currentScenario, 
    setScenario, 
    administerMeal, 
    administerDrug, 
    logs, 
    history, 
    alarms, 
    setAlarms, 
    alarmMuted, 
    setAlarmMuted 
  } = useHealthTwin();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Local ECG rendering indexes
  const ecgIndexRef = useRef<number>(0);
  const ecgSweepIndexRef = useRef<number>(0);
  const hrBufferRef = useRef<number[]>(Array(250).fill(0));

  // --- EAT / RX Interventions State ---
  const [selectedMeal, setSelectedMeal] = useState<'donut' | 'oats' | 'keto'>('donut');
  const [selectedDrug, setSelectedDrug] = useState<'metoprolol' | 'lisinopril' | 'metformin' | 'insulin'>('metoprolol');

  // --- ECG Mathematical Formula (from app.js) ---
  const getECGValue = (phase: number, hr: number) => {
    if (currentScenario === 'vtach') {
      return 0.85 * Math.sin(phase * 2 * Math.PI) + 0.15 * Math.sin(phase * 4 * Math.PI);
    }

    const period = 60 / hr;
    const prDuration = 0.15;
    const qrsDuration = 0.08;
    const qtDuration = 0.4 * Math.sqrt(period);

    const wPR = prDuration / period;
    const wQRS = qrsDuration / period;
    const wQT = qtDuration / period;

    const pStart = 0.05;
    const pEnd = pStart + 0.1;
    const qrsStart = pEnd + wPR * 0.5;
    const rPeak = qrsStart + wQRS * 0.4;
    const sDip = qrsStart + wQRS;
    const tStart = sDip + (wQT - wQRS) * 0.2;
    const tEnd = sDip + wQT;

    if (phase >= pStart && phase < pEnd) {
      const t = (phase - pStart) / (pEnd - pStart);
      return 0.12 * Math.sin(t * Math.PI);
    }
    if (phase >= qrsStart && phase < rPeak) {
      const t = (phase - qrsStart) / (rPeak - qrsStart);
      return -0.15 + t * 1.15;
    }
    if (phase >= rPeak && phase < sDip) {
      const t = (phase - rPeak) / (sDip - rPeak);
      return 1.0 - t * 1.35;
    }
    if (phase >= tStart && phase < tEnd) {
      const t = (phase - tStart) / (tEnd - tStart);
      return 0.22 * Math.sin(t * Math.PI);
    }
    return 0.0;
  };

  // Canvas drawing loop
  useEffect(() => {
    let lastEcgTimestamp = 0;

    const drawLiveECG = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationRef.current = requestAnimationFrame(drawLiveECG);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animationRef.current = requestAnimationFrame(drawLiveECG);
        return;
      }

      if (!lastEcgTimestamp) lastEcgTimestamp = timestamp;
      const delta = timestamp - lastEcgTimestamp;
      lastEcgTimestamp = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Draw ECG clinical millivolt grids (pink paper mesh)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.03)';
      for (let x = 0; x < canvas.width; x += 8) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 8) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.09)';
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // 2. Compute samples & write wave buffer values
      const samplesPerSecond = 160;
      const pointsToDraw = Math.round((delta / 1000) * samplesPerSecond);
      
      if (pointsToDraw > 0) {
        for (let step = 0; step < Math.min(pointsToDraw, 15); step++) {
          const beatsPerSecond = vitals.hr / 60;
          const phaseChange = beatsPerSecond / samplesPerSecond;
          ecgIndexRef.current = (ecgIndexRef.current + phaseChange) % 1.0;

          const rrHz = vitals.rr / 60;
          const baselineWander = 0.07 * Math.sin(Date.now() * 0.001 * 2 * Math.PI * rrHz);
          const sensorNoise = (Math.random() - 0.5) * 0.03;
          const cleanVal = getECGValue(ecgIndexRef.current, vitals.hr);

          hrBufferRef.current[ecgSweepIndexRef.current] = cleanVal + baselineWander + sensorNoise;
          ecgSweepIndexRef.current = (ecgSweepIndexRef.current + 1) % hrBufferRef.current.length;
        }
      }

      // 3. Draw sweeping monitor trace with blanking gap
      ctx.strokeStyle = currentScenario === 'vtach' ? '#ef4444' : '#10b981';
      ctx.lineWidth = 2.0;
      ctx.shadowColor = currentScenario === 'vtach' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)';
      ctx.shadowBlur = 6;

      ctx.beginPath();
      const stepWidth = canvas.width / (hrBufferRef.current.length - 1);
      const midY = canvas.height / 2;
      const gapSize = 16;

      let firstPoint = true;
      for (let i = 0; i < hrBufferRef.current.length; i++) {
        let inGap = false;
        const sweepIdx = ecgSweepIndexRef.current;
        if (sweepIdx + gapSize < hrBufferRef.current.length) {
          if (i >= sweepIdx && i < sweepIdx + gapSize) inGap = true;
        } else {
          if (i >= sweepIdx || i < (sweepIdx + gapSize) % hrBufferRef.current.length) inGap = true;
        }

        if (inGap) {
          firstPoint = true;
          continue;
        }

        const x = i * stepWidth;
        const val = hrBufferRef.current[i];
        const y = midY - (val * (canvas.height * 0.35));

        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw trace head lead circle
      const currentSweepX = ecgSweepIndexRef.current * stepWidth;
      const lastIndex = (ecgSweepIndexRef.current - 1 + hrBufferRef.current.length) % hrBufferRef.current.length;
      const currentVal = hrBufferRef.current[lastIndex];
      const currentY = midY - (currentVal * (canvas.height * 0.35));

      ctx.fillStyle = currentScenario === 'vtach' ? '#ef4444' : '#10b981';
      ctx.beginPath();
      ctx.arc(currentSweepX, currentY, 3.5, 0, 2 * Math.PI);
      ctx.fill();

      animationRef.current = requestAnimationFrame(drawLiveECG);
    };

    animationRef.current = requestAnimationFrame(drawLiveECG);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [vitals.hr, currentScenario]);

  // Handle resizing of canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.parentElement?.clientWidth || canvas.width;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format Recharts historical trend lines
  const chartData = history.hr.map((hr, idx) => ({
    time: history.timeLabels[idx] || '',
    heartRate: hr,
    sysBP: history.bpSys[idx],
    diaBP: history.bpDia[idx],
    glucose: history.cgm[idx],
    oxygen: history.spo2[idx],
    health: history.healthScore[idx],
  }));

  // Render sleep analysis mock static data for Recharts BarChart
  const sleepData = [
    { name: 'Mon', Deep: 2.1, REM: 1.8, Light: 4.1 },
    { name: 'Tue', Deep: 1.9, REM: 1.5, Light: 3.8 },
    { name: 'Wed', Deep: 2.4, REM: 2.0, Light: 4.3 },
    { name: 'Thu', Deep: 1.5, REM: 1.2, Light: 3.2 },
    { name: 'Fri', Deep: 2.2, REM: 1.9, Light: 4.0 },
    { name: 'Sat', Deep: 2.8, REM: 2.3, Light: 4.6 },
    { name: 'Sun', Deep: 2.5, REM: 2.1, Light: 4.4 },
  ];

  // Render weekly activity steps bar charts
  const activityData = [
    { name: 'Mon', Steps: 5400, Calories: 1840 },
    { name: 'Tue', Steps: 7200, Calories: 2100 },
    { name: 'Wed', Steps: 4200, Calories: 1420 },
    { name: 'Thu', Steps: 6100, Calories: 1910 },
    { name: 'Fri', Steps: 8500, Calories: 2320 },
    { name: 'Sat', Steps: 10400, Calories: 2600 },
    { name: 'Sun', Steps: 9500, Calories: 2450 },
  ];

  const getAlertBorder = (val: number, min: number, max: number) => {
    return (val < min || val > max) ? 'border-rose-500 bg-rose-500/5 vital-alert-state' : 'border-slate-800 bg-slate-900/40';
  };

  return (
    <div className="flex flex-col gap-6 p-6 select-none max-w-[1600px] mx-auto w-full">
      
      {/* 1. Master vitals textual summaries */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Heart Rate */}
        <div className={`p-4 border rounded-2xl flex flex-col items-start gap-1 backdrop-blur-xl ${getAlertBorder(vitals.hr, alarms.hr.min, alarms.hr.max)}`}>
          <div className="flex items-center justify-between w-full text-slate-400 text-xs">
            <span className="font-mono">Heart Rate</span>
            <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <span className="text-3xl font-black font-mono text-slate-100 tracking-tight mt-2">{vitals.hr}</span>
          <span className="text-[10px] text-slate-500 font-mono">BPM (Ref: {alarms.hr.min}-{alarms.hr.max})</span>
        </div>

        {/* Blood Pressure */}
        <div className={`p-4 border rounded-2xl flex flex-col items-start gap-1 backdrop-blur-xl ${getAlertBorder(vitals.bpSys, alarms.bpSys.min, alarms.bpSys.max)}`}>
          <div className="flex items-center justify-between w-full text-slate-400 text-xs">
            <span className="font-mono">Blood Pressure</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-3xl font-black font-mono text-slate-100 tracking-tight mt-2">{vitals.bpSys}/{vitals.bpDia}</span>
          <span className="text-[10px] text-slate-500 font-mono">mmHg (Ref: {alarms.bpSys.min}-{alarms.bpSys.max})</span>
        </div>

        {/* Glucose */}
        <div className={`p-4 border rounded-2xl flex flex-col items-start gap-1 backdrop-blur-xl ${getAlertBorder(vitals.cgm, alarms.cgm.min, alarms.cgm.max)}`}>
          <div className="flex items-center justify-between w-full text-slate-400 text-xs">
            <span className="font-mono">Glucose (CGM)</span>
            <Droplet className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-3xl font-black font-mono text-slate-100 tracking-tight mt-2">{vitals.cgm}</span>
          <span className="text-[10px] text-slate-500 font-mono">mg/dL (Ref: {alarms.cgm.min}-{alarms.cgm.max})</span>
        </div>

        {/* SpO2 */}
        <div className={`p-4 border rounded-2xl flex flex-col items-start gap-1 backdrop-blur-xl ${getAlertBorder(vitals.spo2, alarms.spo2.min, alarms.spo2.max)}`}>
          <div className="flex items-center justify-between w-full text-slate-400 text-xs">
            <span className="font-mono">Blood Oxygen</span>
            <Wind className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-black font-mono text-slate-100 tracking-tight mt-2">{vitals.spo2}%</span>
          <span className="text-[10px] text-slate-500 font-mono">SpO2 (Ref: &gt;{alarms.spo2.min}%)</span>
        </div>

        {/* Respiration & Temperature */}
        <div className={`p-4 border rounded-2xl flex flex-col items-start gap-1 backdrop-blur-xl border-slate-800 bg-slate-900/40`}>
          <div className="flex items-center justify-between w-full text-slate-400 text-xs">
            <span className="font-mono">Respiration</span>
            <Thermometer className="w-4 h-4 text-yellow-500" />
          </div>
          <span className="text-3xl font-black font-mono text-slate-100 tracking-tight mt-2">{vitals.rr}</span>
          <span className="text-[10px] text-slate-500 font-mono">RPM (Ref: 12-16)</span>
        </div>
      </div>

      {/* 2. Middle Grid: Sweep ECG & Sliders Controls */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Canvas Sweep ECG */}
        <div className="lg:col-span-8 glass-panel p-5 flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider font-display">Live Sweeping ECG Waveform</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-500">Grid: 1mm/mv</span>
              <button 
                onClick={() => setAlarmMuted(!alarmMuted)}
                className={`flex items-center gap-1.5 px-3 py-1 border rounded-lg text-[10px] font-mono hover:bg-slate-900 ${
                  alarmMuted ? 'border-rose-500/20 text-rose-400 bg-rose-500/5' : 'border-slate-800 text-slate-400'
                }`}
              >
                <span>{alarmMuted ? 'Muted Alarms' : 'Audible'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 w-full bg-slate-950/70 border border-slate-900/80 rounded-xl overflow-hidden min-h-[180px] flex items-center justify-center p-1.5">
            <canvas ref={canvasRef} height={180} className="w-full h-full block bg-slate-950" />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-3">
            <span>Sweep speed: 25 mm/s</span>
            <span>Diagnostic filter: LPF 40Hz</span>
            <span className={currentScenario === 'vtach' ? 'text-rose-500 font-bold' : 'text-slate-500'}>
              Vitals Baseline: {currentScenario.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Right Column: Physiological parameters sliders */}
        <div className="lg:col-span-4 glass-panel p-5 flex flex-col text-left">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-900 mb-4 text-slate-300">
            <Sliders className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold uppercase tracking-wider font-display">What-If Physiological Inputs</span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Sleep Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>Daily Circadian Sleep</span>
                <span className="text-violet-400 font-bold">{sliders.sleep} hrs</span>
              </div>
              <input
                type="range" min="4" max="10" step="0.5"
                value={sliders.sleep}
                onChange={(e) => setSliders(prev => ({ ...prev, sleep: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-slate-800 accent-violet-500 rounded-lg cursor-pointer"
              />
            </div>

            {/* Hydration Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>Intracellular Hydration</span>
                <span className="text-violet-400 font-bold">{sliders.hydration} L</span>
              </div>
              <input
                type="range" min="1" max="4.5" step="0.1"
                value={sliders.hydration}
                onChange={(e) => setSliders(prev => ({ ...prev, hydration: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-slate-800 accent-violet-500 rounded-lg cursor-pointer"
              />
            </div>

            {/* Activity Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>Cardio Duration</span>
                <span className="text-violet-400 font-bold">{sliders.activity} mins</span>
              </div>
              <input
                type="range" min="0" max="180" step="5"
                value={sliders.activity}
                onChange={(e) => setSliders(prev => ({ ...prev, activity: parseInt(e.target.value) }))}
                className="w-full h-1 bg-slate-800 accent-violet-500 rounded-lg cursor-pointer"
              />
            </div>

            {/* Stress Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>Environmental Stress</span>
                <span className="text-violet-400 font-bold">
                  {sliders.stress === 3 ? 'High Critical' : sliders.stress === 2 ? 'Moderate' : 'Optimal'}
                </span>
              </div>
              <input
                type="range" min="1" max="3" step="1"
                value={sliders.stress}
                onChange={(e) => setSliders(prev => ({ ...prev, stress: parseInt(e.target.value) }))}
                className="w-full h-1 bg-slate-800 accent-violet-500 rounded-lg cursor-pointer"
              />
            </div>

            {/* Adherence Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>Prescription Adherence</span>
                <span className="text-violet-400 font-bold">{sliders.adherence}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="5"
                value={sliders.adherence}
                onChange={(e) => setSliders(prev => ({ ...prev, adherence: parseInt(e.target.value) }))}
                className="w-full h-1 bg-slate-800 accent-violet-500 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Grid: Scenario Toggles, Interventions & Live Console logs */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Toggles and Interventions */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Baseline scenario selectors */}
          <div className="glass-panel p-5 flex flex-col text-left">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest font-bold uppercase mb-3">
              Simulated Activity Baseline
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[
                { key: 'normal', label: 'Resting Normal' },
                { key: 'exercise', label: 'Intense Cardio' },
                { key: 'sleep', label: 'Deep Sleep' },
                { key: 'stress', label: 'Acute Stressor' }
              ].map((sc) => (
                <button
                  key={sc.key}
                  onClick={() => setScenario(sc.key)}
                  className={`py-2 px-3 border rounded-xl text-xs font-semibold font-mono tracking-wide transition-all ${
                    currentScenario === sc.key 
                      ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 shadow-md shadow-cyan-500/5' 
                      : 'border-slate-800 text-slate-300 hover:bg-slate-900/40'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>

            <span className="text-[10px] text-slate-500 font-mono tracking-widest font-bold uppercase mb-3 mt-5">
              Inject Clinical Emergencies
            </span>
            <div className="grid grid-cols-2 gap-3.5">
              <button
                onClick={() => setScenario('vtach')}
                className={`py-2.5 px-4 border rounded-xl text-xs font-semibold font-mono tracking-wide flex items-center justify-center gap-2 transition-all ${
                  currentScenario === 'vtach' 
                    ? 'border-rose-500 text-rose-500 bg-rose-500/15 shadow-md' 
                    : 'border-rose-500/20 text-rose-400 hover:bg-rose-500/5'
                }`}
              >
                <ShieldAlert className="w-4 h-4 animate-pulse" />
                <span>Ventricular Tachycardia</span>
              </button>
              <button
                onClick={() => setScenario('hypo')}
                className={`py-2.5 px-4 border rounded-xl text-xs font-semibold font-mono tracking-wide flex items-center justify-center gap-2 transition-all ${
                  currentScenario === 'hypo' 
                    ? 'border-rose-500 text-rose-500 bg-rose-500/15 shadow-md' 
                    : 'border-rose-500/20 text-rose-400 hover:bg-rose-500/5'
                }`}
              >
                <ShieldAlert className="w-4 h-4 animate-pulse" />
                <span>Glycemic Shock (Hypoglycemia)</span>
              </button>
            </div>
          </div>

          {/* Interventions (Eat / Rx dose) */}
          <div className="glass-panel p-5 grid sm:grid-cols-2 gap-5 text-left">
            {/* Meal selector */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-slate-500 font-mono tracking-widest font-bold uppercase">
                Metabolic Intervention
              </span>
              <div className="flex gap-2">
                <select
                  value={selectedMeal}
                  onChange={(e: any) => setSelectedMeal(e.target.value)}
                  className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                >
                  <option value="donut">Glazed Donut (Fast Carbs)</option>
                  <option value="oats">Oats & Fiber (Complex)</option>
                  <option value="keto">Keto Plate (Eggs & Fat)</option>
                </select>
                <button
                  onClick={() => administerMeal(selectedMeal)}
                  className="bg-slate-900 border border-slate-800 hover:border-cyan-400/30 hover:bg-cyan-500/5 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 text-slate-300"
                >
                  <Apple className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Eat</span>
                </button>
              </div>
            </div>

            {/* Drug administrator */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-slate-500 font-mono tracking-widest font-bold uppercase">
                Pharmacotherapy Rx Dose
              </span>
              <div className="flex gap-2">
                <select
                  value={selectedDrug}
                  onChange={(e: any) => setSelectedDrug(e.target.value)}
                  className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                >
                  <option value="metoprolol">Metoprolol (Beta-Blocker)</option>
                  <option value="lisinopril">Lisinopril (ACE Inhibitor)</option>
                  <option value="metformin">Metformin (Sensitizer)</option>
                  <option value="insulin">Humalog Insulin (4U bolus)</option>
                </select>
                <button
                  onClick={() => administerDrug(selectedDrug)}
                  className="bg-slate-900 border border-slate-800 hover:border-cyan-400/30 hover:bg-cyan-500/5 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 text-slate-300"
                >
                  <Syringe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dose Rx</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Console logs */}
        <div className="lg:col-span-4 glass-panel p-5 flex flex-col justify-between text-left min-h-[220px]">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-900 mb-3 text-slate-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider font-display">System Command logs</span>
          </div>

          <div className="flex-1 bg-slate-950/70 border border-slate-900/60 rounded-xl p-3 h-44 overflow-y-auto font-mono text-[10.5px] leading-relaxed flex flex-col gap-2">
            {logs.map((log, idx) => {
              let label = 'SYS';
              let color = 'text-slate-400';
              if (log.type === 'warn') { label = 'WARN'; color = 'text-amber-400'; }
              if (log.type === 'crit') { label = 'CRIT'; color = 'text-rose-500 font-bold'; }
              if (log.type === 'ai') { label = 'AI'; color = 'text-violet-400'; }

              return (
                <div key={idx} className="flex gap-2 text-left">
                  <span className="text-slate-600 flex-shrink-0">[{log.time}]</span>
                  <span className={`${color} flex-shrink-0`}>{label}:</span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Top-tier Clinical Recharts trends */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 text-left">
        
        {/* Heart Rate Trend area chart */}
        <div className="glass-panel p-5">
          <span className="text-xs font-bold uppercase tracking-wider font-display text-slate-400">Heart Rate Trend (BPM)</span>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -30, right: 10, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #1e293b', fontSize: 11 }} />
                <Area type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#f43f5e" fill="rgba(244,63,94,0.06)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Pressure Trend line chart */}
        <div className="glass-panel p-5">
          <span className="text-xs font-bold uppercase tracking-wider font-display text-slate-400">Blood Pressure (mmHg)</span>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: -30, right: 10, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={[40, 180]} />
                <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #1e293b', fontSize: 11 }} />
                <Line type="monotone" dataKey="sysBP" name="Systolic BP" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="diaBP" name="Diastolic BP" stroke="#38bdf8" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Continuous glucose CGM and health index */}
        <div className="glass-panel p-5 md:col-span-2 xl:col-span-1">
          <span className="text-xs font-bold uppercase tracking-wider font-display text-slate-400">Continuous Glucose Trend</span>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -30, right: 10, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #1e293b', fontSize: 11 }} />
                <Area type="monotone" dataKey="glucose" name="Glucose" stroke="#06b6d4" fill="rgba(6,182,212,0.06)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Analysis BarChart */}
        <div className="glass-panel p-5">
          <span className="text-xs font-bold uppercase tracking-wider font-display text-slate-400">Weekly Circadian Sleep (Hours)</span>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sleepData} margin={{ left: -30, right: 10, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #1e293b', fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Deep" stackId="a" fill="#4f46e5" />
                <Bar dataKey="REM" stackId="a" fill="#06b6d4" />
                <Bar dataKey="Light" stackId="a" fill="#64748b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly activity steps bar chart */}
        <div className="glass-panel p-5">
          <span className="text-xs font-bold uppercase tracking-wider font-display text-slate-400">Weekly Activity (Steps)</span>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ left: -20, right: 10, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #1e293b', fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar yAxisId="left" dataKey="Steps" fill="#10b981" />
                <Bar yAxisId="right" dataKey="Calories" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Index score trend */}
        <div className="glass-panel p-5 md:col-span-2 xl:col-span-1">
          <span className="text-xs font-bold uppercase tracking-wider font-display text-slate-400">Health Score Trend</span>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -30, right: 10, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #1e293b', fontSize: 11 }} />
                <Area type="monotone" dataKey="health" name="Health Score" stroke="#00f2fe" fill="rgba(0,242,254,0.06)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
export default ClinicalDashboard;
