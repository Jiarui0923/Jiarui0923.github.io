/* Progress timer ----------------------------------------------------------
 * Drives the <<progresstimer>> markup built by scripts/progress-timer.js.
 *
 * The window holds a fixed number of milestones (data-visible) with the
 * highlight pinned to whichever one is at the top. Its position is a float, so
 * a drag tracks the pointer rather than jumping a whole row at a time, and it
 * snaps to the nearest milestone once the gesture ends.
 *
 * Where it moves from depends on what the device has: a mouse or trackpad
 * scrolls and drags the list directly, while on touch the page scroll walks it
 * instead - grabbing vertical drags there would cost the reader their normal
 * way of scrolling past the section.
 *
 * It also runs the clock: the milestone in flight counts up in real time from
 * the date of the one below it, the most recent one actually finished.
 */
(() => {
    var root = document.querySelector('.progress-timer')
    if (!root) return
    var list = root.querySelector('.line-sidebar__list')
    var items = Array.prototype.slice.call(root.querySelectorAll('.line-sidebar__item'))
    if (!list || !items.length) return

    var visible = Math.max(1, parseInt(root.dataset.visible, 10) || 3)
    var scrollStep = Math.max(20, parseInt(root.dataset.step, 10) || 120)
    // Every milestone can take the top slot, not just the ones that leave a
    // full window below them - otherwise the last few could never be
    // highlighted. Past that point the window simply runs out of rows to fill.
    // Items marked as a border are the edge of the list rather than milestones,
    // so the window stops at the last real one and they only ever sit below it.
    var lastReal = items.length - 1
    while (lastReal > 0 && items[lastReal].hasAttribute('data-border')) lastReal--
    var maxStart = Math.max(0, lastReal)
    // How far the window can go and still be full. Deliberate moves - a drag, a
    // wheel, a keypress - may pass this and leave empty rows below the last
    // milestone, because the reader asked for that. Scroll-driven movement may
    // not: nobody asks to be left looking at one milestone over three blanks.
    var maxFull = Math.max(0, Math.min(maxStart, items.length - visible))
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    var position = 0        // float index of the milestone pinned at the top
    var pitch = 0           // distance from one milestone to the next, in px
    var touchOnly = !window.matchMedia('(any-pointer: fine)').matches
    // Spread the fade across however many rows are on screen, so the last one
    // still reads. A fixed per-row step would reach zero at the third row and
    // any window wider than that would just hold invisible milestones. The
    // floor is higher on a touch screen: the list does not move there unless it
    // is tapped, so a faint row reads as absent rather than as further away -
    // and grey text at a quarter opacity on a phone in daylight is gone.
    var FAINTEST = touchOnly ? 0.55 : 0.3
    var falloff = visible > 1 ? (1 - FAINTEST) / (visible - 1) : 0

    root.style.setProperty('--pt-rows', visible)

    function clamp(value) { return Math.max(0, Math.min(maxStart, value)) }

    // Measured, not assumed: a name that wraps to two lines would otherwise
    // clip the row under it.
    function measure() {
        pitch = items.length > 1
            ? items[1].offsetTop - items[0].offsetTop
            : items[0].offsetHeight
        var last = items[Math.min(items.length, visible) - 1]
        var height = last.offsetTop + last.offsetHeight - items[0].offsetTop
        if (height > 0) root.style.height = height + 'px'
    }

    // --- colours ------------------------------------------------------------
    // The blend between the resting colour and the accent is worked out here
    // rather than in CSS. It was a color-mix() on --effect, which Safari 16
    // resolves to transparent at the 0% end - so on an iPhone every row except
    // the highlighted one painted nothing at all, leaving one line above its
    // own empty height. Reading the stops from CSS keeps the theme in charge.
    var palette = { accent: [17, 17, 19], text: [121, 121, 121], marker: [201, 201, 205] }

    function parseColor(value) {
        var text = String(value || '').trim()
        var hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text)
        if (hex) {
            var digits = hex[1]
            if (digits.length === 3) digits = digits[0] + digits[0] + digits[1] + digits[1] + digits[2] + digits[2]
            return [parseInt(digits.slice(0, 2), 16), parseInt(digits.slice(2, 4), 16), parseInt(digits.slice(4, 6), 16)]
        }
        var parts = text.replace(/^(rgba?|color)\(|\)$/g, '').replace(/^srgb\s+/, '').split(/[\s,/]+/).filter(Boolean)
        if (parts.length < 3) return null
        var channels = parts.slice(0, 3).map((part) => {
            var n = parseFloat(part)
            if (!isFinite(n)) return null
            // color(srgb 1 1 1) gives fractions; rgb() gives 0-255.
            return part.indexOf('%') >= 0 ? n * 2.55 : (n <= 1 && text.indexOf('color(') === 0 ? n * 255 : n)
        })
        return channels.indexOf(null) < 0 ? channels : null
    }

    function readPalette() {
        var style = window.getComputedStyle(list)
        var accent = parseColor(style.getPropertyValue('--accent-color'))
        var text = parseColor(style.getPropertyValue('--text-color'))
        var marker = parseColor(style.getPropertyValue('--marker-color'))
        if (accent) palette.accent = accent
        if (text) palette.text = text
        if (marker) palette.marker = marker
    }

    function mix(from, to, t) {
        var k = Math.max(0, Math.min(1, t))
        return 'rgb(' +
            Math.round(from[0] + (to[0] - from[0]) * k) + ',' +
            Math.round(from[1] + (to[1] - from[1]) * k) + ',' +
            Math.round(from[2] + (to[2] - from[2]) * k) + ')'
    }

    function render() {
        // The window never scrolls past the point where it would run out of
        // milestones to show - that is what left one line over a field of white
        // space. Beyond it the window holds still and the highlight travels
        // down the rows instead, so every milestone can be picked and the block
        // is always full.
        var windowStart = Math.min(position, maxFull)
        list.style.setProperty('--pt-offset', (windowStart * pitch).toFixed(2) + 'px')
        items.forEach((item, i) => {
            var slot = i - windowStart              // place within the window
            var chosen = i - position               // 0 is the highlighted one
            // Fainter the further down the window it sits, and gone outside it.
            // Being a float, each milestone fades on its own way past the top
            // rather than the whole list dimming at once.
            var opacity = 0
            if (slot > -0.6 && slot < visible - 0.4) {
                opacity = Math.max(0, 1 - Math.max(0, slot) * falloff)
                if (slot < 0) opacity *= Math.max(0, 1 + slot / 0.6)
            }
            // Whichever one is highlighted is always at full strength, even
            // when it is sitting low in a window that has stopped moving.
            opacity = Math.max(opacity, Math.max(0, 1 - Math.abs(chosen)))
            // --effect is the Line Sidebar's own 0..1 input: accent colour, the
            // shift and the marker length all read it.
            var effect = Math.max(0, 1 - Math.abs(chosen))
            // Set on the element, not through a custom property a stylesheet
            // has to resolve: one less thing that can quietly not apply.
            item.style.opacity = opacity.toFixed(3)
            item.style.setProperty('--effect', effect.toFixed(3))
            item.style.setProperty('--pt-color', mix(palette.text, palette.accent, effect))
            item.style.setProperty('--pt-marker', mix(palette.marker, palette.accent, effect))
            var active = Math.abs(chosen) < 0.5 && !item.hasAttribute('data-border')
            item.classList.toggle('is-active', active)
            item.setAttribute('aria-current', active ? 'true' : 'false')
        })
    }

    function setPosition(value, animate) {
        position = clamp(value)
        root.classList.toggle('is-animating', !!animate && !reduceMotion.matches)
        render()
    }

    // --- moving the window --------------------------------------------------
    // Nothing here is gated on a media query any more. It used to be, and a
    // device whose primary pointer is reported as coarse - a touchscreen
    // laptop, a tablet-mode convertible - had the drag and wheel handlers
    // simply never registered. Instead the gesture itself decides: a mouse or
    // pen drags, touch is left alone to scroll the page as usual.
    var manual = false          // the reader has taken the wheel
    var settleTO = null
    function settle() {
        window.clearTimeout(settleTO)
        settleTO = window.setTimeout(() => setPosition(Math.round(position), true), 140)
    }

    if (!touchOnly) root.classList.add('is-grabbable')
    // A finger drags the list too. That costs the page its vertical scroll over
    // these few rows (touch-action: pan-x), which is the trade for the list
    // being draggable at all on a phone - there is no gesture that is both.
    if (maxStart) root.classList.add('is-draggable')

    root.addEventListener('wheel', (e) => {
        if (!maxStart) return
        var next = clamp(position + e.deltaY / scrollStep)
        // Only swallow the scroll while the list still has somewhere to go; at
        // either end the page takes it back, so the reader is never trapped in
        // the component.
        if (next === position) return
        e.preventDefault()
        manual = true
        setPosition(next, false)
        settle()
    }, { passive: false })

    var drag = null
    var dragged = false       // the gesture moved, so the click that follows is not a tap
    root.addEventListener('pointerdown', (e) => {
        if (e.button > 0 || !maxStart || !pitch) return
        // A finger never holds still, so it needs more slack than a mouse
        // before the hold counts as a drag rather than a tap.
        drag = { id: e.pointerId, y: e.clientY, from: position, moved: false, slack: e.pointerType === 'touch' ? 8 : 3 }
        root.classList.add('is-dragging')
    })
    root.addEventListener('pointermove', (e) => {
        if (!drag || e.pointerId !== drag.id) return
        var dy = e.clientY - drag.y
        if (!drag.moved) {
            if (Math.abs(dy) < drag.slack) return
            drag.moved = true
            manual = true
            try { root.setPointerCapture(e.pointerId) } catch (err) { /* older pens */ }
        }
        // Dragging up pulls later milestones into view.
        setPosition(drag.from - dy / pitch, false)
        e.preventDefault()
    })
    function endDrag(e) {
        if (!drag || e.pointerId !== drag.id) return
        dragged = drag.moved
        drag = null
        root.classList.remove('is-dragging')
        setPosition(Math.round(position), true)
    }
    root.addEventListener('pointerup', endDrag)
    root.addEventListener('pointercancel', endDrag)

    // A milestone can also just be picked. The click that ends a drag is not a
    // pick, so it is swallowed.
    root.classList.add('is-tappable')
    items.forEach((item, i) => {
        if (item.hasAttribute('data-border')) return
        item.addEventListener('click', () => {
            if (dragged) { dragged = false; return }
            manual = true
            setPosition(i, true)
        })
    })

    // With a mouse or trackpad in the room, page scroll also walks the window
    // until the reader takes it over. On a touch-only screen it does not: by
    // the time the block is on screen the scroll would have carried the list
    // past its end, so it holds still and waits to be dragged or tapped.
    if (!touchOnly) {
        var queued = false
        function follow() {
            queued = false
            if (manual) return
            var rect = root.getBoundingClientRect()
            var travelled = window.innerHeight * 0.85 - rect.top
            setPosition(Math.max(0, Math.min(maxFull, Math.floor(travelled / scrollStep))), true)
        }
        function schedule() {
            if (queued || manual) return
            queued = true
            requestAnimationFrame(follow)
        }
        window.addEventListener('scroll', schedule, { passive: true })
        schedule()
    }

    // --- keyboard ----------------------------------------------------------
    root.tabIndex = 0
    root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') { manual = true; setPosition(Math.round(position) + 1, true) }
        else if (e.key === 'ArrowUp' || e.key === 'PageUp') { manual = true; setPosition(Math.round(position) - 1, true) }
        else if (e.key === 'Home') { manual = true; setPosition(0, true) }
        else if (e.key === 'End') { manual = true; setPosition(maxStart, true) }
        else return
        e.preventDefault()
    })

    // --- the clock ---------------------------------------------------------
    var working = root.querySelector('.line-sidebar__item[data-working]')
    var workingTimer = working && working.querySelector('.lattice-loader__timer')
    var since = working && working.dataset.since ? new Date(working.dataset.since + 'T00:00:00') : null

    function pad(n) { return String(n).padStart(2, '0') }

    function tick() {
        var seconds = Math.max(0, Math.floor((Date.now() - since.getTime()) / 1000))
        var days = Math.floor(seconds / 86400)
        var rest = seconds % 86400
        var text = pad(Math.floor(rest / 3600)) + ':' + pad(Math.floor((rest % 3600) / 60)) + ':' + pad(rest % 60)
        workingTimer.textContent = days > 0 ? days + 'd ' + text : text
    }

    if (workingTimer && since) {
        tick()
        setInterval(tick, 1000)
    } else if (workingTimer) {
        // Nothing to count from - drop the placeholder rather than leave a
        // clock that never moves.
        workingTimer.remove()
    }

    // The stops come from CSS, so they move with the theme: the switch writes
    // body[data-color-scheme], and auto mode moves no attribute at all.
    function repaint() { readPalette(); render() }
    new MutationObserver(repaint).observe(document.body, {
        attributes: true, attributeFilter: ['data-color-scheme']
    })
    var darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    if (darkQuery.addEventListener) darkQuery.addEventListener('change', repaint)
    else if (darkQuery.addListener) darkQuery.addListener(repaint)

    readPalette()
    measure()
    setPosition(0, false)
    window.addEventListener('resize', () => {
        measure()
        render()
    })
    window.addEventListener('orientationchange', () => {
        window.setTimeout(() => { measure(); render() }, 200)
    })
    // Web fonts land after first paint and change the row heights.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => { measure(); render() })
    }
})()
