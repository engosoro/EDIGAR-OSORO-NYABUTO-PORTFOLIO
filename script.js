/**
 * Portfolio JavaScript — Edigar Osoro Nyabuto
 * Features: Loader, Cursor, Navbar, Particles, Typing, Counter,
 *           Scroll Reveal, Dark/Light Mode, Filters, Slider,
 *           Form Validation, Back-to-Top, Modal, Lazy Loading
 */

/* ============================================================
   LOADING SCREEN
============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      // Trigger initial reveal
      setTimeout(revealOnScroll, 300);
    }
  }, 2200);
});

/* ============================================================
   CUSTOM CURSOR
============================================================ */
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';

    // Slight lag for outline
    setTimeout(() => {
      cursorOutline.style.left = e.clientX + 'px';
      cursorOutline.style.top = e.clientY + 'px';
    }, 60);
  });

  // Scale on hover interactive elements
  document.querySelectorAll('a, button, .project-card, .service-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.width = '14px';
      cursorDot.style.height = '14px';
      cursorOutline.style.width = '52px';
      cursorOutline.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.width = '8px';
      cursorDot.style.height = '8px';
      cursorOutline.style.width = '36px';
      cursorOutline.style.height = '36px';
    });
  });
}

/* ============================================================
   NAVBAR — STICKY + GLASSMORPHISM + HAMBURGER
============================================================ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Sticky state on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
  revealOnScroll();
  toggleBackToTop();
  animateBars();
  animateCounters();
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav highlight
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

/* ============================================================
   DARK / LIGHT MODE TOGGLE
============================================================ */
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (theme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

/* ============================================================
   PARTICLE CANVAS BACKGROUND
============================================================ */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.speedY = (Math.random() - 0.5) * 0.6;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`;
    ctx.fill();
  }
}

// Create particles
for (let i = 0; i < 100; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });

  // Draw connections
  particles.forEach((a, i) => {
    particles.slice(i + 1).forEach(b => {
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================================================
   TYPING ANIMATION
============================================================ */
const typingEl = document.getElementById('typingText');
const words = [
  'Software Engineer',
  'Full-Stack Developer',
  'AI / ML Enthusiast',
  'Tech Innovator'
];
let wIdx = 0, cIdx = 0, deleting = false;

function typeEffect() {
  const word = words[wIdx];
  if (!deleting) {
    typingEl.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; setTimeout(typeEffect, 2000); return; }
  } else {
    typingEl.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
  }
  setTimeout(typeEffect, deleting ? 60 : 90);
}
setTimeout(typeEffect, 800);

/* ============================================================
   ANIMATED STAT COUNTERS
============================================================ */
let countersRan = false;
function animateCounters() {
  if (countersRan) return;
  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;
  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 50) {
    countersRan = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 30);
    });
  }
}

/* ============================================================
   SCROLL REVEAL
============================================================ */
function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}
// Initial check
revealOnScroll();

/* ============================================================
   SKILL BAR ANIMATIONS
============================================================ */
let barsAnimated = false;
function animateBars() {
  if (barsAnimated) return;
  const barsSection = document.querySelector('.skills-grid');
  if (!barsSection) return;
  const rect = barsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight + 100) {
    barsAnimated = true;
    document.querySelectorAll('.bar-fill').forEach(bar => {
      const width = bar.dataset.width;
      bar.style.width = width + '%';
    });
  }
}

/* ============================================================
   PROJECT FILTERING + SEARCH
============================================================ */
const projectFilterBtns = document.querySelectorAll('.filter-btn[data-filter]');
const projectCards = document.querySelectorAll('.project-card');
const projectSearch = document.getElementById('projectSearch');

projectFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    projectFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

if (projectSearch) {
  projectSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    projectCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.classList.toggle('hidden', !text.includes(q));
    });
  });
}

/* ============================================================
   BLOG FILTERING + SEARCH
============================================================ */
const blogFilterBtns = document.querySelectorAll('.filter-btn[data-blog-filter]');
const blogCards = document.querySelectorAll('.blog-card');
const blogSearch = document.getElementById('blogSearch');

blogFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    blogFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.blogFilter;
    blogCards.forEach(card => {
      const match = filter === 'all' || card.dataset.blogCat === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

if (blogSearch) {
  blogSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    blogCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.classList.toggle('hidden', !text.includes(q));
    });
  });
}

/* ============================================================
   TESTIMONIALS SLIDER
============================================================ */
const slides = document.querySelectorAll('.testimonial-slide');
const dotsContainer = document.getElementById('testiDots');
let currentSlide = 0;
let slideTimer;

function createDots() {
  if (!dotsContainer) return;
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
}
createDots();

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  document.querySelectorAll('.testi-dot')[currentSlide]?.classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  document.querySelectorAll('.testi-dot')[currentSlide]?.classList.add('active');
}

document.getElementById('testiPrev')?.addEventListener('click', () => {
  clearInterval(slideTimer);
  goToSlide(currentSlide - 1);
  startAutoSlide();
});
document.getElementById('testiNext')?.addEventListener('click', () => {
  clearInterval(slideTimer);
  goToSlide(currentSlide + 1);
  startAutoSlide();
});

function startAutoSlide() {
  slideTimer = setInterval(() => goToSlide(currentSlide + 1), 4500);
}
startAutoSlide();

/* ============================================================
   BACK TO TOP
============================================================ */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   CONTACT FORM VALIDATION
============================================================ */
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  // Clear errors
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');

  // Validate name
  const name = document.getElementById('fname');
  if (!name.value.trim() || name.value.trim().length < 2) {
    document.getElementById('nameError').textContent = 'Please enter your full name (min 2 chars).';
    valid = false;
  }

  // Validate email
  const email = document.getElementById('femail');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    document.getElementById('emailError').textContent = 'Please enter a valid email address.';
    valid = false;
  }

  // Validate subject
  const subject = document.getElementById('fsubject');
  if (!subject.value.trim()) {
    document.getElementById('subjectError').textContent = 'Subject is required.';
    valid = false;
  }

  // Validate message
  const message = document.getElementById('fmessage');
  if (!message.value.trim() || message.value.trim().length < 10) {
    document.getElementById('messageError').textContent = 'Message must be at least 10 characters.';
    valid = false;
  }

  if (!valid) return;

  // Show loading state
  const btnText = contactForm.querySelector('.btn-text');
  const btnLoading = contactForm.querySelector('.btn-loading');
  btnText.style.display = 'none';
  btnLoading.style.display = 'flex';

  // Simulate form submission
  setTimeout(() => {
    btnText.style.display = 'inline-flex';
    btnLoading.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'flex';
    contactForm.reset();
    setTimeout(() => {
      document.getElementById('formSuccess').style.display = 'none';
    }, 5000);
  }, 1800);
});

/* ============================================================
   PROJECT MODAL
============================================================ */
const modalData = {
  1: {
    title: 'E-Commerce Platform',
    desc: 'A comprehensive full-stack e-commerce platform built with React and Node.js. Features include real-time inventory management, Stripe payment integration, AI-powered product recommendations, admin dashboard, and multi-vendor support. Handles 50K+ daily transactions with 99.9% uptime.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Stripe', 'AWS S3', 'Docker'],
    challenges: 'Implementing real-time inventory sync across multiple warehouses and ensuring payment security compliance (PCI-DSS).',
    outcome: 'Increased client revenue by 45% in 3 months post-launch. 4.8★ user satisfaction rating.'
  },
  2: {
    title: 'AI Customer Support Chatbot',
    desc: 'An LLM-powered chatbot system with fine-tuned language models, persistent context memory, and multi-language support (English, Swahili, French). Integrates with CRM systems for seamless handoff to human agents when needed.',
    tech: ['Python', 'TensorFlow', 'FastAPI', 'OpenAI API', 'Pinecone', 'PostgreSQL', 'Redis'],
    challenges: 'Achieving sub-2s response times while maintaining contextual accuracy across multi-turn conversations.',
    outcome: 'Reduced customer support tickets by 60%. Average response time: 1.2 seconds. CSAT score: 4.7/5.'
  },
  3: {
    title: 'Network Vulnerability Scanner',
    desc: 'An automated penetration testing framework that discovers, categorizes, and reports security vulnerabilities in network infrastructure. Generates executive-level and technical reports with remediation recommendations.',
    tech: ['Python', 'Nmap', 'Metasploit', 'Kali Linux', 'SQLite', 'React', 'Flask'],
    challenges: 'Avoiding false positives while covering all OWASP Top 10 vulnerabilities with minimal network noise.',
    outcome: 'Deployed to 15 enterprise clients. Identified 2,400+ critical vulnerabilities in first year of deployment.'
  },
  4: {
    title: 'Cloud Cost Optimizer',
    desc: 'AWS infrastructure monitoring dashboard that analyzes resource utilization, identifies waste, provides auto-scaling recommendations, and automates cost-saving actions using Lambda functions.',
    tech: ['AWS', 'React', 'Python', 'Terraform', 'CloudWatch', 'Lambda', 'DynamoDB'],
    challenges: 'Correlating cost data across 50+ AWS services while maintaining near-real-time dashboard updates.',
    outcome: 'Average client savings: $18,000/month. Reduced cloud waste by 40% across managed accounts.'
  },
  5: {
    title: 'HealthTrack Mobile App',
    desc: 'Cross-platform health management app with AI-driven insights, wearable device integration (Apple Watch, Fitbit), telemedicine video calls, medication reminders, and predictive health analytics.',
    tech: ['React Native', 'Firebase', 'ML Kit', 'TensorFlow Lite', 'Twilio', 'HealthKit'],
    challenges: 'Achieving HIPAA compliance for patient data storage while maintaining smooth cross-platform performance.',
    outcome: '10,000+ active users. 4.6★ App Store rating. Featured in Google Play "Best Apps of 2024".'
  },
  6: {
    title: 'Market Prediction Engine',
    desc: 'Machine learning system for stock market trend analysis combining LSTM neural networks for time-series prediction with NLP-based sentiment analysis of financial news and social media data.',
    tech: ['Python', 'Keras', 'LSTM', 'BERT', 'Pandas', 'NumPy', 'Plotly', 'FastAPI'],
    challenges: 'Preventing overfitting to historical patterns and adapting to market regime changes.',
    outcome: 'Achieved 71% directional accuracy on test data. Currently managing a $200K paper trading portfolio.'
  }
};

const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

document.querySelectorAll('.proj-btn-detail').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    const data = modalData[id];
    if (data) {
      modalBody.innerHTML = `
        <h2 style="color:var(--clr-heading);font-family:var(--font-display);font-size:1.8rem;letter-spacing:0.05em;margin-bottom:16px;">${data.title}</h2>
        <p style="color:var(--clr-text);line-height:1.8;margin-bottom:20px;">${data.desc}</p>
        <h4 style="color:var(--clr-accent);font-size:0.8rem;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:12px;font-family:var(--font-mono);">Technologies Used</h4>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">${data.tech.map(t => `<span style="background:rgba(0,229,255,0.08);border:1px solid rgba(0,229,255,0.2);color:var(--clr-accent);padding:4px 12px;border-radius:4px;font-size:0.78rem;font-family:var(--font-mono);">${t}</span>`).join('')}</div>
        <h4 style="color:var(--clr-accent);font-size:0.8rem;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;font-family:var(--font-mono);">Key Challenge</h4>
        <p style="color:var(--clr-text-muted);font-size:0.9rem;line-height:1.7;margin-bottom:20px;">${data.challenges}</p>
        <h4 style="color:var(--clr-accent);font-size:0.8rem;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;font-family:var(--font-mono);">Outcome</h4>
        <p style="color:var(--clr-text-muted);font-size:0.9rem;line-height:1.7;">${data.outcome}</p>
      `;
      modal.classList.add('open');
    }
  });
});

modalClose.addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.classList.remove('open'); });

/* ============================================================
   SMOOTH SCROLL FOR INTERNAL LINKS
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ============================================================
   LAZY IMAGE LOADING
============================================================ */
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imgObserver.observe(img));
}

/* ============================================================
   INITIAL SETUP
============================================================ */
// Run reveal on initial load
setTimeout(() => {
  revealOnScroll();
  animateCounters();
  animateBars();
}, 2500);
