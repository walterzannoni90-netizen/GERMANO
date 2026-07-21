const https = require("https");
const { execSync } = require("child_process");

const PROJECT_ID = "gen-lang-client-0559451525";
const CLIENT_ID = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com";

function post(url, data) {
  return new Promise((resolve, reject) => {
    const b = JSON.stringify(data);
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(b) },
    };
    const req = https.request(opts, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve(JSON.parse(body)));
    });
    req.on("error", reject);
    req.write(b);
    req.end();
  });
}

async function main() {
  // Step 1: Get device code
  console.log("🔄 Richiedo codice di autorizzazione...");
  const device = await post("https://oauth2.googleapis.com/device/code", {
    client_id: CLIENT_ID,
    scope: "openid https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase",
  });

  console.log(`\n✅ Apri questo link nel browser:`);
  console.log(`   ${device.verification_url}`);
  console.log(`\n✅ Inserisci questo codice:`);
  console.log(`   ${device.user_code}`);
  console.log(`\nDopo aver autorizzato, premi INVIO qui...`);

  // Wait for user input
  await new Promise((r) => process.stdin.once("data", r));

  // Step 2: Poll for token
  console.log("⏳ Attendiamo il token...");
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const token = await post("https://oauth2.googleapis.com/token", {
        client_id: CLIENT_ID,
        device_code: device.device_code,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      });
      if (token.access_token) {
        console.log("✅ Token ottenuto!");
        const AT = token.access_token;

        // Enable Firestore
        console.log("🔄 Abilito Firestore...");
        const fs = await post(
          `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases`,
          {
            name: `projects/${PROJECT_ID}/databases/(default)`,
            locationId: "europe-west1",
            type: "FIRESTORE_NATIVE",
            deleteProtectionState: "DELETE_PROTECTION_DISABLED",
          },
          AT
        );
        console.log("✅ Firestore avviato:", JSON.stringify(fs).slice(0, 200));

        // Enable Auth (Email/Password)
        console.log("🔄 Abilito Authentication...");
        const auth = await post(
          `https://identitytoolkit.googleapis.com/v2/projects/${PROJECT_ID}/config`,
          {
            signIn: { email: { enabled: true, passwordPolicy: { enabled: false } } },
          },
          AT
        );
        console.log("✅ Authentication abilitato:", JSON.stringify(auth).slice(0, 200));

        console.log("\n🎉 Firebase pronto! Ora puoi usare la piattaforma.");
        process.exit(0);
      }
    } catch (e) {
      // still pending
    }
  }
  console.log("❌ Timeout: non hai autorizzato in tempo.");
  process.exit(1);
}

function post(url, data, token) {
  return new Promise((resolve, reject) => {
    const b = JSON.stringify(data);
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(b),
      },
    };
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;
    const req = https.request(opts, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve(JSON.parse(body)));
    });
    req.on("error", reject);
    req.write(b);
    req.end();
  });
}

main();
