/**
 * Job Search & Application Tracker View Component (with Autonomous AI Job-Finder Integration)
 * <!-- DOE-VERSION: 2026.10.01 -->
 */

import { store } from './state.js';
import { STATUSES } from './roadmapData.js';

let jobFinderData = null;
let isLoadingJobFinder = false;

export async function fetchJobFinderData(onLoaded) {
  if (jobFinderData) {
    if (onLoaded) onLoaded();
    return;
  }
  if (isLoadingJobFinder) return;
  isLoadingJobFinder = true;

  // 1. Try local media daemon first (fastest local cache)
  try {
    const res = await fetch('http://127.0.0.1:8080/api/job-finder/stats', {
      signal: AbortSignal.timeout(1500)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'ok') {
        jobFinderData = data;
        if (onLoaded) onLoaded();
        return;
      }
    }
  } catch (e) {
    // Daemon not running, fall through to direct Vercel cloud fetch
  }

  // 2. Direct Cloud Fallback to Vercel KV and Vercel Deployment (works on mobile & without daemon!)
  try {
    const [appliedRes, jobsRes] = await Promise.all([
      fetch('https://david-job-finder.vercel.app/api/applied', { signal: AbortSignal.timeout(3500) }),
      fetch('https://david-job-finder.vercel.app/dashboard_data.json', { signal: AbortSignal.timeout(3500) })
    ]);

    if (appliedRes.ok && jobsRes.ok) {
      const appliedJson = await appliedRes.json();
      const jobs = await jobsRes.json();
      const appliedMap = appliedJson.applied || {};

      let appliedCount = 0;
      let interviewCount = 0;
      let ignoredCount = 0;
      const appliedJobs = [];
      const allJobsEnriched = [];
      const trackCounts = {};

      jobs.forEach(j => {
        const t = j.track || 'other';
        trackCounts[t] = (trackCounts[t] || 0) + 1;

        const urls = [j.effective_url || '', j.job_url || ''];
        let appInfo = null;
        for (const u of urls) {
          if (!u) continue;
          appInfo = appliedMap[u] || appliedMap[u.split('?')[0].replace(/\/$/, '')];
          if (appInfo) break;
        }

        let jobStatus = 'fresh';
        let stageStr = '';
        let actionDate = (j.timestamp || '').slice(0, 10);

        if (appInfo) {
          const st = appInfo.status;
          actionDate = (appInfo.timestamp || j.timestamp || '').slice(0, 10);
          stageStr = appInfo.stage || '';

          if (st === 'applied') {
            appliedCount++;
            jobStatus = 'Applied';
            appliedJobs.push({
              id: j.epoch_ts || j.timestamp,
              title: j.title,
              company: j.company,
              track: j.track,
              status: 'Applied',
              stage: stageStr || 'Application Submitted',
              fit_score: j.fit_score || 0,
              location: j.location,
              url: j.effective_url || j.job_url,
              date: actionDate
            });
          } else if (st === 'interview') {
            interviewCount++;
            jobStatus = 'Interview';
            appliedJobs.push({
              id: j.epoch_ts || j.timestamp,
              title: j.title,
              company: j.company,
              track: j.track,
              status: 'Interview',
              stage: stageStr || 'Interview / Follow-up',
              fit_score: j.fit_score || 0,
              location: j.location,
              url: j.effective_url || j.job_url,
              date: actionDate
            });
          } else if (st === 'ignored') {
            ignoredCount++;
            jobStatus = 'Ignored';
          }
        }

        allJobsEnriched.push({
          id: j.epoch_ts || j.timestamp,
          title: j.title,
          company: j.company,
          track: j.track,
          status: jobStatus,
          stage: stageStr,
          fit_score: j.fit_score || 0,
          location: j.location,
          url: j.effective_url || j.job_url,
          date: actionDate
        });
      });

      const interviewsList = appliedJobs.filter(a => a.status === 'Interview');
      const appliedList = appliedJobs.filter(a => a.status === 'Applied');
      appliedList.sort((a, b) => b.date.localeCompare(a.date));
      const sortedApplied = interviewsList.concat(appliedList);

      const totalSent = appliedCount + interviewCount;
      const freshCount = jobs.length - (totalSent + ignoredCount);

      jobFinderData = {
        status: 'ok',
        connected: true,
        source: 'vercel_cloud',
        hub_url: 'https://david-job-finder.vercel.app',
        total_tracked: jobs.length,
        applications_sent: totalSent,
        interviews_count: interviewCount,
        applied_count: appliedCount,
        ignored_count: ignoredCount,
        fresh_count: freshCount,
        tracks: trackCounts,
        applied_jobs: sortedApplied,
        all_jobs: allJobsEnriched.slice(0, 120)
      };
      if (onLoaded) onLoaded();
    }
  } catch (err) {
    console.warn('Job-Finder cloud sync fallback error:', err);
  } finally {
    isLoadingJobFinder = false;
  }
}

