/* ============================================
   COPPLE — Modern Editorial Redesign
   Animation + Interaction Layer
   ============================================ */

const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initThemeToggle();
  initLenis();
  initNav();
  initMagnetic();
  initRevealAnims();
  initHero();
  initSessionCard();
  initSentimentChart();
  initSynthesisNodes();
  initFAQ();
  initPricingToggle();
  initTweaksPanel();
  initSpotlight();
});

/* ============================================
   THEME / TWEAK PERSISTENCE
   ============================================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "teal",
  "anim": "medium"
}/*EDITMODE-END*/;

function getTweaks() {
  let defaults = { ...TWEAK_DEFAULTS };
  if (window.matchMedia) {
    defaults.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  try {
    const saved = JSON.parse(localStorage.getItem('copple-tweaks') || '{}');
    return { ...defaults, ...saved };
  } catch { 
    return defaults; 
  }
}
function setTweak(key, value) {
  const t = getTweaks();
  t[key] = value;
  localStorage.setItem('copple-tweaks', JSON.stringify(t));
  applyTweaks(t);
  try {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: value }}, '*');
  } catch {}
}
function applyTweaks(t) {
  document.documentElement.setAttribute('data-theme', t.theme);
  document.documentElement.setAttribute('data-accent', t.accent);
  document.documentElement.setAttribute('data-anim', t.anim);
}

function initTheme() {
  applyTweaks(getTweaks());
}

/* ============================================
   THEME TOGGLE (Light / Dark)
   ============================================ */
function initThemeToggle() {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = getTweaks();
      const next = current.theme === 'dark' ? 'light' : 'dark';
      setTweak('theme', next);

      // Update tweaks panel active state if open
      document.querySelectorAll('[data-tweak="theme"] button').forEach(b => {
        b.classList.toggle('is-active', b.dataset.value === next);
      });
    });
  });
}

/* ============================================
   LENIS SMOOTH SCROLL
   ============================================ */
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  // Use GSAP ticker as the sole animation loop to prevent double-update stutter
  if (typeof gsap !== 'undefined' && gsap.ticker) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback: raw RAF if GSAP unavailable
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  window.__lenis = lenis;
}

/* ============================================
   NAV
   ============================================ */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */
function initMagnetic() {
  if (PREFERS_REDUCED) return;
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width/2;
      const my = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${mx*0.18}px, ${my*0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ============================================
   GSAP REVEAL ANIMS
   ============================================ */
function initRevealAnims() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  // Generic reveal
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' }
    });
  });

  // Mask reveal (line by line)
  gsap.utils.toArray('.reveal-mask').forEach(el => {
    const inner = el.children[0];
    if (!inner) return;
    gsap.to(inner, {
      y: '0%',
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    });
  });

  // Stagger groups
  gsap.utils.toArray('[data-stagger]').forEach(group => {
    const kids = group.querySelectorAll('[data-stagger-child]');
    gsap.from(kids, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });
}

/* ============================================
   HERO ENTRANCE
   ============================================ */
