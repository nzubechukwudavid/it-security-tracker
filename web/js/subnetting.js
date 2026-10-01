/**
 * Subnetting Gym - Pure 32-Bit Bitwise Arithmetic Engine (RFC 791 / RFC 4632)
 * <!-- DOE-VERSION: 2026.10.01 -->
 */

import { store } from './state.js';

export const ipToInt = ip => {
  return ip.split('.').reduce((acc, oct) => ((acc << 8) + parseInt(oct, 10)) >>> 0, 0);
};

export const intToIp = int => {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
};

export const prefixToMask = p => {
  if (p === 0) return 0;
  return (~0 << (32 - p)) >>> 0;
};

export function calculateSubnet(ipStr, prefix) {
  const ipInt = ipToInt(ipStr);
  const maskInt = prefixToMask(prefix);
  const wildcardInt = (~maskInt) >>> 0;

  const netInt = (ipInt & maskInt) >>> 0;
  const bcastInt = (netInt | wildcardInt) >>> 0;

  let firstUsableInt, lastUsableInt, usableHosts;

  if (prefix === 31) {
    firstUsableInt = netInt;
    lastUsableInt = bcastInt;
    usableHosts = 2; // RFC 3021
  } else if (prefix === 32) {
    firstUsableInt = netInt;
    lastUsableInt = netInt;
    usableHosts = 1;
  } else {
    firstUsableInt = (netInt + 1) >>> 0;
    lastUsableInt = (bcastInt - 1) >>> 0;
    usableHosts = Math.max(0, Math.pow(2, 32 - prefix) - 2);
  }

  // Derive "Magic Number" calculation for explanation
  const octetIndex = Math.floor((prefix - 1) / 8); // 0, 1, 2, 3
  const maskOctets = intToIp(maskInt).split('.').map(Number);
  const interestingMask = maskOctets[octetIndex];
  const magicNumber = 256 - interestingMask;
  const ipOctets = ipStr.split('.').map(Number);
  const interestingIp = ipOctets[octetIndex];
  const netOctet = Math.floor(interestingIp / magicNumber) * magicNumber;

  return {
    ip: ipStr,
    prefix,
    mask: intToIp(maskInt),
    wildcard: intToIp(wildcardInt),
    network: intToIp(netInt),
    broadcast: intToIp(bcastInt),
    firstUsable: intToIp(firstUsableInt),
    lastUsable: intToIp(lastUsableInt),
    usableHosts,
    magicNumber,
    octetIndex: octetIndex + 1,
    netOctet
  };
}

export function generateRandomProblem(tier = 1) {
  let prefix;
  let o1, o2, o3, o4;

  if (tier === 1) {
    // Class C (/24 - /30)
    prefix = Math.floor(Math.random() * 7) + 24;
    o1 = 192;
    o2 = 168;
    o3 = Math.floor(Math.random() * 254) + 1;
    o4 = Math.floor(Math.random() * 254) + 1;
  } else if (tier === 2) {
    // Class B (/16 - /23)
    prefix = Math.floor(Math.random() * 8) + 16;
    o1 = 172;
    o2 = Math.floor(Math.random() * 16) + 16;
    o3 = Math.floor(Math.random() * 254) + 1;
    o4 = Math.floor(Math.random() * 254) + 1;
  } else if (tier === 3) {
    // Class A (/8 - /15)
    prefix = Math.floor(Math.random() * 8) + 8;
    o1 = 10;
    o2 = Math.floor(Math.random() * 254) + 1;
    o3 = Math.floor(Math.random() * 254) + 1;
    o4 = Math.floor(Math.random() * 254) + 1;
  } else {
    // Mixed / Exam Mode (/12 - /30)
    prefix = Math.floor(Math.random() * 19) + 12;
    o1 = [10, 172, 192][Math.floor(Math.random() * 3)];
    o2 = Math.floor(Math.random() * 254) + 1;
    o3 = Math.floor(Math.random() * 254) + 1;
    o4 = Math.floor(Math.random() * 254) + 1;
  }

  const ipStr = `${o1}.${o2}.${o3}.${o4}`;
  return calculateSubnet(ipStr, prefix);
}

