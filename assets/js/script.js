'use strict';

/* ===========================
   SCROLL PROGRESS BAR
   =========================== */

const scrollProgressBar = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgressBar.style.width = scrolled + '%';
});

/* ===========================
   NAVIGATION FUNCTIONALITY
   =========================== */

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const hasMobileMenu = Boolean(hamburger && navMenu);

const setMenuState = isOpen => {
  if (!hasMobileMenu) return;

  navMenu.classList.toggle('active', isOpen);
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
};

// Smooth scroll navigation
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    }

    // Close mobile menu if open
    if (hasMobileMenu && navMenu.classList.contains('active')) {
      setMenuState(false);
    }
  });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

/* ===========================
   MOBILE MENU TOGGLE
   =========================== */

if (hasMobileMenu) {
  setMenuState(false);

  hamburger.addEventListener('click', () => {
    const shouldOpen = !navMenu.classList.contains('active');
    setMenuState(shouldOpen);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      setMenuState(false);
      hamburger.focus();
    }
  });
}

/* ===========================
   HERO TEXT GLOW TRAIL
   =========================== */

const heroSectionEl = document.querySelector('.hero');
const heroText = document.querySelector('.hero-text');

const glowHandler = (() => {
  let glowFadeTimeout;

  const updateGlow = (event, element, opacityProp) => {
    const rect = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));

    element.style.setProperty('--cursor-x', `${x}%`);
    element.style.setProperty('--cursor-y', `${y}%`);
    const targetOpacity = opacityProp === '--hero-glow-opacity' ? '0.55' : '0.7';
    element.style.setProperty(opacityProp, targetOpacity);

    clearTimeout(glowFadeTimeout);
    glowFadeTimeout = setTimeout(() => {
      element.style.setProperty(opacityProp, '0');
    }, 220);
  };

  return { updateGlow };
})();

if (heroSectionEl) {
  const handleMove = event => {
    const pointerEvent = event.type === 'mousemove' ? event : event;
    glowHandler.updateGlow(pointerEvent, heroSectionEl, '--hero-glow-opacity');
    if (heroText) {
      glowHandler.updateGlow(pointerEvent, heroText, '--glow-opacity');
    }
  };

  const handleLeave = () => {
    heroSectionEl.style.setProperty('--hero-glow-opacity', '0');
    if (heroText) {
      heroText.style.setProperty('--glow-opacity', '0');
    }
  };

  heroSectionEl.addEventListener('pointermove', handleMove);
  heroSectionEl.addEventListener('mousemove', handleMove);
  heroSectionEl.addEventListener('pointerleave', handleLeave);
  heroSectionEl.addEventListener('mouseleave', handleLeave);
} else if (heroText) {
  const handleMove = event => glowHandler.updateGlow(event, heroText, '--glow-opacity');
  heroText.addEventListener('pointermove', handleMove);
  heroText.addEventListener('mousemove', handleMove);
  const handleLeave = () => heroText.style.setProperty('--glow-opacity', '0');
  heroText.addEventListener('pointerleave', handleLeave);
  heroText.addEventListener('mouseleave', handleLeave);
}

/* ===========================
   PORTFOLIO FILTER
   =========================== */

const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const FILTER_ENTER_CLASS = 'filter-enter';
const FILTER_EXIT_CLASS = 'filter-exit';

const clearAnimationState = card => {
  card.classList.remove(FILTER_ENTER_CLASS);
  card.classList.remove(FILTER_EXIT_CLASS);
};

const animateIn = card => {
  clearAnimationState(card);
  card.style.display = 'block';
  card.dataset.filterVisibility = 'visible';
  requestAnimationFrame(() => {
    card.classList.add(FILTER_ENTER_CLASS);
  });
  const handleEnd = event => {
    if (event.animationName === 'filterFadeIn') {
      card.classList.remove(FILTER_ENTER_CLASS);
      card.removeEventListener('animationend', handleEnd);
    }
  };
  card.addEventListener('animationend', handleEnd);
};

const animateOut = card => {
  if (window.getComputedStyle(card).display === 'none') {
    return;
  }

  clearAnimationState(card);
  card.classList.add(FILTER_EXIT_CLASS);
  card.dataset.filterVisibility = 'hidden';
  const handleEnd = event => {
    if (event.animationName === 'filterFadeOut' && card.dataset.filterVisibility === 'hidden') {
      card.style.display = 'none';
      card.classList.remove(FILTER_EXIT_CLASS);
      card.removeEventListener('animationend', handleEnd);
    }
  };
  card.addEventListener('animationend', handleEnd);
};

filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const filterValue = this.getAttribute('data-filter');

    portfolioCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (cardCategory === 'journey') {
        clearAnimationState(card);
        card.style.display = 'block';
        card.dataset.filterVisibility = 'visible';
        return;
      }

      const shouldShow = filterValue === 'all' || cardCategory === filterValue;

      if (shouldShow) {
        animateIn(card);
      } else {
        animateOut(card);
      }
    });
  });
});

/* ===========================
   SCROLL REVEAL ANIMATIONS
   =========================== */

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(
  '.service-card, .tech-item, .skill-bar, .timeline-item, .journey-card, .portfolio-card, .contact-item'
);

animateElements.forEach(el => {
  observer.observe(el);
});

/* ===========================
   JOURNEY MODAL
   =========================== */

const journeyModal = document.getElementById('journey-modal');
const journeyModalDialog = journeyModal ? journeyModal.querySelector('.journey-modal-dialog') : null;
const journeyModalTitle = journeyModal ? journeyModal.querySelector('#journey-modal-title') : null;
const journeyModalIntro = journeyModal ? journeyModal.querySelector('#journey-modal-intro') : null;
const journeyModalList = journeyModal ? journeyModal.querySelector('#journey-modal-list') : null;
const journeyModalTags = journeyModal ? journeyModal.querySelector('#journey-modal-tags') : null;
const journeyModalBadge = journeyModal ? journeyModal.querySelector('#journey-modal-badge') : null;
const journeyModalDate = journeyModal ? journeyModal.querySelector('#journey-modal-date') : null;
const journeyModalCloseBtns = journeyModal ? journeyModal.querySelectorAll('[data-journey-close]') : [];
let journeyLastFocusedElement = null;

const setModalOpenState = isOpen => {
  if (!journeyModal) return;
  journeyModal.classList.toggle('is-open', isOpen);
  journeyModal.setAttribute('aria-hidden', String(!isOpen));
  document.body.classList.toggle('modal-open', isOpen);
};

