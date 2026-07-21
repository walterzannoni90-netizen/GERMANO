@echo off
cd /d "%~dp0"
echo ========================================
echo  GERMANO - Firebase Setup
echo ========================================
echo.
echo Step 1: Login a Firebase...
call firebase login
if errorlevel 1 (
    echo ERRORE: Login fallito
    pause
    exit /b 1
)
echo.
echo Step 2: Inizializzo progetto...
call firebase use --add gen-lang-client-0559451525
echo.
echo Step 3: Abilito Firestore...
call firebase firestore:databases:create --project gen-lang-client-0559451525 --location europe-west1
echo.
echo Step 4: Deploy regole di sicurezza...
echo rules_version = '2'; > firestore.rules
echo service cloud.firestore { >> firestore.rules
echo   match /databases/{database}/documents { >> firestore.rules
echo     match /{document=**} { >> firestore.rules
echo       allow read, write: if true; >> firestore.rules
echo     } >> firestore.rules
echo   } >> firestore.rules
echo } >> firestore.rules
call firebase deploy --only firestore:rules
echo.
echo ========================================
echo  Setup completato!
echo ========================================
pause
