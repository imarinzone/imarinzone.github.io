# RxResume Portfolio Themes

A static portfolio site that renders content strictly from the [RxResume JSON schema](https://rxresu.me/schema.json).

## Structure

```
.
├── Dockerfile                 # Multi-stage build: test → nginx serve
├── Makefile                   # Dev, test, and Docker helpers
├── docker/
│   └── nginx.conf             # nginx config for the serve stage
├── index.html                 # Redirects to default theme
├── config.js                  # Technical config (paths, theme, errors)
├── resume/
│   └── Reactive Resume.json       # RxResume JSON — source of truth
├── src/
│   ├── profile.html           # Optional ASCII profile art block
│   └── rxresume.js            # Shared schema loader and helpers
├── themes/
│   ├── modern/                # Default dark/light theme
│   ├── graphic/               # Bold poster-style theme
│   ├── newspaper/             # Vintage parchment theme
│   └── vscode/                # Dracula-inspired IDE theme
└── tests/
    └── json-processing.test.js
```

## Quick Start

### Without Docker

```bash
make dev          # serves on http://localhost:8080
```

Or with a custom port:

```bash
make dev PORT=3000
```

### With Docker

```bash
make build        # build image (runs tests inside)
make run          # start container on http://localhost:8080
make stop         # stop the container
make clean        # stop + remove image
```

Override image name or tag:

```bash
make build IMAGE=myportfolio TAG=v1.0.0
make run  IMAGE=myportfolio TAG=v1.0.0 PORT=9000
```

### Tests only

```bash
make test
# or
npm test
```

### All available targets

```
make help
```

## Data Contract

All rendered content is read directly from `resume/Reactive Resume.json` using these RxResume schema fields — no alias transformations are applied.

| Section | Fields used |
|---|---|
| `basics` | `name`, `headline`, `email`, `location`, `website.url` |
| `summary` | `content` |
| `sections.profiles` | `items[*].network`, `items[*].username`, `items[*].website.url` |
| `sections.experience` | `items[*].position`, `items[*].company`, `items[*].period`, `items[*].description`, `items[*].website.url` |
| `sections.education` | `items[*].degree`, `items[*].school`, `items[*].area`, `items[*].grade`, `items[*].period` |
| `sections.projects` | `items[*].name`, `items[*].description`, `items[*].website.url` |
| `sections.skills` | `items[*].name` |
| `sections.languages` | `items[*].language`, `items[*].fluency` |

Hidden items (`hidden: true`) are filtered out by `src/rxresume.js` before rendering.

## Themes

| Path | Theme |
|---|---|
| `/` | Modern (default) |
| `/themes/graphic/` | Graphic |
| `/themes/newspaper/` | Newspaper |
| `/themes/vscode/` | VS Code |

## Deployment

The Dockerfile uses a two-stage build:

1. **Build stage** — installs Node, runs `npm test`; fails fast if schema contract is broken.
2. **Serve stage** — copies static assets into an `nginx:alpine` image with security headers and gzip enabled.

The resulting image is fully self-contained and suitable for any container platform (Docker, Kubernetes, Cloud Run, Fly.io, etc.).
