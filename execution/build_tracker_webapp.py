#!/usr/bin/env python3
"""
Build and bundle the IT/Security progress tracker into a cross-device,
PWA-ready web application with Firebase Firestore real-time cloud sync.

Directive: directives/deploy_tracker_webapp.md

Usage:
    python execution/build_tracker_webapp.py [--input data/index.html] [--output-dir web]
    python execution/build_tracker_webapp.py --verify
    python execution/build_tracker_webapp.py --serve [port]
"""

import os
import sys
import json
import shutil
import argparse
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
import socket

# =============================================================================
# VERSION - Must match directives/deploy_tracker_webapp.md
# =============================================================================
DOE_VERSION = "2026.09.08"

# Default paths
DEFAULT_INPUT = Path("data/index.html")
DEFAULT_OUTPUT_DIR = Path("web")

MANIFEST_CONTENT = {
    "name": "IT to Security Tracker",
    "short_name": "IT Tracker",
    "description": "A 16-week working track for IT support, networking and security operations.",
    "start_url": "./",
    "display": "standalone",
    "background_color": "#0B161A",
    "theme_color": "#0F2027",
    "orientation": "portrait-primary",
    "icons": [
        {
            "src": "icons/icon-192.svg",
            "sizes": "192x192",
            "type": "image/svg+xml",
            "purpose": "any maskable"
        },
        {
            "src": "icons/icon-512.svg",
            "sizes": "512x512",
            "type": "image/svg+xml",
            "purpose": "any maskable"
        }
    ]
}

VERCEL_CONFIG = {
    "version": 2,
    "cleanUrls": True,
    "headers": [
        {
            "source": "/sw.js",
            "headers": [
                {
                    "key": "Cache-Control",
                    "value": "public, max-age=0, must-revalidate"
                },
                {
                    "key": "Service-Worker-Allowed",
                    "value": "/"
                }
            ]
        },
        {
            "source": "/manifest.webmanifest",
            "headers": [
                {
                    "key": "Content-Type",
                    "value": "application/manifest+json"
                }
            ]
        }
    ]
}

SERVICE_WORKER_CONTENT = """// Service Worker for IT -> Security Tracker
const CACHE_NAME = 'it-sec-tracker-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Let external Firebase / QR library requests go straight to network
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Network-first strategy for app shell to keep updates fresh
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
"""

ICON_SVG_CONTENT = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#155F7C"/>
      <stop offset="100%" stop-color="#0B161A"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#grad)"/>
  <rect x="32" y="32" width="448" height="448" rx="80" fill="none" stroke="#63B7D6" stroke-width="8" stroke-opacity="0.3"/>
  
  <!-- Terminal/Shield icon motif -->
  <path d="M140 180 L220 256 L140 332" fill="none" stroke="#5FB98B" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="240" y1="332" x2="360" y2="332" stroke="#D9A03F" stroke-width="32" stroke-linecap="round"/>
  
  <!-- Radar/Network pulse dots -->
  <circle cx="360" cy="180" r="20" fill="#63B7D6"/>
  <circle cx="360" cy="180" r="38" fill="none" stroke="#63B7D6" stroke-width="6" stroke-opacity="0.4"/>
</svg>
"""


def get_local_ip():
    """Retrieve local LAN IP for cross-device mobile testing."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip


