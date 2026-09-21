/* Glass surface -----------------------------------------------------------
 * A port of React Bits' GlassSurface (reactbits.dev/components/glass-surface),
 * the same effect the paper layout's floating nav bar uses, packaged so any
 * element can opt in with class="glass-surface".
 *
 * The refraction is real: a displacement map is drawn as an SVG data URI at the
 * element's measured size - a red horizontal ramp, a blue vertical one
 * differenced over it, and a blurred grey core - then fed to three
 * feDisplacementMap passes (one per colour channel, slightly offset, for a
 * touch of chromatic aberration) through backdrop-filter.
 *
 * Each element gets its own filter, because the map has to match its size.
 * Sizes are rounded and filters shared between elements that measure the same,
 * so a row of identical buttons costs one filter.
 *
 * Per-element overrides via data-*: glass-distortion, glass-blur (the blur
 * inside the map, not a backdrop blur), glass-displace, glass-radius.
 * Defaults are the preset the design uses: -150, 30, 0.9.
 */
(() => {
    var targets = Array.prototype.slice.call(document.querySelectorAll('.glass-surface'))
    if (!targets.length) return

    var BORDER_WIDTH = 0.07
    var BRIGHTNESS = 50
    var MAP_OPACITY = 0.93
    var CHANNELS = [{ suffix: 'r', offset: 0 }, { suffix: 'g', offset: 10 }, { suffix: 'b', offset: 20 }]
    var MATRICES = {
        r: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
        g: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
        b: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'
    }

    // Safari and Firefox accept the declaration but render no SVG filter in
    // backdrop-filter, so they take the plain-blur fallback instead.
    function supportsSvgBackdrop() {
        var ua = navigator.userAgent
        if ((/Safari/.test(ua) && !/Chrome/.test(ua)) || /Firefox/.test(ua)) return false
        var probe = document.createElement('div')
        probe.style.backdropFilter = 'url(#glass-probe)'
        return probe.style.backdropFilter !== ''
    }

    if (!supportsSvgBackdrop()) {
        targets.forEach((el) => el.classList.add('glass-surface--fallback'))
        return
    }

    var host = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    host.setAttribute('aria-hidden', 'true')
    host.setAttribute('focusable', 'false')
    host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    host.appendChild(defs)
    document.body.appendChild(host)

    var filters = {}   // signature -> filter id
    var counter = 0

    function num(value, fallback) {
        var n = parseFloat(value)
        return isFinite(n) ? n : fallback
    }

    function buildMap(width, height, radius, blur) {
        var edge = Math.min(width, height) * (BORDER_WIDTH * 0.5)
        var svg =
            '<svg viewBox="0 0 ' + width + ' ' + height + '" xmlns="http://www.w3.org/2000/svg">' +
            '<defs>' +
            '<linearGradient id="rg" x1="100%" y1="0%" x2="0%" y2="0%">' +
            '<stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient>' +
            '<linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient>' +
            '</defs>' +
            '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="black"></rect>' +
            '<rect x="0" y="0" width="' + width + '" height="' + height + '" rx="' + radius + '" fill="url(#rg)"/>' +
            '<rect x="0" y="0" width="' + width + '" height="' + height + '" rx="' + radius +
            '" fill="url(#bg)" style="mix-blend-mode: difference"/>' +
            '<rect x="' + edge + '" y="' + edge + '" width="' + (width - edge * 2) + '" height="' + (height - edge * 2) +
            '" rx="' + radius + '" fill="hsl(0 0% ' + BRIGHTNESS + '% / ' + MAP_OPACITY + ')" ' +
            'style="filter:blur(' + blur + 'px)"/>' +
            '</svg>'
        return 'data:image/svg+xml,' + encodeURIComponent(svg)
    }

    function filterFor(width, height, radius, distortion, blur, displace) {
        var signature = [width, height, radius, distortion, blur, displace].join('|')
        if (filters[signature]) return filters[signature]

        var id = 'glass-filter-' + (counter++)
        var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
        filter.setAttribute('id', id)
        filter.setAttribute('color-interpolation-filters', 'sRGB')
        filter.setAttribute('x', '0%')
        filter.setAttribute('y', '0%')
        filter.setAttribute('width', '100%')
        filter.setAttribute('height', '100%')

        var feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage')
        feImage.setAttribute('x', '0')
        feImage.setAttribute('y', '0')
        feImage.setAttribute('width', '100%')
        feImage.setAttribute('height', '100%')
        feImage.setAttribute('preserveAspectRatio', 'none')
        feImage.setAttribute('result', 'map')
        feImage.setAttribute('href', buildMap(width, height, radius, blur))
        filter.appendChild(feImage)

        CHANNELS.forEach((channel) => {
            var displacement = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap')
            displacement.setAttribute('in', 'SourceGraphic')
            displacement.setAttribute('in2', 'map')
            displacement.setAttribute('xChannelSelector', 'R')
            displacement.setAttribute('yChannelSelector', 'G')
            displacement.setAttribute('scale', String(distortion + channel.offset))
            displacement.setAttribute('result', 'disp-' + channel.suffix)
            filter.appendChild(displacement)

            var matrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix')
            matrix.setAttribute('in', 'disp-' + channel.suffix)
            matrix.setAttribute('type', 'matrix')
            matrix.setAttribute('values', MATRICES[channel.suffix])
            matrix.setAttribute('result', channel.suffix)
            filter.appendChild(matrix)
        })

        var blendRG = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend')
        blendRG.setAttribute('in', 'r')
        blendRG.setAttribute('in2', 'g')
        blendRG.setAttribute('mode', 'screen')
        blendRG.setAttribute('result', 'rg')
        filter.appendChild(blendRG)

        var blendAll = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend')
        blendAll.setAttribute('in', 'rg')
        blendAll.setAttribute('in2', 'b')
        blendAll.setAttribute('mode', 'screen')
        blendAll.setAttribute('result', 'output')
        filter.appendChild(blendAll)

        var gaussian = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur')
        gaussian.setAttribute('in', 'output')
        gaussian.setAttribute('stdDeviation', String(displace))
        filter.appendChild(gaussian)

        defs.appendChild(filter)
        filters[signature] = id
        return id
    }

    function apply(el) {
        var box = el.getBoundingClientRect()
        if (!box.width || !box.height) return
        var data = el.dataset
        var styles = window.getComputedStyle(el)
        var width = Math.round(box.width)
        var height = Math.round(box.height)
        var radius = Math.round(num(data.glassRadius, parseFloat(styles.borderTopLeftRadius) || 0))
        var id = filterFor(
            width, height, radius,
            num(data.glassDistortion, -150),
            num(data.glassBlur, 30),
            num(data.glassDisplace, 0.9)
        )
        el.style.setProperty('--glass-filter', 'url(#' + id + ')')
        el.classList.add('glass-surface--svg')
    }

    targets.forEach((el) => {
        apply(el)
        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(() => apply(el)).observe(el)
        }
    })
    // Web fonts land after first paint and change the measured size.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => targets.forEach(apply))
    }
})()
