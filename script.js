(() => {
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = qs('#siteHeader');
  const nav = qs('#mainNav');
  const menuToggle = qs('#menuToggle');
  const navLinks = qsa('.main-nav a');
  const watchWrap = qs('#watchWrap');
  const heroVisual = qs('#heroVisual');
  const cursorGlow = qs('.cursor-glow');

  qs('#year').textContent = new Date().getFullYear();

  const closeMenu = () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }, { passive: true });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });

  qsa('.reveal').forEach(el => revealObserver.observe(el));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
    });
  }, { rootMargin: '-45% 0px -48% 0px', threshold: 0 });

  qsa('main > section[id]').forEach(section => sectionObserver.observe(section));

  if (!reducedMotion && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
      cursorGlow.style.opacity = '1';
    });

    heroVisual.addEventListener('pointermove', (event) => {
      const box = heroVisual.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      watchWrap.style.transform = `rotateY(${x * -10}deg) rotateX(${y * 7}deg) translate3d(${x * 10}px, ${y * 8}px, 0)`;
    });

    heroVisual.addEventListener('pointerleave', () => {
      watchWrap.style.transform = 'rotateY(0) rotateX(0) translate3d(0,0,0)';
    });

    qsa('.magnetic').forEach(button => {
      button.addEventListener('pointermove', (event) => {
        const box = button.getBoundingClientRect();
        const x = event.clientX - box.left - box.width / 2;
        const y = event.clientY - box.top - box.height / 2;
        button.style.transform = `translate(${x * 0.13}px, ${y * 0.13}px)`;
      });
      button.addEventListener('pointerleave', () => button.style.transform = 'translate(0,0)');
    });
  }

  let lastScrollY = window.scrollY;
  let ticking = false;
  const applyScrollMotion = () => {
    if (!reducedMotion) {
      const heroRect = qs('#home').getBoundingClientRect();
      if (heroRect.bottom > 0) {
        const progress = Math.min(Math.max(-heroRect.top / heroRect.height, 0), 1);
        watchWrap.style.marginTop = `${progress * 28}px`;
      }
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(applyScrollMotion);
      ticking = true;
    }
  }, { passive: true });

  const customShell = qs('#customWatchShell');
  const caseLabel = qs('#caseLabel');
  const strapLabel = qs('#strapLabel');
  const customIndex = qs('#customIndex');
  let selectionCount = 1;

  qsa('.swatch').forEach(button => {
    button.addEventListener('click', () => {
      qsa('.swatch').forEach(item => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
      customShell.dataset.case = button.dataset.case;
      caseLabel.textContent = button.dataset.label;
      selectionCount = selectionCount % 3 + 1;
      customIndex.textContent = String(selectionCount).padStart(2, '0');
      customShell.animate([
        { transform: 'rotateY(-8deg) rotateX(2deg) scale(.97)' },
        { transform: 'rotateY(4deg) rotateX(0deg) scale(1.02)' },
        { transform: 'rotateY(-8deg) rotateX(2deg) scale(1)' }
      ], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
  });

  qsa('.strap-option').forEach(button => {
    button.addEventListener('click', () => {
      qsa('.strap-option').forEach(item => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
      customShell.dataset.strap = button.dataset.strap;
      strapLabel.textContent = button.dataset.label;
      customShell.animate([
        { transform: 'rotateY(-8deg) rotateX(2deg) translateY(0)' },
        { transform: 'rotateY(-15deg) rotateX(3deg) translateY(-10px)' },
        { transform: 'rotateY(-8deg) rotateX(2deg) translateY(0)' }
      ], { duration: 620, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
  });

  const interestForm = qs('#interestForm');
  const formMessage = qs('#formMessage');
  interestForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = new FormData(interestForm).get('email');
    formMessage.textContent = `شكرًا لك — تم تسجيل ${email} ضمن قائمة الاهتمام التجريبية.`;
    interestForm.reset();
  });

  const modal = qs('#experienceModal');
  const openModal = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    qs('#modalClose').focus();
  };
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    qs('#experienceBtn').focus();
  };
  qs('#experienceBtn').addEventListener('click', openModal);
  qs('#modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();