def build_enhanced_html(source_html: str) -> str:
    """
    Inject PWA manifest, service worker registration, Firebase SDK,
    cloud sync controls, and pairing modal into the source HTML.
    """
    html = source_html

    # 1. PWA Meta Tags & Manifest in <head>
    pwa_head = """
  <!-- PWA & Mobile Web App Capabilities -->
  <link rel="manifest" href="manifest.webmanifest">
  <meta name="theme-color" content="#0F2027">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="IT Tracker">
  <link rel="icon" type="image/svg+xml" href="icons/icon-192.svg">
  <link rel="apple-touch-icon" href="icons/icon-192.svg">

  <!-- External Libraries: Firebase Firestore (v10 compat) + QRCode -->
  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
"""
    if "</head>" in html:
        html = html.replace("</head>", pwa_head + "\n</head>", 1)

    # 2. Add Cloud Sync button & status badge to .mast-tools
    cloud_sync_button = """        <button id="cloudSyncBtn" type="button" class="btn-cloud" title="Configure Cloud Sync & Pair Phone">
          <span class="sync-dot" id="syncDot"></span>
          <span id="syncStatusText">Cloud Sync</span>
        </button>"""
    
    if '<div class="mast-tools">' in html:
        html = html.replace(
            '<div class="mast-tools">',
            '<div class="mast-tools">\n' + cloud_sync_button,
            1
        )

    # 3. Add Modal Markup & Additional CSS before </body>
    modal_and_sync_script = """
<!-- Cloud Sync Modal & Styling -->
<style>
.btn-cloud{
  display:inline-flex; align-items:center; gap:6px; font-weight:500;
  border-color:var(--signal); color:var(--signal);
}
.btn-cloud:hover{background:var(--signal-soft)}
.sync-dot{
  width:8px; height:8px; border-radius:50%; background:var(--muted);
  display:inline-block; transition:background 0.3s;
}
.sync-dot.synced{background:var(--ok)}
.sync-dot.syncing{background:var(--flag); animation:pulse 1s infinite alternate}
.sync-dot.error{background:var(--danger)}
@keyframes pulse{from{opacity:0.4} to{opacity:1}}

/* Modal dialog */
.modal-overlay{
  position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(3px);
  z-index:100; display:flex; align-items:center; justify-content:center; padding:16px;
}
.modal-card{
  background:var(--surface); border:1px solid var(--rule); border-radius:8px;
  max-width:520px; width:100%; max-height:90vh; overflow-y:auto; padding:24px;
  box-shadow:0 12px 36px rgba(0,0,0,0.3); font-size:14.5px;
}
.modal-head{display:flex; justify-content:space-between; align-items:center; margin-bottom:16px}
.modal-head h3{font-size:18px; margin:0}
.modal-close{background:none; border:none; font-size:22px; cursor:pointer; padding:0 6px; color:var(--muted)}
.modal-close:hover{color:var(--ink)}
.sync-sec{margin-bottom:20px; padding-bottom:18px; border-bottom:1px solid var(--rule-soft)}
.sync-sec:last-child{border-bottom:none; margin-bottom:0; padding-bottom:0}
.sync-sec h4{font-size:13.5px; color:var(--signal); margin-bottom:6px; text-transform:uppercase; letter-spacing:0.04em}
.input-group{display:flex; gap:8px; margin-top:8px}
.input-group input{flex:1}
.qr-container{display:flex; flex-direction:column; align-items:center; margin-top:14px; gap:8px}
#qrcode{background:#fff; padding:12px; border-radius:6px; min-height:152px; min-width:152px}
.code-badge{
  font-family:var(--mono); background:var(--surface-2); padding:3px 8px;
  border-radius:4px; font-size:12px; border:1px solid var(--rule-soft); word-break:break-all;
}
.notice{font-size:12.5px; color:var(--muted); line-height:1.45; margin-top:6px}
.notice strong{color:var(--ink)}
</style>

<div id="syncModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="syncModalTitle">
  <div class="modal-card">
    <div class="modal-head">
      <h3 id="syncModalTitle">Cloud Sync & Mobile Pairing</h3>
      <button type="button" class="modal-close" id="closeSyncModal" aria-label="Close dialog">&times;</button>
    </div>

    <!-- Section 1: Pair Code & Direct Link -->
    <div class="sync-sec">
      <h4>1. Device Pairing Key</h4>
      <p class="notice">Enter any unique sync key (or generate one) to connect this browser and your phone to the same progress track.</p>
      <div class="input-group">
        <input type="text" id="syncKeyInput" placeholder="e.g. david-track-2026" spellcheck="false" autocomplete="off">
        <button type="button" id="saveSyncKeyBtn">Save</button>
        <button type="button" id="genSyncKeyBtn">Random</button>
      </div>
      <div class="qr-container" id="qrWrapper">
        <div id="qrcode"></div>
        <div class="notice">Scan with your phone camera or use this direct link:</div>
        <div class="code-badge" id="directSyncLink">...</div>
        <button type="button" id="copyLinkBtn" style="margin-top:4px">Copy Link</button>
      </div>
    </div>

    <!-- Section 2: Firebase Credentials -->
    <div class="sync-sec">
      <h4>2. Firebase Configuration (Free Tier)</h4>
      <p class="notice">
        Host on Vercel and sync through Firebase Firestore (100% free forever, 50,000 reads/day).
        Paste your Firebase Web App config JSON below:
      </p>
      <textarea id="firebaseConfigInput" style="height:110px; font-family:var(--mono); font-size:12px;" placeholder='{
  "apiKey": "AIzaSy...",
  "projectId": "your-tracker-proj",
  "appId": "1:..."
}'></textarea>
      <div style="display:flex; gap:8px; margin-top:8px">
        <button type="button" id="saveFirebaseConfigBtn">Save Firebase Config</button>
        <button type="button" id="testSyncBtn">Sync Now</button>
      </div>
      <p class="notice">Need setup help? Check <a href="https://console.firebase.google.com" target="_blank" rel="noopener">Firebase Console</a> (free Spark plan) or refer to the project deployment directive.</p>
    </div>
  </div>
</div>

<script>
/* =====================================================================
   CLOUD SYNC & MOBILE PAIRING MANAGER
   ===================================================================== */
const SYNC_CONFIG_KEY = "it-sec-sync.config.v1";
let syncConfig = {
  syncKey: "",
  firebaseConfig: null,
  lastRemoteSync: 0
};

// Load sync config
try {
  const savedCfg = localStorage.getItem(SYNC_CONFIG_KEY);
  if (savedCfg) syncConfig = Object.assign(syncConfig, JSON.parse(savedCfg));
} catch(e) {}

// Check URL query parameters for ?sync=... to enable instant 1-tap phone pairing!
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("sync")) {
  const paramKey = urlParams.get("sync").trim();
  if (paramKey && paramKey !== syncConfig.syncKey) {
    syncConfig.syncKey = paramKey;
    saveSyncConfig();
    // Clean URL without refresh
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function saveSyncConfig() {
  localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(syncConfig));
}

let db = null;
let firestoreUnsubscribe = null;
let isApplyingRemoteChange = false;

function initFirebase() {
  if (!syncConfig.firebaseConfig || !window.firebase) return false;
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(syncConfig.firebaseConfig);
    }
    db = firebase.firestore();
    setupFirestoreListener();
    return true;
  } catch(err) {
    console.error("Firebase init error:", err);
    updateSyncBadge("error", "Config error");
    return false;
  }
}

function updateSyncBadge(status, text) {
  const dot = document.getElementById("syncDot");
  const txt = document.getElementById("syncStatusText");
  if (!dot || !txt) return;
  dot.className = "sync-dot " + (status || "");
  txt.textContent = text || "Cloud Sync";
}

function setupFirestoreListener() {
  if (!db || !syncConfig.syncKey) {
    updateSyncBadge("", "Cloud (Pair Key Needed)");
    return;
  }

  if (firestoreUnsubscribe) firestoreUnsubscribe();

  updateSyncBadge("syncing", "Connecting...");
  const docRef = db.collection("it_trackers").doc(syncConfig.syncKey);

  firestoreUnsubscribe = docRef.onSnapshot((doc) => {
    if (doc.exists) {
      const data = doc.data();
      const remoteUpdatedAt = data.updatedAt || 0;
      if (remoteUpdatedAt > (syncConfig.lastRemoteSync || 0)) {
        isApplyingRemoteChange = true;
        try {
          if (data.state && typeof data.state === "object") {
            S = Object.assign(blank(), data.state);
            syncConfig.lastRemoteSync = remoteUpdatedAt;
            saveSyncConfig();
            localStorage.setItem(KEY, JSON.stringify(S));
            if (typeof applyTheme === "function") applyTheme();
            if (typeof render === "function") render();
            if (typeof drawApps === "function") drawApps();
            if (typeof drawLog === "function") drawLog();
            flash("Synced from cloud");
          }
        } finally {
          isApplyingRemoteChange = false;
        }
      }
      updateSyncBadge("synced", "Synced");
    } else {
      // First-time document creation
      pushToCloud();
    }
  }, (err) => {
    console.warn("Firestore snapshot error:", err);
    updateSyncBadge("error", "Sync paused");
  });
}

async function pushToCloud() {
  if (isApplyingRemoteChange || !db || !syncConfig.syncKey) return;
  updateSyncBadge("syncing", "Syncing...");
  try {
    const now = Date.now();
    await db.collection("it_trackers").doc(syncConfig.syncKey).set({
      state: S,
      updatedAt: now,
      clientTime: new Date().toISOString()
    }, { merge: true });
    syncConfig.lastRemoteSync = now;
    saveSyncConfig();
    updateSyncBadge("synced", "Synced");
  } catch(err) {
    console.error("Cloud push failed:", err);
    updateSyncBadge("error", "Sync failed");
  }
}

// Hook original save() to also push to cloud when connected
const originalSave = window.save;
window.save = function() {
  originalSave();
  pushToCloud();
};

// QR Code & Modal UI Wiring
function updateQrDisplay() {
  const key = (syncConfig.syncKey || "").trim();
  const directLinkEl = document.getElementById("directSyncLink");
  const qrWrapper = document.getElementById("qrWrapper");
  const qrContainer = document.getElementById("qrcode");
  if (!key) {
    if (qrWrapper) qrWrapper.style.display = "none";
    return;
  }
  if (qrWrapper) qrWrapper.style.display = "flex";

  const pairUrl = window.location.origin + window.location.pathname + "?sync=" + encodeURIComponent(key);
  if (directLinkEl) directLinkEl.textContent = pairUrl;

  if (qrContainer && window.QRCode) {
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
      text: pairUrl,
      width: 144,
      height: 144,
      colorDark: "#0F2027",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }
}

// Modal open/close
const modal = document.getElementById("syncModal");
document.getElementById("cloudSyncBtn").addEventListener("click", () => {
  document.getElementById("syncKeyInput").value = syncConfig.syncKey || "";
  document.getElementById("firebaseConfigInput").value = syncConfig.firebaseConfig ? JSON.stringify(syncConfig.firebaseConfig, null, 2) : "";
  updateQrDisplay();
  modal.classList.remove("hidden");
});
document.getElementById("closeSyncModal").addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

// Save sync key
document.getElementById("saveSyncKeyBtn").addEventListener("click", () => {
  const val = document.getElementById("syncKeyInput").value.trim();
  syncConfig.syncKey = val;
  saveSyncConfig();
  updateQrDisplay();
  setupFirestoreListener();
  flash("Pairing key saved");
});

// Random sync key generator
document.getElementById("genSyncKeyBtn").addEventListener("click", () => {
  const rand = "track-" + Math.random().toString(36).substring(2, 7) + "-" + Math.floor(Math.random()*900 + 100);
  document.getElementById("syncKeyInput").value = rand;
  syncConfig.syncKey = rand;
  saveSyncConfig();
  updateQrDisplay();
  setupFirestoreListener();
});

// Copy pair link
document.getElementById("copyLinkBtn").addEventListener("click", () => {
  const key = (syncConfig.syncKey || "").trim();
  if (!key) return;
  const pairUrl = window.location.origin + window.location.pathname + "?sync=" + encodeURIComponent(key);
  navigator.clipboard.writeText(pairUrl).then(() => flash("Pairing link copied!"));
});

// Save Firebase Config
document.getElementById("saveFirebaseConfigBtn").addEventListener("click", () => {
  const raw = document.getElementById("firebaseConfigInput").value.trim();
  if (!raw) {
    syncConfig.firebaseConfig = null;
    saveSyncConfig();
    flash("Firebase config cleared");
    return;
  }
  try {
    syncConfig.firebaseConfig = JSON.parse(raw);
    saveSyncConfig();
    initFirebase();
    flash("Firebase config connected");
  } catch(err) {
    alert("Invalid JSON format. Please paste valid JSON from Firebase Console.");
  }
});

document.getElementById("testSyncBtn").addEventListener("click", () => {
  if (!db) {
    if (!initFirebase()) {
      alert("Please paste and save your Firebase configuration first.");
      return;
    }
  }
  pushToCloud();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      console.log('PWA ServiceWorker registered with scope:', reg.scope);
    }).catch((err) => {
      console.log('PWA ServiceWorker registration failed:', err);
    });
  });
}

// Initialize on page load
initFirebase();
</script>
"""

    if "</body>" in html:
        html = html.replace("</body>", modal_and_sync_script + "\n</body>", 1)

    return html


