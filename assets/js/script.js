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
    if (hamburger && navMenu) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
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

if (hamburger) {
  hamburger.addEventListener('click', () => {
    if (navMenu) {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    }
  });
}

/* ===========================
   PORTFOLIO FILTER
   =========================== */

const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    this.classList.add('active');

    const filterValue = this.getAttribute('data-filter');

    // Filter cards
    portfolioCards.forEach(card => {
      if (filterValue === 'all') {
        card.style.display = 'block';
        setTimeout(() => card.classList.add('animate'), 10);
      } else {
        const cardCategory = card.getAttribute('data-category');
        if (cardCategory === filterValue) {
          card.style.display = 'block';
          setTimeout(() => card.classList.add('animate'), 10);
        } else {
          card.style.display = 'none';
          card.classList.remove('animate');
        }
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
  '.service-card, .tech-item, .skill-bar, .timeline-item, .portfolio-card, .contact-item'
);

animateElements.forEach(el => {
  observer.observe(el);
});

/* ===========================
   FORM HANDLING
   =========================== */

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };

    // Here you would normally send the form data to a server
    console.log('Form Data:', formData);

    // Show success message
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Message Sent Successfully! ✓';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

    // Reset form
    contactForm.reset();

    // Restore button after 3 seconds
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
    }, 3000);
  });
}

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
      background: rgba(15, 23, 42, 0.98);
      flex-direction: column;
      padding: 2rem 1rem;
      gap: 1rem;
      border-top: 1px solid var(--border-color);
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .nav-menu.active {
      max-height: 400px;
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

      projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

// Close modal
function closeModal() {
  projectModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && projectModal.classList.contains('active')) {
    closeModal();
  }
});

/* ===========================
   PARALLAX EFFECT
   =========================== */

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.hero::before');

  if (scrolled < window.innerHeight) {
    // Parallax effect for hero background
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    }
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

  // If valid, show success and reset form
  if (isValid) {
    formSuccess.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
    formSuccess.classList.add('show');

    // Reset form
    contactForm.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
      formSuccess.classList.remove('show');
    }, 5000);
  }
});

/* ===========================
   LANGUAGE TOGGLE
   =========================== */

// Language data
const translations = {
  en: {
    home: 'Home',
    about: 'About',
    skills: 'Skills',
    experience: 'Experience',
    portfolio: 'Portfolio',
    contact: 'Contact',
    toggleLang: 'EL'
  },
  el: {
    home: 'Αρχική',
    about: 'Σχετικά',
    skills: 'Δεξιότητες',
    experience: 'Εμπειρία',
    portfolio: 'Έργα',
    contact: 'Επικοινωνία',
    toggleLang: 'EN'
  }
};

let currentLang = localStorage.getItem('language') || 'en';

const languageToggle = document.getElementById('language-toggle');
if (languageToggle) {
  languageToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'el' : 'en';
    localStorage.setItem('language', currentLang);
    updateLanguage();
  });
}

function updateLanguage() {
  // Update nav links
  const navLinks = document.querySelectorAll('.nav-link');
  const navItems = ['home', 'about', 'skills', 'experience', 'portfolio', 'contact'];

  navLinks.forEach((link, index) => {
    if (navItems[index]) {
      link.textContent = translations[currentLang][navItems[index]];
    }
  });

  // Update language toggle button
  const langButton = document.querySelector('.lang-text');
  if (langButton) {
    langButton.textContent = translations[currentLang].toggleLang;
  }

  // Store preference
  document.documentElement.lang = currentLang;
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  updateLanguage();
});

/* ===========================
   THEME TOGGLE (Dark/White)
   =========================== */

const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Get saved theme preference or default to dark
let currentTheme = localStorage.getItem('theme') || 'dark';

// Apply saved theme on load
if (currentTheme === 'white') {
  htmlElement.classList.add('white-theme');
}

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'white' : 'dark';

  if (currentTheme === 'white') {
    htmlElement.classList.add('white-theme');
  } else {
    htmlElement.classList.remove('white-theme');
  }

  localStorage.setItem('theme', currentTheme);
});

/* ===========================
   UTILITY FUNCTIONS
   =========================== */

// Log script loaded
console.log('Portfolio script loaded successfully!');
