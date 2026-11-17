/* ==========================================================================
   IMAN MOHAMED AL-HUSSINI - INTERACTIVE SCRIPTS & ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initCustomCursor();
  initTypewriter();
  initScrollAnimations();
  initCounters();
  initSkillBars();
  initProjectFilters();
  initProjectModal();
  initCopyButtons();
  initContactForm();
  initThemeToggle();
  initMobileMenu();
  initTiltEffects();
});

/* --------------------------------------------------------------------------
   1. Interactive Particle / Constellation Canvas
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 20 + 5;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(99, 102, 241,' : 'rgba(6, 182, 212,';
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + ' 0.7)';
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interactivity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density * 0.5;
          const directionY = forceDirectionY * force * this.density * 0.5;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          const opacity = (1 - distance / 110) * 0.22;
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   2. Custom Glowing Mouse Cursor
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  if (!dot || !outline) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;
    outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Scale up cursor on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .glass-card, [role="button"]');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      outline.style.width = '55px';
      outline.style.height = '55px';
      outline.style.borderColor = 'var(--secondary)';
      outline.style.backgroundColor = 'rgba(6, 182, 212, 0.08)';
    });
    el.addEventListener('mouseleave', () => {
      outline.style.width = '36px';
      outline.style.height = '36px';
      outline.style.borderColor = 'var(--primary)';
      outline.style.backgroundColor = 'transparent';
    });
  });
}

/* --------------------------------------------------------------------------
   3. Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const words = [
    'React.js Developer',
    'Web Development Instructor',
    'Frontend & UI Engineer',
    'Computer Science TA',
    'Tech Mentor & Community Leader'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 105;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 450;
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 800);
}

/* --------------------------------------------------------------------------
   4. Scroll Animations (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-init');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. Animated Counters
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if (!counters.length) return;

  let started = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          counters.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.floor(easeProgress * target);
              counter.textContent = currentVal + suffix;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target + suffix;
              }
            }
            requestAnimationFrame(updateCounter);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  const statsSection = document.getElementById('stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* --------------------------------------------------------------------------
   6. Skill Progress Bars
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const level = entry.target.getAttribute('data-level');
          entry.target.style.width = level + '%';
        }
      });
    },
    { threshold: 0.2 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* --------------------------------------------------------------------------
   7. Project Filter
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active', 'bg-indigo-600', 'text-white'));
      filterBtns.forEach((b) => b.classList.add('text-slate-400', 'hover:text-white'));
      
      btn.classList.add('active', 'bg-indigo-600', 'text-white');
      btn.classList.remove('text-slate-400');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. Project Details Modal
   -------------------------------------------------------------------------- */
