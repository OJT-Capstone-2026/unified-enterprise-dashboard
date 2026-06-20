import { members } from '../portfolio/members.js';
import AnalyticsManager from '../../modules/analyticsManager.js';

let simInterval = null;
let currentScore = 94.2;
let kpis = {
  sla: 99.4,
  resolution: 18.0,
  velocity: 42,
  allocation: 88.5
};

let projects = [
  { name: 'Nexus Platform Core', health: 98, progress: 85, status: 'On Track', statusClass: 'badge-success' },
  { name: 'Cloud Infrastructure Migration', health: 76, progress: 60, status: 'At Risk', statusClass: 'badge-warning' },
  { name: 'Zero-Trust Security Integration', health: 92, progress: 45, status: 'On Track', statusClass: 'badge-success' }
];

let risks = [
  { id: 1, label: 'SLA Breach Risk (Average response time approaching threshold)', level: 'warning', icon: 'fa-exclamation-triangle' },
  { id: 2, label: '3 Unassigned High-Priority Bugs in Kanban Backlog', level: 'danger', icon: 'fa-bug' },
  { id: 3, label: 'DevOps Cloud Resource Load Spike (DB memory exceeds 82%)', level: 'warning', icon: 'fa-microchip' }
];

const teamData = members.map(m => ({
  ...m,
  tasks: Math.floor(Math.random() * 20) + 15,
  rating: (Math.random() * 1.5 + 8.3).toFixed(1),
  status: Math.random() > 0.3 ? 'active' : 'idle'
}));

const insights = [
  'Team velocity increased by 8% following recent task completions by Elena Rodriguez.',
  'Warning: Cloud Migration timeline requires attention. Suggest assigning Aisha Patel to infrastructure review.',
  'Overall SLA compliance remains highly optimal at 99.4%.'
];

