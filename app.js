/* Data + DOM helpers */
let resume = null;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Load resume data from JSON file */
async function loadResumeData() {
  try {
    const response = await fetch(CONFIG.paths.resumeData);
    if (!response.ok) {
      throw new Error(`Failed to load resume data: ${response.status}`);
    }
    const data = await response.json();
    
    // Transform data structure to match what the code expects
    resume = {
      basics: data.basics,
      sections: {
        summary: data.summary ? {
          content: data.summary.content
        } : null,
        profiles: data.sections?.profiles || { items: [] },
        experience: data.sections?.experience ? {
          items: (data.sections.experience.items || []).map(item => ({
            ...item,
            date: item.period || '',
            summary: item.description || '',
            website: item.website || null
          }))
        } : { items: [] },
        projects: data.sections?.projects ? {
          items: (data.sections.projects.items || []).map(item => ({
            ...item,
            url: item.website ? { href: item.website.url || '' } : { href: '' },
            summary: item.description || ''
          }))
        } : { items: [] },
        education: data.sections?.education ? {
          items: (data.sections.education.items || []).map(item => ({
            ...item,
            institution: item.school || '',
            studyType: item.degree || '',
            score: item.grade || '',
            date: item.period || '',
            summary: item.description || ''
          }))
        } : { items: [] },
        skills: data.sections?.skills || { items: [] },
        languages: data.sections?.languages || { items: [] }
      }
    };
    
    // Initialize the page after data is loaded
    initializePage();
    
    // Re-initialize animations after page content is loaded
    setTimeout(() => {
      if (window.scrollObserver) {
        initScrollAnimations();
      }
    }, 200);
  } catch (error) {
    console.error('Error loading resume data:', error);
    // Show error message to user
    document.body.innerHTML = CONFIG.errors.resumeLoadError;
  }
}

/* Theme */
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const savedTheme = localStorage.getItem(CONFIG.storage.theme);

// Apply saved theme
if (savedTheme) {
  const themeClasses = savedTheme.split(' ').filter(c => c);
  themeClasses.forEach(cls => {
    if (cls.startsWith('theme-')) {
      body.classList.add(cls);
    }
  });
}

function updateThemeIcon() { 
  themeToggle.querySelector('.icon').textContent = body.classList.contains('theme-dark') 
    ? CONFIG.theme.icons.dark 
    : CONFIG.theme.icons.light; 
}

function updateThemeColor() {
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', body.classList.contains('theme-dark') 
      ? CONFIG.theme.colors.dark 
      : CONFIG.theme.colors.light);
  }
}

function saveTheme() {
  const classes = Array.from(body.classList).filter(c => c.startsWith('theme-')).join(' ');
  localStorage.setItem(CONFIG.storage.theme, classes);
}

updateThemeIcon();
updateThemeColor();

themeToggle.addEventListener('click', () => {
  if (body.classList.contains('theme-dark')) {
    body.classList.remove('theme-dark');
    body.classList.add('theme-light');
  } else {
    body.classList.remove('theme-light');
    body.classList.add('theme-dark');
  }
  saveTheme();
  updateThemeIcon();
  updateThemeColor();
});

