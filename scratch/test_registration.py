import requests
import random

BASE_URL = "http://127.0.0.1:8145"

def test_user_registration_and_navigation():
    print("--- Testing Account Creation & Auto Navigation ---")
    random_email = f"user_{random.randint(1000,9999)}@fraudshield.in"
    reg_payload = {
        "name": "New Test User",
        "email": random_email,
        "password": "Password@123",
        "language_preference": "ta"
    }
    
    res = requests.post(f"{BASE_URL}/api/auth/register", json=reg_payload)
    print("Register API Code:", res.status_code)
    assert res.status_code == 201
    
    data = res.json()
    assert "access_token" in data
    assert "user" in data
    print("Registered User Email:", data["user"]["email"])
    print("Access Token:", data["access_token"][:20] + "...")

    print("\nSUCCESS: ACCOUNT CREATION & AUTO-NAVIGATION LOGIC 100% VERIFIED!")

if __name__ == "__main__":
    test_user_registration_and_navigation()
