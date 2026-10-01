/**
 * Dual-Engine Video Player & Multi-Video Day Streamer
 * <!-- DOE-VERSION: 2026.10.01 -->
 * Features:
 * - Multi-Video Pill Switcher (Lecture, Lab, Extra) for days with multiple lessons
 * - Local RFC 7233 Byte-Range Desktop Daemon streaming when on PC
 * - Direct 1-Tap YouTube App Launch when away from PC (zero broken iframe embeds, zero clunky file pickers)
 * - Picture-in-Picture & W3C Media Session API integration
 */

import { setupPiPAndHotkeys } from './pip.js';

const CCNA_PLAYLIST_ID = 'PLxbwE86jKRgMpuZuLBivmt48dPUfSm444';

export async function probeLocalMediaServer() {
  try {
    const res = await fetch('http://127.0.0.1:8080/health', {
      signal: AbortSignal.timeout(1200)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export function formatVideoTitle(filename, index) {
  if (!filename) return `Video ${index + 1}`;
  let clean = filename.replace(/\.mp4$/i, '');
  clean = clean.replace(/^\d+_Day_\d+_/i, '').replace(/_/g, ' ');

  if (/lecture/i.test(clean)) return `🎬 ${clean}`;
  if (/lab/i.test(clean)) return `🧪 ${clean}`;
  if (/extra/i.test(clean) || /anki/i.test(clean)) return `💡 ${clean}`;
  return `▶️ ${clean}`;
}

export async function mountVideoPlayer(container, dayData, selectedIndex = 0) {
  const isLocalAvailable = await probeLocalMediaServer();
  const vids = dayData.videos || [];
  const safeIndex = Math.min(Math.max(0, selectedIndex), Math.max(0, vids.length - 1));
  const activeVideo = vids[safeIndex] || null;

  // 1. Render Multi-Video Selector Pills (Lecture, Lab, Extra)
  renderVideoSelectorBar(dayData, safeIndex, container);

  // Stop any currently playing video before re-mounting
  const existingVideo = container.querySelector('video');
  if (existingVideo) {
    try {
      existingVideo.pause();
      existingVideo.removeAttribute('src');
      existingVideo.load();
    } catch (e) {}
  }
  container.innerHTML = '';

  if (isLocalAvailable && activeVideo) {
    // Mode A: Local High-Speed Desktop Daemon Streaming (1080p RFC 7233)
    const videoUrl = `http://127.0.0.1:8080/media/01_Jeremy_CCNA_200-301/${encodeURIComponent(activeVideo)}`;
    mountHtml5Player(container, videoUrl, dayData, activeVideo);
    updateToolbar(true, activeVideo, 'Local Vault (1080p)');
  } else {
    // Mode B: Clean, Frictionless 1-Tap YouTube Hub (Bypasses broken mobile iframe embeds)
    mountCleanYouTubeHub(container, dayData, activeVideo, safeIndex);
    updateToolbar(false, 'YouTube (Direct)');
  }
}

function renderVideoSelectorBar(dayData, activeIndex, container) {
  const bar = document.getElementById('videoSelectorBar');
  if (!bar) return;

  const vids = dayData.videos || [];
  if (vids.length <= 1) {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return;
  }

  bar.style.display = 'flex';
  bar.innerHTML = vids.map((v, idx) => {
    const title = formatVideoTitle(v, idx);
    const isActive = idx === activeIndex;
    return `
      <button class="video-pill-btn ${isActive ? 'active' : ''}" data-vidx="${idx}">
        ${title}
      </button>
    `;
  }).join('');

  bar.querySelectorAll('.video-pill-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.vidx, 10);
      mountVideoPlayer(container, dayData, idx);
    };
  });
}

function mountHtml5Player(container, sourceUrl, dayData, videoFilename) {
  const savedTimeKey = `ccna_playback_day_${dayData.day}_${encodeURIComponent(videoFilename)}`;
  const savedTime = parseFloat(localStorage.getItem(savedTimeKey) || '0');

  const videoEl = document.createElement('video');
  videoEl.className = 'video-element';
  videoEl.controls = true;
  videoEl.src = sourceUrl;
  videoEl.preload = 'metadata';
  videoEl.playsInline = true;

  videoEl.addEventListener('loadedmetadata', () => {
    if (savedTime > 5 && savedTime < videoEl.duration - 10) {
      videoEl.currentTime = savedTime;
    }
  });

  // Throttled playback position save
  let lastSaved = 0;
  videoEl.addEventListener('timeupdate', () => {
    const now = Date.now();
    if (now - lastSaved > 3000) {
      lastSaved = now;
      localStorage.setItem(savedTimeKey, videoEl.currentTime.toString());
    }
  });

  container.appendChild(videoEl);

  // Setup W3C Media Session API
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `Day ${dayData.day}: ${dayData.topic}`,
      artist: "Jeremy's IT Lab",
      album: "CCNA 200-301 Complete Course"
    });

    navigator.mediaSession.setActionHandler('seekbackward', () => {
      videoEl.currentTime = Math.max(0, videoEl.currentTime - 10);
    });
    navigator.mediaSession.setActionHandler('seekforward', () => {
      videoEl.currentTime = Math.min(videoEl.duration, videoEl.currentTime + 10);
    });
  }

  // Attach PiP & keyboard hotkeys
  setupPiPAndHotkeys(videoEl);
}

