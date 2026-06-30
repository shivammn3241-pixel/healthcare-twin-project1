import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  PatientProfile, Vitals, Autonomic, Metabolic, Drugs, Sliders, Alarms, SystemLog, 
  RecommendationItem, AIPredictionRisk, AppView, OrganName 
} from '../types';

interface HealthTwinContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  activePatientKey: string;
  setActivePatientKey: (key: string) => void;
  activePatient: PatientProfile;
  currentScenario: string;
  setScenario: (scenario: string) => void;
  vitals: Vitals;
  sliders: Sliders;
  setSliders: React.Dispatch<React.SetStateAction<Sliders>>;
  history: {
    hr: number[];
    bpSys: number[];
    bpDia: number[];
    cgm: number[];
    spo2: number[];
    temp: number[];
    gsr: number[];
    hrv: number[];
    healthScore: number[];
    timeLabels: string[];
  };
  alarms: Alarms;
  setAlarms: React.Dispatch<React.SetStateAction<Alarms>>;
  alarmSoundActive: boolean;
  alarmMuted: boolean;
  setAlarmMuted: (muted: boolean) => void;
  logs: SystemLog[];
  addLog: (type: 'info' | 'warn' | 'crit' | 'ai', message: string) => void;
  selectedOrgan: OrganName | null;
  setSelectedOrgan: (organ: OrganName | null) => void;
  recommendations: RecommendationItem[];
  toggleRecommendation: (id: string) => void;
  aiPredictions: AIPredictionRisk[];
  administerMeal: (type: 'donut' | 'oats' | 'keto') => void;
  administerDrug: (type: 'metoprolol' | 'lisinopril' | 'metformin' | 'insulin') => void;
  healthScore: number;
  patientProfiles: Record<string, PatientProfile>;
  registerUserProfile: (profile: PatientProfile) => void;
}