const Evaluation = {
  render() {
    return `
      <div class="page-header text-reveal">
        <h1 class="gradient-text" data-i18n="evaluation.title">Evaluation & Analytics Center</h1>
        <p data-i18n="evaluation.subtitle">Real-time enterprise metrics, team performance index, and strategic risk evaluation.</p>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card" id="kpi-sla">
          <div class="kpi-card-header">
            <span>SLA Compliance</span>
            <i class="fas fa-check-double text-primary"></i>
          </div>
          <div class="kpi-value" id="val-sla">${kpis.sla}%</div>
          <div class="kpi-trend positive">
            <i class="fas fa-caret-up"></i>
            <span>+0.2% vs target</span>
          </div>
        </div>

        <div class="kpi-card" id="kpi-resolution">
          <div class="kpi-card-header">
            <span>Avg Ticket Resolution</span>
            <i class="fas fa-history text-accent"></i>
          </div>
          <div class="kpi-value" id="val-resolution">${kpis.resolution}m</div>
          <div class="kpi-trend positive">
            <i class="fas fa-caret-down"></i>
            <span>-1.5m this week</span>
          </div>
        </div>

        <div class="kpi-card" id="kpi-velocity">
          <div class="kpi-card-header">
            <span>Active Velocity</span>
            <i class="fas fa-bolt text-gold"></i>
          </div>
          <div class="kpi-value" id="val-velocity">${kpis.velocity} pts</div>
          <div class="kpi-trend positive">
            <i class="fas fa-caret-up"></i>
            <span>+4 pts from average</span>
          </div>
        </div>

        <div class="kpi-card" id="kpi-allocation">
          <div class="kpi-card-header">
            <span>Resource Allocation</span>
            <i class="fas fa-chart-pie text-purple"></i>
          </div>
          <div class="kpi-value" id="val-allocation">${kpis.allocation}%</div>
          <div class="kpi-trend negative">
            <i class="fas fa-caret-up"></i>
            <span>+1.1% resource saturation</span>
          </div>
        </div>
      </div>

      <div class="eval-grid-main">
        <div class="flex flex-column gap-6">
          <div class="grid-2">
            <div class="card liquid-glass" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div class="card-header" style="width: 100%; margin-bottom: var(--space-4);">
                <h3 class="card-title">Performance Score</h3>
              </div>
              <div id="score-gauge-container" style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center;"></div>
            </div>

            <div class="card glass-premium">
              <div class="card-header">
                <h3 class="card-title">Performance Trend Analysis</h3>
              </div>
              <div id="trend-chart-container" style="width: 100%; height: 200px;"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Team Productivity Index</h3>
              <span class="badge badge-primary">Dynamic Scoring</span>
            </div>
            <div class="table-wrapper">
              <table class="prod-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Role</th>
                    <th>Tasks Completed</th>
                    <th>Productivity Rating</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="team-productivity-body">
                  ${teamData.map((m, idx) => `
                    <tr id="member-row-${idx}">
                      <td>
                        <div class="prod-member-cell">
                          <div class="prod-avatar" style="background: linear-gradient(135deg, ${m.color[0]}, ${m.color[1]});">
                            ${m.initials}
                          </div>
                          <span style="font-weight: 600;">${m.name}</span>
                        </div>
                      </td>
                      <td style="color: var(--text-secondary); font-size: 13px;">${m.role}</td>
                      <td style="font-weight: 700;" id="member-tasks-${idx}">${m.tasks}</td>
                      <td>
                        <span class="badge badge-primary" id="member-rating-${idx}" style="font-family: var(--font-mono);">${m.rating} / 10</span>
                      </td>
                      <td>
                        <span class="status-dot ${m.status === 'active' ? 'active' : ''}" id="member-status-${idx}"></span>
                        <span style="font-size: 12px; margin-left: 4px; text-transform: capitalize;" id="member-status-lbl-${idx}">${m.status}</span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="eval-grid-side">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Project Health Monitoring</h3>
            </div>
            <div class="project-health-list">
              ${projects.map((p, idx) => `
                <div class="project-health-item">
                  <div class="project-meta">
                    <span class="project-name">${p.name}</span>
                    <span class="badge ${p.statusClass}" id="project-status-${idx}">${p.status}</span>
                  </div>
                  <div style="font-size: 12px; color: var(--text-muted); display: flex; justify-content: space-between;">
                    <span>Health Index: <strong id="project-health-${idx}">${p.health}%</strong></span>
                    <span>Progress: <strong id="project-progress-${idx}">${p.progress}%</strong></span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-bar ${p.health < 80 ? 'warning' : ''}" id="project-progress-bar-${idx}" style="width: ${p.progress}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Risk Assessment & Indicators</h3>
            </div>
            <div class="risk-indicator-list" id="risk-list-container">
              ${risks.map(r => `
                <div class="risk-item ${r.level === 'warning' ? 'warning' : ''}" id="risk-item-${r.id}">
                  <i class="fas ${r.icon} risk-icon"></i>
                  <div class="risk-details">
                    <div>${r.label}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Executive Insights Panel</h3>
            </div>
            <div class="insights-container" id="insights-container">
              ${insights.map(i => `
                <div class="insight-bubble">
                  <i class="fas fa-lightbulb insight-icon"></i>
                  <div>${i}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Evaluation Timeline</h3>
            </div>
            <div class="timeline-track">
              <div class="timeline-node completed">
                <div class="timeline-time">April 15, 2026</div>
                <div class="timeline-title">Q1 Tech Audit & Review</div>
                <div class="timeline-desc">Architecture and scalability benchmark audit completed successfully (92% rating).</div>
              </div>
              <div class="timeline-node completed">
                <div class="timeline-time">May 30, 2026</div>
                <div class="timeline-title">Load Testing Assessment</div>
                <div class="timeline-desc">Simulated 100k concurrent client events (100% capacity verified).</div>
              </div>
              <div class="timeline-node">
                <div class="timeline-time">June 20, 2026</div>
                <div class="timeline-title">Q2 Executive Evaluation</div>
                <div class="timeline-desc">Active verification of product development timelines and velocity.</div>
              </div>
              <div class="timeline-node upcoming">
                <div class="timeline-time">July 15, 2026</div>
                <div class="timeline-title">Security Compliance Verification</div>
                <div class="timeline-desc">Upcoming zero-trust audit compliance review and SOC2 verification.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="attribution-footer">
        Real-Time Evaluation & Analytics Center implemented by <strong>Arman Patel</strong>
      </footer>
    `;
  },

  onRoute() {
    requestAnimationFrame(() => {
      this.drawCharts();
    });

    this.startSimulation();

    const handleRouteLeave = (e) => {
      if (e.detail.path !== '/evaluation') {
        if (simInterval) {
          clearInterval(simInterval);
          simInterval = null;
        }
        document.removeEventListener('route:changed', handleRouteLeave);
      }
    };
    document.addEventListener('route:changed', handleRouteLeave);
  },

  drawCharts() {
    AnalyticsManager.createGaugeChart('score-gauge-container', currentScore, {
      color: '#6C63FF',
      label: 'Performance Score'
    });

    AnalyticsManager.createLineChart('trend-chart-container', [
      { label: 'Jan', value: 89 },
      { label: 'Feb', value: 90 },
      { label: 'Mar', value: 92 },
      { label: 'Apr', value: 91 },
      { label: 'May', value: 93 },
      { label: 'Jun', value: Math.round(currentScore) }
    ], {
      color: '#00D4FF',
      fill: true
    });
  },

  startSimulation() {
    if (simInterval) clearInterval(simInterval);

    simInterval = setInterval(() => {
      const change = (Math.random() * 0.6 - 0.3);
      currentScore = Math.max(90, Math.min(100, currentScore + change));

      this.drawCharts();

      this.updateKPI('sla', (99 + Math.random() * 0.9).toFixed(1), '%');
      this.updateKPI('resolution', (16 + Math.random() * 4).toFixed(1), 'm');
      this.updateKPI('velocity', Math.floor(40 + Math.random() * 6), ' pts');
      this.updateKPI('allocation', (86 + Math.random() * 4).toFixed(1), '%');

      const randomMemberIdx = Math.floor(Math.random() * teamData.length);
      const member = teamData[randomMemberIdx];

      if (Math.random() > 0.4) {
        member.tasks += 1;
        member.rating = Math.max(8.0, Math.min(10.0, parseFloat(member.rating) + 0.1)).toFixed(1);
        const tasksEl = document.getElementById(`member-tasks-${randomMemberIdx}`);
        const ratingEl = document.getElementById(`member-rating-${randomMemberIdx}`);

        if (tasksEl) {
          tasksEl.textContent = member.tasks;
          this.applyFlashEffect(tasksEl, 'up');
        }
        if (ratingEl) {
          ratingEl.textContent = `${member.rating} / 10`;
          this.applyFlashEffect(ratingEl, 'up');
        }
      }

      if (Math.random() > 0.7) {
        member.status = member.status === 'active' ? 'idle' : 'active';
        const dotEl = document.getElementById(`member-status-${randomMemberIdx}`);
        const lblEl = document.getElementById(`member-status-lbl-${randomMemberIdx}`);
        if (dotEl && lblEl) {
          dotEl.className = `status-dot ${member.status === 'active' ? 'active' : ''}`;
          lblEl.textContent = member.status;
        }
      }

      const randomProjIdx = Math.floor(Math.random() * projects.length);
      const proj = projects[randomProjIdx];
      if (Math.random() > 0.5 && proj.progress < 100) {
        proj.progress = Math.min(100, proj.progress + 1);
        proj.health = Math.max(70, Math.min(100, proj.health + Math.floor(Math.random() * 3 - 1)));

        const healthEl = document.getElementById(`project-health-${randomProjIdx}`);
        const progressEl = document.getElementById(`project-progress-${randomProjIdx}`);
        const barEl = document.getElementById(`project-progress-bar-${randomProjIdx}`);
        const statusEl = document.getElementById(`project-status-${randomProjIdx}`);

        if (healthEl) healthEl.textContent = `${proj.health}%`;
        if (progressEl) progressEl.textContent = `${proj.progress}%`;
        if (barEl) {
          barEl.style.width = `${proj.progress}%`;
          if (proj.health < 80) {
            barEl.className = 'progress-bar warning';
            statusEl.className = 'badge badge-warning';
            statusEl.textContent = 'At Risk';
          } else {
            barEl.className = 'progress-bar';
            statusEl.className = 'badge badge-success';
            statusEl.textContent = 'On Track';
          }
        }
      }

      if (Math.random() > 0.75) {
        const potentialInsights = [
          `Dynamic analysis: SLA metrics remain steady at ${kpis.sla}%.`,
          `Alert: project velocity is running hot at ${kpis.velocity} story points.`,
          `Team load: Resource allocation stands at ${kpis.allocation}% saturation.`,
          `Collaboration Note: David Kim successfully updated compliant firewall policies.`,
          `DevOps report: Aisha Patel completed CI pipeline docker migration audit.`
        ];
        const nextInsight = potentialInsights[Math.floor(Math.random() * potentialInsights.length)];
        insights.unshift(nextInsight);
        if (insights.length > 4) insights.pop();

        const insightsEl = document.getElementById('insights-container');
        if (insightsEl) {
          insightsEl.innerHTML = insights.map(ins => `
            <div class="insight-bubble text-reveal">
              <i class="fas fa-lightbulb insight-icon"></i>
              <div>${ins}</div>
            </div>
          `).join('');
        }
      }
    }, 3500);
  },

  updateKPI(key, newVal, suffix = '') {
    const oldVal = kpis[key];
    kpis[key] = newVal;

    const valEl = document.getElementById(`val-${key}`);
    const cardEl = document.getElementById(`kpi-${key}`);

    if (valEl && cardEl && String(oldVal) !== String(newVal)) {
      valEl.textContent = `${newVal}${suffix}`;
      this.applyFlashEffect(cardEl, parseFloat(newVal) >= parseFloat(oldVal) ? 'up' : 'down');
    }
  },

  applyFlashEffect(element, direction) {
    const className = direction === 'up' ? 'flash-up' : 'flash-down';
    element.classList.remove('flash-up', 'flash-down');
    void element.offsetWidth;
    element.classList.add(className);
    setTimeout(() => {
      element.classList.remove(className);
    }, 800);
  }
};

export default Evaluation;
