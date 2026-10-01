/**
 * Study Cockpit & 16-Week Tracker Unified Application Orchestrator
 * <!-- DOE-VERSION: 2026.10.01 -->
 */

import { store } from './state.js';
import { CCNA_MATRIX } from './matrix.js';
import { mountVideoPlayer } from './player.js';
import { mountSubnettingGym } from './subnetting.js';
import { mountFlashcardDeck } from './flashcards.js';
import { mountCheatsheet } from './cheatsheet.js';
import { initVelocityEngine } from './velocity.js';
import { mountRoadmapView } from './roadmapView.js';
import { mountJobsView } from './jobsView.js';
import { setupMoreDrawer } from './drawer.js';

let activeDay = 1;
let currentView = 'viewCockpit';
let roadmapUnsub = null;

function initApp() {
  const rootState = store.get();
  const cState = store.getCockpit();
  activeDay = cState.currentDay || 1;
  currentView = rootState.activeView || 'viewCockpit';

  // 1. Initialize Theme
  applyTheme(rootState.theme || 'dark');

  // 2. Initialize Velocity Timer Engine
  initVelocityEngine();

  // 3. Setup Masthead View Switcher
  setupViewSwitcher();

  // 4. Setup Cockpit Steppers and Actions
  setupCockpitActions();

  // 5. Setup Cockpit Tabs
  setupCockpitTabs();

  // Handle mobile 1-tap pairing via ?sync=... URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('sync')) {
    const syncVal = urlParams.get('sync').trim();
    if (syncVal) {
      localStorage.setItem('it-sec-sync-channel', syncVal);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  // 6. Setup More Drawer Modal (Interview Bank, About, Sync, Backup)
  setupMoreDrawer(
    document.getElementById('moreDrawerBtn'),
    document.getElementById('moreDrawerModal'),
    document.getElementById('cloudSyncBtn')
  );

  // 7. Mount Current View
  switchView(currentView);

  // 8. Register Service Worker if supported
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.log('Service Worker registration skipped:', err.message);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function setupViewSwitcher() {
  const navBtns = document.querySelectorAll('.view-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      switchView(targetView);
    });
  });
}

function switchView(viewId) {
  if (!['viewCockpit', 'viewRoadmap'].includes(viewId)) {
    viewId = 'viewCockpit';
  }
  currentView = viewId;
  store.commit(s => { s.activeView = viewId; return s; }, false);

  // Update nav buttons
  document.querySelectorAll('.view-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewId);
  });

  // Toggle view panels
  const panels = document.querySelectorAll('.view-panel');
  panels.forEach(p => {
    p.style.display = p.id === viewId ? 'block' : 'none';
  });

  // Mount view content
  if (viewId === 'viewCockpit') {
    if (roadmapUnsub) {
      roadmapUnsub();
      roadmapUnsub = null;
    }
    renderDay(activeDay);
  } else if (viewId === 'viewRoadmap') {
    if (roadmapUnsub) {
      roadmapUnsub();
      roadmapUnsub = null;
    }
    const roadmapContainer = document.getElementById('viewRoadmap');
    roadmapUnsub = mountRoadmapView(roadmapContainer, targetDay => {
      activeDay = targetDay;
      switchView('viewCockpit');
    });
  }
}

function setupCockpitActions() {
  const prevBtn = document.getElementById('prevDayBtn');
  const nextBtn = document.getElementById('nextDayBtn');
  const completeBtn = document.getElementById('markCompleteBtn');
  const themeBtn = document.getElementById('themeToggleBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (activeDay > 1) {
        switchDay(activeDay - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (activeDay < 63) {
        switchDay(activeDay + 1);
      }
    });
  }

  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      store.toggleCockpitDay(activeDay);
      updateCompleteButtonState();
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const curr = store.get().theme || 'dark';
      const next = curr === 'dark' ? 'light' : 'dark';
      store.commit(s => { s.theme = next; return s; }, false);
      applyTheme(next);
    });
  }

  const lockBtn = document.getElementById('lockCockpitBtn');
  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      if (typeof window.lockCockpit === 'function') {
        window.lockCockpit();
      }
    });
  }
}

function updateCompleteButtonState() {
  const completeBtn = document.getElementById('markCompleteBtn');
  if (!completeBtn) return;
  const cState = store.getCockpit();
  const isDone = (cState.completedDays || []).includes(activeDay);

  if (isDone) {
    completeBtn.classList.remove('primary');
    completeBtn.style.background = 'hsla(152, 60%, 45%, 0.2)';
    completeBtn.style.color = 'var(--accent-emerald)';
    completeBtn.style.borderColor = 'var(--accent-emerald)';
    completeBtn.innerHTML = '✓ Completed';
  } else {
    completeBtn.classList.add('primary');
    completeBtn.style.background = '';
    completeBtn.style.color = '';
    completeBtn.style.borderColor = '';
    completeBtn.innerHTML = 'Mark Complete';
  }
}

