'use strict';

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

    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');

    // Close mobile menu if open
    if (hamburger && navMenu) {
      navMenu.classList.remove('active');
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

let scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: none;
  z-index: 999;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.display = 'flex';
    scrollToTopBtn.style.alignItems = 'center';
    scrollToTopBtn.style.justifyContent = 'center';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
  scrollToTopBtn.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
  scrollToTopBtn.style.transform = 'scale(1)';
});

/* ===========================
   PROJECT MODAL FUNCTIONALITY
   =========================== */

const projectData = {
  askcoco: {
    title: 'AI-Powered Browser Assistant Extension',
    description: 'Developed a Chrome extension that enhances browser functionality with AI-assisted text analysis. This project involved creating a seamless integration between browser DOM manipulation and external AI services to provide real-time content analysis within the browser environment.',
    highlights: [
      'Implemented Chrome Extension manifest and background scripts',
      'Built DOM manipulation for content detection and interaction',
      'Integrated with external AI APIs for text processing',
      'Created responsive popup UI for user interactions',
      'Optimized performance for background processing'
    ]
  },
  sally: {
    title: 'Conversation Data Management System',
    description: 'Engineered a real-time data processing platform for managing conversation data across multiple sources. The system handles complex data transformation, external service integration, and JSON-based data pipeline optimization for seamless information flow.',
    highlights: [
      'Designed and implemented real-time data processing pipeline',
      'Integrated Typebot services for conversation data collection',
      'Optimized JSON data transformation and validation',
      'Implemented error handling and data consistency checks',
      'Created efficient database queries for large datasets',
      'Developed API endpoints for external service communication'
    ]
  },
  pdfsearch: {
    title: 'Document Content Search Engine',
    description: 'Created a sophisticated document processing and search system that enables users to find and retrieve information from document collections efficiently. Implemented advanced parsing techniques and optimized search algorithms for fast, accurate results.',
    highlights: [
      'Engineered document parsing and content extraction',
      'Implemented full-text search functionality',
      'Optimized indexing for improved query performance',
      'Built user-friendly search interface and results display',
      'Handled multiple document formats and encodings',
      'Integrated with Laravel backend for scalability'
    ]
  },
  encrypt: {
    title: 'Healthcare Data Integration Platform',
    description: 'Built a comprehensive data integration system for healthcare applications with strict security and compliance requirements. The platform handles complex data transformation using graph databases and implements streaming infrastructure for real-time processing of sensitive medical data.',
    highlights: [
      'Designed graph database schema for medical data relationships',
      'Implemented Kafka-based streaming for real-time data processing',
      'Developed data transformation pipeline for format conversion',
      'Integrated DICOM file processing for medical imaging data',
      'Built secure data validation and encryption mechanisms',
      'Optimized data flow for low-latency processing',
      'Implemented comprehensive logging and monitoring'
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
   UTILITY FUNCTIONS
   =========================== */

// Log script loaded
console.log('Portfolio script loaded successfully!');