const closeJourneyModal = () => {
  if (!journeyModal) return;
  setModalOpenState(false);
  if (journeyLastFocusedElement) {
    journeyLastFocusedElement.focus({ preventScroll: true });
    journeyLastFocusedElement = null;
  }
};

const openJourneyModal = card => {
  if (!journeyModal || !journeyModalDialog) return;
  const modalData = card.querySelector('.journey-modal-data');
  if (!modalData) return;

  journeyLastFocusedElement = document.activeElement;

  const badgeEl = card.querySelector('.journey-badge');
  const dateEl = card.querySelector('.journey-date');
  const titleEl = card.querySelector('.journey-title');
  const summaryEl = modalData.querySelector('p');
  const listEl = modalData.querySelector('ul');

  if (journeyModalBadge && badgeEl) {
    journeyModalBadge.className = 'journey-modal-badge';
    badgeEl.classList.forEach(cls => {
      if (cls.startsWith('journey-badge-')) {
        journeyModalBadge.classList.add(cls);
      }
    });
    journeyModalBadge.innerHTML = badgeEl.innerHTML;
  }

  if (journeyModalDate && dateEl) {
    journeyModalDate.textContent = dateEl.textContent;
  }

  if (journeyModalTitle && titleEl) {
    journeyModalTitle.textContent = titleEl.textContent.trim();
  }

  if (journeyModalIntro) {
    journeyModalIntro.textContent = summaryEl ? summaryEl.textContent.trim() : '';
  }

  if (journeyModalList) {
    journeyModalList.innerHTML = '';
    if (listEl) {
      listEl.querySelectorAll('li').forEach(li => {
        const clone = document.createElement('li');
        clone.innerHTML = li.innerHTML;
        journeyModalList.appendChild(clone);
      });
    }
  }

  if (journeyModalTags) {
    journeyModalTags.innerHTML = '';
    const tags = card.querySelectorAll('.journey-tags .tag');
    tags.forEach(tag => {
      const clone = tag.cloneNode(true);
      journeyModalTags.appendChild(clone);
    });
  }

  setModalOpenState(true);
  setTimeout(() => {
    const closeBtn = journeyModal.querySelector('.journey-modal-close');
    closeBtn?.focus({ preventScroll: true });
  }, 0);
};

const journeyCards = document.querySelectorAll('.journey-card');
journeyCards.forEach(card => {
  card.addEventListener('click', () => openJourneyModal(card));
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openJourneyModal(card);
    }
  });
});

journeyModalCloseBtns.forEach(btn => {
  btn.addEventListener('click', closeJourneyModal);
});

if (journeyModal) {
  journeyModal.addEventListener('click', event => {
    if (event.target === journeyModal || event.target.classList.contains('journey-modal-backdrop')) {
      closeJourneyModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && journeyModal.classList.contains('is-open')) {
      closeJourneyModal();
    }
  });
}

/* ===========================
   FORM HANDLING
   =========================== */

/* ===========================
   HAMBURGER MENU STYLES
   =========================== */

// Add mobile menu styles dynamically
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 768px) {
    .nav-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      display: flex;
      background: var(--navbar-bg);
      box-shadow: var(--shadow-navbar);
      backdrop-filter: blur(12px);
      flex-direction: column;
      padding: 2rem 1rem;
      gap: 1rem;
      border-top: 1px solid var(--border-color);
      max-height: 0;
      overflow: hidden;
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      transition: max-height 0.3s ease, opacity 0.25s ease;
    }

    .nav-menu.active {
      max-height: 400px;
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
    }

    .nav-link {
      padding: 0.75rem 0;
      display: block;
    }
  }