function mountCleanYouTubeHub(container, dayData, activeVideo, activeIndex) {
  const cleanTitle = activeVideo ? formatVideoTitle(activeVideo, activeIndex) : dayData.topic;
  
  // Clean search query to land straight on Jeremy's exact video
  const searchPart = activeVideo 
    ? activeVideo.replace(/\.mp4$/i, '').replace(/^\d+_Day_\d+_/i, '').replace(/_/g, ' ')
    : dayData.topic;
  const directYtSearch = `https://www.youtube.com/results?search_query=Jeremy%27s+IT+Lab+CCNA+Day+${dayData.day}+${encodeURIComponent(searchPart)}`;
  const playlistUrl = `https://www.youtube.com/playlist?list=${CCNA_PLAYLIST_ID}`;

  container.innerHTML = `
    <div class="video-offline-hub">
      <div class="hub-icon">📺</div>
      <h3 class="hub-title">Day ${String(dayData.day).padStart(2, '0')}: ${cleanTitle}</h3>
      <p class="hub-desc">
        Click below to open and watch this lesson directly on YouTube without iframe playback restrictions.
      </p>

      <div class="video-hub-actions">
        <!-- 1-Tap Launch in YouTube App -->
        <a href="${directYtSearch}" target="_blank" rel="noopener" class="action-btn primary" style="font-size:14px; padding:10px 18px; text-decoration:none;">
          ▶️ Watch on YouTube
        </a>

        <!-- Full Playlist Shortcut -->
        <a href="${playlistUrl}" target="_blank" rel="noopener" class="action-btn" style="text-decoration:none;">
          📑 CCNA Playlist
        </a>
      </div>

      <div class="video-hub-hint">
        💻 <strong>Desktop Mode:</strong> When studying on your PC, launching the Study Cockpit streams downloaded 1080p video locally with zero buffering.
      </div>
    </div>
  `;
}

function updateToolbar(isLocal, label, badgeDesc) {
  const badge = document.getElementById('mediaSourceBadge');
  if (badge) {
    if (isLocal) {
      badge.style.color = 'var(--accent-emerald)';
      badge.innerHTML = `🟢 <strong>${badgeDesc || 'Local Vault'}</strong> (${label.slice(0, 30)}...)`;
    } else {
      badge.style.color = 'var(--accent-amber)';
      badge.innerHTML = `📺 <strong>${label}</strong>`;
    }
  }
}