const PATIENT_PROFILES: Record<string, PatientProfile> = {
  sarah: {
    key: 'sarah',
    name: 'Sarah Connor',
    id: 'TWIN-9802',
    age: 42,
    gender: 'Female',
    profileName: 'Baseline Normal',
    cyp2d6Status: 'CYP2D6 *1/*1 (Normal Metabolizer)',
    baseHR: 70,
    hrvBias: 1.0,
    bpSysBias: 0,
    bpDiaBias: 0,
    rrBias: 0,
    cgmRiseRate: 1.8,
    insulinResistance: 1.0,
    baseEF: 62,
    baseSPO2: 98.5,
    tempBias: 0.0,
    metoprololClFactor: 0.11,
    height: "168 cm",
    weight: "62 kg",
    bloodGroup: "A+",
    emergencyContact: "John Connor (+1-555-0199)",
    diagnoses: 'No active clinical conditions. General homeostatic indicators hold within nominal physiological ranges.',
    labs: [
      { name: 'HbA1c', value: '5.3%', status: 'Normal' },
      { name: 'Total Cholesterol', value: '178 mg/dL', status: 'Normal' },
      { name: 'Serum Creatinine', value: '0.8 mg/dL', status: 'Normal' }
    ],
    prescriptions: 'No daily pharmacotherapy regimens prescribed.',
    history: 'Sedentary-to-moderate desk worker. Normal circadian sleep index. Exercises 2-3 times/week.'
  },
  balaji: {
    key: 'balaji',
    name: 'Balaji',
    id: 'TWIN-3104',
    age: 56,
    gender: 'Male',
    profileName: 'Hypertensive Risk',
    cyp2d6Status: 'CYP2D6 *4/*4 (Poor Metabolizer - RISK)',
    baseHR: 76,
    hrvBias: 0.75,
    bpSysBias: 22,
    bpDiaBias: 14,
    rrBias: 1,
    cgmRiseRate: 1.8,
    insulinResistance: 1.25,
    baseEF: 58,
    baseSPO2: 97.8,
    tempBias: 0.1,
    metoprololClFactor: 0.012,
    height: "174 cm",
    weight: "84 kg",
    bloodGroup: "O+",
    emergencyContact: "Asha Balaji (+91-9840012345)",
    diagnoses: 'Essential Hypertension, Stage II (Chronic vascular resistance elevation). Hypercholesterolemia.',
    labs: [
      { name: 'HbA1c', value: '5.8%', status: 'Pre-Diabetic' },
      { name: 'Total Cholesterol', value: '238 mg/dL', status: 'Elevated' },
      { name: 'Serum Creatinine', value: '1.2 mg/dL', status: 'Borderline High' }
    ],
    prescriptions: 'Lisinopril 10mg QD, Metoprolol 25mg QD (Beta-blocker substrate).',
    history: 'Sedentary lifestyle. High chronic environmental stress. Family history: father had early myocardial infarction (MI) at age 54. Patient has CYP2D6 Poor Metabolizer genotype.'
  },
  ashish: {
    key: 'ashish',
    name: 'Ashish',
    id: 'TWIN-5412',
    age: 29,
    gender: 'Male',
    profileName: 'Athletic Conditioning',
    cyp2d6Status: 'CYP2D6 *1/*2 (Normal Metabolizer)',
    baseHR: 48,
    hrvBias: 1.55,
    bpSysBias: -6,
    bpDiaBias: -4,
    rrBias: -2,
    cgmRiseRate: 1.6,
    insulinResistance: 0.7,
    baseEF: 66,
    baseSPO2: 99.2,
    tempBias: -0.2,
    metoprololClFactor: 0.11,
    height: "182 cm",
    weight: "74 kg",
    bloodGroup: "B+",
    emergencyContact: "Vikram Sharma (+91-9988776655)",
    diagnoses: 'Athletic bradycardia (Vagotonically dominated sinus rhythm). Optimal cardiovascular and glycemic clearance indices.',
    labs: [
      { name: 'HbA1c', value: '4.8%', status: 'Optimal' },
      { name: 'Total Cholesterol', value: '142 mg/dL', status: 'Optimal' },
      { name: 'Serum Creatinine', value: '0.9 mg/dL', status: 'Normal' }
    ],
    prescriptions: 'No daily pharmacotherapy regimens prescribed.',
    history: 'Amateur endurance runner. High physical load capacity. Non-smoker. High HRV indexes.'
  },
  sammi: {
    key: 'sammi',
    name: 'Sammi',
    id: 'TWIN-1085',
    age: 19,
    gender: 'Female',
    profileName: 'Type 1 Diabetic',
    cyp2d6Status: 'CYP2D6 *1/*1 (Normal Metabolizer)',
    baseHR: 74,
    hrvBias: 0.9,
    bpSysBias: 2,
    bpDiaBias: 1,
    rrBias: 0,
    cgmRiseRate: 3.4,
    insulinResistance: 2.5,
    baseEF: 61,
    baseSPO2: 98.5,
    tempBias: 0.0,
    metoprololClFactor: 0.11,
    height: "162 cm",
    weight: "51 kg",
    bloodGroup: "AB-",
    emergencyContact: "Helen Carter (+1-555-0144)",
    diagnoses: 'Type 1 Diabetes Mellitus (T1DM). High glycemic variability. Risk of insulin-induced hypoglycemic shock.',
    labs: [
      { name: 'HbA1c', value: '7.8%', status: 'Poor Control' },
      { name: 'Total Cholesterol', value: '162 mg/dL', status: 'Normal' },
      { name: 'Serum Creatinine', value: '0.7 mg/dL', status: 'Normal' }
    ],
    prescriptions: 'Humalog (rapid-acting bolus insulin) titrated to carbs; Lantus 15U (basal insulin) QD.',
    history: 'Diagnosed T1DM at age 8. Lacks endogenous insulin production. High glycemic response to simple carbohydrates.'
  },
  sailu: {
    key: 'sailu',
    name: 'Sailu',
    id: 'TWIN-7743',
    age: 68,
    gender: 'Female',
    profileName: 'Geriatric Cardiopulmonary Risk',
    cyp2d6Status: 'CYP2D6 *2/*17 (Intermediate Metabolizer)',
    baseHR: 78,
    hrvBias: 0.65,
    bpSysBias: 14,
    bpDiaBias: 6,
    rrBias: 2,
    cgmRiseRate: 2.2,
    insulinResistance: 1.45,
    baseEF: 51,
    baseSPO2: 95.5,
    tempBias: -0.3,
    metoprololClFactor: 0.046,
    height: "155 cm",
    weight: "59 kg",
    bloodGroup: "O-",
    emergencyContact: "Kiran Kumar (+91-9444011223)",
    diagnoses: 'Geriatric cardiopulmonary weakness. Age-related arterial stiffening. Borderline renal filtration clearance.',
    labs: [
      { name: 'HbA1c', value: '6.2%', status: 'Pre-Diabetic' },
      { name: 'Total Cholesterol', value: '215 mg/dL', status: 'Borderline High' },
      { name: 'Serum Creatinine', value: '1.1 mg/dL', status: 'Age-Appropriate' }
    ],
    prescriptions: 'Lisinopril 5mg QD (ACE Inhibitor).',
    history: 'Sedentary senior citizen. Experiences mild dyspnea upon moderate exertion (stairs). Decreased cardiac ejection baseline.'
  }
};

