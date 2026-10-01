/**
 * Picture-in-Picture (PiP) Controller & Global Playback Hotkeys
 * <!-- DOE-VERSION: 2026.10.01 -->
 */

let activeVideo = null;

export async function togglePiP(videoEl) {
  const target = videoEl || activeVideo;
  if (!target) return;

  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled && target.readyState >= 1) {
      await target.requestPictureInPicture();
    }
  } catch (err) {
    console.warn('PiP request failed:', err);
  }
}

export function setupPiPAndHotkeys(videoElement) {
  activeVideo = videoElement;

  // Pip button in UI
  const pipBtn = document.getElementById('pipToggleBtn');
  if (pipBtn) {
    pipBtn.onclick = () => togglePiP(videoElement);
  }

  // Bind global keyboard shortcuts
  window.removeEventListener('keydown', handlePlaybackHotkeys);
  window.addEventListener('keydown', handlePlaybackHotkeys);
}

function handlePlaybackHotkeys(e) {
  if (!activeVideo) return;
  
  // Ignore keystrokes inside text inputs or textareas
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

  switch (e.code) {
    case 'Space':
    case 'KeyK':
      e.preventDefault();
      if (activeVideo.paused) {
        activeVideo.play();
      } else {
        activeVideo.pause();
      }
      break;

    case 'KeyP':
      e.preventDefault();
      togglePiP(activeVideo);
      break;

    case 'ArrowLeft':
    case 'KeyJ':
      e.preventDefault();
      activeVideo.currentTime = Math.max(0, activeVideo.currentTime - 10);
      break;

    case 'ArrowRight':
    case 'KeyL':
      e.preventDefault();
      activeVideo.currentTime = Math.min(activeVideo.duration, activeVideo.currentTime + 10);
      break;

    case 'KeyF':
      e.preventDefault();
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (activeVideo.requestFullscreen) {
        activeVideo.requestFullscreen();
      }
      break;

    case 'KeyM':
      e.preventDefault();
      activeVideo.muted = !activeVideo.muted;
      break;

    case 'Period': // '>' key
      if (e.shiftKey) {
        e.preventDefault();
        const rates = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
        const nextRate = rates.find(r => r > activeVideo.playbackRate) || 2.0;
        activeVideo.playbackRate = nextRate;
      }
      break;

    case 'Comma': // '<' key
      if (e.shiftKey) {
        e.preventDefault();
        const rates = [2.0, 1.75, 1.5, 1.25, 1.0, 0.75];
        const nextRate = rates.find(r => r < activeVideo.playbackRate) || 0.75;
        activeVideo.playbackRate = nextRate;
      }
      break;
  }
}
