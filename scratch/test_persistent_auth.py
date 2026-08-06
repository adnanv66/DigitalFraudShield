import requests

BASE_URL = "http://127.0.0.1:8135"



def test_persistent_login():
    print("--- Testing Persistent Auto-Login & Refresh Token Endpoint ---")
    
    # 1. Login to get access & refresh tokens
    login_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "demo@fraudshield.in",
        "password": "Password@123"
    })
    print("Login Response Code:", login_res.status_code)
    assert login_res.status_code == 200
    
    data = login_res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    print("Access Token Generated:", data["access_token"][:30] + "...")
    print("Refresh Token Generated:", data["refresh_token"][:30] + "...")

    # 2. Test Refresh Token Endpoint (/auth/refresh)
    refresh_res = requests.post(f"{BASE_URL}/auth/refresh", json={
        "refresh_token": data["refresh_token"]
    })
    print("Refresh Endpoint Response Code:", refresh_res.status_code)
    assert refresh_res.status_code == 200
    
    refreshed_data = refresh_res.json()
    assert "access_token" in refreshed_data
    assert "refresh_token" in refreshed_data
    print("New Access Token Obtained:", refreshed_data["access_token"][:30] + "...")

    # 3. Test Profile call with newly refreshed access token
    profile_res = requests.get(f"{BASE_URL}/user/profile", headers={
        "Authorization": f"Bearer {refreshed_data['access_token']}"
    })
    print("Profile Access Code:", profile_res.status_code)
    assert profile_res.status_code == 200
    print("Auto-Logged User Name:", profile_res.json()["name"])

    print("\nSUCCESS: PERSISTENT AUTO-LOGIN & REFRESH TOKEN ENGINE VERIFIED 100% WORKING!")

if __name__ == "__main__":
    test_persistent_login()
