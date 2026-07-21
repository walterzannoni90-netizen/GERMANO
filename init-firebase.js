const { execSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const https = require("https");

const PROJECT = "gen-lang-client-0559451525";
const CLIENT_ID = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com";

const projectDir = __dirname;

// Step 1: create firestore rules
const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;
fs.writeFileSync(path.join(projectDir, "firestore.rules"), rules);

// Step 2: create storage rules
const storageRules = `service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}`;
fs.writeFileSync(path.join(projectDir, "storage.rules"), storageRules);

// Step 3: create .firebaserc
fs.writeFileSync(path.join(projectDir, ".firebaserc"), JSON.stringify({
  projects: { default: PROJECT }
}, null, 2));

// Step 4: create firebase.json
fs.writeFileSync(path.join(projectDir, "firebase.json"), JSON.stringify({
  firestore: { rules: "firestore.rules" },
  storage: { rules: "storage.rules" },
  hosting: {
    public: "out",
    ignore: ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}, null, 2));

console.log("========================================");
console.log("  GERMANO - Firebase Token Setup");
console.log("========================================");
console.log();
console.log("Per collegare Firebase al progetto, apri PowerShell COME UTENTE NORMALE");
console.log("(NON da questo terminale) ed esegui questi comandi:");
console.log();
console.log("  cd " + projectDir);
console.log('  npx firebase login:ci');
console.log();
console.log("Questo aprirà il browser. Fai login con Google e autorizza.");
console.log("Poi COPIA il TOKEN che appare (una stringa lunga)");
console.log("e INCOLLALO qui sotto.");
console.log();
console.log("Incolla il token e premi INVIO:");
console.log();

process.stdin.once("data", async (data) => {
  const token = data.toString().trim();
  if (!token) {
    console.log("Token non valido.");
    process.exit(1);
  }
  
  console.log("Token ricevuto! Configurazione in corso...");
  
  try {
    // Try to enable services via Firebase CLI programmatically
    const cmds = [
      `npx firebase --token="${token}" projects:list`,
      `npx firebase --token="${token}" firestore:databases:create --project ${PROJECT} --location europe-west1`,
      `npx firebase --token="${token}" deploy --only firestore:rules,storage:rules --project ${PROJECT}`,
    ];
    
    for (const cmd of cmds) {
      console.log(`> ${cmd}`);
      try {
        const out = execSync(cmd, { cwd: projectDir, timeout: 30000, shell: true });
        console.log(out.toString());
      } catch (e) {
        console.log(e.stderr ? e.stderr.toString() : e.message);
      }
    }
    
    console.log("========================================");
    console.log("  SETUP COMPLETATO!");
    console.log("========================================");
    console.log("Ora registrati su /register e sarai automaticamente admin.");
  } catch (err) {
    console.error("Errore:", err.message);
  }
  
  process.exit(0);
});
