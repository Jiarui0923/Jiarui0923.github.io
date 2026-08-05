/* global hexo */
'use strict';

// Font Awesome icons in homepage markdown.
//
//   ![~](fa-solid fa-wrench)   →   <i class="fa-solid fa-wrench"></i>
//
// The `~` alt text is the opt-in marker; every other image is left alone. The
// markdown renderer turns the syntax into `<img src="fa-solid fa-wrench"
// alt="~">` first, so the swap happens on the rendered HTML — data files skip
// the before_post_render pipeline, which is where a source-level filter would
// normally live.

const IMG_TAG = /<img\b[^>]*>/g;
const ALT_MARKER = /\balt\s*=\s*"~"/;
const SRC_ATTR = /\bsrc\s*=\s*"([^"]*)"/;

function renderIcons(html) {
  if (!html) return '';
  return String(html).replace(IMG_TAG, function (tag) {
    if (!ALT_MARKER.test(tag)) return tag;
    const src = tag.match(SRC_ATTR);
    if (!src) return tag;
    // Already attribute-escaped by the renderer; drop quotes defensively.
    return '<i class="' + src[1].replace(/"/g, '') + '"></i>';
  });
}

hexo.extend.helper.register('render_icons', renderIcons);
