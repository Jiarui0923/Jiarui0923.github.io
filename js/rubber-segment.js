/* Rubber segmented control -------------------------------------------------
 * A plain-JS port of the React Bits "Rubber Segment" micro-interaction
 * (reactbits.dev/micro/rubber-segment), so the theme keeps its no-framework
 * footprint. The thumb is a spring: a tap stretches it across the gap, the
 * braking force squashes it as it lands, and it can be grabbed, dragged and
 * flicked between slots.
 *
 * Tunables live in data-* on the control (defaults match the demo preset
 * size=sm, radius=20, glide=55, speed=1.4, squash=3.5):
 *   data-glide   how much speed stretches the thumb
 *   data-speed   overall animation speed
 *   data-squash  how hard it compresses on landing
 *   data-radius  track corner radius, in px
 */
(() => {
    var root = document.querySelector('.rubber-segment')
    if (!root) return
    var thumb = root.querySelector('.rubber-thumb')
    var options = Array.prototype.slice.call(root.querySelectorAll('.rubber-option'))
    if (!thumb || !options.length) return
    var inputs = options.map((o) => o.querySelector('input'))
    if (inputs.some((i) => !i)) return

    var num = (value, fallback) => {
        var n = parseFloat(value)
        return isFinite(n) ? n : fallback
    }
    var GLIDE = num(root.dataset.glide, 55)
    var SPEED = num(root.dataset.speed, 1.4)
    var SQUASH = num(root.dataset.squash, 3.5)
    var RADIUS = num(root.dataset.radius, 20)

    // Damped just under critical, so the thumb overshoots a little and the
    // squash has something to bite on.
    var STIFFNESS = 190 * SPEED * SPEED
    var DAMPING = 2 * Math.sqrt(STIFFNESS) * 0.72
    var STRETCH_GAIN = (GLIDE / 100) * 0.00055  // px/s of travel -> extra length
    var SQUASH_GAIN = SQUASH * 0.0000075        // px/s^2 of braking -> compression
    var MAX_STRETCH = 0.55
    var MAX_SQUASH = 0.34
    var FLICK_PROJECTION = 0.08                 // seconds of travel a flick is worth

    var slots = []      // left offset of each slot, in the thumb's coordinates
    var x = 0           // current thumb offset
    var v = 0           // px/s
    var accel = 0       // last spring acceleration, for the squash
    var target = 0
    var frameId = null
    var lastTime = 0
    var drag = null
    var suppressClick = false
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    function measure() {
        // offsetLeft shares the thumb's reference frame (the track's padding
        // box), so no border/padding arithmetic is needed.
        slots = options.map((o) => o.offsetLeft)
        thumb.style.width = options[0].offsetWidth + 'px'
        thumb.style.height = options[0].offsetHeight + 'px'
        thumb.style.top = options[0].offsetTop + 'px'
        thumb.style.left = '0px'
        thumb.style.borderRadius = Math.max(0, RADIUS - 3) + 'px'
    }

    function render() {
        var dir = v >= 0 ? 1 : -1
        var stretch = Math.min(Math.abs(v) * STRETCH_GAIN, MAX_STRETCH)
        // Only acceleration that opposes the travel counts as braking.
        var braking = Math.max(0, -accel * dir)
        var squash = Math.min(braking * SQUASH_GAIN, MAX_SQUASH)
        var sx = Math.max(0.6, 1 + stretch - squash)
        var sy = 1 / Math.pow(sx, 0.6)  // rubber keeps roughly its volume
        thumb.style.transform =
            'translate3d(' + x.toFixed(2) + 'px,0,0) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')'
    }

    function frame(now) {
        var dt = Math.min((now - lastTime) / 1000, 1 / 30)
        lastTime = now
        if (!drag || !drag.moved) {
            // Fixed sub-steps: this spring is stiff enough to blow up if a
            // dropped frame is integrated in one go.
            var steps = Math.max(1, Math.ceil(dt / 0.004))
            var h = dt / steps
            for (var i = 0; i < steps; i++) {
                accel = STIFFNESS * (target - x) - DAMPING * v
                v += accel * h
                x += v * h
            }
            if (Math.abs(target - x) < 0.35 && Math.abs(v) < 12) {
                x = target
                v = 0
                accel = 0
                render()
                frameId = null
                return
            }
        }
        render()
        frameId = requestAnimationFrame(frame)
    }

    function start() {
        if (reduceMotion.matches && (!drag || !drag.moved)) {
            x = target
            v = 0
            accel = 0
            render()
            return
        }
        if (frameId === null) {
            lastTime = performance.now()
            frameId = requestAnimationFrame(frame)
        }
    }

    function indexOfChecked() {
        for (var i = 0; i < inputs.length; i++) if (inputs[i].checked) return i
        return -1
    }

    function select(index) {
        index = Math.max(0, Math.min(inputs.length - 1, index))
        if (!inputs[index].checked) {
            inputs[index].checked = true
            // Hands the choice to main.js, which owns the cookie and the theme.
            inputs[index].dispatchEvent(new Event('change', { bubbles: true }))
        } else {
            target = slots[index]
            start()
        }
    }

    // Every route to a new value - click, keyboard, drag - lands here.
    root.addEventListener('change', () => {
        var index = indexOfChecked()
        if (index < 0) return
        target = slots[index]
        start()
    })

    root.addEventListener('pointerdown', (e) => {
        if (e.button > 0) return
        suppressClick = false
        measure()
        drag = { id: e.pointerId, startX: e.clientX, offset: x - e.clientX, moved: false, lastTime: e.timeStamp }
    })

    root.addEventListener('pointermove', (e) => {
        if (!drag || e.pointerId !== drag.id) return
        if (!drag.moved) {
            // A few pixels of slack so a plain tap stays a tap.
            if (Math.abs(e.clientX - drag.startX) < 4) return
            drag.moved = true
            root.classList.add('rubber-dragging')
            try { root.setPointerCapture(e.pointerId) } catch (err) { /* older pens */ }
        }
        var min = slots[0]
        var max = slots[slots.length - 1]
        var raw = drag.offset + e.clientX
        // Resist past the ends instead of stopping dead.
        if (raw < min) raw = min - (min - raw) * 0.32
        else if (raw > max) raw = max + (raw - max) * 0.32
        var dt = Math.max((e.timeStamp - drag.lastTime) / 1000, 0.001)
        v = (raw - x) / dt
        x = raw
        accel = 0
        drag.lastTime = e.timeStamp
        start()
        e.preventDefault()
    })

    function endDrag(e) {
        if (!drag || e.pointerId !== drag.id) return
        var moved = drag.moved
        drag = null
        root.classList.remove('rubber-dragging')
        if (!moved) return  // a tap: the label's own click picks the option
        // Flick: snap to whichever slot the thumb is actually heading for.
        var projected = x + v * FLICK_PROJECTION
        var best = 0
        var bestDistance = Infinity
        slots.forEach((slot, i) => {
            var d = Math.abs(projected - slot)
            if (d < bestDistance) { bestDistance = d; best = i }
        })
        suppressClick = true
        select(best)
    }
    root.addEventListener('pointerup', endDrag)
    root.addEventListener('pointercancel', endDrag)

    // A drag that ends over a label would otherwise click it.
    root.addEventListener('click', (e) => {
        if (!suppressClick) return
        suppressClick = false
        e.preventDefault()
        e.stopPropagation()
    }, true)

    window.addEventListener('resize', () => {
        measure()
        var index = indexOfChecked()
        if (index < 0) return
        target = slots[index]
        x = target
        v = 0
        accel = 0
        render()
    })

    function init() {
        measure()
        var index = indexOfChecked()
        if (index < 0) {
            index = inputs.findIndex((i) => i.value === 'auto')
            if (index < 0) index = 0
            inputs[index].checked = true
        }
        x = target = slots[index]
        v = 0
        accel = 0
        root.classList.add('rubber-ready')
        render()
    }

    init()
    // Web fonts can resize the labels after first paint.
    window.addEventListener('load', () => {
        measure()
        var index = indexOfChecked()
        if (index >= 0) { x = target = slots[index]; render() }
    })
})()
