/* Data + DOM helpers */
const resume = JSON.parse(document.getElementById('resume-data').textContent);
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Theme */
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) body.className = savedTheme;
function updateThemeIcon() { themeToggle.querySelector('.icon').textContent = body.classList.contains('theme-dark') ? '☾' : '☀'; }
updateThemeIcon();
themeToggle.addEventListener('click', () => {
  if (body.classList.contains('theme-dark')) {
    body.classList.remove('theme-dark');
    body.classList.add('theme-light');
  } else {
    body.classList.remove('theme-light');
    body.classList.add('theme-dark');
  }
  localStorage.setItem('theme', body.className);
  updateThemeIcon();
});

/* Bind basics */
$('[data-name]').textContent = resume.basics.name;
$('[data-headline]').textContent = `${resume.basics.headline} — Backend & Cloud`;
$('#emailLink').href = `mailto:${resume.basics.email}`;
$('#footerEmail').href = `mailto:${resume.basics.email}`;

/* Summary */
const summaryHtml = resume.sections?.summary?.content || '';
$('#summaryText').innerHTML = summaryHtml;

/* Profiles (GitHub, LinkedIn) */
const profiles = resume.sections?.profiles?.items || [];
const github = profiles.find(p => (p.network || '').toLowerCase().includes('github'));
const linkedin = profiles.find(p => (p.network || '').toLowerCase().includes('linkedin'));
if (github) {
  $('#githubLink').href = github.url?.href || '#';
  $('#footerGithub').href = github.url?.href || '#';
}
if (linkedin) {
  $('#linkedinLink').href = linkedin.url?.href || '#';
  $('#footerLinkedin').href = linkedin.url?.href || '#';
}

/* Featured topic cards */
const topics = [
  {
    id: 'golang',
    title: 'Golang Microservices',
    meta: 'Latency-first APIs, clean architecture',
    body: 'Design and ship microservices in Go with crisp contracts, observability, and strict SLAs.',
    tags: ['Go', 'REST', 'gRPC', 'GraphQL'],
    details: 'Built production services at Walmart & Replicon; feature flags, versioned APIs, and load testing baked in.'
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes & SRE',
    meta: 'Operational excellence at scale',
    body: 'Design clusters, test harnesses, and SLOs. Automate chaos & regression gates to block p0 failures.',
    tags: ['K8s', 'SRE', 'Helm', 'SLO'],
    details: 'Internal testing framework prevented p0s hitting prod; cluster tooling and golden-path runbooks.'
  },
  {
    id: 'streaming',
    title: 'Streaming & Messaging',
    meta: 'Throughput and consistency',
    body: 'Kafka producers/consumers with idempotency, retries, and compacted topics for critical paths.',
    tags: ['Kafka', 'Backpressure', 'Tracing'],
    details: 'Served ~10k users/sec in exam traffic bursts with resilient stream processing.'
  },
  {
    id: 'datastores',
    title: 'Data stores',
    meta: 'Relational foundations, pragmatic schema',
    body: 'PostgreSQL/MySQL with strong migrations, indexing, and query plans that stay fast.',
    tags: ['PostgreSQL', 'MySQL', 'Migrations'],
    details: 'Centralized tuition DB; safe rollouts and controlled backfills.'
  },
  {
    id: 'apis',
    title: 'API Protocols',
    meta: 'Right tool for the path',
    body: 'Mix of REST/GraphQL/gRPC to balance evolvability with performance and client needs.',
    tags: ['REST', 'GraphQL', 'gRPC'],
    details: 'Cut round-trips and stabilized payloads for low-latency prescription flows.'
  },
  {
    id: 'cloud',
    title: 'Cloud & Infra',
    meta: 'AWS/Azure, containers, IaC',
    body: 'Dockerized services, Terraform modules, and secure pipelines deployed with confidence.',
    tags: ['AWS', 'Azure', 'Docker', 'Terraform'],
    details: 'Hardened build pipelines and reproducible environments from dev to prod.'
  }
];

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
    <article class="card tilt" data-tilt data-id="${t.id}">
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
      const rx = ((y / rect.height) - 0.5) * -8; // tilt range
      const ry = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
    });
  });
}

renderChips();
renderTopicCards();

/* Experience */
const expList = document.getElementById('experienceList');
(resume.sections?.experience?.items || []).forEach(item => {
  const el = document.createElement('article');
  el.className = 'timeline-item';
  el.innerHTML = `
    <div class="timeline-head">
      <div>
        <div class="timeline-title">${item.position} • ${item.company}</div>
        <div class="timeline-meta">${item.date}</div>
      </div>
    </div>
    <div class="timeline-body">${item.summary || ''}</div>
  `;
  expList.appendChild(el);
});

/* Projects */
const projectsGrid = document.getElementById('projectsGrid');
(resume.sections?.projects?.items || []).filter(p => p.visible !== false).forEach(p => {
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <div class="card-title">${p.name}</div>
    <div class="card-meta">${p.description || ''}</div>
    <div class="card-body">${p.summary || ''}</div>
    <div class="card-actions">
      <div class="tag-row"></div>
      ${p.url?.href ? `<a href="${p.url.href}" target="_blank" class="btn btn-ghost">Open</a>` : ''}
    </div>
  `;
  projectsGrid.appendChild(el);
});

/* Education */
const eduList = document.getElementById('educationList');
(resume.sections?.education?.items || []).forEach(ed => {
  const el = document.createElement('article');
  el.className = 'edu-item';
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
  el.className = 'skill';
  el.textContent = s.name;
  skillsCloud.appendChild(el);
});
