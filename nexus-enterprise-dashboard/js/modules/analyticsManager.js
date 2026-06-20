class AnalyticsManager {
  #chartInstances = new Map();

  constructor() {
    this.#ensureRoundRectSupport();
  }

  createBarChart(containerId, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.innerHTML = '';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const width = container.clientWidth;
    const height = container.clientHeight || 300;

    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(2, 2);

    this.#drawBarChart(ctx, data, width, height, options);

    const chartId = Date.now() + Math.random();
    this.#chartInstances.set(chartId, { canvas, data, options });
    return chartId;
  }

  #drawBarChart(ctx, data, width, height, options) {
    const padding = { top: 30, right: 30, bottom: 50, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const barWidth = Math.min(chartWidth / data.length * 0.7, 50);
    const spacing = (chartWidth - barWidth * data.length) / (data.length + 1);

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i <= 4; i++) {
      const y = padding.top + chartHeight - (i / 4) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const value = Math.round((i / 4) * maxValue);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#6C757D';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value, padding.left - 10, y + 4);
    }

    data.forEach((item, index) => {
      const x = padding.left + spacing + index * (barWidth + spacing);
      const barHeight = (item.value / maxValue) * chartHeight;
      const y = padding.top + chartHeight - barHeight;
      const color = options.colors?.[index] || '#6C63FF';

      const gradient = ctx.createLinearGradient(0, y, 0, padding.top + chartHeight);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + '60');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      ctx.fill();

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary') || '#495057';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barWidth / 2, padding.top + chartHeight + 20);
      ctx.fillText(String(item.value), x + barWidth / 2, y - 10);
    });
  }

  createDonutChart(containerId, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.innerHTML = '';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const size = Math.min(container.clientWidth, 280);
    const center = size / 2;
    const radius = size / 2 - 40;

    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(2, 2);

    const colors = ['#6C63FF', '#FF6B6B', '#00D4FF', '#FFD700', '#9B59B6', '#2ECC71'];
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    let startAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.65;
      const x = center + Math.cos(midAngle) * labelRadius;
      const y = center + Math.sin(midAngle) * labelRadius;
      ctx.fillStyle = '#fff';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round((item.value / total) * 100)}%`, x, y + 4);
      startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(center, center, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--card-bg') || '#fff';
    ctx.fill();

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#212529';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(options.centerText || 'Total', center, center - 8);
    ctx.font = '13px Inter, sans-serif';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#6C757D';
    ctx.fillText(String(total), center, center + 14);
  }

  trackEvent(name, data = {}) {
    if (window.gtag) window.gtag('event', name, data);
    console.log(`[Analytics] ${name}`, data);
  }

  #ensureRoundRectSupport() {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
        const r = Array.isArray(radii) ? radii : [radii, radii, radii, radii];
        this.moveTo(x + r[0], y);
        this.lineTo(x + w - r[1], y);
        this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
        this.lineTo(x + w, y + h - r[2]);
        this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
        this.lineTo(x + r[3], y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
        this.lineTo(x, y + r[0]);
        this.quadraticCurveTo(x, y, x + r[0], y);
      };
    }
  }
}

export default new AnalyticsManager();
