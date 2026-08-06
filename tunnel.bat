@echo off
echo ===================================================
echo   Digital Fraud Shield - Instant Public Tunnel Link
echo ===================================================
echo.
set PATH=C:\Users\admin\AppData\Local\OpenAI\Codex\runtimes\cua_node\f8d2abcb7481383b\bin;%PATH%

echo Generating live public web URL for your server on port 8145...
echo.
call npx.cmd localtunnel --port 8145

pause