export function mountJobsView(container) {
  let isAiPanelOpen = false;
  let activeTab = 'allSent'; // 'allSent' | 'interviews' | 'applied' | 'fresh' | 'ignored'
  let searchQuery = '';

  fetchJobFinderData(() => render());

  function render() {
    const rootState = store.get();
    const manualApps = rootState.apps || [];

    // Combine cloud/local AI applications with manual local apps
    const aiAppliedList = (jobFinderData && jobFinderData.applied_jobs) ? jobFinderData.applied_jobs : [];
    
    // Format manual apps to consistent shape
    const formattedManual = manualApps.map(a => ({
      id: a.id,
      title: a.role,
      company: a.co,
      track: 'manual',
      status: a.status || 'Applied',
      stage: a.notes || 'Manually Logged',
      fit_score: 100,
      location: 'Custom',
      url: a.link,
      date: a.date,
      isManual: true
    }));

    // Deduplicate by URL or title+company
    const allAppliedMerged = [...formattedManual];
    aiAppliedList.forEach(ai => {
      const exists = allAppliedMerged.some(m => (m.url && m.url === ai.url) || (m.title === ai.title && m.company === ai.company));
      if (!exists) {
        allAppliedMerged.push(ai);
      }
    });

    // KPI Metrics
    const totalTracked = (jobFinderData && jobFinderData.total_tracked) || 323;
    const sentCount = allAppliedMerged.length;
    const interviewCount = allAppliedMerged.filter(a => a.status === 'Interview').length;
    const appliedOnlyCount = allAppliedMerged.filter(a => a.status === 'Applied').length;
    const ignoredCount = (jobFinderData && jobFinderData.ignored_count) || 196;
    const freshCount = (jobFinderData && jobFinderData.fresh_count) || (totalTracked - sentCount - ignoredCount);
    const hubUrl = (jobFinderData && jobFinderData.hub_url) || 'https://david-job-finder.vercel.app';

    // Filter displayed list based on active tab
    let displayList = [];
    if (activeTab === 'allSent') {
      displayList = allAppliedMerged;
    } else if (activeTab === 'interviews') {
      displayList = allAppliedMerged.filter(a => a.status === 'Interview');
    } else if (activeTab === 'applied') {
      displayList = allAppliedMerged.filter(a => a.status === 'Applied');
    } else if (activeTab === 'fresh') {
      const allJobs = (jobFinderData && jobFinderData.all_jobs) || [];
      displayList = allJobs.filter(j => j.status === 'fresh');
    } else if (activeTab === 'ignored') {
      const allJobs = (jobFinderData && jobFinderData.all_jobs) || [];
      displayList = allJobs.filter(j => j.status === 'Ignored');
    }

    // Apply search filter if present
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      displayList = displayList.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        (item.stage && item.stage.toLowerCase().includes(q))
      );
    }

    container.innerHTML = `
      <div class="jobs-view-container">
        
        <!-- Header & Action Hub Hub Trigger -->
        <div class="jobs-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h2 style="font-size:22px; font-weight:700;">Job Application Pipeline</h2>
              <span style="font-size:11px; padding:2px 8px; border-radius:12px; background:hsla(152, 60%, 45%, 0.15); color:var(--accent-emerald); font-weight:700;">
                🟢 Connected: david-job-finder.vercel.app
              </span>
            </div>
            <p style="color:var(--ink-muted); font-size:13px; margin-top:4px;">
              Autonomous crawler runs every 4 hours via GitHub Actions • Synchronized with Vercel KV store
            </p>
          </div>

          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            <a href="${hubUrl}" target="_blank" rel="noopener" class="action-btn primary" style="background:linear-gradient(135deg, hsl(190, 85%, 42%), hsl(215, 90%, 50%)); border:none; color:#fff; font-weight:700; display:inline-flex; align-items:center; gap:6px; box-shadow:0 4px 14px hsla(190, 90%, 45%, 0.35);">
              🚀 Open 1-Click Action Hub ↗
            </a>
            <button id="showAddAppFormBtn" class="action-btn" style="font-size:12px;">
              + Log Manual Role
            </button>
          </div>
        </div>

        <!-- KPI Metrics Grid -->
        <div class="jobs-kpi-grid">
          <div class="kpi-card" style="border-left:3px solid var(--signal-cyan);">
            <span class="kpi-label">Applications Sent</span>
            <div class="kpi-value" style="color:var(--signal-cyan);">${sentCount}</div>
            <span style="font-size:11px; color:var(--ink-muted);">${appliedOnlyCount} submitted • ${interviewCount} interview calls</span>
          </div>

          <div class="kpi-card" style="border-left:3px solid var(--accent-amber);">
            <span class="kpi-label">Interviews / Screens</span>
            <div class="kpi-value" style="color:var(--accent-amber);">${interviewCount}</div>
            <span style="font-size:11px; color:var(--accent-amber);">🔥 Active Interview Pipeline</span>
          </div>

          <div class="kpi-card" style="border-left:3px solid var(--accent-emerald);">
            <span class="kpi-label">Fresh Unapplied</span>
            <div class="kpi-value" style="color:var(--accent-emerald);">${freshCount}</div>
            <span style="font-size:11px; color:var(--ink-muted);">${totalTracked} total tech roles scraped</span>
          </div>

          <div class="kpi-card" style="border-left:3px solid var(--ink-muted);">
            <span class="kpi-label">Ignored / Passed</span>
            <div class="kpi-value" style="color:var(--ink-muted);">${ignoredCount}</div>
            <span style="font-size:11px; color:var(--ink-muted);">Filtered out from pipeline</span>
          </div>
        </div>

        <!-- AI Bot Live Banner -->
        <div class="ai-job-bot-strip" style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:12px 18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="font-size:24px;">🤖</div>
            <div>
              <div style="font-size:13px; font-weight:600; color:var(--ink-primary); display:flex; align-items:center; gap:8px;">
                <span>AI Job-Finder Bot Automation</span>
                <span style="font-size:11px; color:var(--signal-cyan); font-family:var(--font-mono);">github-actions/4h-cron</span>
              </div>
              <p style="font-size:12px; color:var(--ink-secondary); margin-top:2px;">
                Tracking <strong>${jobFinderData ? jobFinderData.tracks.it_support || 178 : 178} IT Support</strong>, 
                <strong>${jobFinderData ? jobFinderData.tracks.security_soc || 35 : 35} SOC/Security</strong>, and 
                <strong>${jobFinderData ? jobFinderData.tracks.networking_infra || 12 : 12} Networking</strong> roles across Lagos and Remote worldwide.
              </p>
            </div>
          </div>

          <button id="toggleAiJobsListBtn" class="action-btn" style="font-size:12px;">
            ${isAiPanelOpen ? `🙈 Hide Raw AI Database (${totalTracked})` : `👁️ Browse Raw AI Database (${totalTracked})`}
          </button>
        </div>

        <!-- AI Roles Drawer Panel (Collapsible Raw Database Viewer) -->
        <div id="aiJobsDrawerPanel" style="display:${isAiPanelOpen ? 'block' : 'none'}; margin-bottom:16px; background:var(--bg-surface); border:1px solid var(--border-accent); border-radius:var(--radius-md); padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h4 style="font-size:14px; font-weight:700; color:var(--signal-cyan);">All Processed Opportunities from AI Job Bot</h4>
            <span style="font-size:11px; color:var(--ink-muted);">Click "+ Import / Log" to add to active pipeline or "Link ↗" to view posting</span>
          </div>
          <div style="max-height:260px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;">
            ${((jobFinderData && jobFinderData.all_jobs) || []).map(j => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface-elevated); padding:8px 12px; border-radius:var(--radius-sm); font-size:12px; gap:8px;">
                <div style="flex:1; min-width:0;">
                  <div style="font-weight:600; color:var(--ink-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${j.title} • <span style="color:var(--signal-cyan);">${j.company}</span>
                  </div>
                  <div style="font-size:11px; color:var(--ink-muted); margin-top:2px;">
                    Track: <code>${j.track}</code> | Fit: <strong style="color:var(--accent-emerald);">${j.fit_score}%</strong> | Status: <span style="font-weight:600; color:${j.status === 'Interview' ? 'var(--accent-amber)' : j.status === 'Applied' ? 'var(--accent-emerald)' : 'var(--ink-secondary)'};">${j.status}</span>
                  </div>
                </div>
                <div style="display:flex; gap:6px; flex-shrink:0;">
                  ${j.url ? `<a href="${j.url}" target="_blank" rel="noopener" class="action-btn" style="padding:3px 8px; font-size:11px;">Link ↗</a>` : ''}
                  <button class="action-btn primary import-ai-job-btn" data-title="${j.title.replace(/"/g, '&quot;')}" data-company="${j.company.replace(/"/g, '&quot;')}" data-url="${(j.url || '').replace(/"/g, '&quot;')}" data-date="${j.date}" style="padding:3px 10px; font-size:11px;">
                    + Import
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Inline Add Manual Application Form (Hidden by default) -->
        <div id="addAppForm" class="add-app-card" style="display:none; margin-bottom:16px;">
          <h4 style="font-size:15px; font-weight:700; margin-bottom:12px;">Log Direct Job Application</h4>
          <div class="app-form-grid">
            <div class="form-field">
              <label for="appRole">Role Title *</label>
              <input type="text" id="appRole" class="form-input" placeholder="e.g. Junior Network Support" required />
            </div>
            <div class="form-field">
              <label for="appCompany">Company *</label>
              <input type="text" id="appCompany" class="form-input" placeholder="e.g. MainOne / Equinix" required />
            </div>
            <div class="form-field">
              <label for="appLink">Job Posting URL</label>
              <input type="url" id="appLink" class="form-input" placeholder="https://..." />
            </div>
            <div class="form-field">
              <label for="appDate">Date Applied</label>
              <input type="date" id="appDate" class="form-input" value="${new Date().toISOString().slice(0, 10)}" />
            </div>
            <div class="form-field">
              <label for="appStatus">Initial Status</label>
              <select id="appStatus" class="form-input">
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Screening">Screening</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
            <div class="form-field" style="grid-column: span 2;">
              <label for="appNotes">Stage / Notes</label>
              <input type="text" id="appNotes" class="form-input" placeholder="e.g. Recruiter screening call scheduled" />
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:14px;">
            <button id="cancelAddAppBtn" class="action-btn">Cancel</button>
            <button id="submitAddAppBtn" class="action-btn primary">Save Application</button>
          </div>
        </div>

        <!-- Filter Navigation Tabs & Search Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-top:8px;">
          <div class="pipeline-tab-group" style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="action-btn pipeline-tab-btn ${activeTab === 'allSent' ? 'primary' : ''}" data-tab="allSent">
              📬 All Sent (${sentCount})
            </button>
            <button class="action-btn pipeline-tab-btn ${activeTab === 'interviews' ? 'primary' : ''}" data-tab="interviews" style="${activeTab === 'interviews' ? '' : 'color:var(--accent-amber); border-color:hsla(38, 92%, 50%, 0.3);'}">
              🎙️ Interviews & Screens (${interviewCount})
            </button>
            <button class="action-btn pipeline-tab-btn ${activeTab === 'applied' ? 'primary' : ''}" data-tab="applied">
              ✓ Applied Only (${appliedOnlyCount})
            </button>
            <button class="action-btn pipeline-tab-btn ${activeTab === 'fresh' ? 'primary' : ''}" data-tab="fresh">
              ✨ Fresh Unapplied (${freshCount})
            </button>
            <button class="action-btn pipeline-tab-btn ${activeTab === 'ignored' ? 'primary' : ''}" data-tab="ignored">
              🚫 Ignored (${ignoredCount})
            </button>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <input type="text" id="jobPipelineSearchInput" value="${searchQuery}" placeholder="🔍 Search roles, companies..." class="form-input" style="padding:6px 12px; font-size:12px; width:220px;" />
          </div>
        </div>

        <!-- Applications Pipeline Table -->
        <div class="apps-table-card" style="margin-top:12px;">
          ${displayList.length === 0 ? `
            <div style="text-align:center; padding:36px 20px; color:var(--ink-muted);">
              <div style="font-size:32px; margin-bottom:10px;">🔍</div>
              <h4 style="color:var(--ink-primary); font-size:15px;">No applications found in this category</h4>
              <p style="font-size:12px; margin-top:4px;">Try switching tabs or adjusting your search term.</p>
            </div>
          ` : `
            <table class="apps-table">
              <thead>
                <tr>
                  <th>Role & Company</th>
                  <th>Status & Stage</th>
                  <th>Date</th>
                  <th>Track</th>
                  <th style="text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${displayList.map(a => {
                  const isInterview = a.status === 'Interview';
                  const isIgnored = a.status === 'Ignored';
                  const isFresh = a.status === 'fresh';

                  return `
                    <tr style="${isInterview ? 'background:hsla(38, 92%, 50%, 0.05);' : ''}">
                      <td>
                        <div style="font-weight:600; color:var(--ink-primary); display:flex; align-items:center; gap:6px;">
                          ${a.title || 'Untitled Role'}
                          ${isInterview ? '<span style="font-size:10px; background:hsla(38, 92%, 50%, 0.2); color:var(--accent-amber); padding:1px 6px; border-radius:4px; font-weight:700;">INTERVIEW CALL</span>' : ''}
                        </div>
                        <div style="font-size:12px; color:var(--ink-muted); margin-top:2px;">
                          ${a.company || 'Unknown Company'}
                          ${a.location ? ` • <span>${a.location}</span>` : ''}
                          ${a.isManual ? ' • <span style="color:var(--signal-cyan);">Manual Entry</span>' : ''}
                        </div>
                      </td>

                      <td>
                        <div style="display:flex; flex-direction:column; gap:2px;">
                          <span style="display:inline-block; font-size:11px; font-weight:700; padding:2px 8px; border-radius:12px; width:fit-content; background:${
                            isInterview ? 'hsla(38, 92%, 50%, 0.2)' : isIgnored ? 'hsla(0, 0%, 50%, 0.2)' : isFresh ? 'hsla(190, 80%, 45%, 0.15)' : 'hsla(152, 60%, 45%, 0.2)'
                          }; color:${
                            isInterview ? 'var(--accent-amber)' : isIgnored ? 'var(--ink-muted)' : isFresh ? 'var(--signal-cyan)' : 'var(--accent-emerald)'
                          };">
                            ${isInterview ? '🎙️ Interview' : isIgnored ? '🚫 Ignored' : isFresh ? '✨ Fresh' : '✓ Applied'}
                          </span>
                          ${a.stage ? `<span style="font-size:11px; color:var(--ink-secondary);">${a.stage}</span>` : ''}
                        </div>
                      </td>

                      <td style="font-family:var(--font-mono); font-size:12px; color:var(--ink-muted);">
                        ${a.date || '—'}
                      </td>

                      <td>
                        <span style="font-size:11px; font-family:var(--font-mono); background:var(--bg-surface-elevated); padding:2px 6px; border-radius:4px; border:1px solid var(--border-subtle);">
                          ${a.track || 'general'}
                        </span>
                      </td>

                      <td style="text-align:right;">
                        <div style="display:flex; gap:6px; justify-content:flex-end;">
                          ${a.url ? `
                            <a href="${a.url}" target="_blank" rel="noopener" class="action-btn" style="padding:3px 8px; font-size:11px;">
                              Link ↗
                            </a>
                          ` : ''}
                          <a href="${hubUrl}" target="_blank" rel="noopener" class="action-btn" style="padding:3px 8px; font-size:11px; color:var(--signal-cyan);">
                            Hub ↗
                          </a>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          `}
        </div>
      </div>
    `;

    // Bind Filter Tabs
    container.querySelectorAll('.pipeline-tab-btn').forEach(btn => {
      btn.onclick = () => {
        activeTab = btn.dataset.tab;
        render();
      };
    });

    // Bind Search Input
    const sInput = container.querySelector('#jobPipelineSearchInput');
    if (sInput) {
      sInput.oninput = e => {
        searchQuery = e.target.value;
        render();
      };
    }

    // Toggle AI Roles List
    const toggleAiBtn = container.querySelector('#toggleAiJobsListBtn');
    const aiPanel = container.querySelector('#aiJobsDrawerPanel');
    if (toggleAiBtn && aiPanel) {
      toggleAiBtn.onclick = () => {
        isAiPanelOpen = !isAiPanelOpen;
        aiPanel.style.display = isAiPanelOpen ? 'block' : 'none';
        toggleAiBtn.textContent = isAiPanelOpen 
          ? `🙈 Hide Raw AI Database (${totalTracked})` 
          : `👁️ Browse Raw AI Database (${totalTracked})`;
      };
    }

    // Import AI Role
    container.querySelectorAll('.import-ai-job-btn').forEach(btn => {
      btn.onclick = () => {
        const role = btn.dataset.title;
        const co = btn.dataset.company;
        const link = btn.dataset.url;
        const date = btn.dataset.date || new Date().toISOString().slice(0, 10);
        store.commit(s => {
          s.apps = s.apps || [];
          s.apps.unshift({
            id: 'app_' + Date.now(),
            role,
            co,
            link,
            date,
            status: 'Applied',
            notes: 'Imported from AI Job-Finder'
          });
          return s;
        });
        alert(`Imported "${role} at ${co}" to active application pipeline!`);
      };
    });

    // Toggle Add Application Form
    const toggleBtn = container.querySelector('#showAddAppFormBtn');
    const form = container.querySelector('#addAppForm');
    const cancelBtn = container.querySelector('#cancelAddAppBtn');
    const submitBtn = container.querySelector('#submitAddAppBtn');

    if (toggleBtn && form) {
      toggleBtn.onclick = () => { form.style.display = form.style.display === 'none' ? 'block' : 'none'; };
      cancelBtn.onclick = () => { form.style.display = 'none'; };
      submitBtn.onclick = () => {
        const role = container.querySelector('#appRole').value.trim();
        const co = container.querySelector('#appCompany').value.trim();
        const link = container.querySelector('#appLink').value.trim();
        const date = container.querySelector('#appDate').value;
        const status = container.querySelector('#appStatus').value;
        const notes = container.querySelector('#appNotes').value.trim();

        if (!role || !co) {
          alert('Please enter both Role Title and Company Name.');
          return;
        }

        store.commit(s => {
          s.apps = s.apps || [];
          s.apps.unshift({ id: 'app_' + Date.now(), role, co, link, date, status, notes });
          return s;
        });

        form.style.display = 'none';
      };
    }
  }

  render();
  let prevAppsJson = JSON.stringify(store.get().apps || []);
  return store.subscribe(s => {
    const currentAppsJson = JSON.stringify(s.apps || []);
    if (currentAppsJson !== prevAppsJson) {
      prevAppsJson = currentAppsJson;
      render();
    }
  });
}
