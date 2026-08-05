/* global hexo */
'use strict';

// Award badges — "Oral", "Spotlight", "Best Paper", … — rendered next to a
// paper's title on the papers catalog, its own paper page, and the resume.
//
// Declare them wherever the paper is declared:
//
//   awards: ["Oral"]                                  # preset colour
//   awards: [{ name: "Best Demo", palette: "sky" }]   # or pick one yourself
//
// Every badge carries the same award icon; only the colour varies. A name not
// in PRESETS still renders in colour — its palette is picked by hashing the
// name, so it stays stable across builds without a code change here.

const AWARD_ICON = 'fa-solid fa-award';

const PRESETS = {
  'oral': 'amber',
  'spotlight': 'violet',
  'poster': 'sky',
  'best paper': 'rose',
  'best paper award': 'rose',
  'outstanding paper': 'rose',
  'honorable mention': 'emerald',
  'highlight': 'fuchsia',
  'invited talk': 'sky'
};

const PALETTES = ['amber', 'violet', 'rose', 'emerald', 'sky', 'fuchsia'];

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function hashIndex(key, n) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 100000;
  return h % n;
}

// Accepts a string, an object, or an array of either; always returns an array.
function normalize(awards) {
  if (!awards) return [];
  const list = Array.isArray(awards) ? awards : [awards];
  return list.map(function (a) {
    const obj = typeof a === 'string' ? { name: a } : Object.assign({}, a || {});
    if (!obj.name) return null;
    const key = String(obj.name).trim().toLowerCase();
    if (!obj.icon) obj.icon = AWARD_ICON;
    if (!obj.palette) obj.palette = PRESETS[key] || PALETTES[hashIndex(key, PALETTES.length)];
    return obj;
  }).filter(Boolean);
}

function renderBadges(awards, extraClass) {
  const list = normalize(awards);
  if (!list.length) return '';
  const inner = list.map(function (a) {
    return '<span class="award-badge award-' + esc(a.palette) + '">' +
      '<i class="' + esc(a.icon) + '"></i>' + esc(a.name) + '</span>';
  }).join('');
  return '<span class="award-badges' + (extraClass ? ' ' + esc(extraClass) : '') + '">' + inner + '</span>';
}

hexo.extend.helper.register('award_badges', renderBadges);
hexo.extend.helper.register('award_list', normalize);
