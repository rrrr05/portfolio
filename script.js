const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');
const scrollProgress = document.getElementById('scrollProgress');
const cursorGlow = document.getElementById('cursorGlow');
const themeToggle = document.getElementById('themeToggle');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    burger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 50;
  navbar.classList.toggle('scrolled', scrolled);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / docHeight) * 100;
  scrollProgress.style.width = progress + '%';

  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
  cursorGlow.classList.add('active');
});

document.addEventListener('mouseleave', () => {
  cursorGlow.classList.remove('active');
});

const saved = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', saved);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

const words = ['Веб-дизайнер', 'UI/UX дизайнер', 'Верстальщик', 'Креативщик'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typed = document.getElementById('typed');

function typeEffect() {
  const current = words[wordIndex];
  typed.textContent = current.substring(0, charIndex);

  if (!isDeleting) {
    charIndex++;
    if (charIndex > current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
  } else {
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typeEffect, isDeleting ? 40 : 80);
}

typeEffect();

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x -= (dx / dist) * force * 1.5;
        this.y -= (dy / dist) * force * 1.5;
      }
    }

    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const color = isLight ? `rgba(124, 58, 237, ${this.opacity * 0.6})` : `rgba(139, 92, 246, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

const count = Math.min(80, Math.floor(window.innerWidth / 15));
for (let i = 0; i < count; i++) {
  particles.push(new Particle());
}

function drawLines() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const alpha = isLight ? 0.04 * (1 - dist / 140) : 0.06 * (1 - dist / 140);
        const color = isLight ? `rgba(124, 58, 237, ${alpha})` : `rgba(139, 92, 246, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  drawLines();
  requestAnimationFrame(animateParticles);
}

animateParticles();

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.section-header, .skill-card, .project-card, .about-grid, .contacts-grid, .contacts-intro, .contact-form').forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 4 === 1) el.classList.add('reveal-delay-1');
  if (i % 4 === 2) el.classList.add('reveal-delay-2');
  if (i % 4 === 3) el.classList.add('reveal-delay-3');
  revealObserver.observe(el);
});

const skillObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          fill.style.width = fill.dataset.width + '%';
        });
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skills-grid').forEach(grid => {
  skillObserver.observe(grid);
});

const statObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(num => {
          const target = parseInt(num.dataset.target);
          let current = 0;
          const increment = target / 30;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              num.textContent = target;
              clearInterval(timer);
            } else {
              num.textContent = Math.floor(current);
            }
          }, 40);
        });
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.about-stats').forEach(stat => {
  statObserver.observe(stat);
});

const lazyObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.onload = () => img.classList.add('loaded');
        lazyObserver.unobserve(img);
      }
    });
  },
  { rootMargin: '200px' }
);

document.querySelectorAll('.lazy-img').forEach(img => {
  lazyObserver.observe(img);
});

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const tags = card.dataset.tags.split(',');
      if (filter === 'all' || tags.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const original = btn.textContent;
  btn.textContent = 'Отправлено ✓';
  btn.style.background = 'var(--green)';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    e.target.reset();
  }, 2500);
});
