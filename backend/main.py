import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

app = FastAPI(
    title="HealthTwin AI - Biological Telemetry API",
    description="FastAPI clinical backend to map patient twin profiles, analyze telemetry variables, and predict disease risks.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Matches development environments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PYDANTIC SCHEMAS ---
class LabRecord(BaseModel):
    name: str;
    value: str;
    status: str

class PatientProfile(BaseModel):
    key: str
    name: str
    id: str
    age: int
    gender: str
    profileName: str
    cyp2d6Status: str
    baseHR: int
    hrvBias: float
    bpSysBias: int
    bpDiaBias: int
    rrBias: int
    cgmRiseRate: float
    insulinResistance: float
    baseEF: int
    baseSPO2: float
    tempBias: float
    metoprololClFactor: float
    height: str
    weight: str
    bloodGroup: str
    emergencyContact: str
    diagnoses: str
    labs: List[LabRecord]
    prescriptions: str
    history: str

class TelemetryData(BaseModel):
    hr: int
    bpSys: int
    bpDia: int
    cgm: int
    spo2: float
    gsr: float
    hrv: int
    rr: int

class RiskAssessmentResponse(BaseModel):
    disease: str
    percentage: int
    category: str
    confidence: int
    trend: str
    reason: str

# --- PATIENT DATABASE MOCK ---
PATIENT_DB = {
  "sarah": {
    "key": "sarah",
    "name": "Sarah Connor",
    "id": "TWIN-9802",
    "age": 42,
    "gender": "Female",
    "profileName": "Baseline Normal",
    "cyp2d6Status": "CYP2D6 *1/*1 (Normal Metabolizer)",
    "baseHR": 70,
    "hrvBias": 1.0,
    "bpSysBias": 0,
    "bpDiaBias": 0,
    "rrBias": 0,
    "cgmRiseRate": 1.8,
    "insulinResistance": 1.0,
    "baseEF": 62,
    "baseSPO2": 98.5,
    "tempBias": 0.0,
    "metoprololClFactor": 0.11,
    "height": "168 cm",
    "weight": "62 kg",
    "bloodGroup": "A+",
    "emergencyContact": "John Connor (+1-555-0199)",
    "diagnoses": "No active clinical conditions. General homeostatic indicators hold within nominal physiological ranges.",
    "labs": [
      { "name": "HbA1c", "value": "5.3%", "status": "Normal" },
      { "name": "Total Cholesterol", "value": "178 mg/dL", "status": "Normal" },
      { "name": "Serum Creatinine", "value": "0.8 mg/dL", "status": "Normal" }
    ],
    "prescriptions": "No daily pharmacotherapy regimens prescribed.",
    "history": "Sedentary-to-moderate desk worker. Normal circadian sleep index. Exercises 2-3 times/week."
  },
  "balaji": {
    "key": "balaji",
    "name": "Balaji",
    "id": "TWIN-3104",
    "age": 56,
    "gender": "Male",
    "profileName": "Hypertensive Risk",
    "cyp2d6Status": "CYP2D6 *4/*4 (Poor Metabolizer - RISK)",
    "baseHR": 76,
    "hrvBias": 0.75,
    "bpSysBias": 22,
    "bpDiaBias": 14,
    "rrBias": 1,
    "cgmRiseRate": 1.8,
    "insulinResistance": 1.25,
    "baseEF": 58,
    "baseSPO2": 97.8,
    "tempBias": 0.1,
    "metoprololClFactor": 0.012,
    "height": "174 cm",
    "weight": "84 kg",
    "bloodGroup": "O+",
    "emergencyContact": "Asha Balaji (+91-9840012345)",
    "diagnoses": "Essential Hypertension, Stage II (Chronic vascular resistance elevation). Hypercholesterolemia.",
    "labs": [
      { "name": "HbA1c", "value": "5.8%", "status": "Pre-Diabetic" },
      { "name": "Total Cholesterol", "value": "238 mg/dL", "status": "Elevated" },
      { "name": "Serum Creatinine", "value": "1.2 mg/dL", "status": "Borderline High" }
    ],
    "prescriptions": "Lisinopril 10mg QD, Metoprolol 25mg QD (Beta-blocker substrate).",
    "history": "Sedentary lifestyle. High chronic environmental stress. Family history: father had early myocardial infarction (MI) at age 54. Patient has CYP2D6 Poor Metabolizer genotype."
  },
  "ashish": {
    "key": "ashish",
    "name": "Ashish",
    "id": "TWIN-5412",
    "age": 29,
    "gender": "Male",
    "profileName": "Athletic Conditioning",
    "cyp2d6Status": "CYP2D6 *1/*2 (Normal Metabolizer)",
    "baseHR": 48,
    "hrvBias": 1.55,
    "bpSysBias": -6,
    "bpDiaBias": -4,
    "rrBias": -2,
    "cgmRiseRate": 1.6,
    "insulinResistance": 0.7,
    "baseEF": 66,
    "baseSPO2": 99.2,
    "tempBias": -0.2,
    "metoprololClFactor": 0.11,
    "height": "182 cm",
    "weight": "74 kg",
    "bloodGroup": "B+",
    "emergencyContact": "Vikram Sharma (+91-9988776655)",
    "diagnoses": "Athletic bradycardia (Vagotonically dominated sinus rhythm). Optimal cardiovascular and glycemic clearance indices.",
    "labs": [
      { "name": "HbA1c", "value": "4.8%", "status": "Optimal" },
      { "name": "Total Cholesterol", "value": "142 mg/dL", "status": "Optimal" },
      { "name": "Serum Creatinine", "value": "0.9 mg/dL", "status": "Normal" }
    ],
    "prescriptions": "No daily pharmacotherapy regimens prescribed.",
    "history": "Amateur endurance runner. High physical load capacity. Non-smoker. High HRV indexes."
  },
  "sammi": {
    "key": "sammi",
    "name": "Sammi",
    "id": "TWIN-1085",
    "age": 19,
    "gender": "Female",
    "profileName": "Type 1 Diabetic",
    "cyp2d6Status": "CYP2D6 *1/*1 (Normal Metabolizer)",
    "baseHR": 74,
    "hrvBias": 0.9,
    "bpSysBias": 2,
    "bpDiaBias": 1,
    "rrBias": 0,
    "cgmRiseRate": 3.4,
    "insulinResistance": 2.5,
    "baseEF": 61,
    "baseSPO2": 98.5,
    "tempBias": 0.0,
    "metoprololClFactor": 0.11,
    "height": "162 cm",
    "weight": "51 kg",
    "bloodGroup": "AB-",
    "emergencyContact": "Helen Carter (+1-555-0144)",
    "diagnoses": "Type 1 Diabetes Mellitus (T1DM). High glycemic variability. Risk of insulin-induced hypoglycemic shock.",
    "labs": [
      { "name": "HbA1c", "value": "7.8%", "status": "Poor Control" },
      { "name": "Total Cholesterol", "value": "162 mg/dL", "status": "Normal" },
      { "name": "Serum Creatinine", "value": "0.7 mg/dL", "status": "Normal" }
    ],
    "prescriptions": "Humalog (rapid-acting bolus insulin) titrated to carbs; Lantus 15U (basal insulin) QD.",
    "history": "Diagnosed T1DM at age 8. Lacks endogenous insulin production. High glycemic response to simple carbohydrates."
  },
  "sailu": {
    "key": "sailu",
    "name": "Sailu",
    "id": "TWIN-7743",
    "age": 68,
    "gender": "Female",
    "profileName": "Geriatric Cardiopulmonary Risk",
    "cyp2d6Status": "CYP2D6 *2/*17 (Intermediate Metabolizer)",
    "baseHR": 78,
    "hrvBias": 0.65,
    "bpSysBias": 14,
    "bpDiaBias": 6,
    "rrBias": 2,
    "cgmRiseRate": 2.2,
    "insulinResistance": 1.45,
    "baseEF": 51,
    "baseSPO2": 95.5,
    "tempBias": -0.3,
    "metoprololClFactor": 0.046,
    "height": "155 cm",
    "weight": "59 kg",
    "bloodGroup": "O-",
    "emergencyContact": "Kiran Kumar (+91-9444011223)",
    "diagnoses": "Geriatric cardiopulmonary weakness. Age-related arterial stiffening. Borderline renal filtration clearance.",
    "labs": [
      { "name": "HbA1c", "value": "6.2%", "status": "Pre-Diabetic" },
      { "name": "Total Cholesterol", "value": "215 mg/dL", "status": "Borderline High" },
      { "name": "Serum Creatinine", "value": "1.1 mg/dL", "status": "Age-Appropriate" }
    ],
    "prescriptions": "Lisinopril 5mg QD (ACE Inhibitor).",
    "history": "Sedentary senior citizen. Experiences mild dyspnea upon moderate exertion (stairs). Decreased cardiac ejection baseline."
  }
}

# --- REST ENDPOINTS ---

@app.get("/")
def get_root():
    return {
        "status": "active",
        "service": "HealthTwin AI Bio-Telemetry Microservice",
        "engine": "FastAPI + Python 3.11"
    }

@app.get("/api/patients", response_model=Dict[str, Any])
def get_all_patients():
    """Retrieves all clinical digital twin patient profiles."""
    return PATIENT_DB

@app.get("/api/patients/{key}", response_model=Dict[str, Any])
def get_patient_profile(key: str):
    """Retrieves an individual biological twin profile details."""
    if key not in PATIENT_DB:
        raise HTTPException(status_code=404, detail="Patient profile key not identified.")
    return PATIENT_DB[key]

@app.post("/api/predictions", response_model=List[RiskAssessmentResponse])
def calculate_ai_risks(data: TelemetryData, patient_key: str = "sarah"):
    """Computes real-time disease risk assessments using mathematical telemetry parameters."""
    if patient_key not in PATIENT_DB:
        raise HTTPException(status_code=404, detail="Active patient key not identified.")
    
    patient = PATIENT_DB[patient_key]
    
    # Simple algorithmic rules modeling neural network logic
    heart_risk = 20
    hypertension_risk = 15
    diabetes_risk = 10
    
    # 1. Cardio risk factors
    if patient_key == "balaji":
        heart_risk += 45
    elif patient_key == "sailu":
        heart_risk += 35
    
    if data.hr > 120 or data.hrv < 25:
        heart_risk += 20
    
    # 2. Vascular tension factors
    if patient_key == "balaji":
        hypertension_risk += 55
    if data.bpSys > 140:
        hypertension_risk += 25
        
    # 3. Glycemia parameters
    if patient_key == "sammi":
        diabetes_risk = 100
    elif patient_key == "balaji":
        diabetes_risk += 35
    
    if data.cgm > 180:
        diabetes_risk += 15

    # Cap percentages at 100
    heart_risk = min(100, heart_risk)
    hypertension_risk = min(100, hypertension_risk)
    diabetes_risk = min(100, diabetes_risk)

    return [
        {
            "disease": "Heart Disease Risk",
            "percentage": heart_risk,
            "category": "High" if heart_risk > 60 else "Moderate" if heart_risk > 25 else "Low",
            "confidence": 94,
            "trend": "worsening" if data.hr > 110 else "stable",
            "reason": f"Genomic markers indicate cardiovascular predispositions. Active HR is {data.hr} BPM."
        },
        {
            "disease": "Diabetes Mellitus Risk",
            "percentage": diabetes_risk,
            "category": "Critical" if diabetes_risk == 100 else "High" if diabetes_risk > 60 else "Moderate" if diabetes_risk > 25 else "Low",
            "confidence": 98,
            "trend": "worsening" if data.cgm > 170 else "stable",
            "reason": f"Active continuous glucose values are {data.cgm} mg/dL (Ref: 70-140)."
        },
        {
            "disease": "Hypertension Risk",
            "percentage": hypertension_risk,
            "category": "High" if hypertension_risk > 60 else "Moderate" if hypertension_risk > 25 else "Low",
            "confidence": 96,
            "trend": "worsening" if data.bpSys > 135 else "stable",
            "reason": f"Vascular pressure reads at {data.bpSys} mmHg systolic boundary. PGx: {patient['cyp2d6Status']}."
        }
      ]

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
