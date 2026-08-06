@echo off
echo ===================================================
echo   Digital Fraud Shield - Unified Full-Stack App
echo ===================================================
echo.

echo Building React Frontend production bundle...
cd frontend
call npm run build
cd ..

echo.
echo Launching Combined Full-Stack Server (Frontend + Python Engine + DB)...
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8145 --reload

pause