export function mountSubnettingGym(container) {
  let currentProblem = generateRandomProblem(1);
  let currentTier = 1;

  function render() {
    const state = store.get();
    const gym = state.gym || { streak: 0, totalAnswered: 0, totalCorrect: 0 };
    const accuracy = gym.totalAnswered > 0 ? Math.round((gym.totalCorrect / gym.totalAnswered) * 100) : 100;

    container.innerHTML = `
      <div class="gym-card">
        <div class="gym-header">
          <div>
            <h3 style="font-size:16px; font-weight:700;">Subnetting Gym</h3>
            <span style="font-size:12px; color:var(--ink-muted);">Daily IP Math & CIDR Drill</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <select id="gymTierSelect" style="background:var(--bg-surface-elevated); color:var(--ink-primary); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:4px 8px; font-size:12px;">
              <option value="1" ${currentTier === 1 ? 'selected' : ''}>Tier 1: Class C (/24-/30)</option>
              <option value="2" ${currentTier === 2 ? 'selected' : ''}>Tier 2: Class B (/16-/23)</option>
              <option value="3" ${currentTier === 3 ? 'selected' : ''}>Tier 3: Class A (/8-/15)</option>
              <option value="4" ${currentTier === 4 ? 'selected' : ''}>Tier 4: Exam VLSM (/12-/30)</option>
            </select>
            <div class="gym-streak-badge">
              <span>🔥</span> <strong>${gym.streak}</strong> streak (${accuracy}%)
            </div>
          </div>
        </div>

        <div class="gym-prompt">
          <div class="gym-ip-display">${currentProblem.ip} /${currentProblem.prefix}</div>
          <div class="gym-question">Derive the Network ID, Broadcast, Usable Range, and Subnet Mask:</div>
        </div>

        <div class="gym-inputs">
          <div class="gym-field">
            <label for="inputNetwork">Network ID</label>
            <input type="text" id="inputNetwork" class="gym-input" placeholder="e.g. 192.168.1.0" autocomplete="off" />
          </div>
          <div class="gym-field">
            <label for="inputBroadcast">Broadcast Address</label>
            <input type="text" id="inputBroadcast" class="gym-input" placeholder="e.g. 192.168.1.255" autocomplete="off" />
          </div>
          <div class="gym-field">
            <label for="inputFirst">First Usable Host</label>
            <input type="text" id="inputFirst" class="gym-input" placeholder="e.g. 192.168.1.1" autocomplete="off" />
          </div>
          <div class="gym-field">
            <label for="inputLast">Last Usable Host</label>
            <input type="text" id="inputLast" class="gym-input" placeholder="e.g. 192.168.1.254" autocomplete="off" />
          </div>
        </div>

        <div id="gymFeedback" style="display:none; padding:12px; border-radius:var(--radius-md); font-size:13px; line-height:1.5;"></div>

        <div class="gym-actions">
          <button id="gymCheckBtn" class="action-btn primary" style="flex:1;">Submit Answer</button>
          <button id="gymNextBtn" class="action-btn" style="flex:1; display:none;">Next Question →</button>
          <button id="gymSkipBtn" class="action-btn" style="padding:7px 12px;">Skip</button>
        </div>
      </div>
    `;

    // Tier change
    container.querySelector('#gymTierSelect').addEventListener('change', e => {
      currentTier = parseInt(e.target.value, 10);
      currentProblem = generateRandomProblem(currentTier);
      render();
    });

    // Check button
    container.querySelector('#gymCheckBtn').addEventListener('click', () => {
      const netVal = container.querySelector('#inputNetwork').value.trim();
      const bcastVal = container.querySelector('#inputBroadcast').value.trim();
      const firstVal = container.querySelector('#inputFirst').value.trim();
      const lastVal = container.querySelector('#inputLast').value.trim();

      const isNetOk = netVal === currentProblem.network;
      const isBcastOk = bcastVal === currentProblem.broadcast;
      const isFirstOk = firstVal === currentProblem.firstUsable;
      const isLastOk = lastVal === currentProblem.lastUsable;

      const allCorrect = isNetOk && isBcastOk && isFirstOk && isLastOk;

      // Update state
      store.commit(s => {
        const g = s.gym || { streak: 0, totalAnswered: 0, totalCorrect: 0, history: [] };
        g.totalAnswered = (g.totalAnswered || 0) + 1;
        if (allCorrect) {
          g.streak = (g.streak || 0) + 1;
          g.totalCorrect = (g.totalCorrect || 0) + 1;
        } else {
          g.streak = 0;
        }
        s.gym = g;
        return s;
      });

      // Feedback
      const fb = container.querySelector('#gymFeedback');
      fb.style.display = 'block';
      if (allCorrect) {
        fb.style.background = 'hsla(152, 60%, 45%, 0.15)';
        fb.style.color = 'var(--accent-emerald)';
        fb.style.border = '1px solid hsla(152, 60%, 45%, 0.4)';
        fb.innerHTML = `<strong>✨ Perfect! All answers correct.</strong><br>
        Mask: <code>${currentProblem.mask}</code> | Magic Number: <code>${currentProblem.magicNumber}</code> in octet ${currentProblem.octetIndex}.`;
      } else {
        fb.style.background = 'hsla(350, 80%, 55%, 0.15)';
        fb.style.color = 'var(--accent-crimson)';
        fb.style.border = '1px solid hsla(350, 80%, 55%, 0.4)';
        fb.innerHTML = `<strong>❌ Not quite. Review the breakdown:</strong><br>
        • Network: <code>${currentProblem.network}</code> ${isNetOk ? '✓' : '✗'}<br>
        • First Usable: <code>${currentProblem.firstUsable}</code> ${isFirstOk ? '✓' : '✗'}<br>
        • Last Usable: <code>${currentProblem.lastUsable}</code> ${isLastOk ? '✓' : '✗'}<br>
        • Broadcast: <code>${currentProblem.broadcast}</code> ${isBcastOk ? '✓' : '✗'}<br>
        <span style="color:var(--ink-secondary); font-size:12px;">💡 <em>Magic Number Method:</em> 256 - ${256 - currentProblem.magicNumber} = <strong>${currentProblem.magicNumber}</strong> in octet ${currentProblem.octetIndex}. Network falls on multiple <strong>${currentProblem.netOctet}</strong>.</span>`;
      }

      container.querySelector('#gymCheckBtn').style.display = 'none';
      container.querySelector('#gymNextBtn').style.display = 'inline-flex';
    });

    // Next button
    container.querySelector('#gymNextBtn').addEventListener('click', () => {
      currentProblem = generateRandomProblem(currentTier);
      render();
    });

    // Skip button
    container.querySelector('#gymSkipBtn').addEventListener('click', () => {
      currentProblem = generateRandomProblem(currentTier);
      render();
    });
  }

  render();
}
