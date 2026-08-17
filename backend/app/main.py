import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, Pattern, Detection, Report
from app.security import get_password_hash
from app.routers import auth, user, detect, reports, patterns, dashboard, scan, chatbot

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("fraud_shield")

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Production-Ready MVP protecting elderly and rural users from SMS & UPI financial scams in India.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Health Check Endpoints (for Render / uptime monitoring)
@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "database": "connected"
    }

# Setup CORS for cross-origin frontend (e.g. Vercel) and same-origin fallback access
raw_cors = settings.CORS_ORIGINS.strip() if settings.CORS_ORIGINS else "*"
if raw_cors == "*":
    cors_origins = ["*"]
    allow_credentials = False
else:
    cors_origins = [o.strip() for o in raw_cors.split(",") if o.strip()]
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# API ROUTER REGISTRATION (Registered BEFORE Static Files to prevent shadowing)
# -----------------------------------------------------------------------------

# Register Routers (Direct routes)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(detect.router)
app.include_router(reports.router)
app.include_router(patterns.router)
app.include_router(dashboard.router)
app.include_router(scan.router)
app.include_router(chatbot.router)

# Register Routers with /api prefix for frontend Axios compatibility
app.include_router(auth.router, prefix="/api")
app.include_router(user.router, prefix="/api")
app.include_router(detect.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(patterns.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(scan.router, prefix="/api")
app.include_router(chatbot.router, prefix="/api")

@app.on_event("startup")
def startup_event():
    """Seed initial demo user & detection patterns if database is empty."""
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        if user_count == 0:
            logger.info("Seeding initial default demo users...")
            demo_user = User(
                name="Demo User",
                email="demo@fraudshield.in",
                hashed_password=get_password_hash("Password@123"),
                language_preference="en",
                is_admin=False
            )
            admin_user = User(
                name="Admin Officer",
                email="admin@fraudshield.in",
                hashed_password=get_password_hash("Password@123"),
                language_preference="en",
                is_admin=True
            )
            db.add_all([demo_user, admin_user])
            db.commit()

        pattern_count = db.query(Pattern).count()
        if pattern_count == 0:
            logger.info("Seeding fraud detection rules...")
            default_patterns = [
                Pattern(pattern_name="OTP Request", pattern_type="keyword", regex_or_keyword="otp", weight=25, category="Credential Theft", description="Asks for OTP code"),
                Pattern(pattern_name="UPI PIN Request", pattern_type="keyword", regex_or_keyword="upi pin", weight=20, category="Financial Fraud", description="Asks to enter PIN to receive money"),
                Pattern(pattern_name="Fake Urgency", pattern_type="keyword", regex_or_keyword="urgent", weight=20, category="Social Engineering", description="Threatens account or connection cutoff"),
                Pattern(pattern_name="Phishing URL", pattern_type="regex", regex_or_keyword="http", weight=15, category="Phishing", description="Contains external link"),
                Pattern(pattern_name="Personal VPA", pattern_type="regex", regex_or_keyword="@", weight=20, category="Fake VPA", description="Unknown personal UPI handle"),
                Pattern(pattern_name="KYC Block Threat", pattern_type="keyword", regex_or_keyword="kyc", weight=20, category="Banking Fraud", description="Fake KYC expiry warning"),
            ]
            db.add_all(default_patterns)
            db.commit()

        det_count = db.query(Detection).count()
        if det_count == 0:
            logger.info("Seeding sample historical detections...")
            samples = [
                Detection(
                    user_id=1,
                    message_text="URGENT: Your SBI account is suspended due to pending KYC update. Click http://sbi-netverify.com immediately.",
                    risk_score=80,
                    risk_level="High",
                    matched_rules=["contains_kyc", "click_link", "urgency_words"],
                    explanation=[
                        "It asks for your bank KYC update urgently.",
                        "Contains a suspicious unverified website link.",
                        "Uses high-pressure urgent language threatening account suspension."
                    ],
                    language="en",
                    status="Reported"
                ),
                Detection(
                    user_id=1,
                    message_text="ELECTRICITY NOTICE: Connection will be cut at 9:30 PM today due to unpaid bill. Send Rs. 1200 via UPI to 9876543210@paytm.",
                    risk_score=75,
                    risk_level="High",
                    matched_rules=["urgency_words", "unknown_upi", "contains_upi_pin"],
                    explanation=[
                        "Uses high-pressure fake urgency threatening electricity disconnection.",
                        "Directs payment to an unverified personal UPI handle."
                    ],
                    language="en",
                    status="Reported"
                )
            ]
            db.add_all(samples)
            db.commit()

    finally:
        db.close()

# -----------------------------------------------------------------------------
# STATIC FILE MOUNTING (MUST BE REGISTERED LAST TO PREVENT SHADOWING API ROUTES)
# -----------------------------------------------------------------------------
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
