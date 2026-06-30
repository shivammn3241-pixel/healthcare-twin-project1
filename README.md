# HealthTwin AI - Next-Generation Healthcare Digital Twin Portal

**HealthTwin AI** is a production-quality, modern, AI-powered Healthcare Digital Twin web application prototype designed for precision medicine. By integrating real-time telemetry, predictive neural forecasting models, and interactive anatomical visualizations, the portal replicates clinical patient homeostatic states inside a cybernetic dashboard environment.

Suitable as a university final-year project, the portal showcases an exceptional glassmorphism clinical layout, high-performance interactive SVGs with glowing organ indicators, mathematical feedback loops simulating drug and meal pharmacokinetics, and a sweeping ECG vital waveform monitor.

---

## Technical Stack

*   **Frontend**:
    *   React.js 18 (TypeScript)
    *   Vite (High-speed bundler compiler)
    *   Tailwind CSS (Clinical custom palette, dark mode & layout system)
    *   Framer Motion (Smooth transitions, cards animations & glowing effects)
    *   Recharts (Live ECG area trends, sleep stack bar charts, step summaries, and radar maps)
    *   Lucide React (Minimalist clinical vector icon markers)
*   **Backend**:
    *   Python 3.11
    *   FastAPI (Microservice REST framework)
    *   Uvicorn (Asynchronous server gateway interface)
    *   Pydantic (Strict request schema verification)

---

## Main Portals & Features

1.  **Landing Page**: Cinematic clinical marketing page containing hero visualizers, product specifications cards, and precision medicine document summaries.
2.  **Authentication Security**: Futuristic login, registration, and forgot keys dialog panels utilizing secure session storage simulation.
3.  **Digital Twin Torso (Post-Login Home)**:
    *   An interactive cybernetic SVG human wireframe showcasing moving arterial/venous vascular flows (speed scales dynamically with simulated heart rate).
    *   Organ indicators (Brain 🧠, Heart ❤️, Lungs 🫁, Pancreas 💧, Kidneys 💧) that glow on hover and dynamically shift indicator lights (Green: Nominal, Yellow: Warning, Red: Critical) depending on vital signals.
    *   Organ detail sliding HUD: displays localized vital signals, Recharts line trends, AI confidence diagnostics, and custom physiological action checklists.
4.  **Clinical Dashboard Vitals**:
    *   HTML5 Canvas Sweeping ECG waveform monitor rendering accurate P-Q-R-S-T segments with Bazett's heart rate index scaling, respiration baseline wander, and sensor noise.
    *   What-If physiological parameters sliders (Sleep deficit, Activity range, Stress factors, Medication adherence) feeding parameters directly into mathematical differential equations.
    *   Scenario and Incident injection consoles: trigger Ventricular Tachycardia, Hypoglycemic glycemic shock, intense cardiovascular workout, or deep sleep.
    *   Pharmacological drug dosing: administer Beta-Blockers (Metoprolol), ACE Inhibitors (Lisinopril), Metformin, or Insulin to counteract physiological emergencies.
5.  **AI Predictions**: Comprehensive risk assessment panels computing Heart Disease, Diabetes, and Hypertension probabilities, listing diagnostic reasons.
6.  **Interventions & Reports**: Active checklists that adjust the twin's health index when completed, and a print layout enabling PDF reports download.

---

## Installation & Running Instructions

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (Version 18.0 or higher is required)
*   [Python 3.11+](https://www.python.org/downloads/)

> [!TIP]
> On Windows, you can install Node.js quickly from your PowerShell terminal using winget:
> ```powershell
> winget install OpenJS.NodeJS
> ```
> Restart your terminal window after installation to update environment PATH variables.

### 2. Frontend Setup (React.js)
Open your terminal in the project root directory and execute the following:
```bash
# Install frontend package dependencies
npm install

# Start the Vite React development server
npm run dev
```
Open your browser to: [http://localhost:5173](http://localhost:5173)

### 3. Backend Setup (FastAPI)
Open a separate terminal window, navigate to the `backend/` folder, and run:
```bash
# Install backend Python packages
pip install -r requirements.txt

# Launch the FastAPI REST gateway
python main.py
```
View Swagger API documentation at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Physiological Simulation Model Specs

The backend and frontend state engines run custom first-order differential equations simulating homeostatic drives:
*   **Pharmacokinetics**: Beta-blockers (metoprolol) decay in the blood and block sympathetic HR rises, while ACE Inhibitors reduce BP values. Metformin decreases insulin resistance, and rapid-acting insulin bolus clears blood glucose levels.
*   **CYP2D6 Poor Metabolizer Risk**: In Balaji's profile, the genetic clearance factor `metoprololClFactor` is set to $0.012$ (10x slower than normal), causing Metoprolol to remain in the serum for extended cycles, warning clinicians of severe pgx bradycardia risks.
*   **Glycemia Digestion**: Ingesting food adds carbohydrates, complex fiber, and fats to the gut, releasing glucose into the blood stream over time (modulated by fiber and fat delays), triggering pancreatic insulin feedback responses.