def build_app(input_path: Path, output_dir: Path) -> bool:
    """Build the complete web app bundle."""
    if not input_path.exists():
        print(f"❌ Input file not found: {input_path}")
        return False

    print(f"📦 Building Tracker Web App from {input_path} into {output_dir}/...")
    output_dir.mkdir(parents=True, exist_ok=True)
    icons_dir = output_dir / "icons"
    icons_dir.mkdir(parents=True, exist_ok=True)

    # 1. Read input HTML and enhance
    with open(input_path, "r", encoding="utf-8") as f:
        source_html = f.read()

    enhanced_html = build_enhanced_html(source_html)
    with open(output_dir / "index.html", "w", encoding="utf-8") as f:
        f.write(enhanced_html)
    print("  ✓ index.html (enhanced with PWA & Cloud Sync)")

    # 2. Write manifest.webmanifest
    with open(output_dir / "manifest.webmanifest", "w", encoding="utf-8") as f:
        json.dump(MANIFEST_CONTENT, f, indent=2)
    print("  ✓ manifest.webmanifest")

    # 3. Write sw.js
    with open(output_dir / "sw.js", "w", encoding="utf-8") as f:
        f.write(SERVICE_WORKER_CONTENT)
    print("  ✓ sw.js (service worker)")

    # 4. Write icons
    with open(icons_dir / "icon-192.svg", "w", encoding="utf-8") as f:
        f.write(ICON_SVG_CONTENT)
    with open(icons_dir / "icon-512.svg", "w", encoding="utf-8") as f:
        f.write(ICON_SVG_CONTENT)
    print("  ✓ icons/ (192x192 and 512x512 vector icons)")

    # 5. Write vercel.json
    with open(output_dir / "vercel.json", "w", encoding="utf-8") as f:
        json.dump(VERCEL_CONFIG, f, indent=2)
    print("  ✓ vercel.json (optimized cache headers)")

    print("\n✅ Build complete! Web app is ready in:", output_dir.resolve())
    return True


