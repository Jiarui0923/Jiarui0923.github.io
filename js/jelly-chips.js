/* Jelly chips -------------------------------------------------------------
 * The motion half of the Jelly Radio port (reactbits.dev/micro/jelly-radio,
 * gap 4, barge 0). Upstream uses Motion's spring animations on a click
 * selection; these chips are links, so the hovered chip takes the place of the
 * selected one. Same model: the active chip swells, every other chip barges
 * away from it and shrinks, each spring stiffer and less delayed the closer it
 * sits to the active chip.
 *
 * Rows rendered later (the publications list re-renders on every search,
 * filter and page change) are picked up by window.jellyChips.refresh().
 */
(() => {
    var SWELL = 0.2, BARGE = 0, SHRINK = 0.05, JELLY = 1
    var BOUNCE = 0.25, STAGGER = 22, STIFFNESS = 580
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    var rows = []
    var springs = []
    var frameId = null

    // Upstream's spring(k, m, bounce): critical damping scaled down by the
    // bounce, so 0 is dead-flat and higher values overshoot more.
    function damping(k, m, bounce) { return 2 * Math.sqrt(k * m) * (1 - bounce) }

    function Spring(value) {
        this.value = value
        this.target = value
        this.velocity = 0
        this.k = STIFFNESS
        this.m = 0.9
        this.c = damping(STIFFNESS, 0.9, BOUNCE)
        this.delay = 0
        this.done = true
    }
    Spring.prototype.to = function (target, k, m, bounce, delay) {
        this.target = target
        this.k = k
        this.m = m
        this.c = damping(k, m, bounce)
        this.delay = delay || 0
        this.done = false
    }
    Spring.prototype.jump = function (target) {
        this.value = this.target = target
        this.velocity = 0
        this.delay = 0
        this.done = true
    }
    Spring.prototype.step = function (dt) {
        if (this.done) return false
        if (this.delay > 0) { this.delay -= dt; return true }
        // Fixed sub-steps: these springs are stiff enough to blow up if a
        // dropped frame is integrated in one go.
        var steps = Math.max(1, Math.ceil(dt / 0.004))
        var h = dt / steps
        for (var i = 0; i < steps; i++) {
            var accel = (this.k * (this.target - this.value) - this.c * this.velocity) / this.m
            this.velocity += accel * h
            this.value += this.velocity * h
        }
        if (Math.abs(this.target - this.value) < 0.0015 && Math.abs(this.velocity) < 0.02) {
            this.value = this.target
            this.velocity = 0
            this.done = true
        }
        return true
    }

    var lastTime = 0
    function tick(now) {
        var dt = Math.min((now - lastTime) / 1000, 1 / 30)
        lastTime = now
        var running = false
        for (var i = 0; i < springs.length; i++) if (springs[i].step(dt)) running = true
        for (var r = 0; r < rows.length; r++) rows[r].render()
        frameId = running ? requestAnimationFrame(tick) : null
    }

    function start() {
        if (frameId !== null) return
        lastTime = performance.now()
        frameId = requestAnimationFrame(tick)
    }

    function setup(rowEl) {
        if (rowEl.dataset.jellyReady === 'true') return
        var chips = Array.prototype.slice.call(rowEl.querySelectorAll('.jelly-chip'))
        if (!chips.length) return
        rowEl.dataset.jellyReady = 'true'

        var state = chips.map(() => ({ x: new Spring(0), sx: new Spring(1), sy: new Spring(1) }))
        var rowSprings = []
        state.forEach((mv) => { rowSprings.push(mv.x, mv.sx, mv.sy) })
        springs = springs.concat(rowSprings)

        var row = {
            el: rowEl,
            springs: rowSprings,
            render: function () {
                for (var i = 0; i < chips.length; i++) {
                    var mv = state[i]
                    chips[i].style.transform =
                        'translateX(' + mv.x.value.toFixed(2) + 'px) scale(' +
                        mv.sx.value.toFixed(4) + ',' + mv.sy.value.toFixed(4) + ')'
                }
            }
        }
        rows.push(row)

        var widths = []
        function measure() {
            widths = chips.map((c) => c.offsetWidth)
            var chipHeight = chips[0].offsetHeight
            var maxWidth = Math.max.apply(null, widths)
            // Upstream's padding formula: enough room for the swell so the
            // outermost chip never clips against the row's edge.
            rowEl.style.setProperty('--jr-pad-x', (Math.ceil((maxWidth * SWELL * 1.3) / 2 + BARGE) + 2) + 'px')
            rowEl.style.setProperty('--jr-pad-y', (Math.ceil((chipHeight * SWELL) / 2) + 2) + 'px')
        }
        measure()

        function apply(sel) {
            for (var i = 0; i < chips.length; i++) {
                var mv = state[i]
                var far = sel === null ? 0 : Math.abs(i - sel)
                var push = sel === null ? 0 : ((widths[sel] || 0) * SWELL) / 2 + BARGE
                var x = sel === null ? 0 : Math.sign(i - sel) * push
                var scale = sel === null ? 1 : (i === sel ? 1 + SWELL : 1 - SHRINK)
                if (reduceMotion.matches) {
                    mv.x.jump(x); mv.sx.jump(scale); mv.sy.jump(scale)
                    continue
                }
                var k = STIFFNESS * (1 - 0.12 * Math.min(far, 3))
                var inFlight = !mv.x.done || !mv.sx.done || !mv.sy.done
                var delay = inFlight ? 0 : (far * STAGGER) / 1000
                mv.x.to(x, k, 0.9, BOUNCE, delay)
                mv.sx.to(scale, k * (1 + 0.24 * JELLY), 0.9 - 0.1 * JELLY,
                    Math.min(0.85, BOUNCE + 0.3 * JELLY), delay)
                mv.sy.to(scale, k * (1 - 0.14 * JELLY), 0.9 + 0.05 * JELLY,
                    BOUNCE, delay + 0.05 * JELLY)
            }
            if (reduceMotion.matches) row.render()
            else start()
        }

        // Touch never fires pointerenter in a useful way - the finger arrives
        // and leaves in one gesture - so a press drives the same response, and
        // the release is held briefly so the spring is actually seen before the
        // link navigates away.
        var releaseTO = null
        function press(chip, i) {
            window.clearTimeout(releaseTO)
            chips.forEach((c) => c.classList.remove('is-pressed'))
            chip.classList.add('is-pressed')
            apply(i)
        }
        function release() {
            window.clearTimeout(releaseTO)
            releaseTO = window.setTimeout(() => {
                chips.forEach((c) => c.classList.remove('is-pressed'))
                apply(null)
            }, 260)
        }

        chips.forEach((chip, i) => {
            chip.addEventListener('pointerenter', (e) => {
                if (e.pointerType === 'touch') return  // handled by pointerdown
                apply(i)
            })
            chip.addEventListener('pointerdown', () => press(chip, i))
            chip.addEventListener('pointerup', release)
            chip.addEventListener('pointercancel', release)
            chip.addEventListener('focus', () => apply(i))
            chip.addEventListener('blur', () => apply(null))
        })
        rowEl.addEventListener('pointerleave', (e) => {
            if (e.pointerType === 'touch') return
            chips.forEach((c) => c.classList.remove('is-pressed'))
            apply(null)
        })
        window.addEventListener('resize', measure)
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure)
        row.render()
    }

    function refresh() {
        // Drop rows whose elements a re-render has detached, so their springs
        // stop being stepped every frame.
        var live = rows.filter((row) => document.contains(row.el))
        if (live.length !== rows.length) {
            rows = live
            springs = []
            live.forEach((row) => { springs = springs.concat(row.springs) })
        }
        Array.prototype.forEach.call(document.querySelectorAll('.jelly-row'), setup)
    }

    window.jellyChips = { refresh: refresh }
    refresh()
})()
