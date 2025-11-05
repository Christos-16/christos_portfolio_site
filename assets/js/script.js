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
  '.service-card, .tech-item, .skill-bar, .timeline-item, .portfolio-card, .contact-item'
);

animateElements.forEach(el => {
  observer.observe(el);
});

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
    'about.educationText2': 'I\'ve recently completed my <strong>Master\'s degree in Modern Information Technologies and Services</strong> (Grade: 9.24) from the same university. My thesis advanced IoT system integration with a focus on scalable, real-world solutions for smart building ecosystems. Combined with my professional experience at Enchatted, I\'ve developed strong expertise in full-stack web development, IoT systems, data integration, and building robust production systems.',
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
    'portfolio.title': 'My Development Journey',
    'portfolio.phase1.title': 'Web Foundations',
    'portfolio.phase1.description': 'Started with WordPress customization and web design fundamentals. Learned CMS management, HTML/CSS, and how to build responsive websites.',
    'portfolio.phase2.title': 'IoT & System Architecture',
    'portfolio.phase2.description': 'Focused on IoT systems and smart building automation. Completed my Bachelor\'s thesis on Z-Wave protocols and system design. Built SmartHAB—an award-winning IoT project (2nd Place at Kozani 2030).',
    'portfolio.phase3.title': 'Full-Stack Development',
    'portfolio.phase3.description': 'Working at Enchatted on diverse, real-world projects. Built scalable e-commerce platforms, data pipelines, content management systems, and browser extensions. Mastered backend architecture and modern frontend frameworks.',
    'portfolio.phase4.title': 'Research & AI Integration',
    'portfolio.phase4.description': 'Completed my Master\'s thesis on scalable IoT systems. Published research papers on AI, Knowledge Graphs, and IoT at international conferences (AIAI 2025, DCAI 2025). Combining practical experience with academic insights.',
    'portfolio.highlighted.title': 'Highlighted Projects',
    'portfolio.filters.all': 'All Projects',
    'portfolio.filters.work': 'Work Projects',
    'portfolio.filters.student': 'Student & Personal',
    'highlights.title': 'Highlights & Achievements',
    'highlights.item1.title': '2 Years of Work Experience',
    'highlights.item1.text': 'Working full-time at Enchatted on real projects in healthcare, e-commerce, and IoT systems.',
    'highlights.item2.title': '2nd Place Award Winner',
    'highlights.item2.text': 'Recognized in "Kozani 2030" student competition with SmartHAB—an advanced IoT smart building automation system.',
    'highlights.item3.title': 'Master\'s Degree',
    'highlights.item3.text': 'Completed my Master\'s in Modern Information Technologies & Services with focus on practical IoT solutions.',
    'highlights.item4.title': 'Full Stack Developer',
    'highlights.item4.text': 'I work with both backend and frontend—PHP, Laravel, JavaScript, React, and database design.',
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
    'highlights.stats4': 'Master\'s Grade',
    'lang.button': 'EL',
    'lang.aria': 'Switch language to Greek'
  },
  el: {
    'cta.message': 'Έτοιμος να δημιουργήσουμε κάτι μοναδικό;',
    'cta.button': 'Επικοινώνησε μαζί μου',
    'nav.home': 'Αρχική',
    'nav.about': 'Σχετικά',
    'nav.skills': 'Δεξιότητες',
    'nav.experience': 'Εμπειρία',
    'nav.portfolio': 'Έργα',
    'nav.contact': 'Επικοινωνία',
    'hero.subtitle': 'Junior Προγραμματιστής Λογισμικού',
    'hero.description': 'Λατρεύω να δημιουργώ κομψές web εφαρμογές και να πειραματίζομαι με λύσεις Internet of Things.<br>Παράλληλα εργάζομαι στην <strong>Enchatted</strong> και σπουδάζω στο <strong>Πανεπιστήμιο Δυτικής Μακεδονίας</strong>.',
    'hero.ctaPrimary': 'Ας συνεργαστούμε',
    'hero.ctaGithub': 'Δες το GitHub μου',
    'hero.ctaLinkedIn': 'Προφίλ στο LinkedIn',
    'hero.scroll': 'Κάνε scroll για να συνεχίσεις',
    'about.title': 'Σχετικά με εμένα',
    'about.whoTitle': 'Ποιος είμαι',
    'about.whoText': 'Είμαι ο <strong>Christos Anastasiou</strong>, <strong>Junior Προγραμματιστής Λογισμικού</strong> με <strong>2 χρόνια επαγγελματικής εμπειρίας</strong> στην <strong>Enchatted</strong>. Μου αρέσει να γράφω καθαρό, αποδοτικό κώδικα και να δημιουργώ ψηφιακές εμπειρίες που αφήνουν αποτύπωμα.',
    'about.educationTitle': 'Σπουδές',
    'about.educationText1': 'Κατέχω <strong>Πτυχίο Πληροφορικής</strong> (βαθμός 7,34) από το Πανεπιστήμιο Δυτικής Μακεδονίας. Η πτυχιακή μου εργασία είχε θέμα <strong>«Smart Building Automation with Z-Wave: A Case Study of IoT Integration and Management»</strong> και με βοήθησε να αγαπήσω τα κλιμακώσιμα, διασυνδεδεμένα συστήματα.',
    'about.educationText2': 'Ολοκλήρωσα πρόσφατα το <strong>Μεταπτυχιακό στις Σύγχρονες Τεχνολογίες και Υπηρεσίες Πληροφορικής</strong> (βαθμός 9,24) στο ίδιο πανεπιστήμιο, εστιάζοντας σε λύσεις IoT που εφαρμόζονται στην πράξη. Μαζί με την εμπειρία μου στην Enchatted, έχω αποκτήσει ισχυρή τεχνογνωσία σε full-stack ανάπτυξη, συστήματα IoT, ολοκλήρωση δεδομένων και παραγωγικά περιβάλλοντα μεγάλης κλίμακας.',
    'about.workTitle': 'Τι κάνω στην πράξη',
    'about.workIntro': 'Ως full-stack developer στην Enchatted συμμετέχω σε κρίσιμα έργα για την υγεία, το ηλεκτρονικό εμπόριο και την εκπαίδευση. Παίρνω μέρος σε όλα τα στάδια—από την αρχιτεκτονική μέχρι την παράδοση σε παραγωγή. Ενδεικτικά:',
    'about.workItem1': '🚀 <strong>Kalfidis</strong> – Πλατφόρμα Shopify με GraphQL API και custom μηχανισμό caching.',
    'about.workItem2': '📄 <strong>PDF Search Tool</strong> – Εσωτερικό εργαλείο αναζήτησης/ευρετηρίασης PDF με Laravel & JavaScript.',
    'about.workItem3': '🎓 <strong>Open edX Customization</strong> – Προσαρμοσμένα XBlock modules, H5P integration και MFE UI.',
    'about.workItem4': '📊 <strong>ENCRYPT Project</strong> – Σχεδιασμός ροών δεδομένων μεταξύ GraphDB και Kafka pipelines με validators.',
    'about.workItem5': '💻 <strong>Sally CMS</strong> – Δυναμικά πεδία, responsive dashboards και εργαλεία διαχείρισης περιεχομένου.',
    'about.workItem6': '⚡ <strong>Chrome Extension</strong> – Εργαλείο αυτοματοποίησης browser με Manifest v3 και client-side συγχρονισμό.',
    'about.philosophyTitle': 'Η φιλοσοφία μου',
    'about.philosophyText1': 'Πιστεύω στον <strong>καθαρό και συντηρήσιμο κώδικα</strong>. Θέλω να καταλαβαίνω πάντα το «γιατί» πίσω από κάθε επιλογή—από την τεχνολογία που θα διαλέξω μέχρι το πώς θα σχεδιάσω ένα API ή θα βελτιστοποιήσω μια βάση δεδομένων.',
    'about.philosophyText2': 'Η συνεχής μάθηση είναι τρόπος ζωής. Παρακολουθώ τις εξελίξεις, δοκιμάζω νέες πρακτικές και προσπαθώ να δίνω λύσεις που έχουν πραγματικό αντίκτυπο σε χρήστες και επιχειρήσεις.',
    'about.philosophyText3': '<strong>Αναζητώ ευκαιρίες για να εξελιχθώ, να συμβάλω σε απαιτητικά έργα και να συνεργαστώ με ομάδες που εκτιμούν την ποιότητα και την καινοτομία.</strong>',
    'about.cvButton': 'Κατέβασε το CV',
    'services.web.title': 'Ανάπτυξη Web',
    'services.web.text': 'Υλοποιώ responsive και δυναμικές web εφαρμογές με σύγχρονες τεχνολογίες όπως React, Vue.js και Laravel.',
    'services.php.title': 'Ανάπτυξη PHP',
    'services.php.text': 'Δημιουργώ αξιόπιστες server-side εφαρμογές και REST APIs αξιοποιώντας PHP και το οικοσύστημα του Laravel.',
    'services.iot.title': 'Λύσεις IoT',
    'services.iot.text': 'Σχεδιάζω και υλοποιώ συστήματα IoT με έμφαση στον αυτόματο έλεγχο κτιρίων και στην τεχνολογία Z-Wave.',
    'services.shopify.title': 'Καταστήματα Shopify',
    'services.shopify.text': 'Στήνω και προσαρμόζω καταστήματα Shopify με προηγμένες λειτουργίες και βελτιστοποιημένη εμπειρία χρήστη.',
    'portfolio.title': 'Η Εξέλιξή μου στην Τεχνολογία',
    'portfolio.phase1.title': 'Ίδρυση στο Web',
    'portfolio.phase1.description': 'Ξεκίνησα με WordPress και web design. Μάθευα CMS, HTML/CSS και πώς να φτιάχνω responsive websites.',
    'portfolio.phase2.title': 'IoT & Αρχιτεκτονική Συστημάτων',
    'portfolio.phase2.description': 'Εστίασα στα IoT και smart building. Τελείωσα την πτυχιακή στο Z-Wave και system design. Έφτιαξα το SmartHAB που κέρδισε 2η θέση στο Kozani 2030.',
    'portfolio.phase3.title': 'Full-Stack Ανάπτυξη',
    'portfolio.phase3.description': 'Δουλεύω στην Enchatted σε διάφορα real-world projects. Έφτιαξα e-commerce platforms, data pipelines, CMS και browser extensions. Κατάκτησα backend και modern frontend.',
    'portfolio.phase4.title': 'Έρευνα & AI Integration',
    'portfolio.phase4.description': 'Ολοκλήρωσα τη διπλωματική σε scalable IoT systems. Δημοσίευσα ερευνητικές εργασίες για AI, Knowledge Graphs και IoT σε διεθνή συνέδρια (AIAI 2025, DCAI 2025).',
    'portfolio.highlighted.title': 'Ξεχωριστά Έργα',
    'portfolio.filters.all': 'Όλα τα Έργα',
    'portfolio.filters.work': 'Εργασία',
    'portfolio.filters.student': 'Σπουδές & Προσωπικά',
    'highlights.title': 'Επιτεύγματα & Σημεία Αναφοράς',
    'highlights.item1.title': '2 Χρόνια Εργασίας',
    'highlights.item1.text': 'Δουλεύω πλήρως στην Enchatted σε πραγματικά έργα για υγεία, e-commerce και IoT.',
    'highlights.item2.title': 'Βραβείο 2ης Θέσης',
    'highlights.item2.text': 'Διάκριση στον διαγωνισμό «Kozani 2030» με το SmartHAB – σύστημα IoT για έξυπνα κτίρια.',
    'highlights.item3.title': 'Μεταπτυχιακό Πτυχίο',
    'highlights.item3.text': 'Ολοκλήρωσα το Μεταπτυχιακό σε Σύγχρονες Τεχνολογίες με εστίαση σε πρακτικές λύσεις IoT.',
    'highlights.item4.title': 'Full Stack Developer',
    'highlights.item4.text': 'Δουλεύω στο backend και frontend—PHP, Laravel, JavaScript, React, και σχεδιασμό βάσεων.',
    'highlights.item5.title': 'Διάφορα Έργα',
    'highlights.item5.text': 'Έχω δουλέψει σε IoT συστήματα, web apps, πλατφόρμες υγείας, online stores και δεδομένα.',
    'highlights.item6.title': 'Διαρκής Αναζήτηση',
    'highlights.item6.text': 'Μου αρέσει να εξερευνώ νέες τεχνολογίες και να μαθαίνω πώς λειτουργούν τα πράγματα.',
    'highlights.item7.title': 'Δημοσιευμένη Έρευνα',
    'highlights.item7.text': 'Έχω δημοσιεύσει εργασίες για AI, Knowledge Graphs και IoT σε διεθνή συνέδρια.',
    'highlights.item8.title': 'Έξυπνα Συστήματα',
    'highlights.item8.text': 'Εστιάζω στο IoT, έξυπνα κτίρια και στο να κάνω την τεχνολογία να δουλεύει έξυπνα.',
    'highlights.stats1': 'Χρόνια εμπειρίας',
    'highlights.stats2': 'Μεγάλα έργα σε παραγωγή',
    'highlights.stats3': 'Δημοσιευμένες εργασίες',
    'highlights.stats4': 'Βαθμός Μεταπτυχιακού',
    'lang.button': 'EN',
    'lang.aria': 'Αλλαγή γλώσσας σε Αγγλικά'
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
