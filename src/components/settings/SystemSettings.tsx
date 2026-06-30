import React, { useState } from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { Settings, ShieldAlert, Volume2, VolumeX, Eye, EyeOff, Save } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const { 
    alarms, 
    setAlarms, 
    alarmMuted, 
    setAlarmMuted, 
    addLog 
  } = useHealthTwin();

  // Local states for alert configurations input
  const [hrMin, setHrMin] = useState(alarms.hr.min);
  const [hrMax, setHrMax] = useState(alarms.hr.max);
  const [bpSysMin, setBpSysMin] = useState(alarms.bpSys.min);
  const [bpSysMax, setBpSysMax] = useState(alarms.bpSys.max);
  const [cgmMin, setCgmMin] = useState(alarms.cgm.min);
  const [cgmMax, setCgmMax] = useState(alarms.cgm.max);
  const [spo2Min, setSpo2Min] = useState(alarms.spo2.min);

  const [ambientGlow, setAmbientGlow] = useState(true);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAlarms({
      hr: { min: hrMin, max: hrMax },
      bpSys: { min: bpSysMin, max: bpSysMax },
      bpDia: alarms.bpDia,
      cgm: { min: cgmMin, max: cgmMax },
      spo2: { min: spo2Min, max: alarms.spo2.max },
      temp: alarms.temp
    });
    
    addLog('info', 'Clinical alert boundaries updated in system settings.');
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 select-none max-w-[900px] mx-auto w-full text-left">
      
      {/* View Header */}
      <div className="flex flex-col pb-3 border-b border-slate-900">
        <h2 className="text-xl font-black font-display uppercase tracking-wide text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          Twin Portal Configuration Settings
        </h2>
        <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">
          Configure clinical telemetry boundaries and ambient notifications
        </span>
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Alarms boundaries form */}
        <form onSubmit={handleSave} className="md:col-span-8 glass-panel p-5 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-900 text-slate-300">
            <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider font-display">Clinical Alarm Boundaries</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
            {/* Heart Rate Alert */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-bold">HR Minimum / Maximum (BPM)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={hrMin}
                  onChange={(e) => setHrMin(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 outline-none focus:border-cyan-500/40 text-center"
                />
                <span className="text-slate-600 self-center">-</span>
                <input
                  type="number"
                  value={hrMax}
                  onChange={(e) => setHrMax(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 outline-none focus:border-cyan-500/40 text-center"
                />
              </div>
            </div>

            {/* BP Systolic Alert */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-bold">SYS Blood Pressure Min/Max (mmHg)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bpSysMin}
                  onChange={(e) => setBpSysMin(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 outline-none focus:border-cyan-500/40 text-center"
                />
                <span className="text-slate-600 self-center">-</span>
                <input
                  type="number"
                  value={bpSysMax}
                  onChange={(e) => setBpSysMax(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 outline-none focus:border-cyan-500/40 text-center"
                />
              </div>
            </div>

            {/* CGM Alert */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-bold">Glucose CGM Min/Max (mg/dL)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={cgmMin}
                  onChange={(e) => setCgmMin(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 outline-none focus:border-cyan-500/40 text-center"
                />
                <span className="text-slate-600 self-center">-</span>
                <input
                  type="number"
                  value={cgmMax}
                  onChange={(e) => setCgmMax(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 outline-none focus:border-cyan-500/40 text-center"
                />
              </div>
            </div>

            {/* SpO2 Alert */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-bold">Oxygen Saturation Minimum (%)</label>
              <input
                type="number"
                value={spo2Min}
                onChange={(e) => setSpo2Min(parseInt(e.target.value) || 0)}
                className="w-max bg-slate-950/60 border border-slate-800 rounded-xl py-2 px-6 text-slate-200 outline-none focus:border-cyan-500/40 text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-max mt-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-cyan-500/10 flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{savedStatus ? 'Limits Applied!' : 'Apply Alert Ranges'}</span>
          </button>
        </form>

        {/* Right Column: Audio & UI Preferences */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Audio Synthesizer Toggle */}
          <div className="glass-panel p-5 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider font-display text-slate-400">
              Audible Telemetry Feedback
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-350">
                {alarmMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                <span>Beep sequence alert</span>
              </div>
              <button
                onClick={() => setAlarmMuted(!alarmMuted)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                  alarmMuted ? 'bg-slate-800' : 'bg-cyan-500'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform duration-200 ${
                  alarmMuted ? 'translate-x-0' : 'translate-x-6'
                }`} />
              </button>
            </div>
            <span className="text-[10px] text-slate-500 font-sans leading-normal">
              If active, a triple-pulse clinical warning frequency (980Hz) triggers when vital signs exceed thresholds.
            </span>
          </div>

          {/* UI Grid Ambient Toggles */}
          <div className="glass-panel p-5 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider font-display text-slate-400">
              Visual Preferences
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-350">
                {ambientGlow ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                <span>Ambient HUD glows</span>
              </div>
              <button
                onClick={() => setAmbientGlow(!ambientGlow)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                  ambientGlow ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform duration-200 ${
                  ambientGlow ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <span className="text-[10px] text-slate-500 font-sans leading-normal">
              Toggle graphical grid overlays and background particle glowing layers.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
export default SystemSettings;
