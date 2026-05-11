(function() {
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
    if (!cursorGlow.classList.contains('active')) cursorGlow.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = 'a, button, .card, .skill-card, .contact-item, .filter-btn, .theme-cycle, .scroll-top, .project-row, .btn, .footer__top, .contacts-giant__letter';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) cursorRing.classList.add('cursor-ring--hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) cursorRing.classList.remove('cursor-ring--hover');
  });

  const particlesContainer = document.getElementById('clickParticles');
  document.addEventListener('click', e => {
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'click-particle';
      const angle = (Math.PI * 2 / 12) * i + (Math.random() - 0.5);
      const dist = 30 + Math.random() * 60;
      p.style.left = e.clientX + 'px';
      p.style.top = e.clientY + 'px';
      p.style.setProperty('--px', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--py', Math.sin(angle) * dist + 'px');
      particlesContainer.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  });

  const burger = document.getElementById('burger');
  const navMobile = document.getElementById('navMobile');
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');
  const scrollProgress = document.getElementById('scrollProgress');
  let lastScrollY = 0;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMobile.classList.toggle('open');
    document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
  });

  function smoothScrollTo(target) {
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  document.querySelectorAll('.nav__link, .nav__mobile-link, .footer__link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) smoothScrollTo(target);
      burger.classList.remove('active');
      navMobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    navbar.classList.toggle('scrolled', sy > 50);
    if (sy > lastScrollY && sy > 200) {
      navbar.classList.add('nav-hidden');
    } else {
      navbar.classList.remove('nav-hidden');
    }
    lastScrollY = sy;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (sy / docHeight) * 100 + '%';
    scrollTopBtn.classList.toggle('visible', sy > 400);
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const themes = ['void', 'terminal', 'blanc', 'neon', 'matrix'];
  const themeNames = ['VOID', 'TERMINAL', 'BLANC', 'NEON', 'MATRIX'];
  const themeCycle = document.getElementById('themeCycle');
  const themeName = document.getElementById('themeName');
  const saved = localStorage.getItem('theme') || 'void';
  let currentThemeIndex = themes.indexOf(saved);
  if (currentThemeIndex === -1) currentThemeIndex = 0;
  document.documentElement.setAttribute('data-theme', themes[currentThemeIndex]);
  themeName.textContent = themeNames[currentThemeIndex];

  themeCycle.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.documentElement.setAttribute('data-theme', themes[currentThemeIndex]);
    themeName.textContent = themeNames[currentThemeIndex];
    localStorage.setItem('theme', themes[currentThemeIndex]);
  });

  const words = ['UI/UX ДИЗАЙНЕР', 'ВЕБ-ДИЗАЙНЕР', 'ВЕРСТАЛЬЩИК', 'КРЕАТИВЩИК'];
  let wordIndex = 0, charIndex = 0, isDeleting = false;
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

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const statObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat__number').forEach(num => {
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

  document.querySelectorAll('.about-stats').forEach(stat => statObserver.observe(stat));

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

  document.querySelectorAll('.lazy-img').forEach(img => lazyObserver.observe(img));

  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectRows = document.querySelectorAll('.project-row');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectRows.forEach(row => {
        const tags = row.dataset.tags.split(',');
        row.classList.toggle('hidden', filter !== 'all' && !tags.includes(filter));
      });
    });
  });

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const original = btn.textContent;
    btn.textContent = '✓ ОТПРАВЛЕНО';
    btn.style.background = 'var(--green)';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      e.target.reset();
    }, 2500);
  });

  const terminalOverlay = document.getElementById('terminalOverlay');
  const terminalInput = document.getElementById('terminalInput');
  const terminalBody = document.getElementById('terminalBody');

  function terminalPrint(text) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="terminal-output">${text}</span>`;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function processCommand(cmd) {
    const c = cmd.trim().toLowerCase();
    if (!c) return;
    terminalPrint(`<span style="color:var(--accent)">visitor@portfolio:~$</span> ${cmd}`);
    switch(c) {
      case 'help':
        terminalPrint('Доступные команды: help, about, projects, contact, matrix, clear, exit');
        break;
      case 'about':
        terminalPrint('Я — начинающий веб-дизайнер. UI/UX, вёрстка, Figma, JS.');
        break;
      case 'projects':
        terminalPrint('1. NOVA — Creative Agency<br>2. SKYCAST — Weather App<br>3. PRISM — 3D Gallery');
        break;
      case 'contact':
        terminalPrint('Email: hello@example.com<br>Telegram: @yourhandle<br>GitHub: github.com/rrrr05');
        break;
      case 'matrix':
        document.documentElement.setAttribute('data-theme', 'matrix');
        themeName.textContent = 'MATRIX';
        currentThemeIndex = 4;
        terminalPrint('Theme → MATRIX');
        break;
      case 'clear':
        terminalBody.innerHTML = '';
        break;
      case 'exit':
        terminalOverlay.classList.remove('open');
        break;
      default:
        terminalPrint(`Команда не найдена: ${cmd}. Введите 'help'.`);
    }
  }

  document.addEventListener('keydown', e => {
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      terminalOverlay.classList.toggle('open');
      if (terminalOverlay.classList.contains('open')) {
        setTimeout(() => terminalInput.focus(), 100);
      }
    }
    if (e.key === 'Escape' && terminalOverlay.classList.contains('open')) {
      terminalOverlay.classList.remove('open');
    }
  });

  terminalInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      processCommand(terminalInput.value);
      terminalInput.value = '';
    }
  });

  const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIndex = 0;
  document.addEventListener('keydown', e => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        document.body.classList.add('konami-active');
        setTimeout(() => document.body.classList.remove('konami-active'), 5000);
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
})();
