/**
 * Unified State Management & Bidirectional Synchronization Engine
 * <!-- DOE-VERSION: 2026.10.01 -->
 * Features:
 * - 100% Backward-compatible with it-sec-track.v1 schema (done, apps, log, open, theme)
 * - Bidirectional CCNA Day <-> 16-Week Task Mapping
 * - Immutable 40-step snapshot ring-buffer for undo/redo (DOE Learning 4)
 * - Firebase Firestore Real-Time Cloud Synchronization Bridge
 */

import { DEFAULT_FIREBASE_CONFIG } from './roadmapData.js';

export const DEFAULT_SYNC_CHANNEL = 'david-track-2026';

// Capture ?sync=... URL parameter immediately before any store initialization
try {
  if (typeof window !== 'undefined' && window.location && window.location.search) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('sync')) {
      const syncVal = urlParams.get('sync').trim();
      if (syncVal) {
        localStorage.setItem('it-sec-sync-channel', syncVal);
      }
    }
  }
} catch (e) {}

const STORAGE_KEY = 'it-sec-track.v1';
const SYNC_CONFIG_KEY = 'it-sec-sync.config.v1';
const MAX_HISTORY = 40;

const DEFAULT_COCKPIT = {
  version: '2026.10.01',
  currentDay: 1,
  completedDays: [],
  todayActiveSeconds: 0,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  dailyHistory: {},
  ewmaVelocityMinutes: 120, // 2h default
  flashcards: {},
  gym: {
    streak: 0,
    totalAnswered: 0,
    totalCorrect: 0
  },
  dayNotes: {}
};

const DEFAULT_ROOT_STATE = {
  done: {},
  apps: [],
  log: [],
  open: {},
  theme: 'dark',
  activeView: 'viewCockpit', // 'viewCockpit' | 'viewRoadmap'
  cockpit: DEFAULT_COCKPIT
};

// Deterministic CCNA Day <-> Roadmap Task Mapping
// Maps CCNA days (1-63) to Phase 1 (Weeks 1-6 CCNA) task IDs
export function mapDayToTaskIds(day) {
  if (day >= 1 && day <= 7) return ['p1-b1-t1', 'p1-b1-t2', 'p1-b1-t3'];
  if (day >= 8 && day <= 15) return ['p1-b2-t1', 'p1-b2-t2', 'p1-b2-t3'];
  if (day >= 16 && day <= 23) return ['p1-b3-t1', 'p1-b3-t2', 'p1-b3-t3'];
  if (day >= 24 && day <= 33) return ['p1-b4-t1', 'p1-b4-t2', 'p1-b4-t3'];
  if (day >= 34 && day <= 45) return ['p1-b5-t1', 'p1-b5-t2', 'p1-b5-t3'];
  if (day >= 46 && day <= 63) return ['p1-b6-t1', 'p1-b6-t2', 'p1-b6-t3'];
  return [];
}

class UnifiedStore {
  constructor() {
    this.state = this._loadInitialState();
    this.history = [JSON.parse(JSON.stringify(this.state))];
    this.historyIndex = 0;
    this.listeners = new Set();
    this.firestoreUnsub = null;
    this.isPushingToFirestore = false;
    this._syncTimer = null;
    this._lastSyncStatus = null;
    this._hasLocalPending = false;
    this._hasExplicitUserEdit = false;
    this._initialCloudHydrated = false;
    this._persistenceEnabled = false;
    this._networkListenersAttached = false;
    this._initFirestoreSync();
  }

  _loadInitialState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const root = Object.assign({}, DEFAULT_ROOT_STATE, parsed);
        root.cockpit = Object.assign({}, DEFAULT_COCKPIT, parsed.cockpit || {});

        // Normalize legacy view strings
        if (!['viewCockpit', 'viewRoadmap'].includes(root.activeView)) {
          root.activeView = 'viewCockpit';
        }

