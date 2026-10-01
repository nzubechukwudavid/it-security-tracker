/**
 * Adaptive Velocity Engine & W3C Page Visibility Study Timer
 * <!-- DOE-VERSION: 2026.10.01 -->
 */

import { store } from './state.js';

let timerInterval = null;
let isTabVisible = !document.hidden;

export function initVelocityEngine() {
  // 1. Page Visibility API listener
  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
    updateTimerIndicator();
    if (!isTabVisible) {
      // User switched tabs or minimized: persist study seconds to Firestore
      store.syncNow();
    }
  });

  window.addEventListener('beforeunload', () => {
    store.syncNow();
  });

  // 2. Active Second Ticker (Ticks when tab is focused and visible)
  // High-frequency local stopwatch: syncCloud = false to eliminate rapid network flashing!
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (isTabVisible) {
      store.commit(s => {
        s.todayActiveSeconds = (s.todayActiveSeconds || 0) + 1;
        const todayStr = new Date().toISOString().slice(0, 10);
        s.dailyHistory = s.dailyHistory || {};
        s.dailyHistory[todayStr] = s.todayActiveSeconds;
        return s;
      }, false, false);
    }
  }, 1000);

  // 3. Periodic Background Study Time Cloud Sync (every 60s of active study)
  let lastSyncedSeconds = (store.get().todayActiveSeconds || 0);
  setInterval(() => {
    const cur = store.get().todayActiveSeconds || 0;
    if (isTabVisible && Math.abs(cur - lastSyncedSeconds) >= 60) {
      lastSyncedSeconds = cur;
      store.scheduleFirestoreSync(1000);
    }
  }, 15000);

  // Subscribe UI to state changes
  store.subscribe(updateVelocityUI);
}

function updateTimerIndicator() {
  const dot = document.getElementById('timerIndicatorDot');
  if (dot) {
    if (isTabVisible) {
      dot.classList.remove('paused');
    } else {
      dot.classList.add('paused');
    }
  }
}

export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  }
  return `${m}m ${s}s`;
}

export function calculateReadinessForecast(state) {
  const completed = (state.completedDays || []).length;
  const totalDays = 63;
  const remaining = Math.max(1, totalDays - completed);

  // Velocity in minutes
  const todayMins = Math.round((state.todayActiveSeconds || 0) / 60);
  const ewma = state.ewmaVelocityMinutes || 120; // default 120 mins (2h)

  // Dynamic Pacing Mode
  let mode = 'target';
  let modeLabel = 'Target Pace (2h/day)';
  if (ewma >= 150) {
    mode = 'sprint';
    modeLabel = 'Sprint Pace (2.5h+/day)';
  } else if (ewma < 90) {
    mode = 'maintenance';
    modeLabel = 'Maintenance Pace (1h/day)';
  }

  // Days needed based on remaining load (assuming ~2 hours per CCNA Day)
  const estDays = Math.ceil(remaining * (120 / Math.max(30, ewma)));
  
  const dStart = new Date();
  dStart.setDate(dStart.getDate() + estDays);

  const dEnd = new Date(dStart);
  dEnd.setDate(dEnd.getDate() + 7);

  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const forecastStr = `${dStart.toLocaleDateString('en-US', options)} – ${dEnd.toLocaleDateString('en-US', options)}`;

  return {
    completed,
    remaining,
    todayMins,
    ewma,
    mode,
    modeLabel,
    forecastStr
  };
}

export function updateVelocityUI(state) {
  // 1. Masthead timer
  const mastheadTimer = document.getElementById('mastheadLiveTimer');
  if (mastheadTimer) {
    mastheadTimer.textContent = formatTime(state.todayActiveSeconds || 0);
  }

  // 2. Velocity HUD Bar
  const forecast = calculateReadinessForecast(state);
  const fill = document.getElementById('progressFillBar');
  const paceChip = document.getElementById('paceModeChip');
  const predictionText = document.getElementById('velocityPredictionText');
  const progressText = document.getElementById('progressRatioText');

  if (fill) {
    const pct = Math.min(100, Math.round((forecast.completed / 63) * 100));
    fill.style.width = `${pct}%`;
  }

  if (progressText) {
    progressText.textContent = `${forecast.completed} / 63 Days Complete (${Math.round((forecast.completed / 63) * 100)}%)`;
  }

  if (paceChip) {
    paceChip.className = `pace-mode-chip ${forecast.mode}`;
    paceChip.textContent = forecast.modeLabel;
  }

  if (predictionText) {
    predictionText.innerHTML = `At your active pace, estimated CCNA readiness is <strong>${forecast.forecastStr}</strong>.`;
  }
}
