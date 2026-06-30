export interface LabRecord {
  name: string;
  value: string;
  status: 'Normal' | 'Optimal' | 'Elevated' | 'Pre-Diabetic' | 'Borderline High' | 'Borderline Low' | 'Poor Control' | 'Age-Appropriate';
}

export interface PatientProfile {
  key: string;
  name: string;
  id: string;
  age: number;
  gender: string;
  profileName: string;
  cyp2d6Status: string;
  
  // Physiological parameters
  baseHR: number;
  hrvBias: number;
  bpSysBias: number;
  bpDiaBias: number;
  rrBias: number;
  cgmRiseRate: number;
  insulinResistance: number;
  baseEF: number;
  baseSPO2: number;
  tempBias: number;
  metoprololClFactor: number;

  // Medical Record Details
  height: string;
  weight: string;
  bloodGroup: string;
  emergencyContact: string;
  
  // Offline EHR
  diagnoses: string;
  labs: LabRecord[];
  prescriptions: string;
  history: string;
}

export interface Vitals {
  hr: number;
  bpSys: number;
  bpDia: number;
  cgm: number;
  spo2: number;
  temp: number;
  gsr: number;
  hrv: number;
  rr: number;
  ef: number;
  met: number;
  calories: number;
  steps: number;
}

export interface Autonomic {
  sympathetic: number;
  parasympathetic: number;
}

export interface Metabolic {
  mealCarbs: number;
  mealFiber: number;
  mealFats: number;
  insulinActive: number;
}

export interface Drugs {
  metoprolol: number;
  lisinopril: number;
  metformin: number;
}

export interface Sliders {
  sleep: number;
  hydration: number;
  activity: number;
  stress: number;
  adherence: number;
}

export interface AlarmLimits {
  min: number;
  max: number;
}

export interface Alarms {
  hr: AlarmLimits;
  bpSys: AlarmLimits;
  bpDia: AlarmLimits;
  cgm: AlarmLimits;
  spo2: AlarmLimits;
  temp: AlarmLimits;
}

export interface SystemLog {
  time: string;
  type: 'info' | 'warn' | 'crit' | 'ai';
  message: string;
}

export interface RecommendationItem {
  id: string;
  text: string;
  category: 'Fitness' | 'Hydration' | 'Sleep' | 'Nutrition' | 'Mindfulness';
  value: string;
  completed: boolean;
}

export interface AIPredictionRisk {
  disease: string;
  percentage: number;
  category: 'Low' | 'Moderate' | 'High' | 'Optimal' | 'Elevated' | 'Critical';
  confidence: number;
  trend: 'stable' | 'improving' | 'worsening';
  reason: string;
}

export type AppView =
  | 'landing'
  | 'twin'
  | 'dashboard'
  | 'predictions'
  | 'recommendations'
  | 'reports'
  | 'profile'
  | 'settings';

export type OrganName =
  | 'Brain'
  | 'Heart'
  | 'Lungs'
  | 'Pancreas'
  | 'Kidneys'
  | 'Sleep'
  | 'Stress'
  | 'Hydration'
  | 'BloodPressure'
  | 'Activity';
