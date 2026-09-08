# Deploy Tracker Web App
<!-- DOE-VERSION: 2026.09.08 -->

## Goal

Transform the IT/Security study and job tracker into a mobile-ready, cross-device Progressive Web App (PWA) that syncs progress seamlessly between phone and PC, hostable 100% free forever on Vercel with Firebase Firestore.

---

## Trigger Phrases

- "deploy tracker web app"
- "build tracker web app"
- "sync progress tracker with phone"
- "serve tracker locally"
- "host tracker on vercel"

---

## Quick Start

```bash
# 1. Build & verify the web app bundle
python execution/build_tracker_webapp.py

# 2. Test locally on PC & phone over Wi-Fi
python execution/build_tracker_webapp.py --serve 8080

# 3. Verify files
python execution/build_tracker_webapp.py --verify
```

---

## What It Does

1. **Builds PWA Bundle** — Takes `data/index.html` and compiles an enhanced web app in `web/` complete with:
   - Web App Manifest (`manifest.webmanifest`) for standalone mobile installation ("Add to Home Screen").
   - Service Worker (`sw.js`) for offline caching and zero-lag startup.
   - Vector app icons in `web/icons/`.
   - Vercel configuration (`web/vercel.json`) with optimized caching headers.
2. **Local-First Cloud Sync** — Enhances the tracker to always read and write immediately to local storage, while background-syncing with Firebase Firestore in real time.
3. **Instant Mobile Pairing** — Provides a built-in QR code generator and shareable link (`?sync=<your-key>`) so you can scan with your phone camera and start syncing immediately without login forms or passwords.

---

## Free Hosting & Sync Setup Guide

### 1. Host on Vercel (100% Free Forever)
- **Option A (GitHub Integration - Easiest):**
  1. Push your repository to GitHub.
  2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
  3. Select your repository.
  4. Set **Root Directory** to `web` and click **Deploy**.
- **Option B (Vercel CLI):**
  ```bash
  npm i -g vercel
  cd web
  vercel
  ```

### 2. Connect Free Firebase Firestore (2 Minutes)
Firebase's **Spark Plan** gives you 50,000 document reads and 20,000 writes per day for free, with no server sleep or cold-start lag:
1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Create Project**.
2. Go to **Build** → **Firestore Database** → Click **Create Database**.
3. Select **Start in test mode** (or set security rule: `allow read, write: if true;`).
4. Go to **Project Settings (gear icon)** → General → **Your apps** → Click the Web `</>` icon.
5. Copy the generated `firebaseConfig` JSON snippet.
6. In your live tracker, click **Cloud Sync** in the top-right toolbar, paste your JSON snippet, and click **Save Firebase Config**.

### 3. Pair Your Phone & PC
1. Click **Cloud Sync** on your PC.
2. Pick or generate a unique **Pairing Key** (e.g. `david-tracker-2026`).
3. Scan the displayed **QR Code** with your phone's camera (or open the direct link).
4. On your phone browser:
   - **iOS Safari:** Tap Share icon → **"Add to Home Screen"**.
   - **Android Chrome:** Tap three dots → **"Install app"** / **"Add to Home screen"**.
5. Done! Any checkbox or note you update on your phone will sync to your PC in real time.

---

## Output

- **Deliverable:** Standalone production PWA directory in [`web/`](file:///c:/Users/David/Projects/agentic-workflows-template/web)
- **Local Dev Server:** `http://localhost:8080` (Desktop) and `http://<your-lan-ip>:8080` (Phone)

---

## Edge Cases

### Offline / Airplane Mode
**Behavior:** All progress is saved immediately in `localStorage`. As soon as your device reconnects to Wi-Fi or cellular data, the changes automatically sync to Firestore.

### Multiple Simultaneous Updates
**Behavior:** Updates are timestamped (`updatedAt`). The most recent change updates the cloud document, and real-time snapshot listeners notify active screens.

---

## Changelog

### 2026.09.08
- Initial release: PWA bundling, Firebase Firestore real-time sync, QR code pairing, and Vercel deployment configuration.
