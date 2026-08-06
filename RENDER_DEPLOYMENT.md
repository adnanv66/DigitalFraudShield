# 🚀 Render Deployment Guide for Digital Fraud Shield

Your project is 100% prepared and optimized for 1-click deployment on **Render Cloud**.

---

## 🛠️ Step-by-Step Render Deployment Instructions

### Method 1: Render Blueprint (1-Click Automated - Recommended)

1. Open your browser and navigate to: 👉 **[https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)**
2. Click **"New Blueprint Instance"**.
3. Connect your GitHub repository: `https://github.com/adnanv66/DigitalFraudShield`
4. Render will automatically read [`render.yaml`](file:///c:/Adnan%20Drone/SIH%202/render.yaml) and [`Dockerfile`](file:///c:/Adnan%20Drone/SIH%202/Dockerfile), build your React frontend & Python backend, and deploy your live URL:
   👉 **`https://digital-fraud-shield.onrender.com`**

---

### Method 2: Manual Web Service on Render

1. Go to 👉 **[https://dashboard.render.com](https://dashboard.render.com)**
2. Click **"New +"** -> **"Web Service"**.
3. Connect your GitHub repository: `adnanv66/DigitalFraudShield`.
4. Choose **"Docker"** as the Environment.
5. Click **"Create Web Service"**.

Render will automatically build the multi-stage Docker container and publish your live full-stack app!
