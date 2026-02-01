// Configuration constants for the portfolio website

const CONFIG = {
  // File paths
  paths: {
    resumeData: './resume/resume-data.json',
    profileArt: './src/profile.html',
    faviconSvg: './favicon.svg',
    faviconIco: './favicon.ico'
  },

  // Theme configuration
  theme: {
    colors: {
      dark: '#0b0f14',
      light: '#f8f9fa'
    },
    icons: {
      dark: '☾',
      light: '☀'
    },
    defaultPalette: 'default',
    palettes: ['default', 'blue', 'purple', 'green', 'red', 'orange']
  },

  // LocalStorage keys
  storage: {
    theme: 'theme',
    palette: 'palette'
  },

  // Display text
  display: {
    headlineSuffix: ' — Backend & Cloud',
    featuredTitle: 'Areas of Expertise',
    footerText: {
      availability: 'Open to backend and platform roles',
      location: 'Kolkata, India • Remote friendly'
    }
  },

  // Section visibility configuration
  // Set to false to hide a section
  sections: {
    featured: true,      // Areas of Expertise section
    experience: true,     // Experience section
    projects: true,       // Projects section
    education: true,      // Education section
    skills: true,        // Skills section
    languages: true       // Languages section
  },

  // Animation settings
  animation: {
    tilt: {
      perspective: '900px',
      range: 8 // degrees
    }
  },

  // Featured topics/cards
  topics: [
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
  ],

  // Error messages
  errors: {
    resumeLoadError: '<div style="padding: 2rem; text-align: center;"><h1>Error loading resume data</h1><p>Please check that resume/resume-data.json exists and is valid.</p></div>',
    profileArtNotFound: 'Profile art not found, using fallback'
  },

  // Fallback content
  fallbacks: {
    profileArt: '<img src="profile.svg" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />'
  }
};

// Make CONFIG globally available
window.CONFIG = CONFIG;
