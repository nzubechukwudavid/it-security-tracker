/**
 * Dual-Engine Video Player & Multi-Video Day Streamer
 * <!-- DOE-VERSION: 2026.10.01 -->
 * Features:
 * - Multi-Video Pill Switcher (Lecture, Lab, Extra) for days with multiple lessons
 * - Local RFC 7233 Byte-Range Desktop Daemon streaming
 * - Native Phone Storage Player (plays it-security-track MP4s directly from Android/iOS)
 * - 1-Tap YouTube App launch fallback (bypasses broken mobile iframe embeds)
 * - Picture-in-Picture & W3C Media Session API integration
 */

import { setupPiPAndHotkeys } from './pip.js';

const CCNA_PLAYLIST_ID = 'PLxbwE86jKRgMpuZuLBivmt48dPUfSm444';

// In-memory phone storage cache for files picked from mobile internal storage
window._phoneLocalVideos = window._phoneLocalVideos || new Map();

export async function probeLocalMediaServer() {
  const customHost = localStorage.getItem('custom-media-server') || 'http://127.0.0.1:8080';
  try {
    const res = await fetch(`${customHost}/health`, {
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

  // 1. Render Multi-Video Selector Pills
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

  // Check if this video is cached from phone's local storage
  const phoneLocalFile = activeVideo && window._phoneLocalVideos.get(activeVideo);

  if (isLocalAvailable && activeVideo) {
    // Mode A: Desktop RFC 7233 Local Media Daemon Streaming
    const customHost = localStorage.getItem('custom-media-server') || 'http://127.0.0.1:8080';
    const videoUrl = `${customHost}/media/01_Jeremy_CCNA_200-301/${encodeURIComponent(activeVideo)}`;
    mountHtml5Player(container, videoUrl, dayData, activeVideo, 'local_desktop');
    updateToolbar(true, activeVideo, 'Local Vault (1080p)');
  } else if (phoneLocalFile) {
    // Mode B: Native Phone Storage Playback (it-security-track on mobile internal storage)
    const blobUrl = URL.createObjectURL(phoneLocalFile);
    mountHtml5Player(container, blobUrl, dayData, activeVideo, 'phone_storage');
    updateToolbar(true, activeVideo, 'Phone Storage (1080p)');
  } else {
    // Mode C: Mobile Offline Hub with Direct YouTube App & Phone File Picker
    mountMobileVideoHub(container, dayData, activeVideo, safeIndex);
    updateToolbar(false, 'Mobile Hub (Choose Source)');
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

function mountHtml5Player(container, sourceUrl, dayData, videoFilename, sourceMode) {
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

function mountMobileVideoHub(container, dayData, activeVideo, activeIndex) {
  const cleanTitle = activeVideo ? formatVideoTitle(activeVideo, activeIndex) : dayData.topic;
  const directYtSearch = `https://www.youtube.com/results?search_query=Jeremy%27s+IT+Lab+CCNA+Day+${dayData.day}+${encodeURIComponent(dayData.topic)}`;
  const playlistUrl = `https://www.youtube.com/playlist?list=${CCNA_PLAYLIST_ID}`;

  container.innerHTML = `
    <div class="video-offline-hub">
      <div class="hub-icon">📱</div>
      <h3 class="hub-title">Day ${dayData.day}: ${cleanTitle}</h3>
      <p class="hub-desc">
        Watching on mobile without a desktop media server. Choose how you want to watch this lesson:
      </p>

      <div class="video-hub-actions">
        <!-- Option 1: Pick local MP4 from Phone's it-security-track folder -->
        <label class="action-btn primary" style="cursor:pointer;">
          📁 Play from Phone ("it-security-track")
          <input type="file" id="phoneVideoPicker" accept="video/*" multiple style="display:none;" />
        </label>

        <!-- Option 2: 1-Tap Launch in YouTube App -->
        <a href="${directYtSearch}" target="_blank" rel="noopener" class="action-btn" style="text-decoration:none;">
          ▶️ Open in YouTube App
        </a>

        <!-- Option 3: Full YouTube Playlist -->
        <a href="${playlistUrl}" target="_blank" rel="noopener" class="action-btn" style="text-decoration:none;">
          📑 CCNA Playlist
        </a>
      </div>

      <div class="video-hub-hint">
        ⚡ <strong>Offline Pro-Tip:</strong> Select the video from your phone's <code>it-security-track</code> folder. It plays natively in full 1080p offline with zero buffering and zero data!
      </div>
    </div>
  `;

  // Bind Phone Video Picker
  const picker = container.querySelector('#phoneVideoPicker');
  if (picker) {
    picker.onchange = e => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      files.forEach(f => {
        window._phoneLocalVideos.set(f.name, f);
      });

      alert(`Loaded ${files.length} video(s) from phone storage! Starting playback...`);
      mountVideoPlayer(container, dayData, activeIndex);
    };
  }
}

function updateToolbar(isLocal, label, badgeDesc) {
  const badge = document.getElementById('mediaSourceBadge');
  if (badge) {
    if (isLocal) {
      badge.style.color = 'var(--accent-emerald)';
      badge.innerHTML = `🟢 <strong>${badgeDesc || 'Local Vault'}</strong> (${label.slice(0, 30)}...)`;
    } else {
      badge.style.color = 'var(--accent-amber)';
      badge.innerHTML = `📱 <strong>${label}</strong>`;
    }
  }
}
