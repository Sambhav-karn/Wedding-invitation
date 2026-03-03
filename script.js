'use strict';

// Wedding Date
const WEDDING_DATE = new Date('2026-03-13T00:00:00');

/* ── Scroll Progress Bar ── */
const scrollBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = pct + '%';
});

/* ── Particle System (Intro) ── */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    const drift = (Math.random() - 0.5) * 100;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;bottom:-10px;animation-duration:${Math.random()*12+8}s;animation-delay:${Math.random()*8}s;--drift:${drift}px;`;
    container.appendChild(p);
  }
}

/* ── Mandala Canvas ── */
function drawMandala() {
  const canvas = document.getElementById('mandalaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
  canvas.width = size;
  canvas.height = size;
  const cx = size / 2, cy = size / 2;
  let rotation = 0;

  function render() {
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.translate(-cx, -cy);
    ctx.strokeStyle = '#C9A84C';
    ctx.lineWidth = 0.5;

    for (let ring = 1; ring <= 8; ring++) {
      const r = (ring / 9) * (size * 0.45);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.globalAlpha = 0.15;
      ctx.stroke();
      const petals = ring * 6;
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle)*r*0.85, cy + Math.sin(angle)*r*0.85);
        ctx.lineTo(cx + Math.cos(angle)*r, cy + Math.sin(angle)*r);
        ctx.globalAlpha = 0.1;
        ctx.stroke();
      }
    }
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle)*size*0.45, cy + Math.sin(angle)*size*0.45);
      ctx.globalAlpha = 0.1;
      ctx.stroke();
    }
    ctx.restore();
    rotation += 0.002;
    requestAnimationFrame(render);
  }
  render();
}

/* ── Typing Animation ── */
function typeText(el, text, speed) {
  return new Promise(resolve => {
    let i = 0;
    el.style.opacity = '1';
    const timer = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(timer); resolve(); }
    }, speed || 60);
  });
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ── Intro Sequence ── */
async function initIntroSequence() {
  const blessing = document.getElementById('blessingText');
  const couple = document.getElementById('coupleTitle');
  const subtext = document.getElementById('inviteSubtext');
  const hint = document.getElementById('scrollHint');

  await delay(800);
  await typeText(blessing, 'With the Blessings of Our Families', 55);
  await delay(500);
  couple.style.opacity = '1';
  couple.style.animation = 'glowReveal 2s ease forwards';
  await delay(1200);
  subtext.style.opacity = '1';
  subtext.style.animation = 'fadeInUp 1.5s ease forwards';
  await delay(1000);
  hint.style.opacity = '1';
  hint.style.animation = 'fadeInUp 1.5s ease forwards';
}

/* ── Countdown Timer ── */
function updateCountdown() {
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) {
    ['days','hours','minutes','seconds'].forEach(u => document.getElementById(u).textContent = '00');
    return;
  }
  const vals = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };
  Object.keys(vals).forEach(unit => {
    const el = document.getElementById(unit);
    const newVal = String(vals[unit]).padStart(2, '0');
    if (el.textContent !== newVal) {
      el.classList.add('flip-animation');
      el.textContent = newVal;
      setTimeout(() => el.classList.remove('flip-animation'), 400);
    }
  });
}

/* ── Intersection Observer Scroll Reveal ── */
function initScrollReveal() {
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); sectionObs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal-section').forEach(s => sectionObs.observe(s));

  const itemObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const siblings = Array.from(e.target.parentElement.querySelectorAll('.scroll-reveal'));
        const idx = siblings.indexOf(e.target);
        setTimeout(() => e.target.classList.add('visible'), idx * 150);
        itemObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.scroll-reveal').forEach(el => itemObs.observe(el));

  // Timeline alternate sides
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    const card = item.querySelector('.event-card');
    if (card) {
      card.classList.add('scroll-reveal');
      card.classList.add(i % 2 === 0 ? 'from-left' : 'from-right');
      itemObs.observe(card);
    }
  });
}

/* ── Baraat Stars ── */
function createBaraatStars() {
  const container = document.getElementById('baraatStars');
  if (!container) return;
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-duration:${Math.random()*4+2}s;animation-delay:${Math.random()*4}s;`;
    container.appendChild(star);
  }
}

