import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    language_preference: Optional[str] = "en"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResetPassword(BaseModel):
    email: EmailStr
    new_password: str = Field(..., min_length=6)

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    language_preference: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    language_preference: str
    is_admin: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Detection Schemas
class DetectionRequest(BaseModel):
    message_text: str = Field(..., min_length=3, max_length=5000)
    language: Optional[str] = "en"

class DetectionResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    message_text: str
    risk_score: int
    risk_level: str
    matched_rules: List[str]
    explanation: List[str]
    language: str
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Report Schemas
class ReportCreate(BaseModel):
    detection_id: Optional[int] = None
    message_text: str
    category: str
    reason: str
    notes: Optional[str] = None

class ReportResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    detection_id: Optional[int] = None
    message_text: str
    category: str
    reason: str
    notes: Optional[str] = None
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Pattern Schemas
class PatternCreate(BaseModel):
    pattern_name: str
    pattern_type: str
    regex_or_keyword: str
    weight: int
    category: str
    description: Optional[str] = None

class PatternResponse(BaseModel):
    id: int
    pattern_name: str
    pattern_type: str
    regex_or_keyword: str
    weight: int
    category: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Dashboard Schemas
class RiskDistribution(BaseModel):
    name: str
    value: int
    color: str

class DailyDetection(BaseModel):
    date: str
    count: int
    high_risk: int

class DashboardStats(BaseModel):
    total_detections: int
    high_risk: int
    medium_risk: int
    low_risk: int
    reported_scams: int
    detection_accuracy: float
    risk_distribution: List[RiskDistribution]
    daily_counts: List[DailyDetection]
    recent_detections: List[DetectionResponse]
