class ParticleSystem {
  #canvas = null;
  #ctx = null;
  #particles = [];
  #mouse = { x: 0, y: 0 };
  #animationId = null;

  constructor(options = {}) {
    this.options = {
      count: 80,
      size: { min: 2, max: 5 },
      speed: { min: 0.2, max: 0.8 },
      connectionDistance: 120,
      ...options
    };
  }

  initialize(container) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return this;

    this.#canvas = document.createElement('canvas');
    this.#canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;';
    container.appendChild(this.#canvas);
    this.#ctx = this.#canvas.getContext('2d');

    this.#resize();
    this.#createParticles();
    this.#setupMouseTracking();
    this.#animate();

    window.addEventListener('resize', () => this.#resize());
    return this;
  }

  #resize() {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;
  }

  #createParticles() {
    const colors = ['#6C63FF', '#FF6B6B', '#00D4FF', '#FFD700', '#9B59B6'];
    this.#particles = Array.from({ length: this.options.count }, () => ({
      x: Math.random() * this.#canvas.width,
      y: Math.random() * this.#canvas.height,
      vx: (Math.random() - 0.5) * this.options.speed.max,
      vy: (Math.random() - 0.5) * this.options.speed.max,
      size: this.options.size.min + Math.random() * (this.options.size.max - this.options.size.min),
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  #setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
      this.#mouse.x = e.clientX;
      this.#mouse.y = e.clientY;
    });
  }

  #animate() {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    this.#particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      const dx = this.#mouse.x - particle.x;
      const dy = this.#mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 150 && distance > 0) {
        const force = (150 - distance) / 150 * 0.05;
        particle.vx += (dx / distance) * force;
        particle.vy += (dy / distance) * force;
      }

      if (particle.x < 0 || particle.x > this.#canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.#canvas.height) particle.vy *= -1;
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      this.#ctx.beginPath();
      this.#ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.#ctx.fillStyle = particle.color + '60';
      this.#ctx.fill();

      for (let i = index + 1; i < this.#particles.length; i++) {
        const other = this.#particles[i];
        const ddx = particle.x - other.x;
        const ddy = particle.y - other.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist < this.options.connectionDistance) {
          const opacity = 1 - dist / this.options.connectionDistance;
          this.#ctx.beginPath();
          this.#ctx.moveTo(particle.x, particle.y);
          this.#ctx.lineTo(other.x, other.y);
          this.#ctx.strokeStyle = `rgba(108, 99, 255, ${opacity * 0.3})`;
          this.#ctx.lineWidth = 1;
          this.#ctx.stroke();
        }
      }
    });

    this.#animationId = requestAnimationFrame(() => this.#animate());
  }

  destroy() {
    if (this.#animationId) cancelAnimationFrame(this.#animationId);
    this.#canvas?.remove();
  }
}

export default new ParticleSystem();