const STATE_SETPOINTS: Record<string, { sympathetic: number; parasympathetic: number; temp: number }> = {
  normal: { sympathetic: 1.0, parasympathetic: 1.0, temp: 98.6 },
  exercise: { sympathetic: 3.2, parasympathetic: 0.2, temp: 100.2 },
  sleep: { sympathetic: 0.35, parasympathetic: 2.6, temp: 97.8 },
  stress: { sympathetic: 2.4, parasympathetic: 0.5, temp: 99.0 },
  vtach: { sympathetic: 4.8, parasympathetic: 0.1, temp: 98.6 },
  hypo: { sympathetic: 2.8, parasympathetic: 0.4, temp: 98.0 }
};

const INITIAL_RECOMMENDATIONS: RecommendationItem[] = [
  { id: 'steps', text: 'Walk 8,000 steps daily for cardiovascular endurance', category: 'Fitness', value: '8000 steps', completed: false },
  { id: 'water', text: 'Maintain cellular hydration by drinking 2.5L water', category: 'Hydration', value: '2.5 L', completed: false },
  { id: 'sleep', text: 'Restore autonomic regulation - sleep before 11 PM', category: 'Sleep', value: '8 hours', completed: false },
  { id: 'diet', text: 'Reduce sodium and carbohydrates to normalize vascular tension', category: 'Nutrition', value: '<2.3g Na', completed: false },
  { id: 'mind', text: 'Reduce sympathetic tone with 15 mins of mindful meditation', category: 'Mindfulness', value: '15 mins', completed: false },
  { id: 'ex', text: 'Trigger cellular oxygenation: exercise for 30 mins', category: 'Fitness', value: '30 mins', completed: false },
];

const HealthTwinContext = createContext<HealthTwinContextType | undefined>(undefined);

