(function() {
  const pageLoader = document.getElementById('pageLoader');
  const loaderCounter = document.getElementById('loaderCounter');
  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 15) + 5;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);
      setTimeout(() => pageLoader.classList.add('hidden'), 300);
    }
    loaderCounter.textContent = loadProgress + '%';
  }, 80);

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
    cursorGlow.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = 'a, button, .card, .skill-card, .contact-item, .filter-btn, .theme-toggle, .scroll-top';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursorRing.classList.add('cursor-ring--hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursorRing.classList.remove('cursor-ring--hover');
    }
  });

  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  const navMobile = document.getElementById('navMobile');
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');
  const scrollProgress = document.getElementById('scrollProgress');
  const themeToggle = document.getElementById('themeToggle');

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

  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) smoothScrollTo(target);
      burger.classList.remove('active');
      navMobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (window.scrollY / docHeight) * 100 + '%';
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  document.querySelectorAll('.section-header, .skill-card, .card, .about-grid, .contacts-grid, .contacts-intro, .contact-form').forEach((el, i) => {
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
          entry.target.querySelectorAll('.skill-bar__fill').forEach(fill => {
            fill.style.width = fill.dataset.width + '%';
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.skills-grid').forEach(grid => skillObserver.observe(grid));

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
  const projectCards = document.querySelectorAll('.card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const tags = card.dataset.tags.split(',');
        card.classList.toggle('hidden', filter !== 'all' && !tags.includes(filter));
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
})();
