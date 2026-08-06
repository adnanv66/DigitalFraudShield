# 🚀 Native Render Deployment Guide (No Docker Required)

Your project uses a native Shell Build script **[`render-build.sh`](file:///c:/Adnan%20Drone/SIH%202/render-build.sh)** and **[`render.yaml`](file:///c:/Adnan%20Drone/SIH%202/render.yaml)** for 1-click deployment on **Render Cloud**.

---

## 🛠️ Step-by-Step Render Deployment Instructions

### Method 1: Render Blueprint (1-Click Automated)

1. Open your browser and navigate to: 👉 **[https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)**
2. Click **"New Blueprint Instance"**.
3. Connect your GitHub repository: `https://github.com/adnanv66/DigitalFraudShield`
4. Render will automatically execute [`render-build.sh`](file:///c:/Adnan%20Drone/SIH%202/render-build.sh), install dependencies, build the React UI, and launch the Python backend:
   👉 **`https://digital-fraud-shield.onrender.com`**

---

### Method 2: Manual Web Service Settings (Native Python)

- **Environment**: `Python 3`
- **Build Command**: `./render-build.sh`
- **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
