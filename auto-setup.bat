@echo off
title GERMANO - Firebase Auto Setup
cd /d "%~dp0"
echo ========================================
echo  GERMANO - Configurazione Automatica
echo ========================================
echo.

echo [1/4] Login a Firebase...
call npx firebase login --no-localhost
echo.
echo Dopo il login, torna qui e premi un tasto per continuare...
pause >nul

echo.
echo [2/4] Imposto progetto predefinito...
call npx firebase use --add gen-lang-client-0559451525
if errorlevel 1 goto error

echo.
echo [3/4] Abilito Firestore...
call npx firebase firestore:databases:create --project gen-lang-client-0559451525 --location europe-west1
if errorlevel 1 (
    echo (forse gia' esistente - ok)
)

echo.
echo [4/4] Deploy regole di sicurezza...
echo rules_version = '2'; > firestore.rules
echo service cloud.firestore { >> firestore.rules
echo   match /databases/{database}/documents { >> firestore.rules
echo     match /{document=**} { >> firestore.rules
echo       allow read, write: if true; >> firestore.rules
echo     } >> firestore.rules
echo   } >> firestore.rules
echo } >> firestore.rules

echo service firebase.storage { > storage.rules
echo   match /b/{bucket}/o { >> storage.rules
echo     match /{allPaths=**} { >> storage.rules
echo       allow read, write: if true; >> storage.rules
echo     } >> storage.rules
echo   } >> storage.rules
echo } >> storage.rules

echo {"projects":{"default":"gen-lang-client-0559451525"}} > .firebaserc
echo {"firestore":{"rules":"firestore.rules"},"storage":{"rules":"storage.rules"},"hosting":{"public":"out","ignore":["firebase.json","**/.*","**/node_modules/**"]}} > firebase.json

call npx firebase deploy --only firestore:rules,storage:rules

echo.
echo ========================================
echo  ✅ SETUP COMPLETATO!
echo ========================================
echo.
echo Ora esegui: npm run dev
echo E registrati su http://localhost:3000/register
echo.
pause
exit /b 0

:error
echo.
echo ❌ ERRORE! Controlla il messaggio sopra.
pause
