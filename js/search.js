(() => {
    const root = document.body.attributes['data-config-root'].value;
    const searchPath = document.body.attributes['data-search-path'].value;

    const searchBox = document.getElementById('searchbox');
    const countEl = document.getElementById('search-count');
    const resultsEl = document.getElementById('search-results');
    const pagEl = document.getElementById('search-pagination');
    const sortEl = document.getElementById('search-sort');

    const perPage = 10;
    let searchIndex = [];
    let currentPage = 1;
    let loaded = false;
    let currentSort = 'relevance';

    const escapeHtml = (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    // Split the query into #tag filters and free-text terms.
    // A #tag runs until the next # (so multi-word tags like "Machine Learning" work).
    const parseQuery = (raw) => {
        const tags = [];
        let rest = (raw || '').replace(/#([^#]+)/g, (m, g) => {
            const t = g.trim().toLowerCase();
            if (t) tags.push(t);
            return ' ';
        });
        rest = rest.trim().toLowerCase();
        const terms = rest ? rest.split(/\s+/) : [];
        return { tags, terms, text: terms.join(' ') };
    };

    const filterItems = (q) => {
        return searchIndex.filter((item) => {
            if (q.tags.length) {
                const itemTags = (item.tags || []).map((t) => t.toLowerCase());
                const ok = q.tags.every((t) => itemTags.some((it) => it.indexOf(t) !== -1));
                if (!ok) return false;
            }
            if (q.text) {
                if (JSON.stringify(item).toLowerCase().indexOf(q.text) === -1) return false;
            }
            return true;
        });
    };

    // Weighted relevance: title > tags > description > body occurrences.
    const relevanceScore = (item, terms) => {
        if (!terms.length) return 0;
        const title = (item.title || '').toLowerCase();
        const desc = (item.desc || '').toLowerCase();
        const tags = (item.tags || []).join(' ').toLowerCase();
        const content = (item.content || '').toLowerCase();
        let score = 0;
        terms.forEach((t) => {
            if (title.indexOf(t) !== -1) score += 10;
            if (tags.indexOf(t) !== -1) score += 6;
            if (desc.indexOf(t) !== -1) score += 4;
            score += Math.min(content.split(t).length - 1, 5);
        });
        return score;
    };

    const sortItems = (arr, terms) => {
        if (currentSort === 'date') {
            arr.sort((a, b) => (b.ts || 0) - (a.ts || 0));
        } else if (currentSort === 'title') {
            arr.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')));
        } else { // relevance (falls back to date when there is no text query)
            if (terms.length) {
                arr.sort((a, b) => relevanceScore(b, terms) - relevanceScore(a, terms) || (b.ts || 0) - (a.ts || 0));
            } else {
                arr.sort((a, b) => (b.ts || 0) - (a.ts || 0));
            }
        }
        return arr;
    };

    const cardHtml = (item) => {
        const icon = escapeHtml(item.icon || 'fa-solid fa-paper-plane');
        const date = item.date ? `<div class="sr-date">${escapeHtml(item.date)}</div>` : '';
        const desc = item.desc ? `<div class="sr-desc">${escapeHtml(item.desc)}</div>` : '';
        const tags = (item.tags && item.tags.length)
            ? `<div class="sr-tags">${item.tags.map((t) =>
                `<span class="sr-tag" data-tag="${escapeHtml(t)}">#${escapeHtml(t)}</span>`).join('')}</div>`
            : '';
        return `
<a class="sr-card" href="${escapeHtml(item.url)}">
    <div class="sr-icon"><i class="${icon}"></i></div>
    <div class="sr-body">
        <div class="sr-head">
            <div class="sr-title">${escapeHtml(item.title)}</div>
            ${date}
        </div>
        ${desc}
        ${tags}
    </div>
</a>`;
    };

    const renderPagination = (totalPages) => {
        if (totalPages <= 1) { pagEl.innerHTML = ''; return; }
        let html = `<button class="sr-page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>&laquo; Prev</button>`;
        html += `<span class="sr-page-info">Page ${currentPage} of ${totalPages}</span>`;
        html += `<button class="sr-page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Next &raquo;</button>`;
        pagEl.innerHTML = html;
        pagEl.querySelectorAll('.sr-page-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                currentPage = parseInt(btn.dataset.page, 10);
                render();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    };

    const render = () => {
        const q = parseQuery(searchBox.value);
        const filtered = sortItems(filterItems(q), q.terms);
        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / perPage));
        if (currentPage > totalPages) currentPage = totalPages;

        countEl.textContent = `${total} result${total !== 1 ? 's' : ''}`;

        if (total === 0) {
            resultsEl.innerHTML = '<div class="no-results">No results found.</div>';
            pagEl.innerHTML = '';
            return;
        }

        const start = (currentPage - 1) * perPage;
        resultsEl.innerHTML = filtered.slice(start, start + perPage).map(cardHtml).join('');
        renderPagination(totalPages);
    };

    // Clicking a tag inside a card filters by that tag instead of navigating.
    resultsEl.addEventListener('click', (ev) => {
        const tag = ev.target.closest('.sr-tag');
        if (!tag) return;
        ev.preventDefault();
        ev.stopPropagation();
        searchBox.value = '#' + tag.dataset.tag;
        currentPage = 1;
        render();
        searchBox.focus();
    });

    const onInput = () => { currentPage = 1; render(); };

    const loadAndRender = () => {
        if (loaded) { render(); return; }
        fetch(root + searchPath)
            .then((res) => res.json())
            .then((data) => {
                searchIndex = Array.isArray(data) ? data : [];
                loaded = true;
                render();
            })
            .catch(() => {
                countEl.textContent = '';
                resultsEl.innerHTML = '<div class="no-results">Could not load the search index.</div>';
            });
    };

    searchBox.addEventListener('input', () => { if (loaded) onInput(); else loadAndRender(); });
    document.getElementById('search-form').addEventListener('submit', (ev) => { ev.preventDefault(); loadAndRender(); });

    // Sort switcher
    if (sortEl) {
        sortEl.addEventListener('click', (ev) => {
            const btn = ev.target.closest('.sort-btn');
            if (!btn || btn.classList.contains('active')) return;
            currentSort = btn.dataset.sort;
            sortEl.querySelectorAll('.sort-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            currentPage = 1;
            render();
        });
    }

    // Pre-fill from a ?q= URL parameter (e.g. a tag link from another page).
    const initialQ = new URLSearchParams(window.location.search).get('q');
    if (initialQ) searchBox.value = initialQ;

    // Show all results immediately (no input required).
    searchBox.select();
    loadAndRender();
})();
