/* global hexo */
'use strict';

// The <<progresstimer>> tag in source/_data/index.md.
//
// The milestones and every label live in that file's front matter:
//
//   ---
//   progress:
//     visible: 3
//     working_label: "Working"
//     done_label: "Done in"
//     milestones:
//       - name: "Charting the Unknown"              # no date: the one in flight
//         note: "Writing the prospectus"            # optional, the plain version
//       - name: "Proving the Ground"
//         note: "Oral qualifying exam"
//         date: 2025-04-04
//       - name: "Chaos Unformed"                   # border: the edge of the
//         border: true                             # list, never highlighted
//   ---
//
// Data files skip the post pipeline, so nothing strips that front matter for
// us: hexo renders the file whole and the YAML would land on the page as text.
// So this script reads the source itself, splits the front matter off, renders
// only the body, swaps the tag for the timer markup, and hands the result to
// the `index_section` helper. index.ejs prints that instead of site.data.index.
//
// The markup is a static port of two React Bits components - Line Sidebar for
// the milestone list and Lattice Loader for the status of the highlighted one -
// so the browser only has to run the window and the clock (js/progress-timer.js).

const fs = require('fs');
const path = require('path');
const frontMatter = require('hexo-front-matter');

// Lattice Loader, pattern "orbit" on a 3x3 grid: the cell order it lights, the
// cells its "done" mark fills, and the timings the component derives.
const ORBIT_CELLS = [0, 1, 2, 7, null, 3, 6, 5, 4];
const ORBIT_STEP = 90 * 1.2;            // step x scale
const ORBIT_CYCLE = Math.round(8 * ORBIT_STEP);
const DONE_MARK_CELLS = [2, 3, 5, 7];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let state = { html: null };

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// YAML gives back a Date for an unquoted 2025-04-04; anything else arrives as a
// string. Normalise both to a plain Y-M-D, read in local time so the date shown
// is the date written.
function toDateParts(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return { y: value.getUTCFullYear(), m: value.getUTCMonth(), d: value.getUTCDate() };
  }
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]) - 1, d: Number(match[3]) };
}

function isoOf(parts) {
  if (!parts) return '';
  const pad = n => String(n).padStart(2, '0');
  return parts.y + '-' + pad(parts.m + 1) + '-' + pad(parts.d);
}

function prettyOf(parts) {
  if (!parts) return '';
  return MONTHS[parts.m] + ' ' + parts.d + ', ' + parts.y;
}

// One Lattice Loader, rendered flat. The run layer is the animation, the mark
// layer is the shape it settles into once the status is no longer "working".
function latticeLoader(status, label, doneLabel, timerText) {
  const run = ORBIT_CELLS.map(unit => {
    if (unit == null) return '<span class="lattice-loader__cell" data-hole></span>';
    return '<span class="lattice-loader__cell" style="animation-delay:' +
      Math.round(unit * ORBIT_STEP) + 'ms"></span>';
  }).join('');
  const mark = ORBIT_CELLS.map((_, i) =>
    '<span class="lattice-loader__cell"' + (DONE_MARK_CELLS.includes(i) ? ' data-on' : '') + '></span>'
  ).join('');

  return '<span class="lattice-loader" role="status" data-status="' + escapeHtml(status) + '"' +
    ' data-shape="round" data-glow style="--ll-gap:3px;--ll-cycle:' + ORBIT_CYCLE + 'ms">' +
    '<span class="lattice-loader__grid" aria-hidden="true">' +
    '<span class="lattice-loader__layer lattice-loader__run">' + run + '</span>' +
    '<span class="lattice-loader__layer lattice-loader__mark">' + mark + '</span>' +
    '</span>' +
    '<span class="lattice-loader__label" aria-hidden="true">' +
    '<span class="lattice-loader__text"' + (status === 'working' ? ' data-active' : '') + '>' +
    escapeHtml(label) + '</span>' +
    '<span class="lattice-loader__text"' + (status === 'done' ? ' data-active' : '') + '>' +
    escapeHtml(doneLabel) + '</span>' +
    '</span>' +
    '<span class="lattice-loader__timer" aria-hidden="true">' + escapeHtml(timerText) + '</span>' +
    '</span>';
}

