/* VS Code Theme — Data loading & rendering as code files
   Loads the same resume JSON + config as the main site */

let resume = null;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Helpers */
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function stripHtml(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || '';
}

function line(num, code) {
  return `<div class="vsc-line"><span class="vsc-line-num">${num}</span><span class="vsc-line-code">${code}</span></div>`;
}

/* Load data */
async function loadResumeData() {
  try {
    const response = await fetch(CONFIG.paths.resumeData);
    if (!response.ok) throw new Error(`Failed: ${response.status}`);
    const data = await response.json();

    resume = {
      basics: data.basics,
      sections: {
        summary: data.summary ? { content: data.summary.content } : null,
        profiles: data.sections?.profiles || { items: [] },
        experience: data.sections?.experience ? {
          items: (data.sections.experience.items || []).map(item => ({
            ...item, date: item.period || '', summary: item.description || '', website: item.website || null
          }))
        } : { items: [] },
        projects: data.sections?.projects ? {
          items: (data.sections.projects.items || []).map(item => ({
            ...item, url: item.website ? { href: item.website.url || '' } : { href: '' }, summary: item.description || ''
          }))
        } : { items: [] },
        education: data.sections?.education ? {
          items: (data.sections.education.items || []).map(item => ({
            ...item, institution: item.school || '', studyType: item.degree || '', score: item.grade || '', date: item.period || '', summary: item.description || ''
          }))
        } : { items: [] },
        skills: data.sections?.skills || { items: [] },
        languages: data.sections?.languages || { items: [] }
      }
    };

    renderAllPanels();
  } catch (error) {
    console.error('Error loading resume data:', error);
    $('#panel-about_me').innerHTML = '<div style="padding:2rem;color:#f38ba8;">Error loading resume data. Check resume/resume-data.json.</div>';
    $('#panel-about_me').classList.add('active');
  }
}

/* Render code panels */
function renderAllPanels() {
  if (!resume) return;
  renderAboutMe();
  renderExperience();
  renderProjects();
  renderSkills();
  renderContact();
}

function renderAboutMe() {
  const b = resume.basics;
  const summary = stripHtml(resume.sections?.summary?.content || '').trim();
  const summaryLines = wrapText(summary, 60);

  let n = 1;
  let html = '';
  html += line(n++, `<span class="syn-kw">package</span> <span class="syn-pkg">main</span>`);
  html += line(n++, '');
  html += line(n++, `<span class="syn-kw">import</span> (<span class="syn-str">"fmt"</span>, <span class="syn-str">"skills"</span>)`);
  html += line(n++, '');
  html += line(n++, `<span class="syn-kw">type</span> <span class="syn-type">Developer</span> <span class="syn-kw">struct</span> {`);
  html += line(n++, `    Name     <span class="syn-type">string</span>`);
  html += line(n++, `    Role     <span class="syn-type">string</span>`);
  html += line(n++, `    PhotoURL <span class="syn-type">string</span>`);
  html += line(n++, `}`);
  html += line(n++, '');
  html += line(n++, `<span class="syn-kw">func</span> <span class="syn-func">main</span>() {`);
  html += line(n++, `    arin := <span class="syn-type">Developer</span>{`);
  html += line(n++, `        Name:     <span class="syn-str">"${esc(b.name)}"</span>,`);
  html += line(n++, `        Role:     <span class="syn-str">"${esc(b.headline)}${esc(CONFIG.display.headlineSuffix)}"</span>,`);
  html += line(n++, `        PhotoURL: <span class="syn-str">"images/arindam_profile.png"</span>,`);
  html += line(n++, `    }`);
  html += line(n++, `    fmt.<span class="syn-func">Println</span>(arin)`);
  html += line(n++, `}`);
  html += line(n++, '');

  // Profile art in comment block
  html += line(n++, `<span class="syn-comment">/**</span>`);
  html += `<div class="vsc-profile-embed" id="profileArtVsc"></div>`;
  const commentLines = 6;
  for (let i = 0; i < commentLines; i++) {
    html += line(n++, `<span class="syn-comment">//</span>`);
  }
  html += line(n++, `<span class="syn-comment">*/</span>`);
  html += line(n++, '');

  // Summary as comment block
  html += line(n++, `<span class="syn-comment">// Summary:</span>`);
  summaryLines.forEach(l => {
    html += line(n++, `<span class="syn-comment">// ${esc(l)}</span>`);
  });
  html += line(n++, '');

  $('#panel-about_me').innerHTML = html;

  // Load profile art into embed
  loadProfileArt();
}

