/* Specular button ---------------------------------------------------------
 * Companion to css/specular-button.css. Two jobs:
 *   1. push the data-* preset onto the element as CSS custom properties, so
 *      the knobs from the React Bits component stay editable in the markup;
 *   2. aim the rim light at the cursor wherever it is on the page, not only
 *      while it is over the button.
 * Tracking is page-wide but cheap: pointer moves are coalesced to one update
 * per frame, and the CSS transition on --spec-angle does the easing, so there
 * is no animation loop of our own.
 * Everything here is an enhancement — the button still renders its metal rim
 * on CSS alone.
 */
(() => {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.specular-button'))
    if (!buttons.length) return

    var num = (value, fallback) => {
        var n = parseFloat(value)
        return isFinite(n) ? n : fallback
    }

    var tracked = buttons.map((btn) => {
        var data = btn.dataset
        // thickness is a multiplier in the original; 2.5px reads the same here.
        var thickness = num(data.thickness, 0.6) * 2.5
        var radius = num(data.radius, 36)
        var blur = num(data.blur, 12)
        var shine = num(data.shineSize, 13)

        btn.style.setProperty('--spec-thickness', thickness.toFixed(2) + 'px')
        btn.style.setProperty('--spec-radius', radius + 'px')
        btn.style.setProperty('--spec-blur', blur + 'px')
        btn.style.setProperty('--spec-shine', shine + '%')

        return {
            el: btn,
            // The gradient's first glint sits half a shine past the start
            // angle, so the start has to lead the cursor by that much for the
            // highlight to land on the side the cursor is on.
            offset: ((shine / 100) * 360) / 2
        }
    })

    var pointerX = null
    var pointerY = null
    var queued = false

    function aim() {
        queued = false
        if (pointerX === null) return
        tracked.forEach((item) => {
            var box = item.el.getBoundingClientRect()
            // Skip anything scrolled out of view — its rim is not visible.
            if (box.bottom < 0 || box.top > window.innerHeight) return
            var dx = pointerX - (box.left + box.width / 2)
            var dy = pointerY - (box.top + box.height / 2)
            // Conic angles start at 12 o'clock; atan2 starts at 3.
            var angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90 - item.offset
            item.el.style.setProperty('--spec-angle', (((angle % 360) + 360) % 360).toFixed(1) + 'deg')
        })
    }

    function schedule() {
        if (queued) return
        queued = true
        requestAnimationFrame(aim)
    }

    // Pointer coordinates are viewport-relative, so scrolling moves the button
    // under a stationary cursor and the angle has to be recomputed.
    function follow(e) {
        pointerX = e.clientX
        pointerY = e.clientY
        schedule()
    }
    document.addEventListener('pointermove', follow, { passive: true })
    // Touch reports no position until a finger lands, so a tap anywhere aims
    // the rim; without this the button sits at its resting angle on a phone.
    document.addEventListener('pointerdown', follow, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
})()