def verify_bundle(output_dir: Path) -> bool:
    """Verify web bundle integrity."""
    print(f"🔍 Verifying bundle in {output_dir}...")
    expected_files = [
        "index.html",
        "manifest.webmanifest",
        "sw.js",
        "icons/icon-192.svg",
        "icons/icon-512.svg",
        "vercel.json"
    ]
    all_ok = True
    for rel_path in expected_files:
        p = output_dir / rel_path
        if p.exists() and p.stat().st_size > 0:
            print(f"  ✓ {rel_path} ({p.stat().st_size} bytes)")
        else:
            print(f"  ❌ Missing or empty: {rel_path}")
            all_ok = False

    if all_ok:
        print("✅ Bundle verification passed!")
    else:
        print("❌ Bundle verification failed.")
    return all_ok


def serve_app(output_dir: Path, port: int = 8080):
    """Serve the web app locally so phone can connect over Wi-Fi."""
    os.chdir(output_dir)
    local_ip = get_local_ip()
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)

    print("\n=======================================================")
    print(f"🚀 IT/Security Progress Tracker Local Dev Server")
    print(f"=======================================================")
    print(f"  Desktop URL : http://localhost:{port}")
    print(f"  Phone/LAN URL: http://{local_ip}:{port}")
    print("  Press Ctrl+C to stop the server.")
    print("=======================================================\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped.")


def main():
    parser = argparse.ArgumentParser(description="Build and serve the syncable Progress Tracker Web App")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help="Source HTML file")
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR, help="Output directory")
    parser.add_argument("--verify", action="store_true", help="Verify existing bundle")
    parser.add_argument("--serve", nargs="?", const=8080, type=int, help="Run local HTTP server (default port 8080)")
    args = parser.parse_args()

    print(f"[build_tracker_webapp] DOE Version: {DOE_VERSION}")

    if args.verify:
        return 0 if verify_bundle(args.output_dir) else 1

    if args.serve:
        if not (args.output_dir / "index.html").exists():
            print("Bundle not found, building first...")
            if not build_app(args.input, args.output_dir):
                return 1
        serve_app(args.output_dir, args.serve)
        return 0

    # Default action: build bundle
    success = build_app(args.input, args.output_dir)
    if success:
        verify_bundle(args.output_dir)
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