function renderExperience() {
  const items = resume.sections?.experience?.items || [];
  let n = 1;
  let html = '';

  html += line(n++, `<span class="syn-comment"># Experience</span>`);
  html += line(n++, '');

  items.forEach((item, idx) => {
    html += line(n++, `<span class="syn-tag">- position</span>: <span class="syn-str">"${esc(item.position)}"</span>`);
    html += line(n++, `  <span class="syn-tag">company</span>: <span class="syn-str">"${esc(item.company)}"</span>`);
    html += line(n++, `  <span class="syn-tag">period</span>: <span class="syn-str">"${esc(item.date)}"</span>`);
    if (item.website?.url) {
      html += line(n++, `  <span class="syn-tag">website</span>: <span class="syn-link">${esc(item.website.url)}</span>`);
    }
    // Parse description bullets
    const desc = stripHtml(item.summary || '').trim();
    if (desc) {
      html += line(n++, `  <span class="syn-tag">description</span>: |`);
      const descLines = wrapText(desc, 70);
      descLines.forEach(l => {
        html += line(n++, `    <span class="syn-str">${esc(l)}</span>`);
      });
    }
    if (idx < items.length - 1) html += line(n++, '');
  });

  $('#panel-experience').innerHTML = html;
}

function renderProjects() {
  const items = (resume.sections?.projects?.items || []).filter(p => p.hidden !== true);
  let n = 1;
  let html = '';

  html += line(n++, `{`);
  html += line(n++, `  <span class="syn-key">"projects"</span>: [`);

  items.forEach((p, idx) => {
    html += line(n++, `    {`);
    html += line(n++, `      <span class="syn-key">"name"</span>: <span class="syn-str">"${esc(p.name)}"</span>,`);
    const desc = stripHtml(p.summary || p.description || '').trim();
    const descEsc = esc(desc.length > 120 ? desc.slice(0, 120) + '...' : desc);
    html += line(n++, `      <span class="syn-key">"description"</span>: <span class="syn-str">"${descEsc}"</span>,`);
    if (p.url?.href) {
      html += line(n++, `      <span class="syn-key">"url"</span>: <span class="syn-str">"${esc(p.url.href)}"</span>,`);
    }
    html += line(n++, `      <span class="syn-key">"hidden"</span>: <span class="syn-bool">false</span>`);
    html += line(n++, `    }${idx < items.length - 1 ? ',' : ''}`);
  });

  html += line(n++, `  ]`);
  html += line(n++, `}`);

  $('#panel-projects').innerHTML = html;
}

function renderSkills() {
  const skills = resume.sections?.skills?.items || [];
  const languages = resume.sections?.languages?.items || [];
  let n = 1;
  let html = '';

  html += line(n++, `<span class="syn-comment"># Skills & Languages</span>`);
  html += line(n++, '');
  html += line(n++, `<span class="syn-section">[skills]</span>`);

  skills.forEach(s => {
    html += line(n++, `<span class="syn-attr">${esc(s.name.replace(/[\s\/]/g, '_').toLowerCase())}</span> = <span class="syn-bool">true</span>`);
  });

  html += line(n++, '');
  html += line(n++, `<span class="syn-section">[languages]</span>`);

  languages.forEach(l => {
    html += line(n++, `<span class="syn-attr">${esc(l.language.toLowerCase())}</span> = <span class="syn-str">"${esc(l.fluency || 'N/A')}"</span>`);
  });

  // Education
  const education = resume.sections?.education?.items || [];
  if (education.length) {
    html += line(n++, '');
    html += line(n++, `<span class="syn-section">[education]</span>`);
    education.forEach(ed => {
      html += line(n++, '');
      html += line(n++, `<span class="syn-section">[[education.items]]</span>`);
      html += line(n++, `<span class="syn-attr">degree</span> = <span class="syn-str">"${esc(ed.studyType)}"</span>`);
      html += line(n++, `<span class="syn-attr">school</span> = <span class="syn-str">"${esc(ed.institution)}"</span>`);
      if (ed.area) html += line(n++, `<span class="syn-attr">area</span> = <span class="syn-str">"${esc(ed.area)}"</span>`);
      if (ed.score) html += line(n++, `<span class="syn-attr">grade</span> = <span class="syn-str">"${esc(ed.score)}"</span>`);
      html += line(n++, `<span class="syn-attr">period</span> = <span class="syn-str">"${esc(ed.date)}"</span>`);
    });
  }

  $('#panel-skills').innerHTML = html;
}