function initHero() {
  if (typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-eyebrow-row > *', { y: 16, opacity: 0, duration: 0.8, stagger: 0.08 })
    .from('.hero-headline .word > span', { y: '110%', duration: 1.1, stagger: 0.06 }, '-=0.4')
    .from('.hero .lede', { y: 16, opacity: 0, duration: 0.8 }, '-=0.7')
    .from('.hero-cta > *', { y: 16, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.6')
    .from('.hero-meta > *', { y: 12, opacity: 0, duration: 0.6, stagger: 0.06 }, '-=0.5')
    .from('.session-card', { y: 40, opacity: 0, rotateX: 8, duration: 1.2 }, '-=0.9')
    .from('.float-tag', { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.6');
}

/* ============================================
   SESSION CARD — Tilt + spotlight
   ============================================ */
function initSessionCard() {
  const card = document.querySelector('.session-card');
  if (!card || PREFERS_REDUCED) return;
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.setProperty('--mx', (px*100) + '%');
    card.style.setProperty('--my', (py*100) + '%');
    card.style.transform = `perspective(1200px) rotateX(${(0.5-py)*4}deg) rotateY(${(px-0.5)*4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
}

/* ============================================
   SENTIMENT CHART
   ============================================ */
function initSentimentChart() {
  document.querySelectorAll('.sentiment-line').forEach(line => {
    const len = line.getTotalLength ? line.getTotalLength() : 600;
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    if (typeof gsap === 'undefined') {
      line.style.strokeDashoffset = 0;
      return;
    }
    gsap.to(line, {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: line, start: 'top 85%' }
    });
  });
}

/* ============================================
   SYNTHESIS NODES — orbiting
   ============================================ */
function initSynthesisNodes() {
  const cores = document.querySelectorAll('.viz-synthesis .core');
  cores.forEach(core => {
    const NUM = 8;
    for (let i = 0; i < NUM; i++) {
      const node = document.createElement('div');
      node.className = 'node';
      const angle = (i/NUM) * Math.PI * 2;
      const radius = 110 + (i%2===0 ? 0 : 20);
      const left = 50 + Math.cos(angle) * 40;
      const top = 50 + Math.sin(angle) * 40;
      node.style.left = `${left}%`;
      node.style.top = `${top}%`;
      core.appendChild(node);
      if (typeof gsap !== 'undefined' && !PREFERS_REDUCED) {
        gsap.to(node, {
          scale: 1.6,
          opacity: 0.3,
          duration: 1.4 + Math.random(),
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2,
          ease: 'sine.inOut'
        });
      }
    }
  });
}

/* ============================================
   FAQ
   ============================================ */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('is-open'));
      if (!open) item.classList.add('is-open');
    });
  });
}

/* ============================================
   PRICING TOGGLE
   ============================================ */
function initPricingToggle() {
  const toggle = document.querySelector('.pricing-toggle');
  if (!toggle) return;
  toggle.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      toggle.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const billing = btn.dataset.billing;
      document.querySelectorAll('.price-amount').forEach(amt => {
        const m = amt.dataset.monthly;
        const a = amt.dataset.annual;
        const target = billing === 'annual' ? a : m;
        const valEl = amt.querySelector('.value');
        if (!valEl || !target) return;
        // animate count
        const from = parseInt(valEl.textContent || '0', 10);
        const to = parseInt(target, 10);
        animateNumber(valEl, from, to, 600);
      });
      document.querySelectorAll('.price-billing').forEach(p => {
        p.textContent = billing === 'annual' ? 'Billed annually' : 'Billed monthly';
      });
    });
  });
}
function animateNumber(el, from, to, dur) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ============================================
   TWEAKS PANEL — host-driven
   ============================================ */
function initTweaksPanel() {
  const panel = document.querySelector('.tweaks-panel');
  if (!panel) return;

  // Set initial active states
  const t = getTweaks();
  panel.querySelectorAll('[data-tweak="theme"] button').forEach(b => b.classList.toggle('is-active', b.dataset.value === t.theme));
  panel.querySelectorAll('[data-tweak="accent"] button').forEach(b => b.classList.toggle('is-active', b.dataset.color === t.accent));
  panel.querySelectorAll('[data-tweak="anim"] button').forEach(b => b.classList.toggle('is-active', b.dataset.value === t.anim));

  panel.querySelectorAll('[data-tweak="theme"] button').forEach(b => {
    b.addEventListener('click', () => {
      panel.querySelectorAll('[data-tweak="theme"] button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      setTweak('theme', b.dataset.value);
    });
  });
  panel.querySelectorAll('[data-tweak="accent"] button').forEach(b => {
    b.addEventListener('click', () => {
      panel.querySelectorAll('[data-tweak="accent"] button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      setTweak('accent', b.dataset.color);
    });
  });
  panel.querySelectorAll('[data-tweak="anim"] button').forEach(b => {
    b.addEventListener('click', () => {
      panel.querySelectorAll('[data-tweak="anim"] button').forEach(x => x.classList.remove('is-active'));
      b.classList.add('is-active');
      setTweak('anim', b.dataset.value);
    });
  });

  // Close button
  const closeBtn = panel.querySelector('.tweaks-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('is-open');
      try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch {}
    });
  }

  // Listen for host activate/deactivate
  window.addEventListener('message', (e) => {
    if (!e.data || !e.data.type) return;
    if (e.data.type === '__activate_edit_mode') panel.classList.add('is-open');
    if (e.data.type === '__deactivate_edit_mode') panel.classList.remove('is-open');
  });

  // Announce availability AFTER listener wired
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}
}

/* ============================================
   SPOTLIGHT COMPONENT
   ============================================ */
function initSpotlight() {
  const triggers = document.querySelectorAll('.spotlight-trigger');
  const contents = document.querySelectorAll('.spotlight-content');
  const blob = document.querySelector('.spotlight-blob');
  
  if (!triggers.length) return;

  triggers.forEach(t => {
    t.addEventListener('mouseenter', () => {
      const idx = t.dataset.index;
      
      triggers.forEach(tr => tr.classList.remove('active'));
      t.classList.add('active');
      
      contents.forEach(c => {
        if(c.dataset.index === idx) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });

      // Move the ambient blob randomly to make it feel alive
      if(blob) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const scale = 0.8 + Math.random() * 0.5;
        blob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
      }
    });
  });
}
