/* Poster Page — Data loading & rendering
   Loads the same resume JSON + config as the main site */

let resume = null;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

async function loadResumeData() {
  try {
    const response = await fetch(CONFIG.paths.resumeData);
    if (!response.ok) throw new Error(`Failed to load resume data: ${response.status}`);
    const data = await response.json();

    resume = {
      basics: data.basics,
      sections: {
        summary: data.summary ? { content: data.summary.content } : null,
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

    initializePage();
  } catch (error) {
    console.error('Error loading resume data:', error);
    document.body.innerHTML = '<div style="padding:2rem;text-align:center"><h1>Error loading resume data</h1><p>Please check that resume/resume-data.json exists and is valid.</p></div>';
  }
}

function initializePage() {
  if (!resume) return;

  /* Basics */
  $$('[data-name]').forEach(el => el.textContent = resume.basics.name);
  const nameUpper = resume.basics.name.toUpperCase();
  const nameEl = $('.poster-name');
  if (nameEl) nameEl.textContent = nameUpper;

  $$('[data-headline]').forEach(el => {
    el.textContent = `${resume.basics.headline}${CONFIG.display.headlineSuffix}`.toUpperCase();
  });

  $('#emailLink').href = `mailto:${resume.basics.email}`;
  $('#footerEmail').href = `mailto:${resume.basics.email}`;

  if (resume.basics.location) {
    $('#footerLocation').textContent = `${resume.basics.location} · Remote friendly`;
  }

  /* Summary */
  const summaryHtml = resume.sections?.summary?.content || '';
  $('#summaryText').innerHTML = summaryHtml;

  /* Profiles */
  const profiles = resume.sections?.profiles?.items || [];
  const github = profiles.find(p => (p.network || '').toLowerCase().includes('github'));
  const linkedin = profiles.find(p => (p.network || '').toLowerCase().includes('linkedin'));
  if (github) {
    const url = github.website?.url || github.url?.href || '#';
    $('#githubLink').href = url;
    $('#footerGithub').href = url;
  }
  if (linkedin) {
    const url = linkedin.website?.url || linkedin.url?.href || '#';
    $('#linkedinLink').href = url;
    $('#footerLinkedin').href = url;
  }

  if (resume.basics.website?.url) {
    const footerLinks = $('.poster-footer-links');
    if (footerLinks) {
      const a = document.createElement('a');
      a.href = resume.basics.website.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = resume.basics.website.label || 'Portfolio';
      footerLinks.appendChild(a);
    }
  }

  /* Featured Topics */
  renderChips();
  renderTopicCards();

  /* Experience */
  const expList = $('#experienceList');
  (resume.sections?.experience?.items || []).forEach(item => {
    const companyName = item.website?.url
      ? `<a href="${item.website.url}" target="_blank" rel="noopener">${item.company}</a>`
      : item.company;
    const el = document.createElement('article');
    el.className = 'poster-timeline-item';
    el.innerHTML = `
      <div class="poster-timeline-head">
        <div class="poster-timeline-title">${item.position} · ${companyName}</div>
        <div class="poster-timeline-meta">${item.date}</div>
      </div>
      <div class="poster-timeline-body">${item.summary || ''}</div>
    `;
    expList.appendChild(el);
  });

  /* Projects */
  const projGrid = $('#projectsGrid');
  (resume.sections?.projects?.items || []).filter(p => p.hidden !== true).forEach(p => {
    const hasLink = p.url?.href;
    const el = document.createElement('article');
    el.className = `poster-project-card${hasLink ? ' has-link' : ''}`;
    el.innerHTML = `
      <div class="poster-project-title">${p.name}</div>
      <div class="poster-project-desc">${p.summary || p.description || ''}</div>
      ${hasLink ? `<a href="${p.url.href}" target="_blank" rel="noopener" class="poster-project-link">Open</a>` : ''}
    `;
    projGrid.appendChild(el);
  });

  /* Skills */
  const skillsCloud = $('#skillsCloud');
  (resume.sections?.skills?.items || []).forEach(s => {
    const el = document.createElement('span');
    el.className = 'poster-skill';
    el.textContent = s.name;
    skillsCloud.appendChild(el);
  });

  /* Languages */
  const langList = $('#languagesList');
  (resume.sections?.languages?.items || []).forEach(lang => {
    const el = document.createElement('div');
    el.className = 'poster-language';
    el.innerHTML = `<span class="poster-language-name">${lang.language}</span>${lang.fluency ? `<span class="poster-language-fluency">${lang.fluency}</span>` : ''}`;
    langList.appendChild(el);
  });

  /* Section visibility */
  applySectionVisibility();
}

/* Topic chips + cards */
const topics = CONFIG.topics;
let activeFilter = 'all';

function renderChips() {
  const chipRow = $('#topicChips');
  const allChips = ['all', ...topics.map(t => t.id)];
  chipRow.innerHTML = allChips.map(id => {
    const label = id === 'all' ? 'All' : id[0].toUpperCase() + id.slice(1);
    return `<button class="poster-chip${id === activeFilter ? ' active' : ''}" data-chip="${id}">${label}</button>`;
  }).join('');
}

function renderTopicCards() {
  const grid = $('#topicGrid');
  const filtered = activeFilter === 'all' ? topics : topics.filter(t => t.id === activeFilter);
  grid.innerHTML = filtered.map(t => `
    <article class="poster-expertise-card" data-id="${t.id}">
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

  $$('.poster-expertise-card .expand', grid).forEach(btn => {
    btn.addEventListener('click', e => {
      const card = e.currentTarget.closest('.poster-expertise-card');
      const expanded = card.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', String(expanded));
    });
  });
}

$('#topicChips').addEventListener('click', e => {
  const chip = e.target.closest('[data-chip]');
  if (!chip) return;
  activeFilter = chip.getAttribute('data-chip');
  renderChips();
  renderTopicCards();
});

function applySectionVisibility() {
  const sectionMap = {
    featured: '.poster-col-left .poster-section:first-of-type',
  };
  // Just respect config — hide entire sections if needed
  if (!CONFIG.sections.experience) {
    const el = $('#p-experience');
    if (el) el.style.display = 'none';
  }
  if (!CONFIG.sections.projects) {
    const el = $('#p-projects');
    if (el) el.style.display = 'none';
  }
  if (!CONFIG.sections.skills) {
    const el = $('#p-skills');
    if (el) el.style.display = 'none';
  }
}

/* Load Profile Art */
async function loadProfileArt() {
  try {
    const response = await fetch(CONFIG.paths.profileArt);
    const html = await response.text();
    const profileArt = $('#profileArt');
    if (profileArt) profileArt.innerHTML = html;
  } catch {
    const profileArt = $('#profileArt');
    if (profileArt) profileArt.innerHTML = CONFIG.fallbacks?.profileArt || '';
  }
}

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 70;
      const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  });
});

/* Init */
loadProfileArt();
loadResumeData();
