# HealthTwin AI - Clinical Backend Microservice

This directory contains a **FastAPI** REST API backend for the **HealthTwin AI** Healthcare Digital Twin platform. It is designed to serve as a secure gateway for patient records and predictive diagnostics.

## Features

1.  **Patient Registry**: Rest API endpoints to retrieve digital twin profiles, genomic CYP2D6 characteristics, active EHR diagnoses, medication prescriptions, and lifestyle histories.
2.  **Predictive Diagnostics**: POST endpoints that receive real-time vital sign parameters and calculate corresponding heart disease, diabetes, and hypertension risk percentages using clinical heuristic models.

## How to Run Locally

### 1. Prerequisites
Make sure you have Python 3.11+ installed. Verify with:
```bash
python --version
```

### 2. Install Dependencies
Run the following pip command in your terminal from the `backend/` directory:
```bash
pip install -r requirements.txt
```

### 3. Start the Server
Run the Uvicorn dev server command:
```bash
python main.py
```
Or:
```bash
uvicorn main:app --reload --port 8000
```

The API documentation will be available interactively at:
*   Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
*   ReDoc UI: [http://127.0.5.1:8000/redoc](http://127.0.0.1:8000/redoc)
