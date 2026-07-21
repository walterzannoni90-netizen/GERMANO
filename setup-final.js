const https = require("https");
const path = require("path");
const fs = require("fs");

const PROJECT = "gen-lang-client-0559451525";
const API_KEY = "AIzaSyAX4FslBnLBH6Qd_-Fxv_qhv2j9asavk1k";
const USER_UID = "LYlrpa0DoAYVf2KnFn6poK4NaNx1";
const USER_EMAIL = "walterzannoni90@outlook.it";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

function req(method, url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method,
      headers: { "Content-Type": "application/json" },
    };
    const b = body ? JSON.stringify(body) : null;
    if (b) opts.headers["Content-Length"] = Buffer.byteLength(b);
    const r = https.request(opts, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    });
    r.on("error", reject);
    if (b) r.write(b);
    r.end();
  });
}

function makeDoc(fields) {
  const f = {};
  Object.entries(fields).forEach(([k, v]) => {
    if (typeof v === "string") f[k] = { stringValue: v };
    else if (typeof v === "number") f[k] = { integerValue: String(v) };
    else if (typeof v === "boolean") f[k] = { booleanValue: v };
    else if (v instanceof Date) f[k] = { timestampValue: v.toISOString() };
  });
  return { fields: f };
}

async function main() {
  console.log("🚀 Configurazione Firebase...\n");

  // 1. Enable Email/Password auth via REST
  console.log("📧 Abilito Email/Password authentication...");
  try {
    const authRes = await req(
      "PATCH",
      `https://identitytoolkit.googleapis.com/v2/projects/${PROJECT}/config?updateMask=signIn&key=${API_KEY}`,
      {
        signIn: {
          email: {
            enabled: true,
            passwordPolicy: { enabled: false }
          }
        }
      }
    );
    console.log("   ✅ Email/Password abilitato:", authRes.state || "OK");
  } catch (e) {
    console.log("   ⚠️  Errore (forse gi√† attivo):", e.message.substring(0, 100));
  }

  // 2. Create users collection with admin
  console.log("\n👤 Creo utente admin...");
  try {
    const userDoc = makeDoc({
      uid: USER_UID,
      name: "Admin",
      surname: "Germano",
      email: USER_EMAIL,
      role: "admin",
      active: true,
      points: 0,
      level: 1,
      phone: "",
      photoURL: "",
    });
    const userRes = await req(
      "PATCH",
      `${BASE}/users/${USER_UID}?key=${API_KEY}`,
      userDoc
    );
    console.log("   ✅ Utente admin creato:", userRes.name || "OK");
  } catch (e) {
    console.log("   ❌ Errore:", e.message.substring(0, 200));
  }

  // 3. Create sample trainings
  console.log("\n💪 Creo allenamenti di esempio...");
  const trainings = [
    { title: "Full Body HIIT", trainer: "Mario Rossi", duration: "45 min", level: "Intermedio", price: 19.99, category: "HIIT", rating: 4.8, active: true, description: "Allenamento ad alta intensit√†", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" },
    { title: "Yoga per Principianti", trainer: "Giulia Bianchi", duration: "30 min", level: "Principiante", price: 14.99, category: "Yoga", rating: 4.9, active: true, description: "Yoga per principianti", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" },
    { title: "Strongman Foundation", trainer: "Luca Verdi", duration: "60 min", level: "Avanzato", price: 24.99, category: "Forza", rating: 4.7, active: true, description: "Allenamento per esperti", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" },
  ];

  for (const t of trainings) {
    try {
      const doc = makeDoc({ ...t, price: t.price, rating: t.rating, active: true, createdAt: new Date() });
      const res = await req(
        "POST",
        `${BASE}/trainings?key=${API_KEY}`,
        doc
      );
      console.log(`   ✅ ${t.title}: ${res.name || "OK"}`);
    } catch (e) {
      console.log(`   ❌ ${t.title}: ${e.message.substring(0, 100)}`);
    }
  }

  // 4. Create sample consultations
  console.log("\n📅 Creo consulenze di esempio...");
  const consultations = [
    { professionalId: "prof1", professionalName: "Dr. Mario Rossi", specialty: "Personal Trainer", date: "2026-07-22", time: "09:00", duration: 30, type: "online", status: "available", price: 50 },
    { professionalId: "prof2", professionalName: "Giulia Bianchi", specialty: "Yoga & Pilates", date: "2026-07-22", time: "10:00", duration: 30, type: "online", status: "available", price: 45 },
    { professionalId: "prof3", professionalName: "Dr. Luca Verdi", specialty: "Nutrizione", date: "2026-07-23", time: "14:00", duration: 45, type: "online", status: "available", price: 75 },
  ];

  for (const c of consultations) {
    try {
      const doc = makeDoc({ ...c, duration: c.duration, price: c.price, createdAt: new Date() });
      const res = await req(
        "POST",
        `${BASE}/consultations?key=${API_KEY}`,
        doc
      );
      console.log(`   ✅ ${c.professionalName}: ${res.name || "OK"}`);
    } catch (e) {
      console.log(`   ❌ ${c.professionalName}: ${e.message.substring(0, 100)}`);
    }
  }

  console.log("\n========================================");
  console.log("  ✅ SETUP COMPLETATO!");
  console.log("========================================");
  console.log();
  console.log("Ora avvia il server:");
  console.log("   npm run dev");
  console.log("   http://localhost:3000");
  console.log();
  console.log("L'utente admin √® gi√† configurato.");
  console.log("Vai su /admin per la dashboard.");
}

main().catch(console.error);
