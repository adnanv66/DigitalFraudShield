-- Digital Fraud Shield Initial Seed Data

-- Insert default admin & demo user (Password: Password@123)
-- bcrypt hash for 'Password@123': $2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW
INSERT INTO users (id, name, email, hashed_password, language_preference, is_admin)
VALUES 
(1, 'Demo User', 'demo@fraudshield.in', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'en', FALSE),
(2, 'Admin Officer', 'admin@fraudshield.in', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'en', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert Detection Scoring Patterns
INSERT INTO patterns (pattern_name, pattern_type, regex_or_keyword, weight, category, description)
VALUES
('OTP Keyword', 'keyword', 'otp', 25, 'Credential Theft', 'Requests one time password or code'),
('UPI PIN Keyword', 'keyword', 'upi pin', 20, 'Financial Fraud', 'Asks user to enter UPI PIN to receive money'),
('Urgency Language', 'keyword', 'urgent', 20, 'Social Engineering', 'Creates artificial panic or tight deadline'),
('Immediately Keyword', 'keyword', 'immediately', 20, 'Social Engineering', 'Demands instant action'),
('Click Link Pattern', 'regex', 'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', 15, 'Phishing', 'Contains web hyper link'),
('Unknown UPI Handle', 'regex', '[a-zA-Z0-9.\-_]+@(ybl|paytm|okaxis|icici|apl|sbi|postbank)', 20, 'Fake VPA', 'Unverified personal UPI handle'),
('Prize Claim', 'keyword', 'prize', 15, 'Lottery Scam', 'Claims user won prize money'),
('Refund Claim', 'keyword', 'refund', 15, 'Cashback Trap', 'Promises immediate cash refund credit'),
('KYC Suspension', 'keyword', 'kyc', 20, 'Banking Fraud', 'Claims bank or SIM card KYC expired'),
('Lottery Winner', 'keyword', 'lottery', 15, 'Lottery Scam', 'Claims user won lucky draw lottery')
ON CONFLICT DO NOTHING;

-- Insert Sample Historical Detections
INSERT INTO detections (user_id, message_text, risk_score, risk_level, matched_rules, explanation, language, status, created_at)
VALUES
(1, 'Dear SBI User, your account has been blocked due to pending KYC update. Click http://sbi-verify.net to update instantly.', 80, 'High', '["contains_kyc", "click_link", "urgency_words"]'::jsonb, '["It asks for urgent KYC update", "Contains suspicious phishing link sbi-verify.net", "Threatens account suspension"]'::jsonb, 'en', 'Reported', NOW() - INTERVAL '1 day'),
(1, 'URGENT: ELECTRICITY BOARD NOTICE. Your power connection will be cut at 9:30 PM today. Pay Rs. 1500 immediately to UPI 9876543210@paytm.', 75, 'High', '["urgency_words", "unknown_upi", "contains_upi_pin"]'::jsonb, '["Uses high-pressure fake urgency about electricity cut", "Asks to send money to personal unverified phone UPI ID", "Requests immediate money transfer"]'::jsonb, 'en', 'Reported', NOW() - INTERVAL '2 days'),
(1, 'Congratulations! You have won Rs 25,000 Paytm Cashback. Claim your refund by entering UPI PIN at refund-paytm.com', 70, 'High', '["prize_claim", "refund_claim", "contains_upi_pin", "click_link"]'::jsonb, '["You never need to enter your UPI PIN to RECEIVE money", "Uses fake cashback/refund lure", "Contains external unverified link"]'::jsonb, 'en', 'Analyzed', NOW() - INTERVAL '3 days'),
(1, 'Dear Customer, your electricity bill of Rs 480 for July has been generated successfully. Pay via official app.', 10, 'Low', '[]'::jsonb, '["No high risk fraud patterns detected", "Legitimate routine notification wording"]'::jsonb, 'en', 'Safe', NOW() - INTERVAL '4 days'),
(1, 'Your OTP for logging into HDFC NetBanking is 482910. Do not share it with anyone including bank staff.', 35, 'Medium', '["contains_otp"]'::jsonb, '["Message contains sensitive OTP code. Never share this code with callers."]'::jsonb, 'en', 'Analyzed', NOW() - INTERVAL '5 days');

-- Insert Sample Reports
INSERT INTO reports (user_id, detection_id, message_text, category, reason, notes, status, created_at)
VALUES
(1, 1, 'Dear SBI User, your account has been blocked due to pending KYC update. Click http://sbi-verify.net to update instantly.', 'Banking Phishing', 'Phishing link impersonating State Bank of India', 'My grandfather received this on SMS', 'Approved', NOW() - INTERVAL '1 day'),
(1, 2, 'URGENT: ELECTRICITY BOARD NOTICE. Your power connection will be cut at 9:30 PM today. Pay Rs. 1500 immediately to UPI 9876543210@paytm.', 'Utility Scam', 'Fake electricity disconnection threat demanding money to personal UPI', 'Scammers called after sending message', 'Pending Review', NOW() - INTERVAL '2 days');
