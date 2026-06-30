import React from 'react';
import { useHealthTwin } from '../../context/HealthTwinContext';
import { OrganName } from '../../types';
import { X, Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip } from 'recharts';

export const OrganDetailModal: React.FC = () => {
  const { 
    selectedOrgan, 
    setSelectedOrgan, 
    vitals, 
    history, 
    activePatient,
    currentScenario,
    sliders,
    alarms
  } = useHealthTwin();

  if (!selectedOrgan) return null;

  // Determine diagnostic indicators and recommendations based on selected organ
  const getOrganDetails = (organ: OrganName) => {
    switch (organ) {
      case 'Brain': {
        const stressLevel = currentScenario === 'stress' ? 'Severe Stress' : vitals.hrv < 25 ? 'Moderate Strain' : 'Relaxed Baseline';
        const isAlert = stressLevel !== 'Relaxed Baseline';
        return {
          title: 'Central Nervous System',
          status: stressLevel,
          statusType: isAlert ? 'warning' : 'healthy',
          colorClass: 'border-indigo-500 text-indigo-400 bg-indigo-500/10',
          vitalsList: [
            { name: 'Heart Rate Variability', val: `${vitals.hrv} ms`, ref: '>40 ms' },
            { name: 'Autonomic Sympathovagal Drive', val: currentScenario === 'stress' ? 'Sympathetic Dominated' : 'Balanced Homeostasis', ref: 'Co-activated' },
            { name: 'Circadian Sleep Index', val: `${activePatient.key === 'balaji' ? 'Reduced (6h)' : 'Normal (8h)'}`, ref: '7-9h' },
          ],
          aiPrediction: 'High risk of sleep circadian fragmentation and cognitive fatigue if stress variables remain elevated.',
          confidence: '90%',
          advice: 'Practice 15 minutes of mindful respiration. Restrict blue-light device emission prior to sleep hours.',
          chartData: history.hrv.map((val: number, idx: number) => ({ time: idx, val })),
          chartColor: '#a100ff'
        };
      }
      case 'Sleep': {
        const sleepHours = sliders.sleep;
        const statusText = sleepHours < 6.0 ? 'Sleep Deficit' : 'Optimal Rest';
        const isWarn = sleepHours < 6.0;
        return {
          title: 'Sleep & Circadian Rhythm',
          status: statusText,
          statusType: isWarn ? 'warning' : 'healthy',
          colorClass: isWarn ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-blue-500 text-blue-400 bg-blue-500/10',
          vitalsList: [
            { name: 'Sleep Duration', val: `${sleepHours} hrs`, ref: '7-9 hrs' },
            { name: 'Core Temp Drift', val: `${vitals.temp} °F`, ref: '-0.8°F at night' },
            { name: 'Autonomic HRV Reset', val: `${vitals.hrv} ms`, ref: '>40 ms' },
          ],
          aiPrediction: sleepHours < 6.0 
            ? 'Reduced REM cycles. Elevated sympathetic drive during diurnal transitions.'
            : 'Nominal sleep restoration indices.',
          confidence: '88%',
          advice: 'Maintain a consistent sleep window. Restrict caffeine intake 6 hours prior to bedtime.',
          chartData: history.temp.map((val: number, idx: number) => ({ time: idx, val })),
          chartColor: '#3b82f6'
        };
      }
      case 'Heart': {
        const isCrit = currentScenario === 'vtach' || vitals.hr > 130 || vitals.hr < 45;
        const isWarn = vitals.hr > 100 || vitals.hr < 55;
        const statusText = isCrit ? 'Critical Dysrhythmia' : isWarn ? 'Moderate Tachycardia/Bradycardia' : 'Sinus Homeostasis';
        return {
          title: 'Cardiovascular Complex',
          status: statusText,
          statusType: isCrit ? 'critical' : isWarn ? 'warning' : 'healthy',
          colorClass: isCrit ? 'border-rose-500 text-rose-400 bg-rose-500/10' : isWarn ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
          vitalsList: [
            { name: 'Heart Rate Frequency', val: `${vitals.hr} BPM`, ref: '50-100 BPM' },
            { name: 'Vascular Systolic Tension', val: `${vitals.bpSys} mmHg`, ref: '90-120 mmHg' },
            { name: 'Cardiac Ejection Fraction', val: `${vitals.ef}%`, ref: '55-65%' },
          ],
          aiPrediction: currentScenario === 'vtach' 
            ? 'Ventricular pacing collapsed. High risk of cardiovascular ischemia and syncopic events.'
            : 'Steady cardiac load. Genetic PGx CYP2D6 status indicates metoprolol dosage adjustments needed.',
          confidence: '95%',
          advice: currentScenario === 'vtach'
            ? 'Administer emergency Metoprolol Beta-Blocker. Terminate physical load and trigger telemetry protocols.'
            : 'Sustain moderate cardio intervals. Reduce dietary sodium to under 2.3 grams per day.',
          chartData: history.hr.map((val: number, idx: number) => ({ time: idx, val })),
          chartColor: '#f43f5e'
        };
      }
      case 'Lungs': {
        const isCrit = vitals.spo2 < 93;
        const isWarn = vitals.spo2 < 95;
        const statusText = isCrit ? 'Hypoxemia Risk' : isWarn ? 'Mild Desaturation' : 'Optimal Aeration';
        return {
          title: 'Pulmonary Complex',
          status: statusText,
          statusType: isCrit ? 'critical' : isWarn ? 'warning' : 'healthy',
          colorClass: isCrit ? 'border-rose-500 text-rose-400 bg-rose-500/10' : isWarn ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
          vitalsList: [
            { name: 'Oxygen Saturation', val: `${vitals.spo2}%`, ref: '95-100%' },
            { name: 'Respiration Rate', val: `${vitals.rr} RPM`, ref: '12-16 RPM' },
            { name: 'Metabolic Equivalent', val: `${vitals.met} METs`, ref: '1.0-8.5' },
          ],
          aiPrediction: vitals.spo2 < 93 
            ? 'Pulmonary gas transfer efficiency compromised. Monitor for potential geriatric respiratory fatigue.'
            : 'Steady respiratory diffusion and blood gas parameters.',
          confidence: '92%',
          advice: 'Perform deep-diaphragmatic breathing exercises. Maintain active ventilation and check for geriatric dyspnea signs.',
          chartData: history.spo2.map((val: number, idx: number) => ({ time: idx, val })),
          chartColor: '#10b981'
        };
      }
      case 'Stress': {
        const statusText = currentScenario === 'stress' ? 'Acute Sympathetic Load' : vitals.gsr > 2.5 ? 'Moderate Strain' : 'Nominal Balance';
        const isCrit = currentScenario === 'stress';
        const isWarn = vitals.gsr > 2.5;
        return {
          title: 'Adrenal & Stress Complex',
          status: statusText,
          statusType: isCrit ? 'critical' : isWarn ? 'warning' : 'healthy',
          colorClass: isCrit ? 'border-rose-500 text-rose-400 bg-rose-500/10' : isWarn ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
          vitalsList: [
            { name: 'Skin Conductance (GSR)', val: `${vitals.gsr} uS`, ref: '1.0-2.5 uS' },
            { name: 'Heart Frequency (BPM)', val: `${vitals.hr} BPM`, ref: '60-100 BPM' },
            { name: 'Autonomic HRV Reset', val: `${vitals.hrv} ms`, ref: '>40 ms' },
          ],
          aiPrediction: isCrit 
            ? 'Hyper-adrenal activation. Continuous sympathetic drive may cause vascular tension elevations.'
            : 'Nominal endocrine/sympathetic load vectors.',
          confidence: '91%',
          advice: 'Practice deep box-breathing: inhale 4s, hold 4s, exhale 4s, hold 4s. Limit cognitive loads.',
          chartData: history.gsr.map((val: number, idx: number) => ({ time: idx, val })),
          chartColor: '#eab308'
        };
      }
      case 'Hydration': {
        const waterL = sliders.hydration;
        const statusText = waterL < 2.0 ? 'Dehydration Indicated' : 'Steady Osmolality';
        const isWarn = waterL < 2.0;
        return {
          title: 'Fluid & Electrolyte Balance',
          status: statusText,
          statusType: isWarn ? 'warning' : 'healthy',
          colorClass: isWarn ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-cyan-500 text-cyan-400 bg-cyan-500/10',
          vitalsList: [
            { name: 'Fluid Intake Target', val: `${waterL} L`, ref: '2.5-3.0 L' },
            { name: 'Skin Conductance (GSR)', val: `${vitals.gsr} uS`, ref: '1.0-3.0 uS' },
            { name: 'Vascular Systolic Tension', val: `${vitals.bpSys} mmHg`, ref: '90-120 mmHg' },
          ],
          aiPrediction: waterL < 2.0
            ? 'Dehydrated state. Elevated plasma osmolality may increase vascular friction resistances.'
            : 'Nominal vascular volume filtration indices.',
          confidence: '89%',
          advice: 'Encourage structured hydration protocols. Increase water intake to 2.5L and review medication clearing rates.',
          chartData: history.gsr.map((val: number, idx: number) => ({ time: idx, val })),
          chartColor: '#06b6d4'
        };
      }
      case 'BloodPressure': {
        const isCrit = vitals.bpSys > alarms.bpSys.max || vitals.bpSys < alarms.bpSys.min;
        const isWarn = vitals.bpSys > 130 && vitals.bpSys <= alarms.bpSys.max;
        const statusText = isCrit ? 'Vascular Hypertension' : isWarn ? 'Pre-Hypertensive' : 'Vascular Homeostasis';
        return {
          title: 'Vascular Tension complex',
          status: statusText,
          statusType: isCrit ? 'critical' : isWarn ? 'warning' : 'healthy',
          colorClass: isCrit ? 'border-rose-500 text-rose-400 bg-rose-500/10' : isWarn ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
          vitalsList: [
            { name: 'Systolic Tension', val: `${vitals.bpSys} mmHg`, ref: '90-120 mmHg' },
            { name: 'Diastolic Tension', val: `${vitals.bpDia} mmHg`, ref: '50-80 mmHg' },
            { name: 'Vessel Compliance Ratio', val: `${(vitals.ef / 60).toFixed(2)}x`, ref: '1.0x baseline' },
          ],
          aiPrediction: isCrit
            ? 'High systemic vascular resistance. Elevates cardiac workload and risks localized tissue ischemia.'
            : 'Nominal vessel compliance coefficients.',
          confidence: '95%',
          advice: 'Administer Lisinopril ACE-Inhibitor compound if boundary breached. Restrict sodium and simple carbohydrate food blocks.',
          chartData: history.bpSys.map((val: number, idx: number) => ({ time: idx, val })),
          chartColor: '#f59e0b'
        };
      }
      case 'Activity': {
        const isWarn = vitals.steps < 4000;
        const statusText = isWarn ? 'Sedentary Inactivity' : 'Active Aerobic Phase';
        return {
          title: 'Somatic Musculoskeletal load',
          status: statusText,
          statusType: isWarn ? 'warning' : 'healthy',
          colorClass: isWarn ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
          vitalsList: [
            { name: 'Diurnal Step Count', val: `${vitals.steps} steps`, ref: '8,000 steps' },
            { name: 'Caloric Dissipation', val: `${vitals.calories} kcal`, ref: '2,200 kcal' },
            { name: 'Metabolic Volume (METs)', val: `${vitals.met} METs`, ref: '1.0-8.8 METs' },
          ],
          aiPrediction: isWarn
            ? 'Reduced energy expenditure profiles. May contribute to glycemic load variance and decreased Ejection Fraction.'
            : 'Excellent peripheral capillary perfusion and muscle glycogen utilization.',
          confidence: '92%',
          advice: 'Complete daily walking targets (8000 steps). Complete cardiovascular recommendation block to stimulate heart volume output.',
          chartData: history.hr.map((val: number, idx: number) => ({ time: idx, val })),
          chartColor: '#10b981'
        };
      }
      default:
        return null;
    }
  };

  const details = getOrganDetails(selectedOrgan);
  if (!details) return null;

  const getStatusIcon = (type: string) => {
    if (type === 'critical') return <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />;
    if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <CheckCircle className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="absolute top-4 right-4 bottom-4 w-[335px] glass-panel border-l-4 border-l-cyan-400 p-5 flex flex-col justify-between overflow-y-auto z-40 shadow-2xl transition-all duration-300">
      
      {/* Drawer Header */}
      <div>
        <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-4">
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-slate-500 font-mono tracking-wider font-bold">ORGAN DIAGNOSTICS</span>
            <h3 className="text-sm font-black uppercase text-cyan-400 tracking-wide font-display mt-0.5">
              {details.title}
            </h3>
          </div>
          <button 
            onClick={() => setSelectedOrgan(null)}
            className="p-1 rounded-lg hover:bg-slate-900/60 text-slate-500 hover:text-rose-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current status tag */}
        <div className={`p-3 border rounded-xl flex items-center justify-between text-xs font-semibold ${details.colorClass} mb-4`}>
          <span className="font-mono uppercase tracking-wider text-[10px]">Status: {details.status}</span>
          {getStatusIcon(details.statusType)}
        </div>

        {/* Real-time parameters checklist */}
        <div className="flex flex-col gap-3 text-left mb-5">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider font-mono">Telemetry Nodes</span>
          {details.vitalsList.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs font-mono py-1.5 border-b border-slate-950/20">
              <span className="text-slate-400 text-[11px]">{item.name}</span>
              <div className="flex flex-col items-end">
                <span className="font-bold text-slate-200">{item.val}</span>
                <span className="text-[9px] text-slate-600">Ref: {item.ref}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Recharts history graph */}
        <div className="mb-5 flex flex-col text-left">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider font-mono mb-2">Live Waveform Trend</span>
          <div className="h-28 bg-slate-950/60 border border-slate-900/80 rounded-xl overflow-hidden p-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={details.chartData}>
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip 
                  contentStyle={{ background: '#090d16', border: '1px solid #1e293b', fontSize: '9px', fontFamily: 'monospace' }}
                  labelStyle={{ display: 'none' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  stroke={details.chartColor} 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI recommendation footer blocks */}
      <div className="flex flex-col gap-3 pt-3 border-t border-slate-900 text-left">
        {/* Risk Prediction summary */}
        <div className="flex gap-2.5">
          <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-violet-400 tracking-wider font-mono">
              <span>AI Prediction</span>
              <span className="text-slate-500 font-normal">({details.confidence} Conf)</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed font-sans mt-0.5">
              {details.aiPrediction}
            </p>
          </div>
        </div>

        {/* Recommendations list */}
        <div className="flex gap-2.5 mt-1">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-cyan-400 tracking-wider font-mono">Clinical Protocol</span>
            <p className="text-[10px] text-slate-300 leading-relaxed font-sans mt-0.5">
              {details.advice}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
export default OrganDetailModal;