export const HealthTwinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patientProfiles, setPatientProfiles] = useState<Record<string, PatientProfile>>(PATIENT_PROFILES);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [activePatientKey, setActivePatientKey] = useState<string>('sarah');
  const [currentScenario, setScenarioState] = useState<string>('normal');
  const [selectedOrgan, setSelectedOrgan] = useState<OrganName | null>(null);
  
  // Simulated stats
  const [sliders, setSliders] = useState<Sliders>({
    sleep: 7.5,
    hydration: 2.0,
    activity: 30,
    stress: 1,
    adherence: 100
  });

  const [vitals, setVitals] = useState<Vitals>({
    hr: 70,
    bpSys: 120,
    bpDia: 80,
    cgm: 98,
    spo2: 98.5,
    temp: 98.6,
    gsr: 2.0,
    hrv: 55,
    rr: 14,
    ef: 62,
    met: 1.0,
    calories: 1420,
    steps: 4200
  });

  const [autonomic, setAutonomic] = useState<Autonomic>({ sympathetic: 1.0, parasympathetic: 1.0 });
  const [metabolic, setMetabolic] = useState<Metabolic>({ mealCarbs: 0, mealFiber: 0, mealFats: 0, insulinActive: 1.0 });
  const [drugs, setDrugs] = useState<Drugs>({ metoprolol: 0, lisinopril: 0, metformin: 0 });
  const [healthScore, setHealthScore] = useState<number>(94);
  const [alarmSoundActive, setAlarmSoundActive] = useState<boolean>(false);
  const [alarmMuted, setAlarmMuted] = useState<boolean>(false);
  
  const [alarms, setAlarms] = useState<Alarms>({
    hr: { min: 50, max: 130 },
    bpSys: { min: 90, max: 145 },
    bpDia: { min: 50, max: 95 },
    cgm: { min: 70, max: 180 },
    spo2: { min: 94, max: 100 },
    temp: { min: 97.0, max: 99.8 }
  });

  const [logs, setLogs] = useState<SystemLog[]>([
    { time: new Date().toLocaleTimeString(), type: 'info', message: 'Aetheris physiological telemetry stream initialized.' },
    { time: new Date().toLocaleTimeString(), type: 'info', message: 'Autonomic sympathovagal coupling calibrated.' },
    { time: new Date().toLocaleTimeString(), type: 'ai', message: 'Biometric neural twin projections ready. Minimal glycemic model active.' }
  ]);

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(INITIAL_RECOMMENDATIONS);
  const [history, setHistory] = useState({
    hr: Array(30).fill(70),
    bpSys: Array(30).fill(120),
    bpDia: Array(30).fill(80),
    cgm: Array(30).fill(98),
    spo2: Array(30).fill(98.5),
    temp: Array(30).fill(98.6),
    gsr: Array(30).fill(2.0),
    hrv: Array(30).fill(55),
    healthScore: Array(30).fill(94),
    timeLabels: Array(30).fill('').map((_, i) => `${30 - i}s ago`)
  });

  const activePatient = patientProfiles[activePatientKey];

  // Ref variables to avoid stale closure issues in the physiological model loop interval
  const stateRef = useRef({
    activePatientKey,
    currentScenario,
    sliders,
    vitals,
    autonomic,
    metabolic,
    drugs,
    alarms,
    logs,
    history,
    alarmMuted,
    recommendations
  });

  useEffect(() => {
    const session = localStorage.getItem('healthtwin_simple_active_session');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.token) {
        setIsAuthenticated(true);
        setActiveView('twin');

        const customProfile: PatientProfile = {
          key: 'user',
          name: parsed.name || 'Clinical Clinician',
          id: `TWIN-${Math.floor(1000 + Math.random() * 9000)}`,
          age: 38,
          gender: 'Male',
          profileName: 'Patient Twin (Self)',
          cyp2d6Status: 'CYP2D6 *1/*1 (Normal Metabolizer)',
          baseHR: 72,
          hrvBias: 1.0,
          bpSysBias: 0,
          bpDiaBias: 0,
          rrBias: 0,
          cgmRiseRate: 1.8,
          insulinResistance: 1.0,
          baseEF: 62,
          baseSPO2: 98.6,
          tempBias: 0.0,
          metoprololClFactor: 0.11,
          height: '175 cm',
          weight: '74 kg',
          bloodGroup: 'O+',
          emergencyContact: 'Medical Desk (+1-555-0199)',
          diagnoses: 'No active clinical conditions. Biomarker baselines hold within normal range limits.',
          labs: [
            { name: 'HbA1c', value: '5.4%', status: 'Normal' },
            { name: 'Total Cholesterol', value: '180 mg/dL', status: 'Normal' },
            { name: 'Serum Creatinine', value: '0.9 mg/dL', status: 'Normal' }
          ],
          prescriptions: 'None',
          history: `Social History: Smoking: No, Alcohol: Socially, Exercise: 3+ times/week. User Registry: ${parsed.username} (${parsed.email})`
        };

        setPatientProfiles(prev => ({
          ...prev,
          user: customProfile
        }));
        setActivePatientKey('user');
      }
    }
  }, []);

  useEffect(() => {
    stateRef.current = {
      activePatientKey,
      currentScenario,
      sliders,
      vitals,
      autonomic,
      metabolic,
      drugs,
      alarms,
      logs,
      history,
      alarmMuted,
      recommendations
    };
  }, [activePatientKey, currentScenario, sliders, vitals, autonomic, metabolic, drugs, alarms, logs, history, alarmMuted, recommendations]);

  const login = () => {
    setIsAuthenticated(true);
    setActiveView('twin'); // Twin page is the post-login homepage as requested!
    addLog('info', 'Secure clinical session opened. Patient Twin synced.');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveView('landing');
    setScenarioState('normal');
    localStorage.removeItem('healthtwin_simple_active_session');
    addLog('info', 'Secure clinical session terminated.');
  };

  const registerUserProfile = (profile: PatientProfile) => {
    setPatientProfiles(prev => ({
      ...prev,
      [profile.key]: profile
    }));
    setActivePatientKey(profile.key);
  };

  const setScenario = (sc: string) => {
    setScenarioState(sc);
    addLog('info', `Simulated Scenario switched to: ${sc.toUpperCase()}`);
  };

  const addLog = (type: 'info' | 'warn' | 'crit' | 'ai', message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => {
      const updated = [...prev, { time: timestamp, type, message }];
      if (updated.length > 50) updated.shift();
      return updated;
    });
  };

  const toggleRecommendation = (id: string) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === id) {
        const nextState = !rec.completed;
        addLog('info', `Lifestyle Intervention [${rec.category}]: ${rec.text} marked as ${nextState ? 'Completed' : 'Pending'}.`);
        return { ...rec, completed: nextState };
      }
      return rec;
    }));
  };

  const administerMeal = (type: 'donut' | 'oats' | 'keto') => {
    addLog('info', `Meal intervention: Patient consumed ${type === 'donut' ? 'Glazed Donut (Fast Carbs)' : type === 'oats' ? 'Oats & Fiber (Complex Carbs)' : 'Keto Plate (Eggs & Fat)'}.`);
    setMetabolic(prev => {
      if (type === 'donut') {
        return { ...prev, mealCarbs: prev.mealCarbs + 60, mealFiber: prev.mealFiber + 1, mealFats: prev.mealFats + 15 };
      } else if (type === 'oats') {
        return { ...prev, mealCarbs: prev.mealCarbs + 40, mealFiber: prev.mealFiber + 8, mealFats: prev.mealFats + 4 };
      } else {
        return { ...prev, mealCarbs: prev.mealCarbs + 3, prevFiber: prev.mealFiber + 1, mealFats: prev.mealFats + 25 } as any;
      }
    });
  };

  const administerDrug = (type: 'metoprolol' | 'lisinopril' | 'metformin' | 'insulin') => {
    addLog('info', `Pharmacotherapy intervention: Administered dose of ${type.toUpperCase()}.`);
    if (type === 'insulin') {
      setMetabolic(prev => ({ ...prev, insulinActive: prev.insulinActive + 5.0 }));
    } else {
      setDrugs(prev => ({ ...prev, [type]: prev[type] + 20.0 }));
    }
  };

  // Audio Alerts Synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const alarmIntervalRef = useRef<any>(null);

  const playBeep = (frequency: number, duration: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (err) {
      console.warn('Audio synthesis blocked by browser auto-play policy', err);
    }
  };

  // Trigger beep loops
  useEffect(() => {
    if (alarmSoundActive && !alarmMuted) {
      if (!alarmIntervalRef.current) {
        alarmIntervalRef.current = setInterval(() => {
          playBeep(980, 0.10);
          setTimeout(() => playBeep(980, 0.10), 180);
          setTimeout(() => playBeep(980, 0.10), 360);
        }, 2200);
      }
    } else {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
    }
    return () => {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
    };
  }, [alarmSoundActive, alarmMuted]);

  // Physiological mathematical simulation loop (ticks every 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      const dt = 1.0;
      const ref = stateRef.current;
      const p = PATIENT_PROFILES[ref.activePatientKey];
      const set = STATE_SETPOINTS[ref.currentScenario] || STATE_SETPOINTS.normal;
      const ease = 0.08;

      // 1. Sympathetic & Parasympathetic Drive Evolution
      let sym = ref.autonomic.sympathetic + (set.sympathetic - ref.autonomic.sympathetic) * ease;
      let para = ref.autonomic.parasympathetic + (set.parasympathetic - ref.autonomic.parasympathetic) * ease;

      const stressSliderModifier = (ref.sliders.stress - 1) * 0.4;
      const finalSym = sym + stressSliderModifier;
      const sleepDeficiency = Math.max(0, 7.0 - ref.sliders.sleep);
      const finalPara = Math.max(0.1, para - sleepDeficiency * 0.15);

      setAutonomic({ sympathetic: sym, parasympathetic: para });

      // 2. Pharmacokinetic Drug Decay Loops
      let meto = Math.max(0.0, ref.drugs.metoprolol - ref.drugs.metoprolol * p.metoprololClFactor * dt);
      let lisi = Math.max(0.0, ref.drugs.lisinopril - ref.drugs.lisinopril * 0.05 * dt);
      let metf = Math.max(0.0, ref.drugs.metformin - ref.drugs.metformin * 0.06 * dt);
      setDrugs({ metoprolol: meto, lisinopril: lisi, metformin: metf });

      // 3. Autonomic Vitals Modulations (with drugs effects)
      const betaBlockerHRFactor = Math.max(0.5, 1.0 - (meto / (meto + 8.0)) * 0.45);
      const metoprololBPEffect = (meto / (meto + 8.0)) * 14;
      const lisinoprilBPEffect = (lisi / (lisi + 8.0)) * 18;

      // Heart Rate (BPM)
      const hrTarget = p.baseHR * Math.pow(finalSym / finalPara, 0.35) * betaBlockerHRFactor;
      const hrNoise = (Math.random() - 0.5) * 1.5;
      const currentHR = Math.round(ref.vitals.hr + (hrTarget - ref.vitals.hr) * 0.12 + hrNoise);
      const finalHR = Math.max(25, Math.min(220, currentHR));

      // Respiration Rate
      const rrTarget = 12 + p.rrBias + finalSym * 2.6 - finalPara * 0.4;
      const currentRR = Math.round(ref.vitals.rr + (rrTarget - ref.vitals.rr) * 0.1 + (Math.random() * 0.6 - 0.3));

      // Blood Pressure
      const bpSysTarget = 114 + p.bpSysBias + finalSym * 13 - finalPara * 2.5 - metoprololBPEffect - lisinoprilBPEffect;
      const bpDiaTarget = 74 + p.bpDiaBias + finalSym * 7.5 - finalPara * 1.8 - (metoprololBPEffect * 0.6) - (lisinoprilBPEffect * 0.6);
      const finalBPSys = Math.round(ref.vitals.bpSys + (bpSysTarget - ref.vitals.bpSys) * 0.08);
      const finalBPDia = Math.round(ref.vitals.bpDia + (bpDiaTarget - ref.vitals.bpDia) * 0.08);

      // Galvanic Skin Response (GSR)
      const gsrTarget = 1.2 + finalSym * 1.35;
      const finalGSR = Number((ref.vitals.gsr + (gsrTarget - ref.vitals.gsr) * 0.06 + (Math.random() * 0.08 - 0.04)).toFixed(1));

      // Temperature
      const finalTemp = Number((ref.vitals.temp + (set.temp + p.tempBias - ref.vitals.temp) * 0.03 + (Math.random() * 0.04 - 0.02)).toFixed(1));

      // Heart Rate Variability (HRV)
      const hrvTarget = 55 * p.hrvBias * Math.pow(finalPara / finalSym, 0.7);
      const finalHRV = Math.max(3, Math.round(ref.vitals.hrv + (hrvTarget - ref.vitals.hrv) * 0.08 + (Math.random() * 2 - 1)));

      // SpO2
      let spo2Target = p.baseSPO2;
      if (ref.currentScenario === 'vtach') spo2Target = 88.0;
      else if (ref.currentScenario === 'exercise') spo2Target = p.baseSPO2 - 1.1;
      const finalSpO2 = Math.min(100.0, Number((ref.vitals.spo2 + (spo2Target - ref.vitals.spo2) * 0.05 + (Math.random() * 0.1 - 0.05)).toFixed(1)));

      // Ejection Fraction
      let efTarget = p.baseEF;
      if (ref.currentScenario === 'vtach') efTarget = 30;
      else if (ref.currentScenario === 'exercise') efTarget = p.baseEF + 6;
      const finalEF = Math.round(ref.vitals.ef + (efTarget - ref.vitals.ef) * 0.15);

      // Metabolic index (METs)
      let metTarget = 1.0;
      if (ref.currentScenario === 'exercise') metTarget = 8.8;
      const finalMET = Number((ref.vitals.met + (metTarget - ref.vitals.met) * 0.1).toFixed(1));

      // 4. Glycemic Digestion Model
      const fatDelayFactor = 1.0 + ref.metabolic.mealFats * 0.06;
      const decayedFats = Math.max(0.0, ref.metabolic.mealFats - 0.25 * dt);

      let glucoseGutEntry = 0.0;
      let decCarbs = ref.metabolic.mealCarbs;
      let decFiber = ref.metabolic.mealFiber;

      if (ref.metabolic.mealCarbs > 0.0) {
        const absorbRate = Math.min(1.5 / fatDelayFactor, ref.metabolic.mealCarbs);
        decCarbs -= absorbRate;
        glucoseGutEntry += absorbRate * p.cgmRiseRate;
      }

      if (ref.metabolic.mealFiber > 0.0) {
        const absorbRate = Math.min(0.4 / fatDelayFactor, ref.metabolic.mealFiber);
        decFiber -= absorbRate;
        glucoseGutEntry += absorbRate * (p.cgmRiseRate * 0.7);
      }

      // Pancreatic insulin secretion
      const pancreasSecretionThreshold = 95;
      let pancreaticSecretion = 0.0;
      if (p.key !== 'sammi') {
        if (ref.vitals.cgm > pancreasSecretionThreshold) {
          pancreaticSecretion = (ref.vitals.cgm - pancreasSecretionThreshold) * 0.007;
        }
      }
      let activeIns = ref.metabolic.insulinActive + pancreaticSecretion * dt;
      activeIns -= activeIns * 0.045 * dt;

      setMetabolic({ mealCarbs: decCarbs, mealFiber: decFiber, mealFats: decayedFats, insulinActive: activeIns });

      const metforminSensitivityMultiplier = 1.0 + (metf / (metf + 10.0)) * 1.5;
      const effectiveResistance = p.insulinResistance / metforminSensitivityMultiplier;

      const basalLiverGlucoseOutput = p.key === 'sammi' ? 1.5 : 1.1;
      const insulinIndependentClearance = (ref.vitals.cgm - 70) * 0.008;
      const insulinDependentClearance = (ref.vitals.cgm * activeIns * 0.00035) / effectiveResistance;

      const dGlucose = glucoseGutEntry + basalLiverGlucoseOutput - insulinIndependentClearance - insulinDependentClearance;
      let newGlucose = ref.vitals.cgm + dGlucose * dt;

      if (ref.currentScenario === 'hypo') {
        activeIns = Math.max(30.0, activeIns);
        newGlucose = Math.max(36, newGlucose - 1.5 * dt);
      } else {
        newGlucose = Math.max(40, Math.min(380, newGlucose));
      }
      const finalCGM = Math.round(newGlucose);

      // Steps and calories progression
      let dynamicSteps = ref.vitals.steps + Math.round((finalMET * 1.5 + (ref.currentScenario === 'exercise' ? 5 : 0.05)));
      let dynamicCalories = ref.vitals.calories + Math.round((finalMET * 0.15 + (ref.currentScenario === 'exercise' ? 0.4 : 0.02)));

      setVitals({
        hr: finalHR,
        bpSys: finalBPSys,
        bpDia: finalBPDia,
        cgm: finalCGM,
        spo2: finalSpO2,
        temp: finalTemp,
        gsr: finalGSR,
        hrv: finalHRV,
        rr: currentRR,
        ef: finalEF,
        met: finalMET,
        steps: dynamicSteps,
        calories: dynamicCalories
      });

      // 5. Health Score Calculation
      let score = 98;
      if (finalHR < ref.alarms.hr.min || finalHR > ref.alarms.hr.max) score -= 15;
      if (finalBPSys < ref.alarms.bpSys.min || finalBPSys > ref.alarms.bpSys.max) score -= 10;
      if (finalBPDia < ref.alarms.bpDia.min || finalBPDia > ref.alarms.bpDia.max) score -= 10;
      if (finalCGM < ref.alarms.cgm.min || finalCGM > ref.alarms.cgm.max) score -= 15;
      if (finalCGM < 55) score -= 15;
      if (finalSpO2 < ref.alarms.spo2.min) score -= 20;
      if (finalSpO2 < 90) score -= 15;

      // Lifestyle completed recommendations boost!
      const completedCount = ref.recommendations.filter(r => r.completed).length;
      score += completedCount * 1.5;

      const finalHealthScore = Math.max(10, Math.min(100, Math.round(score)));
      setHealthScore(finalHealthScore);

      // Check alarm trigger status
      let criticalAlert = false;
      if (finalHR < ref.alarms.hr.min || finalHR > ref.alarms.hr.max ||
          finalBPSys < ref.alarms.bpSys.min || finalBPSys > ref.alarms.bpSys.max ||
          finalCGM < ref.alarms.cgm.min || finalCGM > ref.alarms.cgm.max ||
          finalSpO2 < ref.alarms.spo2.min) {
        criticalAlert = true;
      }
      setAlarmSoundActive(criticalAlert);

      // Trigger warning logs on breach
      if (ref.currentScenario === 'vtach' && Math.random() < 0.15) {
        addLog('crit', `HEMODYNAMIC CRISIS: Ventricular Tachycardia identified (HR: ${finalHR} BPM). Systolic output collapsing.`);
      } else if (ref.currentScenario === 'hypo' && finalCGM < 55 && Math.random() < 0.15) {
        addLog('crit', `GLYCEMIC EMERGENCY: Extreme Neuroglycopenia risk (Glucose: ${finalCGM} mg/dL). Inject fast carbs/insulin antidote.`);
      } else if (criticalAlert && Math.random() < 0.05) {
        addLog('warn', `Threshold violation. System in stress baseline. Twin Health Index: ${finalHealthScore}/100.`);
      }

      // 6. Update Sparkline/Trend Buffers
      setHistory(prev => {
        const nextHR = [...prev.hr, finalHR].slice(-30);
        const nextBPSys = [...prev.bpSys, finalBPSys].slice(-30);
        const nextBPDia = [...prev.bpDia, finalBPDia].slice(-30);
        const nextCGM = [...prev.cgm, finalCGM].slice(-30);
        const nextSpO2 = [...prev.spo2, finalSpO2].slice(-30);
        const nextTemp = [...prev.temp, finalTemp].slice(-30);
        const nextGSR = [...prev.gsr, finalGSR].slice(-30);
        const nextHRV = [...prev.hrv, finalHRV].slice(-30);
        const nextHS = [...prev.healthScore, finalHealthScore].slice(-30);
        const nextLabels = [...prev.timeLabels, new Date().toLocaleTimeString().split(' ')[0]].slice(-30);
        
        return {
          hr: nextHR,
          bpSys: nextBPSys,
          bpDia: nextBPDia,
          cgm: nextCGM,
          spo2: nextSpO2,
          temp: nextTemp,
          gsr: nextGSR,
          hrv: nextHRV,
          healthScore: nextHS,
          timeLabels: nextLabels
        };
      });

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sync state if active patient changes
  useEffect(() => {
    const p = patientProfiles[activePatientKey];
    setVitals(prev => ({
      ...prev,
      hr: p.baseHR,
      bpSys: 114 + p.bpSysBias,
      bpDia: 74 + p.bpDiaBias,
      cgm: 98,
      spo2: p.baseSPO2,
      temp: 98.6 + p.tempBias,
      ef: p.baseEF,
      steps: activePatientKey === 'ashish' ? 9500 : activePatientKey === 'balaji' ? 3200 : 5400
    }));
    setScenarioState('normal');
    addLog('info', `Profile synchronized. Monitoring patient: ${p.name} (${p.profileName}).`);
  }, [activePatientKey]);

  // Dynamic AI Predictions Engine
  const aiPredictions: AIPredictionRisk[] = [
    {
      disease: 'Heart Disease Risk',
      percentage: activePatientKey === 'balaji' ? 78 : activePatientKey === 'sailu' ? 62 : activePatientKey === 'sammi' ? 38 : activePatientKey === 'ashish' ? 8 : 22,
      category: activePatientKey === 'balaji' ? 'High' : activePatientKey === 'sailu' ? 'High' : activePatientKey === 'ashish' ? 'Low' : 'Moderate',
      confidence: 94,
      trend: activePatientKey === 'balaji' && vitals.hr > 90 ? 'worsening' : 'stable',
      reason: activePatientKey === 'balaji' 
        ? 'Severe genetic risk (father had MI at 54). Cytochrome P450 poor metabolizer (CYP2D6 *4/*4).'
        : activePatientKey === 'sailu'
        ? 'Geriatric arterial stiffness, reduced cardiac ejection fraction baseline (51%).'
        : 'nominal cardio markers with moderate activity.'
    },
    {
      disease: 'Diabetes Mellitus Risk',
      percentage: activePatientKey === 'sammi' ? 100 : activePatientKey === 'balaji' ? 58 : activePatientKey === 'sailu' ? 44 : activePatientKey === 'sarah' ? 12 : 5,
      category: activePatientKey === 'sammi' ? 'Critical' : activePatientKey === 'balaji' ? 'Elevated' : 'Low',
      confidence: 98,
      trend: activePatientKey === 'sammi' && vitals.cgm > 180 ? 'worsening' : 'stable',
      reason: activePatientKey === 'sammi'
        ? 'Diagnosed Type 1 Diabetes Mellitus. Complete lack of endogenous insulin production.'
        : activePatientKey === 'balaji'
        ? 'HbA1c of 5.8% (Pre-diabetic), insulin resistance factor of 1.25.'
        : 'Optimal glucose-insulin clearance index.'
    },
    {
      disease: 'Hypertension Risk',
      percentage: activePatientKey === 'balaji' ? 92 : activePatientKey === 'sailu' ? 65 : activePatientKey === 'sarah' ? 15 : 4,
      category: activePatientKey === 'balaji' ? 'High' : activePatientKey === 'sailu' ? 'Elevated' : 'Low',
      confidence: 96,
      trend: vitals.bpSys > 140 ? 'worsening' : 'stable',
      reason: activePatientKey === 'balaji'
        ? 'Stage II Essential Hypertension diagnosed. High systemic vascular resistance.'
        : activePatientKey === 'sailu'
        ? 'Age-related arterial compliance reduction. Elevated systolic boundary.'
        : 'Vascular compliance values normal.'
    },
    {
      disease: 'Sleep Disorder Risk',
      percentage: sliders.sleep < 5.5 ? 74 : sliders.stress > 2 ? 55 : 18,
      category: sliders.sleep < 5.5 ? 'High' : sliders.stress > 2 ? 'Moderate' : 'Low',
      confidence: 88,
      trend: sliders.sleep < 6.0 ? 'worsening' : 'stable',
      reason: sliders.sleep < 6.0 
        ? `Severe circadian sleep duration deficit (${sliders.sleep} hours/day). Autonomic resetting compromised.`
        : 'Normal sleep cycles, steady REM indicators.'
    },
    {
      disease: 'Stress & Sympathetic Load Risk',
      percentage: sliders.stress === 3 ? 84 : sliders.stress === 2 ? 48 : 12,
      category: sliders.stress === 3 ? 'High' : sliders.stress === 2 ? 'Moderate' : 'Low',
      confidence: 91,
      trend: currentScenario === 'stress' ? 'worsening' : 'stable',
      reason: sliders.stress > 1
        ? `High environmental stress index. Elevated skin conductance (GSR: ${vitals.gsr} uS).`
        : 'Balanced sympathovagal balance, low sympathetic drive.'
    }
  ];

  return (
    <HealthTwinContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      activeView,
      setActiveView,
      activePatientKey,
      setActivePatientKey,
      activePatient,
      currentScenario,
      setScenario,
      vitals,
      sliders,
      setSliders,
      history,
      alarms,
      setAlarms,
      alarmSoundActive,
      alarmMuted,
      setAlarmMuted,
      logs,
      addLog,
      selectedOrgan,
      setSelectedOrgan,
      recommendations,
      toggleRecommendation,
      aiPredictions,
      administerMeal,
      administerDrug,
      healthScore,
      patientProfiles,
      registerUserProfile
    }}>
      {children}
    </HealthTwinContext.Provider>
  );
};

export const useHealthTwin = () => {
  const context = useContext(HealthTwinContext);
  if (!context) throw new Error('useHealthTwin must be used within a HealthTwinProvider');
  return context;
};
