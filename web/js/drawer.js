import { store } from './state.js';
import { QA, DEFAULT_FIREBASE_CONFIG } from './roadmapData.js';
import { copyToClipboard } from './cheatsheet.js';
import { mountJobsView } from './jobsView.js';

export function setupMoreDrawer(drawerTriggerBtn, drawerModalEl, cloudSyncBtn) {
  if (!drawerModalEl) return;

  if (drawerTriggerBtn) {
    drawerTriggerBtn.addEventListener('click', () => {
      openDrawer('tabAbout');
    });
  }

  if (cloudSyncBtn) {
    cloudSyncBtn.addEventListener('click', () => {
      openDrawer('tabSync');
    });
  }

  const closeBtn = drawerModalEl.querySelector('#closeDrawerBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeDrawer());
  }

  drawerModalEl.addEventListener('click', e => {
    if (e.target === drawerModalEl) closeDrawer();
  });

  function openDrawer(activeTabId = 'tabAbout') {
    renderDrawerContent(drawerModalEl, activeTabId);
    drawerModalEl.classList.add('open');
  }

  function closeDrawer() {
    drawerModalEl.classList.remove('open');
  }
}

function getSyncKey() {
  return localStorage.getItem('it-sec-sync-channel') || 'david-track-2026';
}

function getDirectSyncUrl(key) {
  // Use production Vercel domain if on localhost, or active origin
  const baseUrl = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
    ? 'https://it-security-tracker.vercel.app/'
    : window.location.origin + window.location.pathname;
  return `${baseUrl}?sync=${encodeURIComponent(key)}`;
}