const projectsData = {
  ecommerce: {
    title: 'E-Commerce Web Application (DEPI Graduation Project)',
    category: 'Full-Stack / React.js & REST API',
    subtitle: 'Egypt Digital Pioneers Initiative (DEPI) Graduation Project',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    tags: ['React.js', 'RESTful API', 'Local Storage', 'HTML5/CSS3', 'Responsive UI', 'Git'],
    description:
      'A comprehensive, modern full-featured e-commerce platform built as the final graduation project for the Egypt Digital Pioneers Initiative (DEPI). It features complete customer workflows, user authentication, responsive design, interactive cart and checkout, and a full administrative dashboard for product management and updates.',
    keyFeatures: [
      'Administrative interfaces including complete Product Management and dynamic Product Update pages.',
      'User-facing components: Product Details, Interactive Image Slider, Navigation Sidebar, Cart, and Seamless Checkout.',
      'RESTful API integration for data handling, catalog population, and inventory synchronization.',
      'Local Storage integration for reliable offline state preservation and client-side shopping cart persistence.',
      'Earned exceptional evaluations from DEPI supervisors for UI/UX finesse and robust architecture.'
    ],
    liveUrl: 'https://client-esw.vercel.app/',
    serverUrl: 'https://server-esw.up.railway.app',
    githubUrl: 'https://github.com/ImanMohamed20'
  },
  pharmacy: {
    title: 'Pharmacy AI Chatbot & Mobile App (Graduation Project)',
    category: 'AI & Mobile / University Capstone',
    subtitle: 'Faculty of Computer Science and Information, Zagazig University',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    tags: ['Artificial Intelligence', 'Chatbot Integration', 'NLP', 'Python', 'Mobile Training', 'Zagazig University'],
    description:
      'Collaborative capstone project with the College of Pharmacy at Zagazig University. The system delivers an intelligent mobile training assistant that provides pharmacy students with personalized medical guidance, drug information queries, and educational practice scenarios.',
    keyFeatures: [
      'Led comprehensive project analysis and requirement engineering across multidisciplinary medical and CS teams.',
      'Directly contributed to improving the core AI chatbot accuracy by 90%, drastically reducing hallucinated answers.',
      'Formulated in-depth documentation and technical architectural diagrams for the university review board.',
      'Awarded an (A+) graduation distinction for its innovation, high practicality, and societal impact.'
    ],
    liveUrl: 'https://github.com/ImanMohamed20',
    serverUrl: null,
    githubUrl: 'https://github.com/ImanMohamed20'
  },
  itmartian: {
    title: 'Blood & Medicine Donation Web Platforms',
    category: 'Healthcare Web Platform',
    subtitle: 'Front-End Development at IT-MARTIAN, Cairo',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    tags: ['JavaScript', 'HTML5', 'CSS3', 'Authentication', 'Responsive Web Design', 'Healthcare'],
    description:
      'Developed core web features and interactive interfaces for blood and life-saving medicine donation platforms at IT-MARTIAN, connecting urgent donors with patients in critical need across Egypt.',
    keyFeatures: [
      'Constructed the dedicated HDL Drugs Donation portal and medical supply tracking modules.',
      'Implemented front-end authentication flows, secure form submissions, and donor request validations.',
      'Guaranteed cross-browser compatibility and optimized mobile-first responsive performance.',
      'Significantly improved user experience and accessibility for donors navigating under urgent conditions.'
    ],
    liveUrl: 'https://github.com/ImanMohamed20',
    serverUrl: null,
    githubUrl: 'https://github.com/ImanMohamed20'
  },
  cognorise_currency: {
    title: 'Real-Time Currency Converter',
    category: 'React & REST APIs',
    subtitle: 'CognoRise InfoTech Web Development Internship',
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80',
    tags: ['React.js', 'REST API', 'JavaScript', 'Tailwind CSS', 'Finance UI'],
    description:
      'A sleek real-time currency conversion tool fetching live foreign exchange market rates via RESTful APIs with interactive currency swapping and responsive layout.',
    keyFeatures: [
      'Live exchange rate integration with instant calculated value updates.',
      'Currency swap button and quick search for global international fiat currencies.',
      'Clean, accessible UI and instant error handling for network latency.'
    ],
    liveUrl: 'https://github.com/ImanMohamed20/CognoRise_Infotech/tree/main/currency',
    serverUrl: null,
    githubUrl: 'https://github.com/ImanMohamed20/CognoRise_Infotech/tree/main/currency'
  },
  cognorise_todo: {
    title: 'Modern Task Manager & To-Do App',
    category: 'React.js & Productivity',
    subtitle: 'CognoRise InfoTech Web Development Internship',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
    tags: ['React.js', 'Local Storage', 'CRUD Operations', 'UI/UX'],
    description:
      'Feature-rich task management app with persistent local storage, priority filters, task completion toggles, and smooth micro-interactions.',
    keyFeatures: [
      'Full CRUD capabilities (Create, Read, Update, Delete) with interactive completion status.',
      'Persistent state saved across page reloads using browser LocalStorage.',
      'Clean minimalist aesthetics with animated transitions.'
    ],
    liveUrl: 'https://github.com/ImanMohamed20/CognoRise_Infotech/tree/main/to-do-list',
    serverUrl: null,
    githubUrl: 'https://github.com/ImanMohamed20/CognoRise_Infotech/tree/main/to-do-list'
  },
  cognorise_timer: {
    title: 'Interactive Countdown Timer & Utilities',
    category: 'JavaScript & Utilities',
    subtitle: 'CognoRise InfoTech Web Development Internship',
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80',
    tags: ['JavaScript ES6+', 'HTML5', 'CSS3', 'Audio API', 'Event Loop'],
    description:
      'High-precision countdown timer and utility suite featuring custom time inputs, pause/resume/reset states, sound alert cues, and dynamic visual progress dials.',
    keyFeatures: [
      'Accurate timing algorithms with drift compensation.',
      'Visual circular progress ring and audio cue upon completion.',
      'Bundled alongside BMI Health Calculator and Scientific Calculator web tools.'
    ],
    liveUrl: 'https://github.com/ImanMohamed20/CognoRise_Infotech/tree/main/COUNTDOWN%20TIMER',
    serverUrl: null,
    githubUrl: 'https://github.com/ImanMohamed20/CognoRise_Infotech/tree/main/COUNTDOWN%20TIMER'
  }
};

