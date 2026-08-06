# Digital Fraud Shield — API Documentation

This document describes all REST API endpoints provided by the FastAPI backend for **Digital Fraud Shield**.

Base URL: `http://localhost:8000` (Local) or deployed backend URL.

---

## 1. Authentication Endpoints (`/auth`)

### `POST /auth/register`
Registers a new user account.
- **Request Body**:
  ```json
  {
    "name": "Ramesh Kumar",
    "email": "ramesh@example.com",
    "password": "Password@123",
    "language_preference": "en"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "name": "Ramesh Kumar",
      "email": "ramesh@example.com",
      "language_preference": "en"
    }
  }
  ```

### `POST /auth/login`
Authenticates a user with email and password.
- **Request Body**:
  ```json
  {
    "email": "ramesh@example.com",
    "password": "Password@123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "name": "Ramesh Kumar",
      "email": "ramesh@example.com",
      "language_preference": "en"
    }
  }
  ```

### `POST /auth/logout`
Logs out current session.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
  ```json
  { "message": "Logged out successfully" }
  ```

### `POST /auth/reset-password`
Resets password for registered user email.
- **Request Body**:
  ```json
  {
    "email": "ramesh@example.com",
    "new_password": "NewPassword@123"
  }
  ```
- **Response**: `200 OK`
  ```json
  { "message": "Password reset successfully" }
  ```

---

## 2. User Profile Endpoints (`/user`)

### `GET /user/profile`
Fetches current logged-in user profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
  ```json
  {
    "id": 1,
    "name": "Ramesh Kumar",
    "email": "ramesh@example.com",
    "language_preference": "en",
    "created_at": "2026-08-05T12:00:00"
  }
  ```

### `PUT /user/profile`
Updates profile details or language preference.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "Ramesh Kumar Updated",
    "language_preference": "ta"
  }
  ```
- **Response**: `200 OK`

---

## 3. Fraud Detection Engine (`/detect` & `/detections`)

### `POST /detect`
Analyzes a pasted SMS / WhatsApp / UPI message for fraud signals.
- **Headers**: Optional `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "message_text": "URGENT: Your SBI Electricity bill is unpaid. Connection disconnected tonight at 9:30 PM. Call 9876543210 immediately to pay via UPI PIN.",
    "language": "en"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": 12,
    "message_text": "...",
    "risk_score": 85,
    "risk_level": "High",
    "matched_rules": [
      "contains_upi_pin",
      "urgency_words",
      "kyc_suspension",
      "click_link"
    ],
    "explanation": [
      "It asks for your UPI PIN (never share your PIN to receive money).",
      "Uses urgent language threatening immediate disconnection.",
      "Asks you to contact an unknown individual phone number."
    ],
    "language": "en",
    "created_at": "2026-08-05T22:30:00"
  }
  ```

### `GET /detections`
Lists recent fraud detections with filtering options.
- **QueryParams**: `risk_level` (Low, Medium, High), `status`, `search`, `limit`, `offset`
- **Response**: `200 OK` array of detection records.

### `GET /detections/{id}`
Returns details for a specific detection record by ID.

---

## 4. Scam Reporting Endpoints (`/reports`)

### `POST /reports`
Submits a scam report for community flag and admin review.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "detection_id": 12,
    "message_text": "...",
    "category": "UPI Fraud",
    "reason": "Phishing connection scam",
    "notes": "Called number and they asked for Google Pay pin"
  }
  ```
- **Response**: `201 Created`

### `GET /reports`
Retrieves submitted reports.

---

## 5. Pattern Management Endpoints (`/patterns`)

### `GET /patterns`
Gets active fraud detection rules and patterns.

### `POST /patterns`
Adds a new detection pattern (Admin).

---

## 6. Dashboard Metrics (`/dashboard`)

### `GET /dashboard`
Provides aggregated statistics for the main dashboard:
- Total Detections
- Count of High, Medium, and Low risk detections
- Total Reported Scams
- Engine Accuracy Percentage (e.g. 96.4%)
- Risk distribution breakdown
- 7-day daily detection counts
- Top recent detection table entries
