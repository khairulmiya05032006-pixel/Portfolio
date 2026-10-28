const root = document.body;
const themeButton = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') root.classList.add('light');
themeButton.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('portfolio-theme', root.classList.contains('light') ? 'light' : 'dark');
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion) revealItems.forEach(item => item.classList.add('visible'));
else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: .12 });
  revealItems.forEach(item => observer.observe(item));
}

if (!reducedMotion) {
  const canvas = document.getElementById('particle-field');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function setSize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    const count = Math.min(50, Math.max(20, Math.floor(window.innerWidth / 28)));
    particles = Array.from({ length: count }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18, r: Math.random() * 1.25 + .35 }));
  }
  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = root.classList.contains('light') ? 'rgba(28,48,31,.18)' : 'rgba(214,255,77,.35)';
    particles.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1; if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); });
    requestAnimationFrame(draw);
  }
  setSize(); draw(); window.addEventListener('resize', setSize);
}
