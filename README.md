# Germano - Piattaforma Fitness

Una piattaforma completa per la vendita di allenamenti, prenotazione di consulenze, gestione clienti, messaggistica, pagamenti e monitoraggio progressi.

## Caratteristiche

### Principali
- **Catalogo Allenamenti**: Programmi fitness acquistabili con video esercizi, progressi e completamento sessioni
- **Prenotazioni Consulenze**: Online e in presenza, sincronizzate con Google Calendar
- **Pagamenti Stripe**: Integrazione completa con carte, Apple Pay, Google Pay
- **Messaggistica**: Chat privata cliente-professionista con foto, PDF, notifiche
- **Progressi**: Peso, misure, fotografie, grafici, confronto immagini
- **Documenti**: Area riservata con programmi, referti, ricevute, consensi
- **Notifiche**: Promemoria appuntamenti, allenamenti, pagamenti, messaggi
- **Dashboard**: Home personalizzata per cliente e professionista
- **Programma Fedeltà**: Punti, referral, wallet interno, codici sconto

### Tecnologie
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Stile**: Spotify-inspired con palette colori fitness personalizzata (verde, arancione, scuro)
- **UI Components**: Custom components con supporto dark mode

## Installazione

1. Clona il repository
2. Installa le dipendenze:
```bash
npm install
```

3. Avvia lo sviluppo:
```bash
npm run dev
```

4. Apri [http://localhost:3000](http://localhost:3000)

## Struttura Progetto

```
germano-platform/
├── app/
│   ├── page.tsx              # Home page
│   ├── dashboard/page.tsx    # Dashboard cliente
│   ├── trainings/page.tsx    # Catalogo allenamenti
│   ├── consultations/page.tsx # Prenotazione consulenze
│   ├── messages/page.tsx     # Messaggistica
│   ├── progress/page.tsx     # Monitoraggio progressi
│   ├── payments/page.tsx     # Gestione pagamenti
│   ├── documents/page.tsx    # Documenti
│   ├── notifications/page.tsx # Notifiche
│   ├── profile/page.tsx      # Profilo utente
│   └── layout.tsx            # Layout principale
├── components/
│   ├── ui/                   # Componenti UI riutilizzabili
│   ├── Navbar.tsx            # Barra di navigazione
│   ├── Sidebar.tsx           # Menu laterale
│   ├── Hero.tsx              # Hero section
│   ├── FeaturedTrainings.tsx # Allenamenti in evidenza
│   ├── Stats.tsx             # Statistiche
│   └── ...                   # Altri componenti
└── lib/
    └── utils.ts              # Funzioni utili
```

## Palette Colori

Il design è ispirato a Spotify ma con una palette personalizzata per il settore fitness:

- **Green (Primary)**: `#22c55e` - Colore principale, rappresenta il benessere
- **Orange (Accent)**: `#f97316` - Colore secondario, rappresenta energia
- **Dark**: `#121212` - Sfondo principale scuro
- **Dark Surface**: `#181818` - Sfondo secondario
- **Dark Highlight**: `#282828` - Elementi in rilievo

## Sviluppo futuro

- **Negozio**: Vendita integratori, gestione ordini, magazzino
- **AI**: Assistente virtuale per FAQ e supporto
- **Mobile App**: App iOS e Android native
- **Admin Panel**: Pannello per gestione utenti e contenuti
- **Google Calendar Sync**: Integrazione completa
- **Push Notifications**: Notifiche push native

## Note

- Il codice è modulare per consentire l'aggiunta futura di nuove funzionalità
- Tutti i dati e il codice sono di proprietà del committente
- L'AI non sostituisce il professionista ma lo affianca nel supporto
