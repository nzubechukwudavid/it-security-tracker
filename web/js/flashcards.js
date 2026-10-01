/**
 * In-App Active Recall Flashcard Engine with SuperMemo SM-2 Algorithm
 * <!-- DOE-VERSION: 2026.10.01 -->
 */

import { store } from './state.js';

export function calculateSM2(cardState, grade) {
  // cardState: { interval: 1, repetition: 0, ef: 2.5 }
  // grade: 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)
  let { interval = 1, repetition = 0, ef = 2.5 } = cardState || {};

  // Grade mapping to standard SM-2 0-5 scale
  // 1 -> 1 (Blackout), 2 -> 3 (Pass with effort), 3 -> 4 (Good), 4 -> 5 (Easy)
  const qMap = { 1: 1, 2: 3, 3: 4, 4: 5 };
  const q = qMap[grade] || 3;

  if (q >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ef);
    }
    repetition++;
  } else {
    repetition = 0;
    interval = 1;
  }

  // Update Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < 1.3) ef = 1.3;

  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + interval);

  return {
    interval,
    repetition,
    ef: Math.round(ef * 100) / 100,
    dueDate: nextDue.toISOString().slice(0, 10)
  };
}

export async function loadDayCards(dayNumber) {
  const pad = String(dayNumber).padStart(2, '0');
  
  // Try 1: Local Media Daemon (RFC range / media vault)
  try {
    const res = await fetch(`http://127.0.0.1:8080/media/01_Jeremy_CCNA_200-301/flashcards/json/day_${pad}_flashcards.json`, {
      signal: AbortSignal.timeout(600)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Media daemon not running or unreachable
  }

  // Try 2: Relative bundled data path
  try {
    const res = await fetch(`data/flashcards/day_${pad}_flashcards.json`, {
      signal: AbortSignal.timeout(1000)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Relative data not found
  }

  // Fallback seed card
  return [
    {
      id: `day_${pad}_fallback_01`,
      front: `What is the core focus of Day ${dayNumber}?`,
      back: `Review the day's lecture video and complete the Packet Tracer lab.`
    }
  ];
}

export function mountFlashcardDeck(container, dayNumber) {
  let cards = [];
  let currentIndex = 0;
  let isFlipped = false;
  let isLoading = true;

  container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--ink-muted);">Loading Flashcards...</div>`;

  loadDayCards(dayNumber).then(loaded => {
    cards = loaded;
    isLoading = false;
    render();
  });

  function render() {
    if (isLoading) return;

    if (!cards.length) {
      container.innerHTML = `
        <div style="text-align:center; padding:40px 20px; color:var(--ink-muted);">
          <div style="font-size:32px; margin-bottom:10px;">🎉</div>
          <h4 style="color:var(--ink-primary); font-size:16px;">No flashcards found for Day ${dayNumber}</h4>
          <p style="font-size:13px; margin-top:4px;">Focus on the video lecture and Packet Tracer lab!</p>
        </div>
      `;
      return;
    }

    const card = cards[currentIndex];
    const cardId = card.id || `day_${dayNumber}_card_${currentIndex}`;
    const srsData = (store.get().flashcards || {})[cardId] || { interval: 1, repetition: 0, ef: 2.5 };

    container.innerHTML = `
      <div class="flashcard-stage">
        <div style="display:flex; justify-content:space-between; width:100%; font-size:12px; color:var(--ink-muted);">
          <span>Card <strong>${currentIndex + 1}</strong> of ${cards.length}</span>
          <span>SRS Interval: <strong>${srsData.interval}d</strong> (EF: ${srsData.ef})</span>
        </div>

        <div class="card-flip-container ${isFlipped ? 'flipped' : ''}" id="cardFlipper">
          <div class="card-face front">
            <span style="font-size:11px; text-transform:uppercase; color:var(--signal-cyan); font-weight:700;">Question</span>
            <div class="card-text">${card.front}</div>
            <div class="card-footer-hint">Click or press [Space / Enter] to flip</div>
          </div>
          <div class="card-face back">
            <span style="font-size:11px; text-transform:uppercase; color:var(--accent-emerald); font-weight:700;">Answer</span>
            <div class="card-text">${card.back}</div>
            <div class="card-footer-hint">Select a review rating below (keys 1 - 4)</div>
          </div>
        </div>

        <div class="srs-buttons" style="opacity: ${isFlipped ? '1' : '0.4'}; pointer-events: ${isFlipped ? 'auto' : 'none'};">
          <button class="srs-btn" data-grade="1">
            <div>1. Again</div>
            <div style="font-size:10px; color:var(--ink-muted);">1 day</div>
          </button>
          <button class="srs-btn" data-grade="2">
            <div>2. Hard</div>
            <div style="font-size:10px; color:var(--ink-muted);">+2 days</div>
          </button>
          <button class="srs-btn" data-grade="3">
            <div>3. Good</div>
            <div style="font-size:10px; color:var(--ink-muted);">${Math.round(srsData.interval * srsData.ef)}d</div>
          </button>
          <button class="srs-btn" data-grade="4">
            <div>4. Easy</div>
            <div style="font-size:10px; color:var(--ink-muted);">${Math.round(srsData.interval * srsData.ef * 1.3)}d</div>
          </button>
        </div>
      </div>
    `;

    // Flip handler
    container.querySelector('#cardFlipper').addEventListener('click', () => {
      isFlipped = !isFlipped;
      render();
    });

    // SRS buttons
    container.querySelectorAll('.srs-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const grade = parseInt(btn.dataset.grade, 10);
        gradeCard(grade);
      });
    });
  }

  function gradeCard(grade) {
    const card = cards[currentIndex];
    const cardId = card.id || `day_${dayNumber}_card_${currentIndex}`;
    const currState = (store.get().flashcards || {})[cardId];
    const updated = calculateSM2(currState, grade);

    store.commit(s => {
      s.flashcards = s.flashcards || {};
      s.flashcards[cardId] = updated;
      return s;
    }, false);

    isFlipped = false;
    currentIndex = (currentIndex + 1) % cards.length;
    render();
  }

  // Keyboard navigation
  const keyHandler = e => {
    // Only listen if flashcard container is visible in active tab
    if (!container.closest('.tab-content') || container.closest('.tab-content').style.display === 'none') {
      return;
    }
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.code === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      isFlipped = !isFlipped;
      render();
    } else if (isFlipped && ['1', '2', '3', '4'].includes(e.key)) {
      e.preventDefault();
      gradeCard(parseInt(e.key, 10));
    }
  };

  window.addEventListener('keydown', keyHandler);
}