function initProjectModal() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  if (!modalOverlay || !modalCloseBtn) return;

  const modalImg = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalTags = document.getElementById('modal-tags');
  const modalLiveLink = document.getElementById('modal-live-link');
  const modalGithubLink = document.getElementById('modal-github-link');

  document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = trigger.getAttribute('data-open-modal');
      const data = projectsData[projectId];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalSubtitle.textContent = data.subtitle;
      modalCategory.textContent = data.category;
      modalDesc.textContent = data.description;
      modalImg.src = data.image;
      modalImg.alt = data.title;

      // Populate features
      modalFeatures.innerHTML = data.keyFeatures
        .map(
          (f) =>
            `<li class="flex items-start gap-2.5 text-slate-300 text-sm">
              <i class="fa-solid fa-circle-check text-cyan-400 mt-1 flex-shrink-0"></i>
              <span>${f}</span>
            </li>`
        )
        .join('');

      // Populate tags
      modalTags.innerHTML = data.tags
        .map((t) => `<span class="badge-tech">${t}</span>`)
        .join('');

      // Links
      if (data.liveUrl) {
        modalLiveLink.href = data.liveUrl;
        modalLiveLink.style.display = 'inline-flex';
      } else {
        modalLiveLink.style.display = 'none';
      }

      if (data.githubUrl) {
        modalGithubLink.href = data.githubUrl;
        modalGithubLink.style.display = 'inline-flex';
      } else {
        modalGithubLink.style.display = 'none';
      }

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   9. Copy to Clipboard & Toast Notifications
   -------------------------------------------------------------------------- */
function showToast(message, icon = 'fa-check-circle') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-cyan-400 text-lg"></i>
    <span class="font-medium">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-copy-label') || 'Text';

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`${label} copied to clipboard! ✨`);
      }).catch(() => {
        // Fallback prompt
        prompt('Copy to clipboard: Ctrl+C, Enter', textToCopy);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   10. Interactive Contact Form
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'fa-triangle-exclamation');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Preparing message...`;

    setTimeout(() => {
      // Create mailto link for direct sending
      const mailtoUrl = `mailto:eman01232002@gmail.com?subject=${encodeURIComponent(
        subject || `Portfolio Contact from ${name}`
      )}&body=${encodeURIComponent(
        `Hi Iman,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      showToast(`Thank you ${name}! Opening your email client... ✉️`, 'fa-paper-plane');
      window.location.href = mailtoUrl;

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
    }, 900);
  });
}

/* --------------------------------------------------------------------------
   11. Dark / Light Theme Toggle
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('iman-portfolio-theme') || 'dark';
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    toggleBtn.innerHTML = '<i class="fa-solid fa-moon text-indigo-400"></i>';
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('iman-portfolio-theme', 'dark');
      toggleBtn.innerHTML = '<i class="fa-solid fa-sun text-amber-400"></i>';
      showToast('Switched to Dark Theme 🌙');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('iman-portfolio-theme', 'light');
      toggleBtn.innerHTML = '<i class="fa-solid fa-moon text-indigo-400"></i>';
      showToast('Switched to Light Theme ☀️');
    }
  });
}

/* --------------------------------------------------------------------------
   12. Mobile Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuDropdown = document.getElementById('mobile-menu-dropdown');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  if (!menuBtn || !menuDropdown) return;

  menuBtn.addEventListener('click', () => {
    menuDropdown.classList.toggle('hidden');
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuDropdown.classList.add('hidden');
    });
  });
}

/* --------------------------------------------------------------------------
   13. 3D Card Tilt on Mouse Move
   -------------------------------------------------------------------------- */
function initTiltEffects() {
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const rotateX = deltaY * -7;
      const rotateY = deltaX * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}
