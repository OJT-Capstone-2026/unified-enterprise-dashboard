export function renderContributionChart(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const canvas = document.createElement('canvas');
  container.innerHTML = '';
  container.appendChild(canvas);

  const width = container.clientWidth;
  const height = 200;
  canvas.width = width * 2;
  canvas.height = height * 2;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  const weeks = 26;
  const days = 7;
  const cellSize = Math.min((width - 40) / weeks, 14);
  const data = Array.from({ length: weeks * days }, () => Math.random());

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const val = data[w * days + d];
      const intensity = Math.floor(val * 4);
      const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
      ctx.fillStyle = colors[intensity];
      ctx.fillRect(20 + w * (cellSize + 2), 10 + d * (cellSize + 2), cellSize, cellSize);
    }
  }

  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#6C757D';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Contributions (last 6 months)', 20, height - 5);
}

export default renderContributionChart;
