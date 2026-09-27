

'use strict';

// Navbar and page state setup
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page starts scrolled

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const page = href.split('/').pop();

    if (
      (currentPage === 'index.html' || currentPage === '') && (page === 'index.html' || page === '' || href === '#') ||
      (page !== '' && page !== '#' && currentPage === page)
    ) {
      link.classList.add('active');
    }
  });
})();

// Mobile navigation toggle
(function initMobileMenu() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });
})();

// Reveal sections on scroll
(function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
  );

  elements.forEach(el => observer.observe(el));

  // Fallback: make any element already in the viewport visible immediately
  // (handles elements at the top of the page on first load)
  function revealVisible() {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }

  // Run once right away and again after a short delay for slow renders
  revealVisible();
  setTimeout(revealVisible, 200);
})();

// Smooth anchor scrolling
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '76'
      );
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();





(function initContactForm() {
  const form      = document.getElementById('contactForm');
  if (!form) return;

  const notice    = document.getElementById('formNotice');
  const submitBtn = form.querySelector('[type="submit"]');

  // The church email address — update this to the real address
  const CHURCH_EMAIL = 'info@divinecovenant.org';

  // ── helpers ──────────────────────────────────────────────────────
  function showNotice(msg, isError) {
    if (!notice) return;
    notice.textContent       = msg;
    notice.style.color       = isError ? '#e53e3e' : 'var(--gold-dark)';
    notice.style.background  = isError ? 'rgba(229,62,62,0.08)' : 'rgba(245,184,46,0.10)';
    notice.style.borderColor = isError ? '#e53e3e' : 'var(--gold)';
    notice.style.display     = 'block';
    notice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideNotice() {
    if (notice) notice.style.display = 'none';
  }

  // ── validation ───────────────────────────────────────────────────
  function validate() {
    const required = [
      form.querySelector('[name="name"]'),
      form.querySelector('[name="email"]'),
      form.querySelector('[name="message"]'),
    ];
    let valid = true;

    required.forEach(field => {
      if (!field) return;
      if (!field.value.trim()) {
        field.style.borderColor = '#e53e3e';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    const emailField = form.querySelector('[name="email"]');
    if (emailField && emailField.value.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
      emailField.style.borderColor = '#e53e3e';
      valid = false;
    }

    return valid;
  }

  // ── submit — opens the user's mail app with a pre-filled template ─
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideNotice();

    if (!validate()) {
      showNotice('Please fill in all required fields correctly.', true);
      return;
    }

    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const phoneEl = form.querySelector('[name="phone"]');
    const phone   = phoneEl ? phoneEl.value.trim() : '';
    const subjEl  = form.querySelector('[name="subject"]');
    const subject = subjEl ? subjEl.value.trim() || 'General Enquiry' : 'General Enquiry';
    const message = form.querySelector('[name="message"]').value.trim();

    // ── Email body template ─────────────────────────────────────────
    const body =
`────────────────────────────────
NEW MESSAGE — Divine Covenant RCCG Website
────────────────────────────────

Name:     ${name}
Email:    ${email}
Phone:    ${phone || 'Not provided'}
Subject:  ${subject}

Message:
─────────────────────────────────
${message}
─────────────────────────────────

This message was sent via the contact form on the Divine Covenant RCCG website.
To reply, email: ${email}`;

    const subjectLine = `[Website] ${subject} — ${name}`;

    // Open the user's default mail app with everything pre-filled
    window.location.href =
      `mailto:${CHURCH_EMAIL}` +
      `?subject=${encodeURIComponent(subjectLine)}` +
      `&body=${encodeURIComponent(body)}`;

    // Show a confirmation so the user knows something happened
    showNotice(
      '✅ Your mail app is opening with your message ready to send. ' +
      'Just hit Send in your email client!',
      false
    );

    // Reset form after a short delay so the notice is readable first
    setTimeout(() => { form.reset(); }, 1500);
  });

  // Clear red borders as the user types
  form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
})();



(function initPlanVisitModal() {
  const openBtns  = document.querySelectorAll('[data-modal="plan-visit"]');
  const modal     = document.getElementById('planVisitModal');
  const closeBtn  = document.getElementById('closeModal');
  const overlay   = document.getElementById('modalOverlay');

  if (!modal || !openBtns.length) return;

  function openModal() {
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden';

    const firstFocusable = modal.querySelector('input, button, a, textarea, select');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay)  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });
})();



(function updateYear() {
  const yearEls = document.querySelectorAll('.js-year');
  const year    = new Date().getFullYear();
  yearEls.forEach(el => { el.textContent = year; });
})();