/* Initialize page with resume data */
function initializePage() {
  if (!resume) return;
  
  /* Bind basics */
  $('[data-name]').textContent = resume.basics.name;
  $('[data-headline]').textContent = `${resume.basics.headline}${CONFIG.display.headlineSuffix}`;
  $('#emailLink').href = `mailto:${resume.basics.email}`;
  $('#footerEmail').href = `mailto:${resume.basics.email}`;
  
  // Update footer location from JSON
  if (resume.basics.location) {
    $('#footerLocation').textContent = `${resume.basics.location} • Remote friendly`;
  }
  
  // Add website/portfolio link if available
  if (resume.basics.website?.url) {
    const websiteLabel = resume.basics.website.label || 'Portfolio';
    const footerLinks = $('.footer-links');
    if (footerLinks && !$('#footerWebsite')) {
      const websiteLink = document.createElement('a');
      websiteLink.id = 'footerWebsite';
      websiteLink.href = resume.basics.website.url;
      websiteLink.target = '_blank';
      websiteLink.rel = 'noopener';
      websiteLink.textContent = websiteLabel;
      footerLinks.appendChild(websiteLink);
    }
  }
  
  // Add phone number to footer location if available
  if (resume.basics.phone) {
    const footerLocation = $('#footerLocation');
    if (footerLocation) {
      const currentText = footerLocation.textContent;
      footerLocation.innerHTML = `${currentText}<br><a href="tel:${resume.basics.phone.replace(/\s/g, '')}" class="muted-link">${resume.basics.phone}</a>`;
    }
  }

  /* Summary */
  const summaryHtml = resume.sections?.summary?.content || '';
  $('#summaryText').innerHTML = summaryHtml;

  /* Profiles (GitHub, LinkedIn) */
  const profiles = resume.sections?.profiles?.items || [];
  const github = profiles.find(p => (p.network || '').toLowerCase().includes('github'));
  const linkedin = profiles.find(p => (p.network || '').toLowerCase().includes('linkedin'));
  if (github) {
    const githubUrl = github.website?.url || github.url?.href || '#';
    $('#githubLink').href = githubUrl;
    $('#footerGithub').href = githubUrl;
  }
  if (linkedin) {
    const linkedinUrl = linkedin.website?.url || linkedin.url?.href || '#';
    $('#linkedinLink').href = linkedinUrl;
    $('#footerLinkedin').href = linkedinUrl;
  }

/* Featured topic cards */
const topics = CONFIG.topics;
const chipRow = document.getElementById('topicChips');
const topicGrid = document.getElementById('topicGrid');
let activeFilter = 'all';

function renderChips() {
  const allChips = ['all', ...topics.map(t => t.id)];
  chipRow.innerHTML = allChips.map(id => {
    const label = id === 'all' ? 'All' : id[0].toUpperCase() + id.slice(1);
    return `<button class="chip ${id === activeFilter ? 'active' : ''}" data-chip="${id}">${label}</button>`;
  }).join('');
}

function renderTopicCards() {
  const filtered = activeFilter === 'all' ? topics : topics.filter(t => t.id === activeFilter);
  topicGrid.innerHTML = filtered.map(t => `
    <article class="card tilt animate-on-scroll" data-tilt data-id="${t.id}">
      <div class="card-title">${t.title}</div>
      <div class="card-meta">${t.meta}</div>
      <div class="card-body">${t.body}</div>
      <div class="card-actions">
        <div class="tag-row">${t.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        <button class="expand" aria-expanded="false">Details</button>
      </div>
      <div class="card-details">${t.details}</div>
    </article>
  `).join('');

  // Hook up card interactions
  $$('.card .expand', topicGrid).forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.card');
      const expanded = card.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', String(expanded));
    });
  });

  enableTilt($$('.tilt', topicGrid));
  
  // Re-initialize scroll animations for new cards
  if (window.scrollObserver) {
    $$('.card', topicGrid).forEach(card => {
      window.scrollObserver.observe(card);
    });
  }
}

chipRow.addEventListener('click', (e) => {
  const chip = e.target.closest('[data-chip]');
  if (!chip) return;
  activeFilter = chip.getAttribute('data-chip');
  renderChips();
  renderTopicCards();
});

