# AI-Powered Predictive Maintenance System for IoT Devices 🚀

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3-orange.svg)](https://scikit-learn.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

An end-to-end industrial IoT solution that uses **Machine Learning** to predict equipment failures before they occur. This project simulates real-world sensor data (Temperature, Vibration, Current) and provides an AI-driven dashboard for real-time monitoring and failure alerts.

Prototype Link : [Link](https://ai.studio/apps/a0451f25-f87b-4c26-84ce-c0eb30b94ee1?fullscreenApplet=true)

---

## 📖 Project Overview

### What is AI-Powered Predictive Maintenance?
In simple terms, it's like a "health check" for industrial machines. Instead of fixing a machine *after* it breaks (Reactive) or fixing it on a fixed schedule (Preventative), we use AI to predict *exactly when* it might fail based on its current behavior.

### The Problem It Solves
- **Reduces Downtime:** Prevents unexpected factory shutdowns.
- **Saves Cost:** Avoids expensive emergency repairs.
- **Improves Safety:** Detects overheating or mechanical wear before it becomes dangerous.

---

## 🛠️ Tech Stack

- **Language:** Python 3.9+
- **Machine Learning:** Scikit-Learn (Random Forest), Pandas, NumPy
- **Backend API:** Flask
- **Frontend Dashboard:** React, Vite, Tailwind CSS, Recharts, Framer Motion
- **IoT Simulation:** Virtual sensor telemetry generator

---

## 🏗️ Project Architecture

```text
[ IoT Sensors ] ----> [ Data Preprocessing ] ----> [ AI Model (Random Forest) ]
      |                        |                           |
(Temp, Vib, Curr)        (Normalization)             (Failure Prediction)
      |                        |                           |
      v                        v                           v
[ Flask API ] <----------------------------------- [ React Dashboard ]
```

---

## 📂 Folder Structure

```text
AI-Predictive-Maintenance-IoT/
├── data/               # Simulated sensor datasets (CSV)
├── models/             # Trained ML models (.pkl)
├── src/                # Python Source Code
│   ├── train_model.py  # Script to generate data & train AI
│   └── app.py          # Flask API for real-time inference
├── requirements.txt    # Python dependencies
├── README.md           # Project documentation
└── (React App Files)   # Dashboard source code
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/AI-Predictive-Maintenance-IoT.git
cd AI-Predictive-Maintenance-IoT
```

### 2. Setup Python Environment
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Train the AI Model
Run the training script to generate the dataset and save the trained model.
```bash
python src/train_model.py
```

### 4. Run the API
Start the Flask server to handle prediction requests.
```bash
python src/app.py
```

---

## 📊 Results & Screenshots

### Real-Time Telemetry
The dashboard visualizes live streams of Temperature, Vibration, and Current. When the "Failure Drift" is triggered, the AI detects the abnormal patterns and shifts the status from **Normal** to **Critical**.

### Model Performance
- **Algorithm:** Random Forest Classifier
- **Accuracy:** ~98% (on simulated data)
- **Features:** Temperature, Vibration, Current
  
<img width="1513" height="878" alt="Screenshot 2026-04-13 200851" src="https://github.com/user-attachments/assets/f70f2bfe-b8c8-48fa-ab0a-2f1d85c90039" />

<img width="1337" height="855" alt="Screenshot 2026-04-13 200905" src="https://github.com/user-attachments/assets/a02a6ffc-8230-4057-bb3c-072b93a70061" />

---

## 🎓 Learning Outcomes
- Implementing **Random Forest** for binary classification.
- Building **RESTful APIs** with Flask for ML model deployment.
- Creating **Real-time Data Visualizations** with React and Recharts.
- Understanding **Industrial IoT** workflows and predictive maintenance logic.

