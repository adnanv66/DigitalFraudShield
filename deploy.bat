@echo off
echo ===================================================
echo   Digital Fraud Shield - 1-Click Vercel Deployment
echo ===================================================
echo.
set PATH=C:\Users\admin\AppData\Local\OpenAI\Codex\runtimes\cua_node\f8d2abcb7481383b\bin;%PATH%

echo Step 1: Logging into Vercel in your browser...
call npx.cmd vercel login

echo.
echo Step 2: Deploying Full-Stack Application to Vercel Production...
call npx.cmd vercel --prod

echo.
echo ===================================================
echo   Deployment Completed! Check your live Vercel link above.
echo ===================================================
pause
