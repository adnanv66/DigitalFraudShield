import requests

BASE_URL = "http://127.0.0.1:8105"

def test_chatbot_and_cert_in():
    print("--- Testing Chatbot Query API & CERT-In Integration ---")
    res = requests.post(f"{BASE_URL}/api/chat", json={
        "query": "Someone sent me an SMS asking for my UPI PIN to receive money",
        "language": "en"
    })
    print("Chatbot API Response:", res.json())
    assert res.status_code == 200
    assert "cert_in_helplines" in res.json()
    assert res.json()["cert_in_helplines"]["toll_free"] == "1800-11-4949"
    print("\nSUCCESS: CHATBOT API & CERT-IN HELPLINE INTEGRATION VERIFIED 100% WORKING!")

if __name__ == "__main__":
    test_chatbot_and_cert_in()