function buildTimer(config) {
  const milestones = (config && config.milestones) || [];
  if (!milestones.length) return '';

  const visible = Math.max(1, Number(config.visible) || 3);
  const step = Math.max(20, Number(config.scroll_step) || 120);
  const workingLabel = config.working_label || 'Working';
  const doneLabel = config.done_label || 'Done in';

  const items = milestones.map((milestone, index) => {
    const parts = toDateParts(milestone.date);
    // `border: true` marks the edge of the list rather than something that
    // happened - it carries no status and can never take the top slot.
    const border = milestone.border === true;
    // The first milestone is the one in flight; its clock runs from the date of
    // the milestone below it, the most recent one actually finished.
    const working = !border && index === 0 && !milestone.date;
    const since = working ? toDateParts(milestones[1] && milestones[1].date) : null;
    const status = working ? 'working' : 'done';
    const timerText = working ? '' : prettyOf(parts);

    return '<li class="line-sidebar__item progress-timer__item" data-index="' + index + '"' +
      (border ? ' data-border' : '') +
      (working ? ' data-working' : '') +
      (since ? ' data-since="' + escapeHtml(isoOf(since)) + '"' : '') + '>' +
      '<span class="line-sidebar__marker" aria-hidden="true"></span>' +
      '<span class="line-sidebar__label">' +
      '<span class="line-sidebar__text">' + escapeHtml(milestone.name || '') + '</span>' +
      (milestone.note
        ? '<span class="line-sidebar__note">' + escapeHtml(milestone.note) + '</span>'
        : '') +
      '</span>' +
      (border ? '' :
        '<span class="progress-timer__status">' +
        latticeLoader(status, workingLabel, doneLabel, timerText) +
        '</span>') +
      '</li>';
  }).join('');

  return '<div class="progress-timer" data-visible="' + visible + '" data-step="' + step + '">' +
    // A div, not the <nav> the upstream component uses: the theme styles bare
    // `nav` elements as the site header - fixed, with chrome and, under 600px,
    // `height: 48px; overflow: hidden`. That clipped the milestone list to its
    // first row on a phone and left the rest of the block empty.
    '<div class="line-sidebar line-sidebar--markers line-sidebar--scale-tick progress-timer__rail">' +
    '<ul class="line-sidebar__list" aria-label="Milestones">' + items + '</ul>' +
    '</div>' +
    '</div>';
}

// What marked actually emits for `<<progresstimer>>` on its own line is
// `<p>&lt;<progresstimer>&gt;</p>`: it escapes the first angle bracket, then
// takes `<progresstimer>` for a raw HTML tag and passes it through. So each
// bracket is matched either escaped or literal, and the surrounding paragraph
// goes with it - a <div> cannot live inside a <p>.
const TAG = /(?:<p>\s*)?(?:&lt;|<){2}\s*progresstimer\s*(?:&gt;|>){2}(?:\s*<\/p>)?/gi;

// Read afresh on every pass. Holding the parse in a module-level cache meant
// that under `hexo server`, which keeps one process alive across rebuilds, an
// edit to the milestones or to the prose was never picked up.
function read() {
  const file = path.join(hexo.source_dir, '_data', 'index.md');
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (err) {
    return null;    // no homepage section authored; nothing to do
  }
  const parsed = frontMatter.parse(raw);
  return { config: parsed.progress || null, body: parsed._content || '' };
}

hexo.extend.filter.register('before_generate', async function () {
  const fresh = read();
  if (!fresh) {
    state = { html: null };
    return;
  }
  const rendered = await hexo.render.render({ text: fresh.body, engine: 'markdown' });
  state = { html: String(rendered).replace(TAG, buildTimer(fresh.config)) };
});

// Falls back to the raw data document if anything above did not run, so the
// section never disappears because of this script.
hexo.extend.helper.register('index_section', function () {
  if (state.html != null) return state.html;
  const data = this.site && this.site.data;
  return (data && data.index) || '';
});