function enableTilt(cards) {
  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -CONFIG.animation.tilt.range;
      const ry = ((x / rect.width) - 0.5) * CONFIG.animation.tilt.range;
      card.style.transform = `perspective(${CONFIG.animation.tilt.perspective}) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = `perspective(${CONFIG.animation.tilt.perspective}) rotateX(0) rotateY(0)`;
    });
  });
}

renderChips();
renderTopicCards();

  /* Experience */
  const expList = document.getElementById('experienceList');
  (resume.sections?.experience?.items || []).forEach(item => {
    const el = document.createElement('article');
    el.className = 'timeline-item animate-on-scroll';
    
    // Create company name with link if website exists
    const companyName = item.website?.url 
      ? `<a href="${item.website.url}" target="_blank" rel="noopener" class="company-link">${item.company}</a>`
      : item.company;
    
    el.innerHTML = `
      <div class="timeline-head">
        <div>
          <div class="timeline-title">${item.position} • ${companyName}</div>
          <div class="timeline-meta">${item.date}</div>
        </div>
      </div>
      <div class="timeline-body">${item.summary || ''}</div>
    `;
    expList.appendChild(el);
  });

  /* Projects */
  const projectsGrid = document.getElementById('projectsGrid');
  const projectCards = [];
  (resume.sections?.projects?.items || []).filter(p => p.hidden !== true).forEach(p => {
    const el = document.createElement('article');
    el.className = 'card tilt animate-on-scroll';
    el.innerHTML = `
      <div class="card-title">${p.name}</div>
      <div class="card-meta"></div>
      <div class="card-body">${p.summary || p.description || ''}</div>
      <div class="card-actions">
        <div class="tag-row"></div>
        ${p.url?.href ? `<a href="${p.url.href}" target="_blank" class="btn btn-ghost">Open</a>` : ''}
      </div>
    `;
    projectsGrid.appendChild(el);
    projectCards.push(el);
  });
  enableTilt(projectCards);

  /* Education */
  const eduList = document.getElementById('educationList');
  (resume.sections?.education?.items || []).forEach(ed => {
    const el = document.createElement('article');
    el.className = 'edu-item animate-on-scroll';
    el.innerHTML = `
      <div class="timeline-title">${ed.studyType} • ${ed.institution}</div>
      <div class="timeline-meta">${ed.area || ''} ${ed.score ? '• ' + ed.score : ''} • ${ed.date || ''}</div>
      <div class="timeline-body">${ed.summary || ''}</div>
    `;
    eduList.appendChild(el);
  });

  /* Skills */
  const skillsCloud = document.getElementById('skillsCloud');
  (resume.sections?.skills?.items || []).forEach(s => {
    const el = document.createElement('span');
    el.className = 'skill animate-on-scroll';
    el.textContent = s.name;
    skillsCloud.appendChild(el);
  });

  /* Languages */
  const languagesList = document.getElementById('languagesList');
  if (languagesList) {
    const languages = resume.sections?.languages?.items || [];
    if (languages.length > 0) {
      languagesList.innerHTML = languages.map((lang, index) => {
        const fluency = lang.fluency || '';
        return `
          <div class="language-item animate-on-scroll" style="transition-delay: ${index * 0.1}s">
            <span class="language-name">${lang.language}</span>
            ${fluency ? `<span class="language-fluency">${fluency}</span>` : ''}
          </div>
        `;
      }).join('');
    }
  }
}

/* Apply section visibility based on config */
function applySectionVisibility() {
  // Hide/show sections
  Object.keys(CONFIG.sections).forEach(sectionId => {
    const section = document.getElementById(sectionId);
    const navLink = document.querySelector(`a.nav-link[href="#${sectionId}"]`);
    
    if (section) {
      section.style.display = CONFIG.sections[sectionId] ? '' : 'none';
    }
    
    if (navLink) {
      navLink.style.display = CONFIG.sections[sectionId] ? '' : 'none';
    }
  });
}

/* Load Profile Art */
async function loadProfileArt() {
  try {
    const response = await fetch(CONFIG.paths.profileArt);
    const html = await response.text();
    
    // Load into hero section
    const profileArt = document.getElementById('profileArt');
    if (profileArt) {
      profileArt.innerHTML = html;
    }
    
  } catch (error) {
    console.log(CONFIG.errors.profileArtNotFound);
    // Fallback: create a simple profile placeholder
    const profileArt = document.getElementById('profileArt');
    if (profileArt) {
      profileArt.innerHTML = CONFIG.fallbacks.profileArt;
    }
  }
}

// Load profile art when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProfileArt);
} else {
  loadProfileArt();
}

/* Scroll Animations with Intersection Observer */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Store observer globally for re-use
  window.scrollObserver = observer;

  // Observe all cards
  document.querySelectorAll('.card.animate-on-scroll').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
  });

  // Observe timeline items
  document.querySelectorAll('.timeline-item.animate-on-scroll').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });

  // Observe education items
  document.querySelectorAll('.edu-item.animate-on-scroll').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });

  // Observe skills
  document.querySelectorAll('.skill.animate-on-scroll').forEach((skill, index) => {
    skill.style.transitionDelay = `${index * 0.05}s`;
    observer.observe(skill);
  });

  // Observe language items
  document.querySelectorAll('.language-item.animate-on-scroll').forEach((item, index) => {
    observer.observe(item);
  });

  // Observe sections
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
}

/* Parallax Effect */
function initParallax() {
  const hero = document.querySelector('.hero');
  const orbs = document.querySelectorAll('.orb');
  
  if (!hero) return;

  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;

    // Only apply parallax to orbs, not profile art
    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 0.2;
      orb.style.transform = `translateY(${rate * speed}px)`;
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);
}

/* Smooth Scroll for Navigation Links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* Enhanced Micro-interactions */
function initMicroInteractions() {
  // Button ripple effect
  document.querySelectorAll('.btn, .chip, .icon-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Card hover glow effect
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angleX = (y - centerY) / 10;
      const angleY = (centerX - x) / 10;
      
      this.style.setProperty('--mouse-x', `${x}px`);
      this.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* Add ripple effect styles dynamically */
function addRippleStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .btn, .chip, .icon-btn {
      position: relative;
      overflow: hidden;
    }
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Load resume data when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    applySectionVisibility();
    loadResumeData();
    addRippleStyles();
    initSmoothScroll();
    initMicroInteractions();
    
    // Initialize animations after data loads
    setTimeout(() => {
      initScrollAnimations();
      initParallax();
    }, 300);
  });
} else {
  applySectionVisibility();
  loadResumeData();
  addRippleStyles();
  initSmoothScroll();
  initMicroInteractions();
  
  // Initialize animations after data loads
  setTimeout(() => {
    initScrollAnimations();
    initParallax();
  }, 300);
}