function renderDrawerContent(container, activeTabId = 'tabAbout') {
  const inner = container.querySelector('#drawerContentInner');
  if (!inner) return;

  const activeSyncKey = getSyncKey();
  const directSyncUrl = getDirectSyncUrl(activeSyncKey);

  inner.innerHTML = `
    <div class="drawer-nav-tabs">
      <button class="drawer-tab-btn ${activeTabId === 'tabAbout' ? 'active' : ''}" data-dtab="tabAbout">ℹ️ About Program</button>
      <button class="drawer-tab-btn ${activeTabId === 'tabSync' ? 'active' : ''}" data-dtab="tabSync">☁️ Cloud Sync & Mobile Pairing</button>
      <button class="drawer-tab-btn ${activeTabId === 'tabJobs' ? 'active' : ''}" data-dtab="tabJobs">💼 Job Tracker & AI Bot</button>
      <button class="drawer-tab-btn ${activeTabId === 'tabInterview' ? 'active' : ''}" data-dtab="tabInterview">💡 Interview Bank</button>
      <button class="drawer-tab-btn ${activeTabId === 'tabBackup' ? 'active' : ''}" data-dtab="tabBackup">💾 Data & Backup</button>
    </div>

    <!-- Panel 1: About Program -->
    <div class="drawer-panel" id="tabAbout" style="display:${activeTabId === 'tabAbout' ? 'block' : 'none'};">
      <div class="about-section-content">
        <h3 style="font-size:18px; font-weight:700; color:var(--signal-cyan); margin-bottom:8px;">
          IT → Security Career Track (16-Week Program)
        </h3>
        <p style="font-size:14px; color:var(--ink-secondary); line-height:1.6; margin-bottom:16px;">
          A self-contained, offline-capable study cockpit and job-hunt pipeline designed to systematically transition a computer science or engineering graduate into Enterprise IT Support, Network Engineering (Cisco CCNA 200-301), and Security Operations (SOC).
        </p>

        <div class="about-grid">
          <div class="about-card">
            <h4>🎯 2-Hour Adaptive Pacing</h4>
            <p>Non-punitive scheduling using Exponentially Weighted Moving Average (EWMA). If life gets busy, your timeline adjusts forward automatically without red guilt markers.</p>
          </div>
          <div class="about-card">
            <h4>⚡ Zero-Friction Local Streaming</h4>
            <p>Embedded RFC 7233 Python media daemon serves your downloaded 1080p video library with instant byte-range scrubbing and floating Picture-in-Picture (PiP) over Cisco Packet Tracer.</p>
          </div>
          <div class="about-card">
            <h4>🧠 Spaced Repetition Flashcards</h4>
            <p>2,157 Anki flashcards extracted directly from Jeremy's course materials and embedded into the app using the SuperMemo SM-2 algorithm. No Anki installation required.</p>
          </div>
          <div class="about-card">
            <h4>☁️ Real-Time Cross-Device Sync</h4>
            <p>Local-first architecture backed by Firebase Firestore. Study on your desktop, and review flashcards or watch YouTube fallback streams seamlessly on your mobile Chrome App.</p>
          </div>
        </div>

        <div style="margin-top:20px; padding:14px; background:var(--bg-surface-elevated); border-radius:var(--radius-md); font-size:12px; color:var(--ink-muted);">
          <strong>DOE Architecture Version:</strong> 2026.10.01 • Standards: RFC 7233, RFC 791, RFC 4632, W3C PiP, W3C MediaSession, WCAG 2.2 Level AA.
        </div>
      </div>
    </div>

    <!-- Panel 2: Cloud Sync & Mobile Pairing -->
    <div class="drawer-panel" id="tabSync" style="display:${activeTabId === 'tabSync' ? 'block' : 'none'};">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
        <div>
          <h3 style="font-size:18px; font-weight:700; color:var(--signal-cyan);">Cloud Sync & Mobile Pairing</h3>
          <p style="font-size:13px; color:var(--ink-secondary); margin-top:2px;">
            Pair this desktop cockpit with your phone to synchronize study progress, CCNA days, and flashcards across both screens in real time.
          </p>
        </div>
        <div id="cloudStatusPill" style="display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; padding:4px 10px; border-radius:12px; background:hsla(152, 60%, 45%, 0.15); color:var(--accent-emerald);">
          🟢 Connected to Firestore
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:18px; margin-bottom:20px;">
        <!-- Left: Pairing Controls -->
        <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px;">
          <h4 style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--signal-cyan); margin-bottom:8px;">
            1. Device Pairing Key
          </h4>
          <p style="font-size:12px; color:var(--ink-muted); margin-bottom:12px;">
            Enter a unique key (or generate one) to connect this browser and your phone to the same progress track.
          </p>

          <div style="display:flex; gap:8px; margin-bottom:16px;">
            <input type="text" id="syncKeyInput" class="form-input" value="${activeSyncKey}" placeholder="e.g. david-track-2026" spellcheck="false" autocomplete="off" />
            <button id="saveSyncKeyBtn" class="action-btn primary">Save</button>
            <button id="genSyncKeyBtn" class="action-btn">🎲 Random</button>
          </div>

          <h4 style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--signal-cyan); margin-bottom:8px;">
            2. Direct Mobile 1-Tap Link
          </h4>
          <p style="font-size:12px; color:var(--ink-muted); margin-bottom:8px;">
            Send this link to your phone via WhatsApp, Telegram, or email. Opening it automatically pairs without typing passwords:
          </p>
          <div style="background:var(--bg-surface); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); font-family:var(--font-mono); font-size:12px; word-break:break-all; color:var(--signal-cyan); margin-bottom:10px;" id="directSyncLinkText">
            ${directSyncUrl}
          </div>
          <div style="display:flex; gap:8px;">
            <button id="copyMobileLinkBtn" class="action-btn" style="flex:1;">📋 Copy 1-Tap Link</button>
            <button id="forceSyncNowBtn" class="action-btn primary" style="flex:1;">⚡ Force Sync Now</button>
          </div>
        </div>

        <!-- Right: QR Code for Phone Camera -->
        <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; align-items:center; text-align:center; justify-content:center;">
          <h4 style="font-size:13px; font-weight:700; color:var(--ink-primary); margin-bottom:6px;">Instant QR Code Scan</h4>
          <p style="font-size:11px; color:var(--ink-muted); margin-bottom:12px;">Open camera on your iPhone / Android:</p>
          <div style="background:#fff; padding:10px; border-radius:var(--radius-sm); display:inline-block; box-shadow:0 4px 12px rgba(0,0,0,0.3);">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(directSyncUrl)}" alt="Mobile Pairing QR" width="150" height="150" style="display:block;" />
          </div>
          <span style="font-size:11px; color:var(--ink-muted); margin-top:10px;">Firestore Project: <code>${DEFAULT_FIREBASE_CONFIG.projectId || 'it-tracker-md'}</code></span>
        </div>
      </div>
    </div>

    <!-- Panel 3: Job Tracker & AI Bot -->
    <div class="drawer-panel" id="tabJobs" style="display:${activeTabId === 'tabJobs' ? 'block' : 'none'};">
      <div id="drawerJobsMount"></div>
    </div>

    <!-- Panel 4: Interview Bank -->
    <div class="drawer-panel" id="tabInterview" style="display:${activeTabId === 'tabInterview' ? 'block' : 'none'};">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; gap:12px;">
        <input type="text" id="interviewSearchInput" class="form-input" style="flex:1;" placeholder="🔍 Filter interview scenarios (DNS, TCP, DHCP, OSPF...)" />
        <span style="font-size:12px; color:var(--ink-muted); font-family:var(--font-mono);">${QA.length} Questions</span>
      </div>

      <div class="qa-accordion-list" id="qaAccordionList">
        ${QA.map(([q, a], idx) => `
          <details class="qa-details" data-qa-idx="${idx}">
            <summary class="qa-summary">
              <span>${q}</span>
            </summary>
            <div class="qa-answer-body">
              <p>${a}</p>
              <button class="action-btn copy-qa-btn" style="padding:4px 8px; font-size:11px; margin-top:8px;">
                📋 Copy Answer
              </button>
            </div>
          </details>
        `).join('')}
      </div>
    </div>

    <!-- Panel 5: Data & Backup -->
    <div class="drawer-panel" id="tabBackup" style="display:${activeTabId === 'tabBackup' ? 'block' : 'none'};">
      <h3 style="font-size:16px; font-weight:700; margin-bottom:6px;">Data Vault & Backup</h3>
      <p style="font-size:13px; color:var(--ink-muted); margin-bottom:16px;">
        Export your complete profile (study progress, applications, flashcard intervals, and notes) to a portable JSON file.
      </p>

      <div style="display:flex; flex-direction:column; gap:12px; max-width:320px;">
        <button id="downloadBackupBtn" class="action-btn primary" style="justify-content:center;">
          📥 Download JSON Profile Backup
        </button>

        <label class="action-btn" style="justify-content:center; cursor:pointer;">
          📤 Restore Profile from File
          <input type="file" id="restoreFileInput" accept=".json" style="display:none;" />
        </label>

        <button id="resetProfileBtn" class="action-btn" style="justify-content:center; color:var(--accent-crimson); border-color:hsla(350, 80%, 55%, 0.4);">
          ⚠️ Reset Local Progress
        </button>
      </div>
    </div>
  `;

  // Bind Drawer Tabs
  const jobsMount = inner.querySelector('#drawerJobsMount');
  if (jobsMount) {
    mountJobsView(jobsMount);
  }

  inner.querySelectorAll('.drawer-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      inner.querySelectorAll('.drawer-tab-btn').forEach(b => b.classList.remove('active'));
      inner.querySelectorAll('.drawer-panel').forEach(p => p.style.display = 'none');
      btn.classList.add('active');
      const target = inner.querySelector('#' + btn.dataset.dtab);
      if (target) target.style.display = 'block';
    });
  });

  // Bind Sync Controls
  const saveKeyBtn = inner.querySelector('#saveSyncKeyBtn');
  const genKeyBtn = inner.querySelector('#genSyncKeyBtn');
  const copyLinkBtn = inner.querySelector('#copyMobileLinkBtn');
  const forcePushBtn = inner.querySelector('#forceSyncNowBtn');

  if (saveKeyBtn) {
    saveKeyBtn.onclick = () => {
      const val = inner.querySelector('#syncKeyInput').value.trim();
      if (val) {
        store.setSyncChannel(val);
        alert(`Pairing Key saved to "${val}"! Connecting...`);
        renderDrawerContent(container, 'tabSync');
      }
    };
  }

  if (genKeyBtn) {
    genKeyBtn.onclick = () => {
      const randKey = 'track-' + Math.random().toString(36).slice(2, 8);
      inner.querySelector('#syncKeyInput').value = randKey;
      store.setSyncChannel(randKey);
      alert(`New Pairing Key generated: "${randKey}". Refreshing connection...`);
      renderDrawerContent(container, 'tabSync');
    };
  }

  if (copyLinkBtn) {
    copyLinkBtn.onclick = () => {
      copyToClipboard(directSyncUrl);
      copyLinkBtn.textContent = '✓ Link Copied!';
      setTimeout(() => { copyLinkBtn.textContent = '📋 Copy 1-Tap Link'; }, 2000);
    };
  }

  if (forcePushBtn) {
    forcePushBtn.onclick = () => {
      store.syncNow();
      alert('Local state pushed to Firestore cloud vault successfully!');
    };
  }

  // Bind Interview Filter
  const qSearch = inner.querySelector('#interviewSearchInput');
  if (qSearch) {
    qSearch.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      inner.querySelectorAll('.qa-details').forEach(d => {
        d.style.display = (!q || d.textContent.toLowerCase().includes(q)) ? 'block' : 'none';
      });
    });
  }

  // Bind Copy Answer buttons
  inner.querySelectorAll('.copy-qa-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const p = btn.closest('.qa-answer-body').querySelector('p');
      if (p) copyToClipboard(p.textContent);
    });
  });

  // Bind Backup Download
  const dlBtn = inner.querySelector('#downloadBackupBtn');
  if (dlBtn) {
    dlBtn.onclick = () => {
      const blob = new Blob([JSON.stringify(store.get(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `it-sec-track-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    };
  }

  // Bind Restore File
  const fileInput = inner.querySelector('#restoreFileInput');
  if (fileInput) {
    fileInput.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (typeof parsed === 'object' && parsed !== null) {
            localStorage.setItem('it-sec-track.v1', JSON.stringify(parsed));
            alert('Profile restored successfully! Refreshing...');
            window.location.reload();
          }
        } catch (err) {
          alert('Could not parse JSON backup file.');
        }
      };
      reader.readAsText(file);
    };
  }

  // Bind Reset
  const resetBtn = inner.querySelector('#resetProfileBtn');
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (confirm('Clear all progress, flashcard reviews, and applications in this browser? Make sure to download a backup first!')) {
        localStorage.removeItem('it-sec-track.v1');
        window.location.reload();
      }
    };
  }
}
