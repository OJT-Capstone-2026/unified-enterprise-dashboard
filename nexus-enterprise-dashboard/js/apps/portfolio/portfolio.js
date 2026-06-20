import { members } from './members.js';

const Portfolio = {
  render() {
    return `
      <div class="page-header">
        <h1>Team Portfolio</h1>
        <p>Meet the talented professionals driving Nexus Enterprise forward.</p>
      </div>

      <div class="team-grid">
        ${members.map(m => `
          <div class="team-card perspective-3d">
            <div class="team-avatar" style="background: linear-gradient(135deg, ${m.color[0]}, ${m.color[1]});">
              ${m.initials}
            </div>
            <div class="team-name">${m.name}</div>
            <div class="team-role">${m.role}</div>
            <p class="team-bio">${m.bio}</p>
            <div class="flex gap-3 justify-between mt-4" style="justify-content:center;">
              ${m.skills.map(s => `<span class="badge badge-primary">${s}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
};

export default Portfolio;
