import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app.engine import FraudEngine

def test_engine():
    print("--- Testing Digital Fraud Shield Engine ---")

    # Test 1: SBI KYC Phishing with UPI PIN request (High Risk > 60)
    text1 = "URGENT: SBI account blocked due to pending KYC update. Click http://sbi-netverify.com immediately and enter your UPI PIN."
    score1, risk1, rules1, exp1 = FraudEngine.analyze_message(text1, "en")
    print(f"Test 1 (KYC Phishing + PIN) -> Score: {score1}, Risk: {risk1}, Rules Count: {len(rules1)}")
    assert risk1 == "High", f"Expected High, got {risk1}"

    # Test 2: Electricity Disconnection Scam in Tamil (Urgency + UPI + PIN + Link)
    text2 = "மின்சார இணைப்பு இன்றிரவு துண்டிக்கப்படும். உடனடியாக http://eb-pay.info 9876543210@paytm என்ற UPI முகவரிக்கு UPI PIN பதிவு செய்யவும்."
    score2, risk2, rules2, exp2 = FraudEngine.analyze_message(text2, "ta")
    print(f"Test 2 (Electricity Scam TA) -> Score: {score2}, Risk: {risk2}, Rules Count: {len(rules2)}")
    assert risk2 == "High", f"Expected High, got {risk2}"
    assert len(exp2) >= 2, "Expected multilingual explanations"

    # Test 3: Cashback UPI PIN Trap in Hindi (Prize + Refund + PIN + Link)
    text3 = "बधाई हो! आपने ₹25,000 Paytm रिफंड पुरस्कार जीता है। अपने बैंक में पैसे लेने के लिए http://paytm-refund.site पर UPI PIN दर्ज करें।"
    score3, risk3, rules3, exp3 = FraudEngine.analyze_message(text3, "hi")
    print(f"Test 3 (Cashback UPI PIN Trap HI) -> Score: {score3}, Risk: {risk3}, Rules Count: {len(rules3)}")
    assert risk3 == "High", f"Expected High, got {risk3}"
    assert len(exp3) >= 2, "Expected multilingual explanations"

    # Test 4: Legitimate Notification
    text4 = "Dear Customer, your electricity bill of Rs 480 for July has been generated successfully. Pay online via official EB website."
    score4, risk4, rules4, exp4 = FraudEngine.analyze_message(text4, "en")
    print(f"Test 4 (Legitimate Notice) -> Score: {score4}, Risk: {risk4}, Rules Count: {len(rules4)}")
    assert risk4 == "Low", f"Expected Low, got {risk4}"

    print("\nALL ENGINE UNIT TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_engine()
