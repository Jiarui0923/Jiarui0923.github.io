# Jiarui Li — Personal Academic Website

[![Hexo](https://img.shields.io/badge/Hexo-6.3.0-0e83cd?logo=hexo)](https://hexo.io/)
[![Theme](https://img.shields.io/badge/Theme-Cupertino-0071e3)](https://github.com/MrWillCom/hexo-theme-cupertino)
[![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?logo=github)](https://pages.github.com/)

**[jiarui-li.com](https://jiarui-li.com)** — personal academic website built with [Hexo](https://hexo.io/) and the [Cupertino](https://github.com/MrWillCom/hexo-theme-cupertino) theme, hosted on GitHub Pages.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:4000)
npm run server

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 🏗️ Project Structure

```
Jiarui0923.github.io/
├── _config.yml                  # Hexo site configuration
├── source/
│   ├── _posts/                  # Blog posts (unused)
│   ├── papers/                  # 📄 Research papers
│   │   ├── index.md             #   Paper catalog (layout: catalog)
│   │   ├── AIMLSYS2024GPUMCMC/
│   │   ├── BIBM2024GPUCOREX/
│   │   ├── BCB2025EGM/
│   │   ├── ICLR2026QCAI/
│   │   └── LMRL2026TCREML/
│   ├── resume/
│   │   └── index.md             # Résumé page (layout: resume)
│   ├── images/                  # Site-wide images
│   └── CNAME                    # Custom domain
├── themes/
│   └── cupertino/               # Cupertino theme (modified)
│       └── layout/
│           ├── layout.ejs       # Root layout (bypasses for paper/catalog)
│           ├── paper.ejs        # Research paper template
│           ├── catalog.ejs      # Papers index / catalog template
│           └── resume.ejs       # Résumé template
└── package.json
```

---

## 📄 Paper Pages

Each paper lives in its own directory under `source/papers/` and is a **Hexo page** (`index.md`) with YAML front-matter:

```yaml
layout: paper
has_breadcrumb: true
has_is_mono: true
paper:       # Paper metadata
  title: ...
  publication: ...
  date: { month, year }
  abbr: ...
authors:     # Author list with affiliations
  - name: ...
    affiliation: ...
    link: ...
links:       # External links (paper, PDF, code, etc.)
  - name: Paper
    link: ...
    icon: ...
citations:   # Citation formats (Bibtex, APA, etc.)
  Bibtex: |
    @inproceedings{...}
document:    # Footer metadata
  centered: false
  footer: "CC BY 4.0"
---
Markdown body (paper abstract, figures, etc.)
```

The `paper.ejs` layout renders complete academic paper pages with:
- Froze navbar with section navigation
- Author affiliations with superscript markers
- Code blocks via CodeMirror with syntax highlighting (Cascadia Code font)
- Citation section with BibTeX syntax highlighting (no line numbers, auto wrapping)
- QR code share widget (theme-aware colors)
- Theme toggle (light/dark with CodeMirror adaptation)

---

## 🗂️ Paper Catalog (`/papers/`)

The `source/papers/index.md` page uses the `catalog` layout to display a searchable, filterable index of all publications:

- **Search** — real-time filtering by title, author, venue, keyword
- **Tag filtering** — tag pill buttons auto-generated from paper metadata
- **Pagination** — auto-splits at 10 papers per page
- **Theme-aware** — inherits Cupertino color scheme (light/dark/auto)
- Font Awesome & Academicons icons for paper links

---

## 📝 Resume Page (`/resume/`)

The `source/resume/index.md` page uses the `resume` layout — a minimalist template with:
- Title and content only (no license, tags, prev/next, or comments)
- Font Awesome & Academicons icon support
- TOC disabled for clean rendering

---

## Configuration

Edit `_config.yml` for site-wide settings and `themes/cupertino/_config.yml` for theme settings. Key theme features:

- Light / dark / auto color scheme
- Frosted-glass navigation
- Rainbow banner (Pride Month)
- Scroll reveal animations
- TOC support