/* ── Petal Canvas (Invitation) ── */
function initPetalsCanvas() {
  const canvas = document.getElementById('petalsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#C9A84C', '#F0D080', '#6B1A2A', '#FFF3C4', '#FF9999'];
  const petals = Array.from({ length: 30 }, () => ({
    x: Math.random() * 800,
    y: Math.random() * 600 - 600,
    r: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: Math.random() * 1.5 + 0.5,
    drift: (Math.random() - 0.5) * 0.8,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    opacity: Math.random() * 0.6 + 0.3
  }));

  let active = false;
  const obs = new IntersectionObserver(e => { e.forEach(en => { active = en.isIntersecting; }); }, { threshold: 0.1 });
  const section = canvas.closest('section');
  if (section) obs.observe(section);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (active) {
      petals.forEach(p => {
        p.y += p.speed; p.x += p.drift; p.rotation += p.rotSpeed;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ── Fireworks ── */
function initFireworks() {
  const canvas = document.getElementById('fireworksCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#C9A84C','#F0D080','#FFF3C4','#FFD700','#FF6B6B','#FF9999','#E8B4B8','#FFFFFF'];
  const fireworks = [];
  const particles = [];
  let active = false;
  let lastLaunch = 0;

  const obs = new IntersectionObserver(e => { e.forEach(en => { active = en.isIntersecting; }); }, { threshold: 0.3 });
  const finale = document.getElementById('finale');
  if (finale) obs.observe(finale);

  function spawnFirework() {
    const fw = {
      x: Math.random() * canvas.width,
      y: canvas.height,
      tx: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
      ty: Math.random() * canvas.height * 0.5 + 50,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      trail: [], done: false
    };
    const angle = Math.atan2(fw.ty - fw.y, fw.tx - fw.x);
    const speed = Math.random() * 5 + 9;
    fw.vx = Math.cos(angle) * speed;
    fw.vy = Math.sin(angle) * speed;
    return fw;
  }

  function explode(fw) {
    const count = Math.floor(Math.random() * 60) + 80;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particles.push({
        x: fw.x, y: fw.y, color: fw.color,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        alpha: 1, decay: Math.random() * 0.02 + 0.01,
        size: Math.random() * 3 + 1
      });
    }
  }

  function animate(ts) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (active && ts - lastLaunch > 700) {
      fireworks.push(spawnFirework());
      if (Math.random() > 0.5) setTimeout(() => fireworks.push(spawnFirework()), 250);
      lastLaunch = ts;
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
      const fw = fireworks[i];
      fw.trail.push({ x: fw.x, y: fw.y });
      if (fw.trail.length > 8) fw.trail.shift();
      fw.trail.forEach((t, ti) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = fw.color;
        ctx.globalAlpha = ti / fw.trail.length * 0.5;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = fw.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = fw.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      fw.vx *= 0.99; fw.vy *= 0.99; fw.vy += 0.15;
      fw.x += fw.vx; fw.y += fw.vy;

      if (fw.vy >= 0 || fw.y <= fw.ty) {
        explode(fw);
        fireworks.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= 0.98; p.vy *= 0.98; p.vy += 0.08;
      p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/*
  WEDDING MUSIC
  ► Rename your song file to:  wedding-song.mp3
  ► Place it in the SAME folder as index.html
  ► Music plays automatically on loop — no controls shown to visitors
*/
function startWeddingMusic() {
  const audio = document.getElementById('weddingAudio');
  if (!audio) return;
  audio.volume = 0;
  const tryPlay = () => {
    audio.play().then(() => {
      let vol = 0;
      const fade = setInterval(() => {
        vol = Math.min(vol + 0.012, 0.75);
        audio.volume = vol;
        if (vol >= 0.75) clearInterval(fade);
      }, 80);
    }).catch(() => {});
  };
  tryPlay();
  ['click','scroll','touchstart','keydown'].forEach(ev => {
    document.addEventListener(ev, function unlock() {
      tryPlay();
      document.removeEventListener(ev, unlock);
    }, { once: true });
  });
}

/* ── Baraat Animation ── */
function initBaraatAnimation() {
  const vehicle = document.getElementById('baraatVehicle');
  const section = document.getElementById('baraat');
  if (!vehicle || !section) return;
  let observed = false;
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !observed) {
        observed = true;
        vehicle.style.animation = 'none';
        void vehicle.offsetWidth;
        vehicle.style.animation = 'baraatRide 6s linear infinite';
      }
    });
  }, { threshold: 0.4 }).observe(section);
}

/* ── Cursor Trail ── */
function initCursorTrail() {
  if ('ontouchstart' in window) return;
  const trail = [];
  for (let i = 0; i < 12; i++) {
    const dot = document.createElement('div');
    const size = (12 - i) * 0.8 + 2;
    dot.style.cssText = `position:fixed;pointer-events:none;z-index:99999;border-radius:50%;background:radial-gradient(circle,#F0D080,#C9A84C);transform:translate(-50%,-50%);width:${size}px;height:${size}px;opacity:${((12-i)/12)*0.5};`;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animTrail() {
    trail.forEach((dot, i) => {
      dot.x = i === 0 ? mx : trail[i-1].x;
      dot.y = i === 0 ? my : trail[i-1].y;
      dot.el.style.left = dot.x + 'px';
      dot.el.style.top = dot.y + 'px';
    });
    requestAnimationFrame(animTrail);
  })();
}

/* ── Countdown Petals ── */
function initCountdownPetals() {
  const c = document.getElementById('petalsCd');
  if (!c) return;
  ['🌸','🌺','🌼','🪷','✨'].forEach((emoji, ei) => {
    for (let i = 0; i < 3; i++) {
      const el = document.createElement('div');
      el.textContent = emoji;
      el.style.cssText = `position:absolute;font-size:${Math.random()*12+10}px;left:${Math.random()*100}%;top:-20px;animation:petalFall ${Math.random()*8+6}s linear ${Math.random()*5}s infinite;--r:${Math.random()*720}deg;--dx:${(Math.random()-0.5)*80}px;pointer-events:none;`;
      c.appendChild(el);
    }
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  drawMandala();
  initIntroSequence();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  initScrollReveal();
  createBaraatStars();
  initBaraatAnimation();
  initPetalsCanvas();
  initLoveCanvas();
  initFireworks();
  initCountdownPetals();
  initCursorTrail();
  startWeddingMusic();
  console.log('Shivam & Khushbu – Wedding Invitation Loaded');
});

/* ============================================
   LOVE STORY CANVAS – floating hearts & stars
============================================ */
function initLoveCanvas() {
  const canvas = document.getElementById('loveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize();
  window.addEventListener('resize', resize);

  const SYMBOLS = ['❤', '✦', '✿', '❧', '◆'];
  const items = Array.from({ length: 25 }, () => ({
    x: Math.random() * 1200,
    y: Math.random() * 900,
    size: Math.random() * 18 + 8,
    speed: Math.random() * 0.4 + 0.1,
    drift: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.3 + 0.05,
    symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    color: ['#C9A84C','#F0D080','#FFF3C4','#6B1A2A','#FF9999'][Math.floor(Math.random()*5)]
  }));

  let active = false;
  const obs = new IntersectionObserver(e => e.forEach(en => { active = en.isIntersecting; }), { threshold: 0.1 });
  const section = document.getElementById('lovestory');
  if (section) obs.observe(section);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (active) {
      items.forEach(item => {
        item.y -= item.speed;
        item.x += item.drift;
        if (item.y < -30) { item.y = canvas.height + 20; item.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.globalAlpha = item.opacity;
        ctx.fillStyle = item.color;
        ctx.font = `${item.size}px serif`;
        ctx.fillText(item.symbol, item.x, item.y);
        ctx.restore();
      });
    }
    requestAnimationFrame(animate);
  }
  animate();
}


