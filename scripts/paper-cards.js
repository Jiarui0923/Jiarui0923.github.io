/* global hexo */
'use strict';

// Inline `<<slug>>` paper-card syntax.
// A before_post_render filter replaces `<<slug>>` in markdown with a glass
// paper card (mirrors themes/cupertino/layout/_partial/paper-card.ejs), looking
// the paper up in source/_data/papers.yml (site.data.papers).

const fs = require('fs');
const path = require('path');

let mapCache = null;

function getPaperMap() {
  if (mapCache) return mapCache;
  let papers = null;
  try {
    const data = hexo.locals.get('data');
    if (data && Array.isArray(data.papers)) papers = data.papers;
  } catch (e) { /* not ready */ }
  if (!papers) {
    try {
      const yaml = require('js-yaml');
      const file = path.join(hexo.source_dir, '_data', 'papers.yml');
      papers = yaml.load(fs.readFileSync(file, 'utf8'));
    } catch (e) { papers = []; }
  }
  const map = {};
  (papers || []).forEach(function (entry) {
    if (!entry) return;
    if (entry.slug) map[entry.slug] = entry;   // papers with a dedicated page
    if (entry.ref) map[entry.ref] = entry;     // referenceable papers without a page
  });
  mapCache = map;
  return map;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderPaperCard(entry) {
  const root = hexo.config.root || '/';
  const pp = entry.paper || {};
  const slug = entry.slug;
  const links = entry.links || [];
  const authors = (entry.authors || []).map(function (a) { return esc(a.name); }).join(', ');
  const year = pp.date ? pp.date.year : '';
  const titleUrl = slug ? (root + 'papers/' + slug + '/') : (links[0] ? links[0].link : '');
  const venue = (pp.abbr ? '(' + esc(pp.abbr) + (year ? ' ' + esc(year) : '') + ') ' : '') + esc(pp.publication || '');
  const titleHtml = titleUrl ? '<a href="' + esc(titleUrl) + '">' + esc(pp.title) + '</a>' : esc(pp.title);
  let linksHtml = '';
  if (links.length) {
    linksHtml = '<div class="paper-card-links">' + links.map(function (l) {
      return '<a class="paper-card-link" href="' + esc(l.link) + '" target="_blank"><i class="' + esc(l.icon) + '"></i> ' + esc(l.name) + '</a>';
    }).join('') + '</div>';
  }
  return '<div class="paper-card">' +
    '<span class="paper-card-icon"><i class="fa-solid fa-file-lines"></i></span>' +
    '<div class="paper-card-body">' +
      '<div class="paper-card-title">' + titleHtml + '</div>' +
      (venue ? '<div class="paper-card-venue">' + venue + '</div>' : '') +
      (authors ? '<div class="paper-card-authors">' + authors + '</div>' : '') +
      linksHtml +
    '</div>' +
  '</div>';
}

hexo.extend.filter.register('before_post_render', function (data) {
  if (!data.content || data.content.indexOf('<<') === -1) return data;
  const map = getPaperMap();
  data.content = data.content.replace(/<<\s*([A-Za-z0-9_-]+)\s*>>/g, function (m, slug) {
    const entry = map[slug];
    if (!entry) return '<span class="paper-card-missing">[unknown paper: ' + esc(slug) + ']</span>';
    data.has_paper_cards = true;
    // Blank lines so kramed treats the card as a standalone HTML block.
    return '\n\n' + renderPaperCard(entry) + '\n\n';
  });
  return data;
});
