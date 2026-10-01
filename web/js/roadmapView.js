/**
 * Modernized 16-Week Career Roadmap View Component
 * <!-- DOE-VERSION: 2026.10.01 -->
 */

import { store } from './state.js';
import { PLAN } from './roadmapData.js';

const keyOf = (pId, bId, tId) => `${pId}.${bId}.${tId}`;

export function mountRoadmapView(container, onJumpToCockpitDay) {
  function render() {
    const rootState = store.get();
    const done = rootState.done || {};

    // Calculate total and completed tasks
    let totalTasks = 0;
    let completedTasks = 0;
    PLAN.forEach(p => {
      (p.blocks || []).forEach(b => {
        (b.tasks || []).forEach(t => {
          totalTasks++;
          const k = keyOf(p.id, b.id, t.id);
          if (done[k]) completedTasks++;
        });
      });
    });

    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    container.innerHTML = `
      <div class="roadmap-view-container">
        
        <!-- Roadmap Top Bar & Search -->
        <div class="roadmap-topbar">
          <div class="roadmap-summary">
            <h2 style="font-size:22px; font-weight:700;">16-Week Working Track</h2>
            <p style="color:var(--ink-muted); font-size:13px; margin-top:2px;">
              From CS Degree to Enterprise IT Support, Network Engineering & Security Operations
            </p>
          </div>

          <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
            <div class="search-input-wrap">
              <input type="text" id="roadmapSearchInput" class="roadmap-search-input" placeholder="🔍 Search tasks, commands, tools..." />
            </div>
            <div class="roadmap-progress-badge">
              <strong>${completedTasks}</strong> / ${totalTasks} Tasks (${percent}%)
            </div>
          </div>
        </div>

        <!-- Progress Meter Strip -->
        <div class="roadmap-meter-strip">
          ${PLAN.map(p => {
            let pTotal = 0;
            let pDone = 0;
            (p.blocks || []).forEach(b => {
              (b.tasks || []).forEach(t => {
                pTotal++;
                const k = keyOf(p.id, b.id, t.id);
                if (done[k]) pDone++;
              });
            });
            const pPct = pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0;
            return `
              <div class="meter-segment ${pPct === 100 ? 'complete' : ''}" style="flex:${pTotal || 1};" title="${p.label}: ${p.title} (${pDone}/${pTotal})">
                <div class="meter-segment-fill" style="width:${pPct}%;"></div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Phases List -->
        <div class="phases-container" id="phasesContainer">
          ${PLAN.map((phase, pIdx) => renderPhase(phase, pIdx, done)).join('')}
        </div>
      </div>
    `;

    // Bind Search Input
    const searchInput = container.querySelector('#roadmapSearchInput');
    searchInput.addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      container.querySelectorAll('.task-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
      });
      container.querySelectorAll('.roadmap-block').forEach(block => {
        const visibleTasks = block.querySelectorAll('.task-item:not([style*="display: none"])');
        block.style.display = (!q || visibleTasks.length > 0) ? 'block' : 'none';
      });
      container.querySelectorAll('.roadmap-phase-card').forEach(ph => {
        const visibleBlocks = ph.querySelectorAll('.roadmap-block:not([style*="display: none"])');
        ph.style.display = (!q || visibleBlocks.length > 0) ? 'block' : 'none';
      });
    });

    // Bind Checkboxes
    container.querySelectorAll('.task-checkbox').forEach(cb => {
      cb.addEventListener('change', e => {
        const taskId = e.target.dataset.taskId;
        store.toggleRoadmapTask(taskId);
      });
    });

    // Bind Jump to Cockpit buttons
    container.querySelectorAll('.jump-cockpit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const day = parseInt(btn.dataset.day, 10);
        if (onJumpToCockpitDay) onJumpToCockpitDay(day);
      });
    });
  }

  function renderPhase(phase, pIdx, done) {
    return `
      <section class="roadmap-phase-card" id="${phase.id}">
        <div class="phase-header">
          <div>
            <div class="phase-tag">${phase.label} • Window: ${phase.window}</div>
            <h3 class="phase-title">${phase.title}</h3>
            <p class="phase-aim">${phase.aim}</p>
          </div>
        </div>

        <div class="phase-blocks">
          ${(phase.blocks || []).map(b => renderBlock(phase, b, done)).join('')}
        </div>
      </section>
    `;
  }

  function renderBlock(phase, block, done) {
    const bTasks = block.tasks || [];
    const bDoneCount = bTasks.filter(t => done[keyOf(phase.id, block.id, t.id)]).length;
    const isBlockDone = bTasks.length > 0 && bDoneCount === bTasks.length;

    // CCNA Day match check for jumping into Cockpit
    const titleStr = block.title || '';
    const labelStr = block.label || '';
    const ccnaMatch = titleStr.match(/Day\s*(\d+)/i) || labelStr.match(/Week\s*(\d+)/i);
    const dayJump = ccnaMatch ? parseInt(ccnaMatch[1], 10) * 7 - 6 : null;

    return `
      <div class="roadmap-block ${isBlockDone ? 'block-complete' : ''}" id="${block.id}">
        <div class="block-header">
          <div>
            <h4 class="block-title">
              ${block.label ? `<span style="color:var(--signal-cyan);">${block.label}:</span> ` : ''}${titleStr}
            </h4>
            <span style="font-size:12px; color:var(--ink-muted);">Tasks: ${bDoneCount}/${bTasks.length}</span>
          </div>

          ${dayJump ? `
            <button class="jump-cockpit-btn action-btn" data-day="${Math.min(63, Math.max(1, dayJump))}" title="Launch Study Cockpit for this topic">
              🚀 Open in Cockpit
            </button>
          ` : ''}
        </div>

        <div class="block-tasks">
          ${bTasks.map(t => {
            const k = keyOf(phase.id, block.id, t.id);
            const isDone = Boolean(done[k]);
            return `
            <label class="task-item ${isDone ? 'done' : ''}">
              <input type="checkbox" class="task-checkbox" data-task-id="${k}" ${isDone ? 'checked' : ''} />
              <span class="task-custom-checkbox"></span>
              <div class="task-content">
                <div class="task-text">${t.text}</div>
                ${t.resource ? `<a href="${t.resource}" target="_blank" rel="noopener" class="task-resource-link" onclick="event.stopPropagation()">🔗 Reference / Lab</a>` : ''}
              </div>
            </label>
          `;
          }).join('')}
        </div>
      </div>
    `;
  }

  render();
  let prevDoneJson = JSON.stringify(store.get().done || {});
  return store.subscribe(s => {
    const currentDoneJson = JSON.stringify(s.done || {});
    if (currentDoneJson !== prevDoneJson) {
      prevDoneJson = currentDoneJson;
      render();
    }
  });
}
