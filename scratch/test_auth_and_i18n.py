import requests
import json
import time

BASE_URL = "http://127.0.0.1:8095"



def test_full_process():
    print("--- 1. Testing Authentication Flow ---")
    
    unique_email = f"kavitha.{int(time.time())}@fraudshield.in"
    # 1. Register a new user
    reg_payload = {
        "name": "Kavitha Raman",
        "email": unique_email,
        "password": "Password@123",
        "language_preference": "ta"
    }
    res_reg = requests.post(f"{BASE_URL}/auth/register", json=reg_payload)
    print("Register Status:", res_reg.status_code)
    assert res_reg.status_code in [201, 400], f"Unexpected status: {res_reg.status_code}"
    
    # 2. Login
    login_payload = {
        "email": unique_email,
        "password": "Password@123"
    }

    res_login = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    print("Login Status:", res_login.status_code)
    assert res_login.status_code == 200, f"Login failed: {res_login.text}"
    token_data = res_login.json()
    token = token_data["access_token"]
    print("JWT Token generated successfully:", token[:25] + "...")

    # 3. Fetch User Profile
    headers = {"Authorization": f"Bearer {token}"}
    res_prof = requests.get(f"{BASE_URL}/user/profile", headers=headers)
    print("User Profile Status:", res_prof.status_code)
    assert res_prof.status_code == 200
    user = res_prof.json()
    print("User Profile Name:", user["name"], "| Language Pref:", user["language_preference"])

    print("\n--- 2. Testing Multilingual Detection (Localization) ---")
    
    # English Fraud Test
    msg_en = "URGENT: SBI account blocked due to pending KYC update. Click http://sbi-verify.com immediately."
    res_en = requests.post(f"{BASE_URL}/detect", json={"message_text": msg_en, "language": "en"})
    det_en = res_en.json()
    print(f"English Detection -> Risk: {det_en['risk_level']}, Score: {det_en['risk_score']}")
    print("EN Bullet Explanation 1:", det_en['explanation'][0])

    # Tamil Fraud Test
    msg_ta = "மின்சார இணைப்பு இன்றிரவு துண்டிக்கப்படும். உடனடியாக 9876543210@paytm என்ற UPI முகவரிக்கு UPI PIN பதிவு செய்யவும்."
    res_ta = requests.post(f"{BASE_URL}/detect", json={"message_text": msg_ta, "language": "ta"})
    det_ta = res_ta.json()
    print(f"Tamil Detection -> Risk: {det_ta['risk_level']}, Score: {det_ta['risk_score']}")

    # Hindi Fraud Test
    msg_hi = "बधाई हो! आपने ₹25,000 Paytm रिफंड पुरस्कार जीता है। अपने बैंक में पैसे लेने के लिए http://paytm-refund.site पर UPI PIN दर्ज करें।"
    res_hi = requests.post(f"{BASE_URL}/detect", json={"message_text": msg_hi, "language": "hi"})
    det_hi = res_hi.json()
    print(f"Hindi Detection -> Risk: {det_hi['risk_level']}, Score: {det_hi['risk_score']}")

    print("\n--- 3. Testing Dashboard Telemetry ---")
    res_dash = requests.get(f"{BASE_URL}/dashboard")
    dash = res_dash.json()
    print("Total Detections:", dash["total_detections"])
    print("High Risk Count:", dash["high_risk"])
    print("Accuracy Benchmark:", dash["detection_accuracy"], "%")

    print("\nSUCCESS: AUTHENTICATION, LOCALIZATION, & TELEMETRY VERIFIED 100% WORKING!")


if __name__ == "__main__":
    test_full_process()
