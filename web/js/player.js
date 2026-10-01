/**
 * Dual-Engine Video Player & Streaming Failover (Local MP4 vs YouTube IFrame)
 * <!-- DOE-VERSION: 2026.10.01 -->
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

export async function mountVideoPlayer(container, dayData) {
  const isLocalAvailable = await probeLocalMediaServer();
  const vids = dayData.videos || [];
  const primaryVideo = vids[0] || null;

  const existingVideo = container.querySelector('video');
  if (existingVideo) {
    try {
      existingVideo.pause();
      existingVideo.removeAttribute('src');
      existingVideo.load();
    } catch (e) {}
  }
  container.innerHTML = '';

  if (isLocalAvailable && primaryVideo) {
    // 1. Mount Native HTML5 Video Player streaming from Local Media Daemon (RFC 7233 Range)
    const videoUrl = `http://127.0.0.1:8080/media/01_Jeremy_CCNA_200-301/${encodeURIComponent(primaryVideo)}`;
    const savedTimeKey = `ccna_playback_day_${dayData.day}`;
    const savedTime = parseFloat(localStorage.getItem(savedTimeKey) || '0');

    const videoEl = document.createElement('video');
    videoEl.className = 'video-element';
    videoEl.controls = true;
    videoEl.src = videoUrl;
    videoEl.preload = 'metadata';

    videoEl.addEventListener('loadedmetadata', () => {
      if (savedTime > 5 && savedTime < videoEl.duration - 10) {
        videoEl.currentTime = savedTime;
      }
    });

    // Throttled timestamp save
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

    // Attach PiP and global hotkeys
    setupPiPAndHotkeys(videoEl);

    // Notify toolbar
    updateToolbar(true, primaryVideo);
  } else {
    // 2. Mount Responsive Privacy-Enhanced YouTube Embed
    // Calculate playlist index (Day 1 starts near video 1)
    const playlistIndex = Math.max(1, (dayData.day - 1) * 2 + 1);
    const ytUrl = `https://www.youtube-nocookie.com/embed?listType=playlist&list=${CCNA_PLAYLIST_ID}&index=${playlistIndex}&enablejsapi=1&autoplay=0`;

    const iframe = document.createElement('iframe');
    iframe.className = 'youtube-frame';
    iframe.src = ytUrl;
    iframe.title = `Day ${dayData.day}: ${dayData.topic}`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.frameBorder = '0';

    container.appendChild(iframe);
    updateToolbar(false, 'YouTube (Cloud Fallback)');
  }
}

function updateToolbar(isLocal, label) {
  const badge = document.getElementById('mediaSourceBadge');
  if (badge) {
    if (isLocal) {
      badge.style.color = 'var(--accent-emerald)';
      badge.innerHTML = `🟢 <strong>Local Vault</strong> (${label.slice(0, 32)}...)`;
    } else {
      badge.style.color = 'var(--accent-amber)';
      badge.innerHTML = `🌐 <strong>YouTube Fallback</strong> (Local server offline)`;
    }
  }
}
