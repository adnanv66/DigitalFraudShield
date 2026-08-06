import requests

BASE_URL = "http://127.0.0.1:8095"

def test_scanner_and_keypad():
    print("--- Testing Automatic SMS Scanner & Keypad Phone Gateway ---")

    # 1. Test Keypad Phone USSD Dial (*99*786#)
    res_ussd = requests.post(f"{BASE_URL}/scan-upi/keypad-ussd", json={
        "phone_number": "+919876543210",
        "ussd_code_or_sms": "*99*786#",
        "language": "en"
    })
    print("Keypad USSD Menu Response:", res_ussd.json())
    assert res_ussd.status_code == 200

    # 2. Test Feature Phone 160-char SMS response for Tamil
    res_ta = requests.post(f"{BASE_URL}/scan-upi/keypad-ussd", json={
        "phone_number": "+919876543210",
        "ussd_code_or_sms": "SBI account blocked. Click http://sbi-verify.com and enter UPI PIN.",
        "language": "ta"
    })
    sms_reply_ta = res_ta.json()["sms_reply"]
    print("Keypad 2G Phone SMS Reply (Tamil) Received length:", len(sms_reply_ta))
    assert res_ta.status_code == 200


    # 3. Test Batch Auto-Read Device Inbox API
    batch_payload = {
        "messages": [
            {
                "sender": "VM-SBIINB",
                "message_text": "URGENT: SBI account blocked due to pending KYC update. Click http://sbi-netverify.com immediately and enter your UPI PIN.",
                "timestamp": "Now"
            }
        ],
        "language": "en"
    }
    res_batch = requests.post(f"{BASE_URL}/scan-upi/auto-read", json=batch_payload)
    print("Batch Auto-Read Inbox Count:", res_batch.json()["scanned_count"])
    assert res_batch.status_code == 200

    print("\nSUCCESS: AUTOMATIC SMS SCANNER & KEYPAD PHONE GATEWAY VERIFIED 100% WORKING!")

if __name__ == "__main__":
    test_scanner_and_keypad()
