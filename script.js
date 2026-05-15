// ── TOUCH DETECTION ──────────────────────────────────────
const isTouch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;

// ── CUSTOM CURSOR ────────────────────────────────────────
if (!isTouch) {
  const cursorDot  = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursorDot.className  = 'cursor-dot';
  cursorRing.className = 'cursor-ring';
  document.body.append(cursorDot, cursorRing);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.transform = `translate(${mx}px,${my}px)`;
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a,button,.service-card,.work-card,.faq-q,.svc-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-ring--hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-ring--hover'));
  });
}

// ── CLICK SPARKS ─────────────────────────────────────────
const SPARK_COLORS = ['#FF2D78','#00F5D4','#B026FF','#ffffff'];
document.addEventListener('click', e => {
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    const angle = (i / 10) * Math.PI * 2;
    const dist  = 40 + Math.random() * 40;
    s.style.cssText = `
      left:${e.clientX}px;
      top:${e.clientY}px;
      --tx:${Math.cos(angle) * dist}px;
      --ty:${Math.sin(angle) * dist}px;
      background:${SPARK_COLORS[i % SPARK_COLORS.length]};
      box-shadow:0 0 6px ${SPARK_COLORS[i % SPARK_COLORS.length]};
    `;
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
});

// ── SCROLL PROGRESS + BACK TO TOP ───────────────────────
const nav          = document.getElementById('nav');
const scrollBar    = document.getElementById('scrollProgress');
const backTop      = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;

  scrollBar.style.width = pct + '%';
  nav.classList.toggle('scrolled', scrolled > 40);
  backTop.classList.toggle('visible', scrolled > 400);
}, { passive: true });

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── COUNTER ANIMATION ───────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const statNums = document.querySelectorAll('.stat-num[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObserver.observe(el));

// ── SCROLL REVEAL ────────────────────────────────────────
(function initReveal() {
  const groups = [
    { sel: '.section .label',  stagger: 0   },
    { sel: '.section h2',      stagger: 0   },
    { sel: '.service-card',    stagger: 85  },
    { sel: '.step',            stagger: 130 },
    { sel: '.work-card',       stagger: 110 },
    { sel: '.stat',            stagger: 100 },
    { sel: '.contact-sub',     stagger: 0   },
    { sel: '.contact-links',   stagger: 0   },
  ];

  groups.forEach(({ sel, stagger }) => {
    const els = [...document.querySelectorAll(sel)];
    // group by direct parent so stagger resets per section
    const byParent = els.reduce((map, el) => {
      const key = el.parentElement;
      (map.get(key) || map.set(key, []).get(key)).push(el);
      return map;
    }, new Map());

    byParent.forEach(siblings => {
      siblings.forEach((el, i) => {
        el.setAttribute('data-reveal', '');
        if (stagger && i > 0) el.style.setProperty('--reveal-delay', `${i * stagger}ms`);
      });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
})();

// ── MAGNETIC BUTTONS ────────────────────────────────────
document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width  / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ── GRADIENT TEXT ON H1 ──────────────────────────────────
const h1Pink = document.querySelector('.h1-pink');
if (h1Pink) {
  h1Pink.style.cssText += `
    background: linear-gradient(135deg, #FF2D78 0%, #FF6B9D 50%, #FF2D78 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 4s linear infinite;
  `;
}
const h1Cyan = document.querySelector('.h1-cyan');
if (h1Cyan) {
  h1Cyan.style.cssText += `
    background: linear-gradient(135deg, #00F5D4 0%, #00C4AA 50%, #00F5D4 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 5s linear infinite reverse;
  `;
}

// ── MARQUEE ──────────────────────────────────────────────
function initMarquees() {
  document.querySelectorAll('.marquee-track').forEach(track => {
    const half = track.scrollWidth / 2;
    track.style.setProperty('--mq-half', `-${half}px`);
  });
}
document.fonts.ready.then(initMarquees);

// ── HAMBURGER MENU ───────────────────────────────────────
const burger    = document.getElementById('navBurger');
const mobileNav = document.getElementById('navMobile');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('is-open');
    mobileNav.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}


// ── SERVICE SELECTOR ─────────────────────────────────────
document.querySelectorAll('.svc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const isActive = btn.classList.contains('active');
    document.querySelectorAll('.svc-btn').forEach(b => b.classList.remove('active'));
    if (!isActive) {
      btn.classList.add('active');
      document.getElementById('cf-service-val').value = btn.dataset.value;
    } else {
      document.getElementById('cf-service-val').value = '';
    }
  });
});