function renderContact() {
  const b = resume.basics;
  const profiles = resume.sections?.profiles?.items || [];
  const github = profiles.find(p => (p.network || '').toLowerCase().includes('github'));
  const linkedin = profiles.find(p => (p.network || '').toLowerCase().includes('linkedin'));
  let n = 1;
  let html = '';

  html += line(n++, `<span class="syn-heading"># Contact</span>`);
  html += line(n++, '');
  html += line(n++, `<span class="syn-heading">## ${esc(b.name)}</span>`);
  html += line(n++, '');
  html += line(n++, `<span class="syn-bullet">-</span> <span class="syn-bold">Email:</span> <span class="syn-link">${esc(b.email)}</span>`);
  if (b.location) {
    html += line(n++, `<span class="syn-bullet">-</span> <span class="syn-bold">Location:</span> ${esc(b.location)}`);
  }
  if (b.website?.url) {
    html += line(n++, `<span class="syn-bullet">-</span> <span class="syn-bold">Portfolio:</span> <span class="syn-link">${esc(b.website.url)}</span>`);
  }
  if (github) {
    const url = github.website?.url || github.url?.href || '';
    html += line(n++, `<span class="syn-bullet">-</span> <span class="syn-bold">GitHub:</span> <span class="syn-link">${esc(url)}</span>`);
  }
  if (linkedin) {
    const url = linkedin.website?.url || linkedin.url?.href || '';
    html += line(n++, `<span class="syn-bullet">-</span> <span class="syn-bold">LinkedIn:</span> <span class="syn-link">${esc(url)}</span>`);
  }
  html += line(n++, '');
  html += line(n++, `<span class="syn-heading">## Availability</span>`);
  html += line(n++, '');
  html += line(n++, `Open to backend and platform roles.`);
  html += line(n++, `${esc(b.location || '')} · Remote friendly`);
  html += line(n++, '');
  html += line(n++, `---`);
  html += line(n++, '');
  html += line(n++, `<span class="syn-comment">*View this portfolio in other themes:*</span>`);
  html += line(n++, `<span class="syn-bullet">-</span> [Default](./index.html)`);
  html += line(n++, `<span class="syn-bullet">-</span> [Graphic](./graphic.html)`);
  html += line(n++, `<span class="syn-bullet">-</span> [Newspaper](./newspaper.html)`);

  $('#panel-contact').innerHTML = html;

  const emailEl = $('#emailLink');
  if (emailEl) emailEl.href = `mailto:${b.email}`;
}

/* Word wrapping helper */
function wrapText(text, maxLen) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  words.forEach(w => {
    if (cur.length + w.length + 1 > maxLen) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cur ? cur + ' ' + w : w;
    }
  });
  if (cur) lines.push(cur);
  return lines;
}

/* Tab switching */
const tabFileMap = {
  about_me: { name: 'about_me.go', lang: 'Go' },
  experience: { name: 'experience.yml', lang: 'YAML' },
  projects: { name: 'projects.json', lang: 'JSON' },
  skills: { name: 'skills.toml', lang: 'TOML' },
  contact: { name: 'contact.md', lang: 'Markdown' },
};

function switchTab(tabId) {
  // Tabs
  $$('.vsc-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  // Tree items
  $$('.vsc-tree-item').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  // Panels
  $$('.vsc-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tabId}`));
  // Breadcrumb
  const info = tabFileMap[tabId];
  if (info) {
    $('#breadcrumbFile').textContent = info.name;
    $('#statusLang').textContent = info.lang;
  }
}

// Tab click
$$('.vsc-tab').forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

// Tree item click
$$('.vsc-tree-item').forEach(item => {
  item.addEventListener('click', () => switchTab(item.dataset.tab));
});

/* Load Profile Art */
async function loadProfileArt() {
  try {
    const response = await fetch(CONFIG.paths.profileArt);
    const html = await response.text();
    const el = $('#profileArtVsc');
    if (el) el.innerHTML = html;
  } catch {
    const el = $('#profileArtVsc');
    if (el) el.innerHTML = CONFIG.fallbacks?.profileArt || '';
  }
}

/* Init */
loadResumeData();
