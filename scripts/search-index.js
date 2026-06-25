/* global hexo */
'use strict';

// Custom search-index generator.
// Builds a JSON index (search.json) covering all posts and pages — _posts,
// papers/*, resume, and other source pages — with correct titles and
// searchable content extracted from both the body and front-matter.
// Consumed by themes/cupertino/source/js/search.js (fetches theme.search_path).

hexo.extend.generator.register('search-json', function (locals) {
  const root = hexo.config.root || '/';

  // --- helpers -------------------------------------------------------------
  function clean(str) {
    if (str == null) return '';
    return String(str)
      .replace(/<\/?[^>]+>/g, ' ')       // html tags
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // md images
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // md links -> text
      .replace(/[#>*_`~|]+/g, ' ')        // md punctuation
      .replace(/\s+/g, ' ')
      .trim();
  }

  function push(parts, value) {
    const c = clean(value);
    if (c) parts.push(c);
  }

  function authorsText(authors) {
    if (!Array.isArray(authors)) return '';
    return authors.map(function (a) { return a && a.name ? a.name : ''; }).join(' ');
  }

  function tableText(tbl, parts) {
    if (!tbl) return;
    (tbl.columns || []).forEach(function (c) { push(parts, c); });
    (tbl.rows || []).forEach(function (row) {
      (row || []).forEach(function (cell) { push(parts, cell); });
    });
  }

  function lastSegment(path) {
    const seg = String(path || '').replace(/\/?(index)?\.html?$/i, '').replace(/\/$/, '');
    const name = seg.split('/').pop() || seg;
    return name || path;
  }

  function deriveTitle(p) {
    if (p.title) return p.title;
    if (p.paper && p.paper.title) return p.paper.title;
    return lastSegment(p.path || p.source);
  }

  // Display string + sortable timestamp for the "update date".
  function deriveDate(p) {
    if (p.paper && p.paper.date && p.paper.date.year) {
      const d = p.paper.date;
      const text = (d.month ? d.month + ' ' : '') + d.year;
      const ts = Date.parse((d.month || 'Jan') + ' 1, ' + d.year) || 0;
      return { text: text, ts: ts };
    }
    const dt = p.date || p.updated;
    if (dt) {
      if (typeof dt.format === 'function') {
        return { text: dt.format('MMM D, YYYY'), ts: dt.valueOf() };
      }
      const jd = new Date(dt);
      if (!isNaN(jd.getTime())) {
        return {
          text: jd.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          ts: jd.getTime()
        };
      }
    }
    return { text: '', ts: 0 };
  }

  function tagNames(t) {
    if (!t) return [];
    if (Array.isArray(t)) {
      return t.map(function (x) { return x && x.name ? x.name : x; }).filter(Boolean);
    }
    if (Array.isArray(t.data)) {
      return t.data.map(function (x) { return x.name; });
    }
    if (typeof t.map === 'function') {
      return t.map(function (x) { return x && x.name ? x.name : x; }).filter(Boolean);
    }
    return [];
  }

  function collectContent(p) {
    const parts = [];
    push(parts, p._content);

    // Individual paper pages (layout: paper)
    if (p.paper) {
      push(parts, p.paper.title);
      push(parts, p.paper.publication);
      push(parts, p.paper.abbr);
    }
    push(parts, authorsText(p.authors));

    // Catalog page (papers/index.md) — paper data now lives in _data/papers.yml
    var catalogPapers = p.papers;
    if (!Array.isArray(catalogPapers) && p.type === 'catalog') {
      var dataAll = hexo.locals.get('data');
      if (dataAll && Array.isArray(dataAll.papers)) catalogPapers = dataAll.papers;
    }
    if (Array.isArray(catalogPapers)) {
      catalogPapers.forEach(function (item) {
        if (item.paper) {
          push(parts, item.paper.title);
          push(parts, item.paper.publication);
          push(parts, item.paper.abbr);
        }
        if (Array.isArray(item.tags)) push(parts, item.tags.join(' '));
        push(parts, authorsText(item.authors));
      });
    }

    // Projects index (projects/index.md)
    if (Array.isArray(p.projects)) {
      p.projects.forEach(function (proj) {
        push(parts, proj.title || proj.name);
        push(parts, proj.desc);
        if (Array.isArray(proj.tags)) push(parts, proj.tags.join(' '));
      });
    }

    // Resume: publications
    if (Array.isArray(p.publications)) {
      p.publications.forEach(function (sec) {
        push(parts, sec.section);
        (sec.items || []).forEach(function (it) {
          push(parts, it.title);
          push(parts, it.venue);
          push(parts, authorsText(it.authors));
        });
      });
    }

    // Resume: education
    if (Array.isArray(p.education)) {
      p.education.forEach(function (g) {
        push(parts, g.degree);
        (g.entries || []).forEach(function (e) {
          push(parts, e.institution);
          push(parts, e.detail);
          (e.notes || []).forEach(function (n) { push(parts, n); });
          push(parts, e.location);
        });
      });
    }

    // Resume: skills (nested label/value)
    if (Array.isArray(p.skills)) {
      p.skills.forEach(function (sec) {
        push(parts, sec.subsection);
        (sec.items || []).forEach(function (it) {
          push(parts, it.label);
          push(parts, it.value);
          (it.children || []).forEach(function (ch) {
            push(parts, ch.label);
            push(parts, ch.value);
          });
        });
      });
    }

    // Resume: contact / socials
    (p.contact || []).forEach(function (c) { push(parts, c.text); });
    (p.socials || []).forEach(function (s) { push(parts, s.title); });

    // Resume: single tables
    tableText(p.grants, parts);
    tableText(p.awards, parts);

    // Resume: sectioned tables
    [].concat(p.services || [], p.experiences || []).forEach(function (sec) {
      push(parts, sec.subsection);
      tableText(sec, parts);
    });

    return parts.join(' ');
  }

  function isExcludedPath(path) {
    const url = String(path || '');
    return (
      url === 'CNAME' ||
      url === 'manifest.json' ||
      /\.(json|js|css)$/i.test(url) ||
      url.indexOf('images/') === 0
    );
  }

  // --- build index ---------------------------------------------------------
  const items = [];
  const seen = {};

  function isIndexMd(src) {
    return /(^|[\/\\])index\.(md|markdown)$/i.test(src || '');
  }

  function add(p, isPost) {
    if (!p) return;
    if (p.indexing === false) return;
    if (p.type === 'search') return;
    if (p.layout === 'resume') return;        // resume must not appear in search
    if (/^resume(\/|$)/.test(p.path || '')) return;
    // Only index `index.md` pages, or markdown files inside _posts.
    if (!isPost && !isIndexMd(p.source)) return;
    if (isExcludedPath(p.path)) return;

    const url = root + p.path;
    if (seen[url]) return;
    seen[url] = true;

    const date = deriveDate(p);
    const tags = tagNames(p.tags);

    const item = {
      title: deriveTitle(p),
      url: url,
      icon: p.pageicon || 'fa-solid fa-paper-plane',
      content: collectContent(p),
      date: date.text,
      ts: date.ts
    };
    if (p.desc) item.desc = String(p.desc);
    if (tags.length) item.tags = tags;

    items.push(item);
  }

  locals.posts.each(function (p) { add(p, true); });
  locals.pages.each(function (p) { add(p, false); });

  // Newest first so the no-query "show all" view is ordered by update date.
  items.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });

  return {
    path: 'search.json',
    data: JSON.stringify(items)
  };
});