function switchDay(newDay) {
  if (newDay < 1 || newDay > 63) return;
  activeDay = newDay;
  store.commit(s => {
    s.cockpit = s.cockpit || {};
    s.cockpit.currentDay = newDay;
    return s;
  });
  renderDay(newDay);
}

function renderDay(dayNumber) {
  const dayData = CCNA_MATRIX.find(d => d.day === dayNumber) || {
    day: dayNumber,
    topic: `Day ${dayNumber}`,
    videos: [],
    lab: { has_lab: false },
    flashcards: { has_cards: false },
    commands: []
  };

  // 1. Update Indicator & Stepper Buttons
  const indicator = document.getElementById('dayIndicator');
  const prevBtn = document.getElementById('prevDayBtn');
  const nextBtn = document.getElementById('nextDayBtn');

  if (indicator) indicator.textContent = `Day ${String(dayNumber).padStart(2, '0')} / 63`;
  if (prevBtn) prevBtn.disabled = dayNumber <= 1;
  if (nextBtn) nextBtn.disabled = dayNumber >= 63;

  // 2. Mission Banner
  const title = document.getElementById('missionTitle');
  const sub = document.getElementById('missionSub');
  if (title) title.textContent = dayData.topic;
  if (sub) sub.textContent = `Module ${Math.ceil(dayNumber / 7)} • CCNA 200-301`;

  // 3. Mark Complete Button
  updateCompleteButtonState();

  // 4. Video Player
  const videoBox = document.getElementById('videoPlayerContainer');
  if (videoBox) {
    mountVideoPlayer(videoBox, dayData);
  }

  // 5. Lab Launcher Card
  const labBox = document.getElementById('labLauncherContainer');
  if (labBox) {
    if (dayData.lab && dayData.lab.has_lab && dayData.lab.pkt_file) {
      const labUrl = `http://127.0.0.1:8080/media/01_Jeremy_CCNA_200-301/labs/${encodeURIComponent(dayData.lab.pkt_file)}`;
      labBox.innerHTML = `
        <div class="lab-card">
          <div class="lab-meta">
            <h3>🧪 Packet Tracer Lab</h3>
            <p>File: <code>${dayData.lab.pkt_file}</code></p>
          </div>
          <a href="${labUrl}" download="${dayData.lab.pkt_file}" class="lab-launch-btn">
            <span>🚀 Open in Packet Tracer</span>
          </a>
        </div>
      `;
    } else {
      labBox.innerHTML = `
        <div class="lab-card" style="opacity:0.8;">
          <div class="lab-meta">
            <h3 style="color:var(--ink-secondary);">📖 Concept & Theory Day</h3>
            <p>No standalone Packet Tracer lab for Day ${dayNumber}. Practice commands and flashcards!</p>
          </div>
          <span style="font-size:12px; color:var(--ink-muted); padding:6px 12px; background:var(--bg-surface-elevated); border-radius:var(--radius-sm);">Theory Only</span>
        </div>
      `;
    }
  }

  // 6. Cheatsheet Tab
  const cheatsheetBox = document.getElementById('cheatsheetContent');
  if (cheatsheetBox) {
    mountCheatsheet(cheatsheetBox, dayData.commands || []);
  }

  // 7. Subnetting Gym Tab
  const gymBox = document.getElementById('gymContent');
  if (gymBox && !gymBox.querySelector('.gym-card')) {
    mountSubnettingGym(gymBox);
  }

  // 8. Flashcards Tab
  const flashcardBox = document.getElementById('flashcardContent');
  if (flashcardBox) {
    mountFlashcardDeck(flashcardBox, dayNumber);
  }

  // 9. Notes Tab
  const notesArea = document.getElementById('notesTextarea');
  if (notesArea) {
    const savedNotes = (store.getCockpit().dayNotes || {})[dayNumber] || '';
    notesArea.value = savedNotes;
    notesArea.oninput = () => {
      store.commit(s => {
        s.cockpit = s.cockpit || {};
        s.cockpit.dayNotes = s.cockpit.dayNotes || {};
        s.cockpit.dayNotes[dayNumber] = notesArea.value;
        return s;
      }, false);
    };
  }
}

function setupCockpitTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.style.display = 'block';
        if (targetId === 'gymContent' && !targetPanel.querySelector('.gym-card')) {
          mountSubnettingGym(targetPanel);
        }
      }
    });
  });
}

// Boot on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