        // Clean any bare task keys that leaked from earlier bug
        if (root.done) {
          ['t1', 't2', 't3', 't4', 't5', 't6', 't7'].forEach(bare => {
            delete root.done[bare];
          });
        }
        return root;
      }
    } catch (e) {
      console.warn('Failed to parse saved state, using default:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_ROOT_STATE));
  }

  get() {
    return this.state;
  }

  getCockpit() {
    return this.state.cockpit || DEFAULT_COCKPIT;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  commit(updater, recordHistory = true, syncCloud = true) {
    const prevState = JSON.parse(JSON.stringify(this.state));
    const nextState = typeof updater === 'function' ? updater(prevState) : Object.assign({}, prevState, updater);

    if (syncCloud) {
      nextState.updatedAt = Date.now();
      this._hasLocalPending = true;
      this._hasExplicitUserEdit = true;
    }
    this.state = nextState;

    if (recordHistory) {
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }
      this.history.push(JSON.parse(JSON.stringify(this.state)));
      if (this.history.length > MAX_HISTORY) {
        this.history.shift();
      } else {
        this.historyIndex++;
      }
    }

    this._persist();
    if (syncCloud) {
      this.scheduleFirestoreSync(600);
    }
    this._notify();
  }

  // Toggle Cockpit Day completion with bidirectional Roadmap check
  toggleCockpitDay(dayNumber) {
    this.commit(s => {
      s.cockpit = s.cockpit || Object.assign({}, DEFAULT_COCKPIT);
      s.cockpit.completedDays = s.cockpit.completedDays || [];
      s.done = s.done || {};

      const isDone = s.cockpit.completedDays.includes(dayNumber);
      if (isDone) {
        s.cockpit.completedDays = s.cockpit.completedDays.filter(d => d !== dayNumber);
      } else {
        s.cockpit.completedDays.push(dayNumber);
      }

      // Bidirectional sync to Roadmap task IDs
      const taskIds = mapDayToTaskIds(dayNumber);
      taskIds.forEach(tId => {
        if (!isDone) {
          s.done[tId] = true;
        }
      });

      return s;
    });
  }

  // Toggle Roadmap Task with bidirectional Cockpit check
  toggleRoadmapTask(taskId) {
    this.commit(s => {
      s.done = s.done || {};
      
      // Also scrub any legacy bare key that might correspond to this task
      const bareMatch = String(taskId).match(/\.(t\d+)$/);
      if (bareMatch) {
        delete s.done[bareMatch[1]];
      }

      if (s.done[taskId]) {
        delete s.done[taskId];
      } else {
        s.done[taskId] = 1;
      }
      return s;
    });
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this._persist();
      this._notify();
      return true;
    }
    return false;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this._persist();
      this._notify();
      return true;
    }
    return false;
  }

  _persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to persist state to localStorage:', e);
    }
  }

  _notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error('State listener error:', err);
      }
    }
  }

  _initFirestoreSync() {
    try {
      if (typeof window.firebase === 'undefined') {
        this._setSyncStatus('offline');
        return;
      }

      let cfg = DEFAULT_FIREBASE_CONFIG;
      const customRaw = localStorage.getItem(SYNC_CONFIG_KEY);
      if (customRaw) {
        try { cfg = Object.assign({}, DEFAULT_FIREBASE_CONFIG, JSON.parse(customRaw)); } catch (e) {}
      }

      const channelId = localStorage.getItem('it-sec-sync-channel') || cfg.channelId || DEFAULT_SYNC_CHANNEL;

      if (!window.firebase.apps.length) {
        window.firebase.initializeApp({
          apiKey: cfg.apiKey,
          authDomain: cfg.authDomain,
          projectId: cfg.projectId,
          storageBucket: cfg.storageBucket,
          messagingSenderId: cfg.messagingSenderId,
          appId: cfg.appId
        });
      }

      const db = window.firebase.firestore();

      // Enable local offline persistence if available
      try {
        if (!this._persistenceEnabled && db.enablePersistence) {
          db.enablePersistence({ synchronizeTabs: true }).catch(err => {
            console.log('Firestore offline persistence note:', err.code);
          });
          this._persistenceEnabled = true;
        }
      } catch (e) {}

      // Wire automatic flush on network reconnection and tab hide
      if (!this._networkListenersAttached && typeof window !== 'undefined') {
        window.addEventListener('online', () => {
          console.log('[Sync] Network reconnected; syncing pending progress...');
          this.syncNow();
        });
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden' && this._hasLocalPending) {
            this.syncNow();
          }
        });
        this._networkListenersAttached = true;
      }

      this.firestoreUnsub = db.collection('it_trackers').doc(channelId).onSnapshot(doc => {
        // Prevent local pending writes from triggering snapshot loop
        if (doc.metadata && doc.metadata.hasPendingWrites) return;
        if (this.isPushingToFirestore) return;

        if (doc.exists) {
          const remote = doc.data();
          if (remote && remote.state) {
            let remoteUpdatedAt = 0;
            if (typeof remote.updatedAtMs === 'number') {
              remoteUpdatedAt = remote.updatedAtMs;
            } else if (remote.updatedAt && typeof remote.updatedAt.toMillis === 'function') {
              remoteUpdatedAt = remote.updatedAt.toMillis();
            } else if (remote.state && typeof remote.state.updatedAt === 'number') {
              remoteUpdatedAt = remote.state.updatedAt;
            }

            const localUpdatedAt = this.state.updatedAt || 0;

            // FIRST BOOT HYDRATION:
            // If this client hasn't hydrated yet and hasn't had explicit user clicks,
            // it MUST unconditionally adopt the existing remote cloud document!
            if (!this._initialCloudHydrated && !this._hasExplicitUserEdit) {
              console.log('[Sync] Initial cloud hydration: adopting established remote state.');
              const merged = Object.assign({}, DEFAULT_ROOT_STATE, remote.state);
              merged.cockpit = Object.assign({}, DEFAULT_COCKPIT, remote.state.cockpit || {});
              merged.todayActiveSeconds = Math.max(this.state.todayActiveSeconds || 0, remote.state.todayActiveSeconds || 0);
              this.state = merged;
              this._hasLocalPending = false;
              this._initialCloudHydrated = true;
              this._persist();
              this._notify();
              this._setSyncStatus('synced');
              return;
            }

            // RACE CONDITION GUARD: If we have explicit unsaved local edits that are genuinely newer than remote snapshot:
            if (this._hasLocalPending && this._hasExplicitUserEdit && localUpdatedAt > remoteUpdatedAt) {
              console.log('[Sync] Preserving newer local edits; syncing local state to cloud...');
              this.syncNow();
              return;
            }

            // Clean any legacy bare keys from remote state
            if (remote.state.done) {
              ['t1', 't2', 't3', 't4', 't5', 't6', 't7'].forEach(bare => {
                delete remote.state.done[bare];
              });
            }

            const merged = Object.assign({}, DEFAULT_ROOT_STATE, remote.state);
            merged.cockpit = Object.assign({}, DEFAULT_COCKPIT, remote.state.cockpit || {});
            merged.updatedAt = Math.max(remoteUpdatedAt, localUpdatedAt);

            // ACCUMULATIVE STUDY TIME: Study seconds must NEVER roll backwards on any client!
            merged.todayActiveSeconds = Math.max(this.state.todayActiveSeconds || 0, remote.state.todayActiveSeconds || 0);

            // ACCUMULATIVE DAILY STUDY TIME: Merge daily histories with Math.max
            const mergedHistory = Object.assign({}, remote.state.dailyHistory || {});
            for (const [day, secs] of Object.entries(this.state.dailyHistory || {})) {
              mergedHistory[day] = Math.max(mergedHistory[day] || 0, secs || 0);
            }
            merged.dailyHistory = mergedHistory;

            const currentStr = JSON.stringify(this.state);
            const remoteStr = JSON.stringify(merged);
            if (currentStr !== remoteStr) {
              this._hasLocalPending = false;
              this.state = merged;
              this._persist();
              this._notify();
            }
            this._initialCloudHydrated = true;
            this._setSyncStatus('synced');
          }
        } else {
          // Document does not exist in cloud yet
          this._initialCloudHydrated = true;
        }
      }, err => {
        console.warn('Firestore snapshot error:', err);
        this._setSyncStatus('offline');
      });

      this._setSyncStatus('synced');
    } catch (e) {
      this._setSyncStatus('offline');
    }
  }

  scheduleFirestoreSync(delayMs = 600) {
    if (this._syncTimer) {
      clearTimeout(this._syncTimer);
    }
    this._syncTimer = setTimeout(() => {
      this._syncTimer = null;
      this.syncNow();
    }, delayMs);
  }

  syncNow() {
    if (this._syncTimer) {
      clearTimeout(this._syncTimer);
      this._syncTimer = null;
    }

    // HYDRATION GATE: Prevent an unhydrated booting client from pushing initial empty state
    if (!this._initialCloudHydrated && !this._hasExplicitUserEdit) {
      console.log('[Sync] Hydration gate active: holding outbound push until initial cloud snapshot is received.');
      return;
    }

    try {
      if (typeof window.firebase === 'undefined' || !window.firebase.apps || !window.firebase.apps.length) return;
      let cfg = DEFAULT_FIREBASE_CONFIG;
      const customRaw = localStorage.getItem(SYNC_CONFIG_KEY);
      if (customRaw) {
        try { cfg = Object.assign({}, DEFAULT_FIREBASE_CONFIG, JSON.parse(customRaw)); } catch (e) {}
      }
      const channelId = localStorage.getItem('it-sec-sync-channel') || cfg.channelId || DEFAULT_SYNC_CHANNEL;

      const db = window.firebase.firestore();
      this.isPushingToFirestore = true;
      this._setSyncStatus('syncing');

      const pushTimestamp = this.state.updatedAt || Date.now();

      db.collection('it_trackers').doc(channelId).set({
        state: this.state,
        updatedAtMs: pushTimestamp,
        clientTime: new Date().toISOString(),
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        this._hasLocalPending = false;
        this._setSyncStatus('synced');
      }).catch(err => {
        console.warn('Firestore sync push failed:', err.message);
        this._setSyncStatus('offline');
      }).finally(() => {
        setTimeout(() => { this.isPushingToFirestore = false; }, 600);
      });
    } catch (e) {
      console.warn('Firestore sync exception:', e);
      this._setSyncStatus('offline');
    }
  }

  setSyncChannel(newChannelId) {
    if (!newChannelId) return;
    const clean = newChannelId.trim();
    localStorage.setItem('it-sec-sync-channel', clean);
    if (this.firestoreUnsub) {
      try { this.firestoreUnsub(); } catch (e) {}
      this.firestoreUnsub = null;
    }
    this._initFirestoreSync();
    this.syncNow();
  }

  _setSyncStatus(status) {
    if (this._lastSyncStatus === status) return;
    this._lastSyncStatus = status;

    const textEl = document.getElementById('cloudSyncStatusText');
    const dotEl = document.getElementById('syncStatusDot');
    const pill = document.getElementById('cloudStatusPill');

    if (dotEl) {
      dotEl.className = 'sync-dot ' + (status === 'synced' ? 'synced' : status === 'syncing' ? 'syncing' : 'offline');
    }
    if (textEl) {
      textEl.textContent = status === 'synced' ? 'Cloud Synced' : status === 'syncing' ? 'Syncing...' : 'Local Vault';
    }
    if (pill) {
      if (status === 'synced') {
        pill.innerHTML = '🟢 Connected to Firestore';
        pill.style.background = 'hsla(152, 60%, 45%, 0.15)';
        pill.style.color = 'var(--accent-emerald)';
      } else if (status === 'syncing') {
        pill.innerHTML = '🟡 Syncing updates...';
        pill.style.background = 'hsla(38, 92%, 50%, 0.15)';
        pill.style.color = 'var(--accent-amber)';
      } else {
        pill.innerHTML = '⚪ Local Offline Vault';
        pill.style.background = 'hsla(0, 0%, 50%, 0.15)';
        pill.style.color = 'var(--ink-muted)';
      }
    }
  }
}

export const store = new UnifiedStore();
