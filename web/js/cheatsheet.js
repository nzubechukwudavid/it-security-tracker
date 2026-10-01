/**
 * Cisco IOS Command Cheatsheet & 1-Click Clipboard Engine
 * <!-- DOE-VERSION: 2026.10.01 -->
 */

export function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `📋 ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    showToast(`Copied: <code>${text}</code>`);
  } catch (err) {
    console.error('Failed to copy text:', err);
    showToast(`Could not copy automatically. Select and press Ctrl+C.`);
  }
}

export function mountCheatsheet(container, commands) {
  if (!commands || !commands.length) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px 20px; color:var(--ink-muted);">
        <div style="font-size:28px; margin-bottom:8px;">💡</div>
        <h4 style="color:var(--ink-primary); font-size:15px;">Conceptual Theory Day</h4>
        <p style="font-size:13px; margin-top:4px;">No new CLI configuration commands required today. Focus on theory and flashcards!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="command-table">
      <thead>
        <tr>
          <th>Command</th>
          <th>Mode</th>
          <th>Description</th>
          <th style="text-align:right;">Copy</th>
        </tr>
      </thead>
      <tbody>
        ${commands.map((c, i) => `
          <tr>
            <td><code class="command-code">${c.cmd}</code></td>
            <td style="color:var(--ink-muted); font-size:12px;">${c.mode || 'Config'}</td>
            <td>${c.desc}</td>
            <td style="text-align:right;">
              <button class="copy-cmd-btn" data-idx="${i}">Copy</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  container.querySelectorAll('.copy-cmd-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx, 10);
      const targetCmd = commands[idx].cmd;
      copyToClipboard(targetCmd);
    });
  });
}
