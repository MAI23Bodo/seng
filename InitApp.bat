@ECHO OFF
START InitBackend.bat
START InitFrontend.bat
timeout /t 5
START "" http://localhost:3000