# Digital Fraud Shield 🛡️

**Digital Fraud Shield** is a production-ready, full-stack web application built to protect elderly, rural, and vulnerable users from SMS, WhatsApp, and UPI financial scams in India.

It features a rule-based AI fraud detection engine, multi-language support (**English**, **Tamil**, **Hindi**), high-accessibility features (**High Contrast Mode**, **Large Text Mode**, ARIA tags), an interactive analytics dashboard, transparent explainable risk breakdowns, and scam reporting workflows.

---

## 🌟 Key Features

1. **Multilingual Fraud Detection**:
   - Paste SMS / UPI message and analyze instantly.
   - Transparent scoring engine (+25 OTP, +20 UPI PIN, +20 Urgency, +15 Link, +20 Unknown UPI handle, +15 Prize, +15 Refund, +20 KYC, +15 Lottery).
   - Low (0-30), Medium (31-60), and High (61+) Risk categorization.
   - Bulleted explainability breakdown in English, Tamil, or Hindi.

2. **Accessibility-First UI**:
   - Built for elderly & rural users with large fonts, clear color coding, high-contrast toggle, and full keyboard navigation.

3. **Analytics Dashboard**:
   - Real-time stat cards (Total Detections, High/Med/Low Risk, Reported Scams, Accuracy).
   - Recharts visual charts for Risk Distribution and Daily Detection Trends.
   - Filterable & searchable detection history log.

4. **Community Scam Reporting**:
   - User report submission modal with categories, reason, and notes.
   - Database storage requiring admin approval for pattern updates.

5. **User Profile & Customization**:
   - JWT Auth (Register, Login, Password Reset, Logout).
   - Preferences for Language (EN, TA, HI), Dark Mode, High Contrast Mode, and Text Scale.

---

## 📁 Project Structure

```text
├── backend/            # FastAPI Python 3.12 Backend
│   ├── app/            # Main FastAPI application, models, schemas, routers
│   ├── Dockerfile      # Docker setup for backend
│   └── requirements.txt
├── frontend/           # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/            # Components, pages, i18n, context
│   └── package.json
├── database/           # Database DDL schemas and seed scripts
│   ├── schema.sql      # Supabase PostgreSQL schema DDL
│   └── seed.sql        # Demo seed data & initial fraud rules
├── docs/               # Documentation
│   └── API_DOCUMENTATION.md
├── public/             # Static public assets
├── shared/             # Shared constants & configurations
├── docker-compose.yml  # Local multi-container Docker deployment
├── render.yaml         # Render deployment blueprint for backend
└── vercel.json         # Vercel deployment configuration for frontend
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ and `npm`
- Python 3.10+ (Python 3.12 recommended)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
> The backend automatically initializes a local SQLite database (`fraud_shield.db`) pre-populated with default patterns and seed data if no PostgreSQL connection is provided.

Interactive API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## ⚡ Vercel Public Web Deployment

The project is pre-configured with Full-Stack Vercel Serverless Function support ([`vercel.json`](file:///c:/Adnan%20Drone/SIH%202/vercel.json) and [`api/index.py`](file:///c:/Adnan%20Drone/SIH%202/api/index.py)).

### Deploying via Vercel CLI:
```bash
npx vercel --prod
```

### Deploying via Vercel Web Dashboard:
1. Push project to GitHub.
2. Go to [https://vercel.com/new](https://vercel.com/new) and import your repo.
3. Vercel automatically deploys the frontend and python serverless backend to:
   `https://digital-fraud-shield.vercel.app`

---

## 🔒 Security & Best Practices

- **JWT Authentication**: Secure HttpOnly / Bearer token authentication header.
- **SQLAlchemy & Parameterized Queries**: Complete protection against SQL injection.
- **Input Sanitization**: Cleaned user inputs and strict Pydantic validation.
- **CORS Protection**: Scoped origins configurable via environment variables.

---

## 📄 License
MIT License. Built for Social Impact & Digital Security.