`;
document.head.appendChild(style);

/* ===========================
   SMOOTH SCROLL BEHAVIOR
   =========================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');

    // Skip if it's just # or if it's a nav link (already handled)
    if (href === '#' || this.classList.contains('nav-link')) return;

    e.preventDefault();

    const target = document.querySelector(href);
    if (target) {
      const offsetTop = target.offsetTop - 80; // Account for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

/* ===========================
   SKILL BARS ANIMATION
   =========================== */

const skillBars = document.querySelectorAll('.progress-bar');

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressBar = entry.target.querySelector('.progress');
      const width = progressBar.style.width;
      progressBar.style.width = '0';
      setTimeout(() => {
        progressBar.style.width = width;
      }, 100);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

/* ===========================
   PAGE LOAD ANIMATIONS
   =========================== */

window.addEventListener('load', () => {
  // Animate hero section on load
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.classList.add('animate');
  }
});

/* ===========================
   SCROLL TO TOP FUNCTIONALITY
   =========================== */

const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add('show');
  } else {
    scrollToTopBtn.classList.remove('show');
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* ===========================
   PROJECT MODAL FUNCTIONALITY
   =========================== */

const projectData = {
  askcoco: {
    title: 'AI-Powered Browser Assistant Extension',
    description: 'Tackled the challenge of integrating AI-powered text analysis directly into the browser. This required deep understanding of Chrome Extension architecture, DOM manipulation, and seamless communication between content scripts and background workers. The solution enables users to access intelligent text processing without leaving their workflow.',
    highlights: [
      'Solved Chrome Extension architecture challenges with manifest configuration',
      'Implemented secure DOM manipulation for content detection and interaction',
      'Built efficient API communication layer with external AI services',
      'Designed responsive UI for real-time user interaction',
      'Optimized extension performance to minimize browser impact',
      'Ensured data privacy and secure communication protocols'
    ]
  },
  barbershop: {
    title: 'Barbershop63 Progressive Web App',
    description: 'Developed a full booking experience for a local barbershop that keeps working even when clients drop offline. The goal was to replace manual scheduling with a seamless, mobile-first app that syncs appointments, staff availability, and notifications across devices.',
    highlights: [
      'Implemented installable PWA with precaching and runtime caching strategies',
      'Designed admin dashboard for managing barbers, services, and availability',
      'Built customer booking flow with time-slot validation and reminders integration',
      'Shipped responsive UI that adapts to kiosk, tablet, and mobile usage',
      'Added light/dark theme support that maps to the brand palette dynamically',
      'Instrumented analytics to monitor retention and peak booking hours'
    ]
  },
  sally: {
    title: 'Real-Time Data Processing Platform',
    description: 'Solved the complex problem of processing and synchronizing conversation data from multiple sources in real-time. This involved designing a robust pipeline that handles data transformation, validation, and external service integration while maintaining data consistency and high performance.',
    highlights: [
      'Architected real-time data processing pipeline from ground up',
      'Implemented bidirectional service integration with data validation',
      'Optimized JSON transformation to reduce processing overhead',
      'Built resilient error handling and automatic retry mechanisms',
      'Designed efficient database indexing for sub-second queries',
      'Created REST API endpoints with proper authentication and rate limiting'
    ]
  },
  pdfsearch: {
    title: 'Document Search and Retrieval System',
    description: 'Addressed the need for fast and accurate document searching across large collections. The solution required implementing advanced parsing techniques, building efficient indexing strategies, and creating an intuitive interface that balances powerful search capabilities with user-friendly design.',
    highlights: [
      'Engineered robust document parsing supporting multiple file formats',
      'Implemented full-text search with advanced query syntax',
      'Built inverted index for millisecond-level search performance',
      'Designed clean, accessible user interface for search and results',
      'Handled encoding complexities and format variations seamlessly',
      'Architected scalable Laravel backend for concurrent users'
    ]
  },
  encrypt: {
    title: 'Secure Data Integration System',
    description: 'Engineered a data integration platform for handling sensitive information with strict compliance requirements. The solution required designing a secure architecture, implementing efficient data transformation pipelines, and ensuring real-time processing capabilities while maintaining data integrity and security standards.',
    highlights: [
      'Designed relational data models using graph database principles',
      'Implemented streaming infrastructure for real-time data synchronization',
      'Built secure data transformation pipeline with validation layers',
      'Integrated specialized file format processing with error recovery',
      'Implemented encryption and secure credential management',
      'Optimized data flow architecture for low-latency requirements',
      'Built comprehensive monitoring and audit logging system'
    ]
  }
};

const projectModal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
const modalOverlay = document.getElementById('modal-overlay');
const modalTriggers = document.querySelectorAll('.portfolio-modal-trigger');

// Open modal when clicking on project
modalTriggers.forEach(trigger => {
  trigger.addEventListener('click', function(e) {
    e.preventDefault();
    const projectId = this.getAttribute('data-project');
    const data = projectData[projectId];

    if (data) {
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-description').textContent = data.description;

      const highlightsList = document.getElementById('modal-highlights');
      highlightsList.innerHTML = '';
      data.highlights.forEach(highlight => {
        const li = document.createElement('li');
        li.textContent = highlight;
        highlightsList.appendChild(li);
      });

      if (projectModal) {
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });
});

// Close modal
function closeModal() {
  if (!projectModal) return;
  projectModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', closeModal);
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
    closeModal();
  }
});

/* ===========================
   PARALLAX EFFECT
   =========================== */

const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
  if (!heroSection) return;

  const scrolled = window.pageYOffset;

  if (scrolled < window.innerHeight) {
    // Parallax effect for hero background
    heroSection.style.backgroundPosition = `center ${scrolled * 0.5}px`;
  }
});

/* ===========================
   INTERSECTION OBSERVER FOR ANIMATIONS
   =========================== */

const revealOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

// Apply to cards for staggered animations
document.querySelectorAll('.service-card, .highlight-card, .tech-item, .skill-bar, .timeline-item, .portfolio-card').forEach(el => {
  revealOnScroll.observe(el);
});

/* ===========================
   SECTION REVEAL ON SCROLL
   =========================== */

const sectionRevealOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const sectionReveal = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, sectionRevealOptions);

// Observe all sections except hero
document.querySelectorAll('section:not(#hero)').forEach(section => {
  sectionReveal.observe(section);
});

// Make all sections visible by adding in-view class after a short delay
// This ensures animations trigger even if user doesn't scroll
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('section:not(#hero)').forEach(section => {
      section.classList.add('in-view');
    });
  }, 100);
});

/* ===========================
   CTA BANNER
   =========================== */

const ctaBanner = document.getElementById('cta-banner');
const ctaClose = document.getElementById('cta-close');
let ctaShown = false;

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  // Show CTA banner after scrolling 30% down the page
  const showCTAAt = document.documentElement.scrollHeight * 0.3;

  if (scrollTop > showCTAAt && !ctaShown) {
    ctaBanner.classList.add('show');
    ctaShown = true;
  } else if (scrollTop < showCTAAt && ctaShown) {
    ctaBanner.classList.remove('show');
    ctaShown = false;
  }
});

ctaClose.addEventListener('click', () => {
  ctaBanner.classList.remove('show');
  // Don't show again until next page visit
  localStorage.setItem('ctaClosed', 'true');
});

// Check if CTA was closed
if (localStorage.getItem('ctaClosed') === 'true') {
  ctaShown = true; // Prevent showing during this visit
}

// Reset CTA closed state on page reload
window.addEventListener('beforeunload', () => {
  localStorage.removeItem('ctaClosed');
});

/* ===========================
   DARK MODE TOGGLE
   =========================== */

function setupThemeToggle() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');

  if (!darkModeToggle) {
    console.error('Theme toggle button not found');
    return;
  }

  function updateThemeIcon() {
    const icon = darkModeToggle.querySelector('ion-icon');
    if (!icon) return;

    if (document.documentElement.classList.contains('white-theme')) {
      icon.setAttribute('name', 'sunny-outline');
    } else {
      icon.setAttribute('name', 'moon-outline');
    }
  }

  // Load saved theme preference (dark or white)
  let currentThemeMode = localStorage.getItem('themeMode') || 'dark';

  if (currentThemeMode === 'white') {
    document.documentElement.classList.add('white-theme');
  }
  updateThemeIcon();

  // Add click event listener
  darkModeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    currentThemeMode = currentThemeMode === 'dark' ? 'white' : 'dark';

    if (currentThemeMode === 'white') {
      document.documentElement.classList.add('white-theme');
    } else {
      document.documentElement.classList.remove('white-theme');
    }

    localStorage.setItem('themeMode', currentThemeMode);
    updateThemeIcon();
  });
}

// Wait for DOM to be fully ready, then setup theme toggle
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupThemeToggle);
} else {
  setupThemeToggle();
}

/* ===========================
   FORM VALIDATION
   =========================== */

const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const formSuccess = document.getElementById('form-success');
const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
let formMessageTimeout;

// Real-time validation
nameInput.addEventListener('blur', () => {
  const error = document.getElementById('name-error');
  if (nameInput.value.trim() === '') {
    error.classList.add('show');
  } else {
    error.classList.remove('show');
  }
});

emailInput.addEventListener('blur', () => {
  const error = document.getElementById('email-error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    error.classList.add('show');
  } else {
    error.classList.remove('show');
  }
});

messageInput.addEventListener('blur', () => {
  const error = document.getElementById('message-error');
  if (messageInput.value.trim() === '') {
    error.classList.add('show');
  } else {
    error.classList.remove('show');
  }
});

const showFormMessage = (translationKey, type = 'success') => {
  if (!formSuccess) return;
  if (formMessageTimeout) {
    clearTimeout(formMessageTimeout);
    formMessageTimeout = null;
  }

  const message =
    (translations[currentLang] && translations[currentLang][translationKey]) ||
    (translations.en && translations.en[translationKey]) ||
    '';

  formSuccess.textContent = message;
  formSuccess.classList.toggle('error', type === 'error');
  formSuccess.classList.add('show');

  formMessageTimeout = setTimeout(() => {
    formSuccess.classList.remove('show');
    formSuccess.classList.remove('error');
    formMessageTimeout = null;
  }, 5000);
};

const encodeFormData = formData =>
  [...formData.entries()]
    .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
    .join('&');

// Form submission
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate all fields
  let isValid = true;
  const errors = {
    name: document.getElementById('name-error'),
    email: document.getElementById('email-error'),
    message: document.getElementById('message-error')
  };

  // Name validation
  if (nameInput.value.trim() === '') {
    errors.name.classList.add('show');
    isValid = false;
  } else {
    errors.name.classList.remove('show');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    errors.email.classList.add('show');
    isValid = false;
  } else {
    errors.email.classList.remove('show');
  }

  // Message validation
  if (messageInput.value.trim() === '') {
    errors.message.classList.add('show');
    isValid = false;
  } else {
    errors.message.classList.remove('show');
  }

  // If valid, submit to Netlify
  if (isValid) {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add('is-loading');
    }

    const formData = new FormData(contactForm);
    if (!formData.has('form-name')) {
      formData.append('form-name', 'contact');
    }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormData(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        contactForm.reset();
        showFormMessage('contact.form.success', 'success');
      })
      .catch(() => {
        showFormMessage('contact.form.error', 'error');
      })
      .finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove('is-loading');
        }
      });
  }
});

/* ===========================
   LANGUAGE TOGGLE
   =========================== */

const translations = {
  en: {
    'cta.message': 'Ready to build something amazing?',
    'cta.button': 'Let\'s Work Together',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.portfolio': 'Portfolio',
    'nav.contact': 'Contact',
    'hero.subtitle': 'Junior Software Developer',
    'hero.description': 'Passionate about building beautiful web applications and exploring IoT solutions.<br>I\'m currently working at <strong>Enchatted</strong> and studying at <strong>University of Western Macedonia</strong>.',
    'hero.ctaPrimary': 'Let\'s Work Together',
    'hero.ctaGithub': 'View on GitHub',
    'hero.ctaLinkedIn': 'LinkedIn Profile',
    'hero.scroll': 'Scroll to explore',
    'about.title': 'About Me',
    'about.whoTitle': 'Who I Am',
    'about.whoText': 'I\'m <strong>Christos Anastasiou</strong>, a <strong>Junior Software Developer</strong> with <strong>2 years of professional experience</strong> at <strong>Enchatted</strong>. I\'m passionate about building clean, efficient code and creating digital solutions that make a real impact.',
    'about.educationTitle': 'My Education',
    'about.educationText1': 'I hold a <strong>Bachelor of Science in Computer Science</strong> (Grade: 7.34) from the University of Western Macedonia, where my thesis explored <strong>"Smart Building Automation with Z-Wave: A Case Study of IoT Integration and Management"</strong>. This experience sparked my passion for building scalable, connected systems and tackling complex technical challenges.',
    'about.educationText2': 'I\'ve recently completed my <strong>Master’s degree in Modern Information Technologies and Services</strong> (Grade: 9.24) from the same university. My thesis advanced IoT system integration with a focus on scalable, real-world solutions for smart building ecosystems. Combined with my professional experience at Enchatted, I\'ve developed strong expertise in full-stack web development, IoT systems, data integration, and building robust production systems.',
    'about.workTitle': 'What I Do',
    'about.workIntro': 'As a full-stack developer at Enchatted, I contribute to diverse, mission-critical projects across healthcare, e-commerce, and educational technology. I\'m involved in every stage—from designing system architecture to deploying production code. Here are some highlights:',
    'about.workItem1': '🚀 <strong>Kalfidis</strong> - Shopify E-Commerce Platform with GraphQL API and custom caching',
    'about.workItem2': '📄 <strong>PDF Search Tool</strong> - Internal tool for PDF searching and indexing with Laravel & JavaScript',
    'about.workItem3': '🎓 <strong>Open edX Customization</strong> - Custom XBlock modules, H5P integration, and MFE UI adaptation',
    'about.workItem4': '📊 <strong>ENCRYPT Project</strong> - Data flow design between GraphDB and Kafka pipelines with validation',
    'about.workItem5': '💻 <strong>Sally CMS</strong> - Dynamic fields, responsive dashboards, and content management tools',
    'about.workItem6': '⚡ <strong>Chrome Extension</strong> - Browser automation tool with Manifest v3 API and client-side data sync',
    'about.philosophyTitle': 'My Philosophy',
    'about.philosophyText1': 'I\'m passionate about <strong>writing clean, maintainable code</strong> that stands the test of time. I believe in <strong>understanding the "why" behind every decision</strong>, whether it\'s choosing a technology, designing an API, or optimizing a database query. I approach problems methodically—breaking them down, exploring solutions, and always thinking about scalability and user impact.',
    'about.philosophyText2': 'Beyond code, I\'m driven by continuous learning. The tech landscape evolves rapidly, and I stay curious about emerging technologies, best practices, and new problem-solving approaches. When I work on a project, I\'m not just completing tasks—I\'m building solutions that make a real difference for users and businesses.',
    'about.philosophyText3': '<strong>I\'m looking to grow, contribute meaningfully to challenging projects, and collaborate with teams that value quality and innovation.</strong>',
    'about.cvButton': 'Download CV',
    'services.web.title': 'Web Development',
    'services.web.text': 'Building responsive and dynamic web applications with modern technologies like React, Vue.js, and Laravel.',
    'services.php.title': 'PHP Development',
    'services.php.text': 'Developing robust server-side applications and REST APIs using PHP and the Laravel framework.',
    'services.iot.title': 'IoT Solutions',
    'services.iot.text': 'Designing and implementing IoT systems with a focus on smart building automation and Z-Wave technology.',
    'services.shopify.title': 'Shopify',
    'services.shopify.text': 'Creating and customizing Shopify stores with advanced features and optimized user experience.',
    'tech.title': 'Tech Stack',
    'skills.title': 'Skills & Expertise',
    'portfolio.title': 'Featured Projects',
    'portfolio.filters.all': 'All Projects',
    'portfolio.filters.work': 'Work Projects',
    'portfolio.filters.student': 'Student Projects',
    'highlights.title': 'Highlights & Achievements',
    'highlights.item1.title': '2 Years of Work Experience',
    'highlights.item1.text': 'Since 01/11/2023 employed at Enchatted I.K.E. as web applications developer & information systems administrator—covering data analysis, server and database management, in-house apps, web/API builds, and multimedia workflows.',
    'highlights.item2.title': '2nd Place Award Winner',
    'highlights.item2.text': 'Recognized in "Kozani 2030" student competition with SmartHAB—an advanced IoT smart building automation system.',
    'highlights.item3.title': 'Master’s Degree',
    'highlights.item3.text': 'Completed my Master’s in Modern Information Technologies & Services with focus on practical IoT solutions.',
    'highlights.item4.title': 'Software Developer (Web & Systems)',
    'highlights.item4.text': 'Working across backend and frontend—PHP, Laravel, JavaScript, React, REST APIs, and database design.',
    'highlights.item5.title': 'Diverse Projects',
    'highlights.item5.text': 'I\'ve worked on IoT systems, web apps, healthcare platforms, online stores, and data solutions.',
    'highlights.item6.title': 'Always Learning',
    'highlights.item6.text': 'I like exploring new technologies and staying curious about how things work.',
    'highlights.item7.title': 'Published Research',
    'highlights.item7.text': 'I\'ve published papers on AI, Knowledge Graphs, and IoT at international conferences.',
    'highlights.item8.title': 'Smart Systems',
    'highlights.item8.text': 'I focus on IoT automation, smart building systems, and making technology work intelligently.',
    'highlights.stats1': 'Years Professional Experience',
    'highlights.stats2': 'Major Projects Delivered',
    'highlights.stats3': 'Published Research Papers',
    'highlights.stats4': 'Master’s Grade',
    'projectTimeline.title': 'Project Journey',
    'projectTimeline.intro': 'Quick highlights from each phase—open a card to see the wins without digging through long case studies.',
    'projectTimeline.cta': 'View Highlights',
    'projectTimeline.item1.badge': 'Current',
    'projectTimeline.item1.date': '2024 — Present',
    'projectTimeline.item1.visual': 'Illustration representing modern product delivery work.',
    'projectTimeline.item1.chip': 'Delivery',
    'projectTimeline.item1.title': 'Product Delivery at Enchatted',
    'projectTimeline.item1.summary': 'Leading Enchatted delivery across Shopify, Laravel, and AI-powered browser tooling.',
    'projectTimeline.item1.tag1': 'Laravel',
    'projectTimeline.item1.tag2': 'Shopify',
    'projectTimeline.item1.tag3': 'AI Tooling',
    'projectTimeline.item1.modalTitle': 'Enchatted Delivery Highlights',
    'projectTimeline.item1.modalIntro': 'Cross-functional workstreams shipping production features across commerce, learning, and automation products.',
    'projectTimeline.item1.point1': 'Kalfidis multi-language Shopify store with custom Liquid, GraphQL caching, and growth dashboards.',
    'projectTimeline.item1.point2': 'AskCoco browser assistant shipped as Manifest v3 extension with secure DOM hooks and AI-driven prompts.',
    'projectTimeline.item1.point3': 'Sally CMS modules delivering schema-driven content fields, role workflows, and audit history.',
    'projectTimeline.item1.point4': 'PDF discovery pipeline syncing S3 archives, text extraction queues, and instant search UI.',
    'projectTimeline.item1.point5': 'Open edX and H5P customisations aligning branding, MFE theming, and learner analytics.',
    'projectTimeline.item1.point6': 'ENCRYPT data flows bridging GraphDB and Kafka with validation services for EU deliverables.',
    'projectTimeline.item2.badge': 'Research',
    'projectTimeline.item2.date': '2023 — 2025',
    'projectTimeline.item2.visual': 'Illustration representing smart building energy forecasting research.',
    'projectTimeline.item2.chip': 'Energy',
    'projectTimeline.item2.title': 'Smart Building & IoT Research',
    'projectTimeline.item2.summary': 'Master\'s thesis: Benchmarked ML models on 29M sensor readings to forecast campus energy demand and map actionable savings.',
    'projectTimeline.item2.tag1': 'IoT',
    'projectTimeline.item2.tag2': 'Z-Wave',
    'projectTimeline.item2.tag3': 'Energy Forecasting',
    'projectTimeline.item2.modalTitle': 'Master\'s Thesis Outcomes',
    'projectTimeline.item2.modalIntro': 'Analysis and Optimization of Smart Building Systems Using Machine Learning and IoT Technologies.',
    'projectTimeline.item2.point1': 'Curated 29M readings from 52 Z-Wave sensors across five energy subsystems on campus.',
    'projectTimeline.item2.point2': 'Engineered ML pipelines comparing nine algorithms across linear, boosting, and deep architectures.',
    'projectTimeline.item2.point3': 'Applied walk-forward validation with RMSE, MAE, wMAPE, and MASE to mirror production forecasting.',
    'projectTimeline.item2.point4': 'Produced explainability notebooks and energy cost scenarios to guide facility optimisation.',
    'projectTimeline.item2.point5': 'Packaged reproducible code, documentation, and roadmap for multimodal data and RAG tooling.',
    'projectTimeline.item3.badge': 'Community',
    'projectTimeline.item3.date': '2021 — 2022',
    'projectTimeline.item3.visual': 'Illustration representing community and WordPress work.',
    'projectTimeline.item3.chip': 'Community',
    'projectTimeline.item3.title': 'Community & WordPress Sites',
    'projectTimeline.item3.summary': 'Keeping community WordPress sites fresh, accessible, and easy to hand over.',
    'projectTimeline.item3.tag1': 'WordPress',
    'projectTimeline.item3.tag2': 'Content Strategy',
    'projectTimeline.item3.tag3': 'Accessibility',
    'projectTimeline.item3.modalTitle': 'Community WordPress Projects',
    'projectTimeline.item3.modalIntro': 'Volunteer-led work refreshing student and local organisation sites with modern content strategy.',
    'projectTimeline.item3.point1': 'Led IEEE Student Branch site refresh with event coverage, sponsors, and automated updates.',
    'projectTimeline.item3.point2': 'Supported local organisations with bespoke themes, donation flows, and editorial tooling.',
    'projectTimeline.item3.point3': 'Audited accessibility and performance, resolving contrast, navigation, and Core Web Vitals issues.',
    'projectTimeline.item3.point4': 'Produced maintenance playbooks and trained volunteer editors for smooth handovers.',
    'projectTimeline.item4.badge': 'Foundations',
    'projectTimeline.item4.date': '2019 — 2021',
    'projectTimeline.item4.visual': 'Illustration representing early experiments and learning.',
    'projectTimeline.item4.chip': 'Experiments',
    'projectTimeline.item4.title': 'Foundations & Experiments',
    'projectTimeline.item4.summary': 'Experimenting with web tech to build strong UI and delivery foundations.',
    'projectTimeline.item4.tag1': 'React',
    'projectTimeline.item4.tag2': 'UI/UX',
    'projectTimeline.item4.tag3': 'Rapid Prototyping',
    'projectTimeline.item4.modalTitle': 'Foundational Experiments',
    'projectTimeline.item4.modalIntro': 'University and personal prototypes that built my front-end and delivery habits.',
    'projectTimeline.item4.point1': 'Built React weather, task, and habit apps to practice API consumption and responsive UI.',
    'projectTimeline.item4.point2': 'Prototyped vanilla JS micro-tools exploring DOM patterns, forms, and local storage.',
    'projectTimeline.item4.point3': 'Adopted Git workflows, automated tests, and CI scripts across university projects.',
    'projectTimeline.item4.point4': 'Experimented with Node services and REST APIs to learn deployment and monitoring basics.',
    'experience.title': 'Experience & Education',
    'contact.title': 'Let\'s Connect',
    'contact.form.submit': 'Send Message',
    'contact.form.success': '✓ Message sent successfully! I\'ll get back to you soon.',
    'contact.form.error': '⚠️ Something went wrong. Please try again or email me directly.',
    'lang.button': 'EL',
    'lang.aria': 'Switch language to Greek'
  },
  el: {
    'cta.message': 'Πάμε να δημιουργήσουμε κάτι ξεχωριστό;',
    'cta.button': 'Ας συνεργαστούμε',
    'nav.home': 'Αρχική',
    'nav.about': 'Σχετικά',
    'nav.skills': 'Δεξιότητες',
    'nav.experience': 'Εμπειρία',
    'nav.portfolio': 'Έργα',
    'nav.contact': 'Επικοινωνία',
    'hero.subtitle': 'Junior Software Developer',
    'hero.description': 'Φτιάχνω web εφαρμογές και δουλεύω με IoT λύσεις.<br>Εργάζομαι στην <strong>Enchatted</strong> και σπουδάζω στο <strong>Πανεπιστήμιο Δυτικής Μακεδονίας</strong>.',
    'hero.ctaPrimary': 'Ας συνεργαστούμε',
    'hero.ctaGithub': 'Δες το GitHub μου',
    'hero.ctaLinkedIn': 'Προφίλ στο LinkedIn',
    'hero.scroll': 'Κάνε scroll για να συνεχίσεις',
    'about.title': 'Σχετικά με εμένα',
    'about.whoTitle': 'Ποιος είμαι',
    'about.whoText': 'Είμαι ο <strong>Christos Anastasiou</strong>, <strong>Junior Software Developer</strong> με <strong>δύο χρόνια εμπειρίας</strong> στην <strong>Enchatted</strong>. Φτιάχνω καθαρό κώδικα και δημιουργώ ψηφιακές εμπειρίες που λειτουργούν.',
    'about.educationTitle': 'Σπουδές',
    'about.educationText1': 'Αποφοίτησα από το Τμήμα Πληροφορικής του Πανεπιστημίου Δυτικής Μακεδονίας (βαθμός 7.34) με πτυχιακή <strong>«Smart Building Automation with Z-Wave»</strong>, όπου εμβάθυνα στην αρχιτεκτονική IoT και στην ολοκλήρωση έξυπνων συστημάτων.',
    'about.educationText2': 'Ολοκλήρωσα επίσης το <strong>Μεταπτυχιακό στις Σύγχρονες Τεχνολογίες Πληροφορικής και Υπηρεσιών</strong> (βαθμός 9.24) με έμφαση στη διαλειτουργικότητα IoT σε πραγματικές εγκαταστάσεις. Μαζί με την εμπειρία μου στην Enchatted έχω αναπτύξει ισχυρές δεξιότητες σε full-stack ανάπτυξη, IoT, ενοποίηση δεδομένων και παραγωγικά συστήματα.',
    'about.workTitle': 'Τι κάνω',
    'about.workIntro': 'Στην Enchatted συμμετέχω σε έργα υψηλής ευθύνης για υγεία, e-commerce και εκπαιδευτική τεχνολογία. Είμαι παρών σε όλα τα στάδια – από τον σχεδιασμό αρχιτεκτονικής έως την παράδοση παραγωγικού κώδικα. Ενδεικτικά:',
    'about.workItem1': '🚀 <strong>Kalfidis</strong> – Shopify e-commerce πλατφόρμα με GraphQL API και custom caching',
    'about.workItem2': '📄 <strong>PDF Search Tool</strong> – Εσωτερικό εργαλείο αναζήτησης και ευρετηρίασης PDF με Laravel & JavaScript',
    'about.workItem3': '🎓 <strong>Open edX Customization</strong> – Προσαρμογές XBlock, H5P integration και MFE UI',
    'about.workItem4': '📊 <strong>ENCRYPT Project</strong> – Ροές δεδομένων μεταξύ GraphDB και Kafka με validators',
    'about.workItem5': '💻 <strong>Sally CMS</strong> – Δυναμικά πεδία, responsive dashboards και εργαλεία περιεχομένου',
    'about.workItem6': '⚡ <strong>Chrome Extension</strong> – Browser automation tool με Manifest v3 και client-side συγχρονισμό',
    'about.philosophyTitle': 'Φιλοσοφία',
    'about.philosophyText1': 'Πιστεύω σε καθαρό, συντηρήσιμο κώδικα και στο να ξέρω το «γιατί» πίσω από κάθε απόφαση – από σχεδιασμό API έως βελτιστοποίηση βάσης δεδομένων.',
    'about.philosophyText2': 'Η συνεχής μάθηση είναι μέρος του κώδικά μας: παρακολουθώ τεχνολογικές εξελίξεις, δοκιμάζω νέες πρακτικές και κερδίζω πολύτιμη εμπειρία.',
    'about.philosophyText3': '<strong>Ζητώ projects που θα γίνω καλύτερος, συμβολή με νόημα και ομάδες που εκτιμούν την ποιότητα.</strong>',
    'about.cvButton': 'Κατέβασε το CV',
    'services.web.title': 'Ανάπτυξη Web',
    'services.web.text': 'Αναπτύσσω responsive και δυναμικές web εφαρμογές με τεχνολογίες όπως React, Vue.js και Laravel.',
    'services.php.title': 'PHP Development',
    'services.php.text': 'Δημιουργώ αξιόπιστες server-side εφαρμογές και REST APIs με PHP και Laravel.',
    'services.iot.title': 'Λύσεις IoT',
    'services.iot.text': 'Σχεδιάζω και υλοποιώ συστήματα IoT με έμφαση στον αυτοματισμό κτιρίων και το Z-Wave.',
    'services.shopify.title': 'Shopify',
    'services.shopify.text': 'Δημιουργώ και προσαρμόζω καταστήματα Shopify με προηγμένες δυνατότητες και κορυφαία εμπειρία χρήσης.',
    'tech.title': 'Τεχνολογίες & Εργαλεία',
    'skills.title': 'Δεξιότητες & Εξειδίκευση',
    'portfolio.title': 'Επιλεγμένα έργα',
    'portfolio.filters.all': 'Όλα τα έργα',
    'portfolio.filters.work': 'Εργασία',
    'portfolio.filters.student': 'Σπουδές',
    'highlights.title': 'Σημαντικά επιτεύγματα',
    'highlights.item1.title': '2 χρόνια εμπειρίας',
    'highlights.item1.text': 'Από 01/11/2023 εργάζομαι στην Enchatted I.K.E. ως προγραμματιστής web εφαρμογών και διαχειριστής πληροφοριακών συστημάτων, με αρμοδιότητες σε ανάλυση δεδομένων, διαχείριση εξυπηρετητών, βάσεων, in-house εφαρμογών, web/API ανάπτυξη και multimedia.',
    'highlights.item2.title': 'Βραβείο 2ης θέσης',
    'highlights.item2.text': 'Διάκριση στον φοιτητικό διαγωνισμό «Kozani 2030» με το SmartHAB – ένα σύστημα αυτοματισμού για έξυπνα κτίρια.',
    'highlights.item3.title': 'Μεταπτυχιακές σπουδές',
    'highlights.item3.text': 'Ολοκλήρωσα το Μεταπτυχιακό σε Σύγχρονες Τεχνολογίες Πληροφορικής με έμφαση σε πρακτικές λύσεις IoT.',
    'highlights.item4.title': 'Προγραμματιστής Λογισμικού (Web & Systems)',
    'highlights.item4.text': 'Εργάζομαι τόσο στο backend όσο και στο frontend – PHP, Laravel, JavaScript, React, REST APIs και σχεδιασμό βάσεων δεδομένων.',
    'highlights.item5.title': 'Ποικιλία έργων',
    'highlights.item5.text': 'Έχω δουλέψει σε IoT λύσεις, web εφαρμογές, healthcare platforms, e-commerce και data projects.',
    'highlights.item6.title': 'Συνεχής μάθηση',
    'highlights.item6.text': 'Δοκιμάζω νέες τεχνολογίες και εξερευνώ πώς λειτουργούν.',
    'highlights.item7.title': 'Δημοσιευμένη έρευνα',
    'highlights.item7.text': 'Έχω δημοσιεύσει εργασίες για AI, Knowledge Graphs και IoT σε διεθνή συνέδρια.',
    'highlights.item8.title': 'Έξυπνα συστήματα',
    'highlights.item8.text': 'Δουλεύω με IoT αυτοματισμό και smart building συστήματα που λειτουργούν αποδοτικά.',
    'highlights.stats1': 'Χρόνια εμπειρίας',
    'highlights.stats2': 'Μεγάλα έργα σε παραγωγή',
    'highlights.stats3': 'Δημοσιευμένες εργασίες',
    'highlights.stats4': 'Βαθμός Μεταπτυχιακού',
    'projectTimeline.title': 'Μια σύντομη διαδρομή',
    'projectTimeline.intro': 'Κύριες πτυχές από κάθε περίοδο – άνοιξε τις κάρτες για περισσότερα.',
    'projectTimeline.cta': 'Δες λεπτομέρειες',
    'projectTimeline.item1.badge': 'Τρέχον',
    'projectTimeline.item1.date': '2024 — Σήμερα',
    'projectTimeline.item1.visual': 'Απεικόνιση που παραπέμπει σε σύγχρονα έργα product delivery.',
    'projectTimeline.item1.chip': 'Delivery',
    'projectTimeline.item1.title': 'Product Delivery στην Enchatted',
    'projectTimeline.item1.summary': 'Συμβάλλω στη παράδοση projects σε Shopify, Laravel και AI browser tools.',
    'projectTimeline.item1.tag1': 'Laravel',
    'projectTimeline.item1.tag2': 'Shopify',
    'projectTimeline.item1.tag3': 'AI Tools',
    'projectTimeline.item1.modalTitle': 'Έργα στην Enchatted',
    'projectTimeline.item1.modalIntro': 'Ποικιλά projects σε commerce, learning platforms και automation tools.',
    'projectTimeline.item1.point1': 'Kalfidis – δίγλωσσο Shopify store με custom Liquid, GraphQL caching και growth dashboards.',
    'projectTimeline.item1.point2': 'AskCoco – browser extension με Manifest v3, secure DOM integration και AI-powered prompts.',
    'projectTimeline.item1.point3': 'Sally CMS – δυναμικά πεδία, role-based workflows και audit history.',
    'projectTimeline.item1.point4': 'PDF discovery – S3 sync, text extraction queues και instant search interface.',
    'projectTimeline.item1.point5': 'Open edX & H5P – branding, MFE theming και learner analytics customizations.',
    'projectTimeline.item1.point6': 'ENCRYPT – data flows μεταξύ GraphDB και Kafka με validation services.',
    'projectTimeline.item2.badge': 'Έρευνα',
    'projectTimeline.item2.date': '2023 — 2025',
    'projectTimeline.item2.visual': 'Απεικόνιση που αποδίδει έρευνα σε πρόβλεψη ενέργειας έξυπνων κτιρίων.',
    'projectTimeline.item2.chip': 'Ενέργεια',
    'projectTimeline.item2.title': 'Smart Building & IoT Research',
    'projectTimeline.item2.summary': 'Master\'s thesis: ML model benchmarking σε 29M sensor readings για energy demand forecasting.',
    'projectTimeline.item2.tag1': 'IoT',
    'projectTimeline.item2.tag2': 'Z-Wave',
    'projectTimeline.item2.tag3': 'ML Forecasting',
    'projectTimeline.item2.modalTitle': 'Master\'s Thesis Outcomes',
    'projectTimeline.item2.modalIntro': 'Analysis and optimization of smart building systems με ML και IoT technologies.',
    'projectTimeline.item2.point1': 'Processed 29M readings από 52 Z-Wave sensors σε 5 energy subsystems.',
    'projectTimeline.item2.point2': 'Benchmarked 9 algorithms (linear, boosting, deep learning).',
    'projectTimeline.item2.point3': 'Walk-forward validation με RMSE, MAE, wMAPE και MASE metrics.',
    'projectTimeline.item2.point4': 'Created explainability notebooks και energy savings scenarios.',
    'projectTimeline.item2.point5': 'Delivered reproducible code, docs και multimodal data roadmap.',
    'projectTimeline.item3.badge': 'Κοινότητα',
    'projectTimeline.item3.date': '2021 — 2022',
    'projectTimeline.item3.visual': 'Απεικόνιση που συμβολίζει κοινότητες και WordPress έργα.',
    'projectTimeline.item3.chip': 'Κοινότητα',
    'projectTimeline.item3.title': 'Community & WordPress Sites',
    'projectTimeline.item3.summary': 'Maintained student and community WordPress sites με modern content strategy και accessibility.',
    'projectTimeline.item3.tag1': 'WordPress',
    'projectTimeline.item3.tag2': 'Content',
    'projectTimeline.item3.tag3': 'Accessibility',
    'projectTimeline.item3.modalTitle': 'Community WordPress Projects',
    'projectTimeline.item3.modalIntro': 'Volunteer-led refresh of student and local organization sites.',
    'projectTimeline.item3.point1': 'IEEE Student Branch refresh με event coverage, sponsors tracking και automated updates.',
    'projectTimeline.item3.point2': 'Local organizations με custom themes, donation flows και content management tools.',
    'projectTimeline.item3.point3': 'Accessibility audits και performance optimization (contrast, navigation, Core Web Vitals).',
    'projectTimeline.item3.point4': 'Maintenance playbooks και volunteer training για smooth handover.',
    'projectTimeline.item4.badge': 'Βάσεις',
    'projectTimeline.item4.date': '2019 — 2021',
    'projectTimeline.item4.visual': 'Απεικόνιση που εκφράζει πειραματισμούς και μάθηση.',
    'projectTimeline.item4.chip': 'Πειράματα',
    'projectTimeline.item4.title': 'Foundations & Experiments',
    'projectTimeline.item4.summary': 'University and personal projects building UI and delivery fundamentals.',
    'projectTimeline.item4.tag1': 'React',
    'projectTimeline.item4.tag2': 'UI/UX',
    'projectTimeline.item4.tag3': 'Prototyping',
    'projectTimeline.item4.modalTitle': 'Foundational Experiments',
    'projectTimeline.item4.modalIntro': 'University and personal prototypes shaping my approach to software design and delivery.',
    'projectTimeline.item4.point1': 'React weather, task και habit apps για practice σε API consumption και responsive design.',
    'projectTimeline.item4.point2': 'Vanilla JS micro-tools με focus σε DOM patterns, forms και local storage.',
    'projectTimeline.item4.point3': 'Git workflows, automated tests και CI setup σε university projects.',
    'projectTimeline.item4.point4': 'Node services και REST APIs exploration για deployment και monitoring basics.',
    'experience.title': 'Εμπειρία & Εκπαίδευση',
    'contact.title': 'Ας επικοινωνήσουμε',
    'contact.form.submit': 'Στείλε μήνυμα',
    'contact.form.success': '✓ Το μήνυμα στάλθηκε! Θα επικοινωνήσω σύντομα μαζί σου.',
    'contact.form.error': '⚠️ Κάτι πήγε στραβά. Δοκίμασε ξανά ή στείλε μου email.',
    'lang.button': 'EN',
    'lang.aria': 'Εναλλαγή γλώσσας στα Αγγλικά'
  }
};

let currentLang = localStorage.getItem('language') || 'en';

const languageToggle = document.getElementById('language-toggle');
if (languageToggle) {
  languageToggle.addEventListener('click', () => {
    const nextLang = currentLang === 'en' ? 'el' : 'en';
    setLanguage(nextLang);
  });
}

function applyTranslations(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.dataset.i18n;
    const translation = translations[lang] && translations[lang][key];
    if (translation !== undefined) {
      el.innerHTML = translation;
    }
  });
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', currentLang);
  document.documentElement.lang = currentLang;

  applyTranslations(currentLang);

  const langButton = document.querySelector('.lang-text');
  if (langButton) {
    const label = translations[currentLang] && translations[currentLang]['lang.button'];
    langButton.textContent = label || (currentLang === 'en' ? 'EL' : 'EN');
  }

  if (languageToggle) {
    const ariaLabel = translations[currentLang] && translations[currentLang]['lang.aria'];
    if (ariaLabel) {
      languageToggle.setAttribute('aria-label', ariaLabel);
    }
  }
}

const initTranslations = () => setLanguage(currentLang);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTranslations);
} else {
  initTranslations();
}

/* ===========================
   THEME TOGGLE (Dark/White)
   =========================== */

/* ===========================
   UTILITY FUNCTIONS
   =========================== */

// Log script loaded
console.log('Portfolio script loaded successfully!');
