/**
 * DepthCarousel - vanilla port of the React Bits DepthCarousel component,
 * driven by GSAP to match the rest of this site's animation style.
 */
import { gsap } from 'gsap';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function initDepthCarousel(root) {
    const cards = Array.from(root.querySelectorAll('.depth-carousel__card'));
    const tints = cards.map((c) => c.querySelector('.depth-carousel__tint'));
    const count = cards.length;
    if (!count) return;

    const cfg = {
        cardWidth: parseFloat(root.dataset.cardWidth) || 300,
        depth: parseFloat(root.dataset.depth) || 220,
        spread: parseFloat(root.dataset.spread) || 90,
        tilt: parseFloat(root.dataset.tilt) || 22,
        tiltDirection: root.dataset.tiltDirection || 'right',
        visibleCards: parseFloat(root.dataset.visibleCards) || 4,
        falloff: parseFloat(root.dataset.falloff) || 0.2,
        blur: parseFloat(root.dataset.blur) || 6,
        duration: parseFloat(root.dataset.duration) || 700,
        ease: root.dataset.ease || 'power3.out',
        loop: root.dataset.loop === '1',
        autoplay: root.dataset.autoplay === '1',
        autoplayDelay: parseFloat(root.dataset.autoplayDelay) || 3200
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let pos = 0;
    let focus = 0;
    let scale = 1;
    let tween = null;
    let active = 0;

    const arrowPrev = root.querySelector('.depth-carousel__arrow--prev');
    const arrowNext = root.querySelector('.depth-carousel__arrow--next');
    const dots = Array.from(root.querySelectorAll('.depth-carousel__dot'));

    function layout(p) {
        const dir = cfg.tiltDirection === 'left' ? -1 : 1;

        for (let i = 0; i < count; i++) {
            const el = cards[i];
            if (!el) continue;

            let d = i - p;
            if (cfg.loop && count > 1) {
                d = ((d % count) + count) % count;
                if (d > count / 2) d -= count;
            }

            const back = Math.max(0, d);
            const az = Math.abs(d);
            const shown = az <= cfg.visibleCards + 0.5;

            const tz = -cfg.depth * d;
            const tx = dir * cfg.spread * d;
            const ry = dir * cfg.tilt * clamp(d, 0, 1);

            let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
            if (!shown) opacity = 0;

            const brightness = Math.max(0.15, 1 - back * cfg.falloff);
            const blurPx = cfg.blur > 0 ? Math.min(cfg.blur, (back / Math.max(1, cfg.visibleCards)) * cfg.blur) : 0;
            const zi = Math.round(2000 - d * 20);

            el.style.transform = `translate(-50%, -50%) scale(${scale}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
            el.style.opacity = opacity.toFixed(3);
            el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
            el.style.zIndex = String(zi);
            el.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none';

            const tint = tints[i];
            if (tint) tint.style.opacity = clamp(back * cfg.falloff * 1.25, 0, 0.86).toFixed(3);
        }
    }

    function notify(idx) {
        active = idx;
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === idx);
            dot.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        });
        cards.forEach((card, i) => card.setAttribute('aria-hidden', i === idx ? 'false' : 'true'));
    }

    function tweenTo(target, animate) {
        tween?.kill();
        const proxy = { p: pos };
        const dur = animate && !reduced ? cfg.duration / 1000 : 0;
        tween = gsap.to(proxy, {
            p: target,
            duration: dur,
            ease: cfg.ease,
            onUpdate: () => {
                pos = proxy.p;
                layout(proxy.p);
            },
            onComplete: () => {
                if (count > 0) pos = ((pos % count) + count) % count;
                layout(pos);
            }
        });
    }

    function setFocus(rawIndex, animate = true) {
        const idx = cfg.loop ? ((rawIndex % count) + count) % count : clamp(rawIndex, 0, count - 1);
        let delta = idx - pos;
        if (cfg.loop && count > 1) {
            delta = ((delta % count) + count) % count;
            if (delta > count / 2) delta -= count;
        }
        tweenTo(pos + delta, animate);
        if (idx !== focus) {
            focus = idx;
            notify(idx);
        }
    }

    function navigateBy(step) {
        setFocus(focus + step, true);
    }

    // Responsive scale
    const ro = new ResizeObserver((entries) => {
        const w = entries[0].contentRect.width;
        // Buffer kept small so the front card fills most of the width,
        // especially on narrow (mobile) viewports.
        const needed = cfg.cardWidth + Math.abs(cfg.spread) * 1.2 + 30;
        scale = clamp(w / needed, 0.6, 1);
        layout(pos);
    });
    ro.observe(root);

    // Wheel
    // Only react to wheel gestures that are clearly horizontal (a trackpad
    // swipe). Vertical mouse-wheel scrolling passes through untouched so it
    // scrolls the page instead of hijacking the carousel.
    let wheelTimer;
    let wheelGestureStart = 0;
    root.addEventListener('wheel', (e) => {
        if (count < 2) return;
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault();
        tween?.kill();
        if (!wheelTimer) wheelGestureStart = Math.round(pos);
        const delta = e.deltaMode === 1 ? e.deltaX * 24 : e.deltaX;
        const step = clamp(delta / (cfg.cardWidth * 0.9), -0.6, 0.6);
        // Cap the whole gesture to moving one slide at a time.
        pos = clamp(pos + step, wheelGestureStart - 1, wheelGestureStart + 1);
        layout(pos);
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
            setFocus(Math.round(pos), true);
            wheelTimer = null;
        }, 130);
    }, { passive: false });

    // Drag / swipe - direction-locked so a vertical page scroll that starts
    // on the carousel is left alone (native scroll), and only a clearly
    // horizontal drag advances the carousel, one slide at a time.
    let drag = null;
    const DIRECTION_LOCK_THRESHOLD = 8;

    root.addEventListener('pointerdown', (e) => {
        if (count < 2) return;
        tween?.kill();
        drag = {
            x: e.clientX,
            y: e.clientY,
            startPos: pos,
            startIndex: Math.round(pos),
            lastX: e.clientX,
            lastT: performance.now(),
            v: 0,
            moved: false,
            locked: null, // 'horizontal' | 'vertical'
            id: e.pointerId
        };
    });

    root.addEventListener('pointermove', (e) => {
        if (!drag) return;

        if (!drag.locked) {
            const dx = e.clientX - drag.x;
            const dy = e.clientY - drag.y;
            if (Math.abs(dx) < DIRECTION_LOCK_THRESHOLD && Math.abs(dy) < DIRECTION_LOCK_THRESHOLD) {
                return;
            }
            drag.locked = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
            if (drag.locked === 'horizontal') {
                drag.moved = true;
                root.setPointerCapture(drag.id);
            }
        }

        if (drag.locked !== 'horizontal') return;

        const stepPx = Math.max(cfg.cardWidth * 0.55 * scale, 40);
        const dx = e.clientX - drag.x;
        const now = performance.now();
        const dt = Math.max(now - drag.lastT, 1);
        drag.v = (e.clientX - drag.lastX) / dt;
        drag.lastX = e.clientX;
        drag.lastT = now;
        // Clamp so a single drag gesture can only move one slide either way.
        pos = clamp(drag.startPos - dx / stepPx, drag.startIndex - 1, drag.startIndex + 1);
        layout(pos);
    });

    function endDrag() {
        if (!drag) return;
        const wasDrag = drag;
        drag = null;
        if (wasDrag.locked !== 'horizontal') return;
        const target = clamp(
            Math.round(pos + Math.sign(-wasDrag.v) * (Math.abs(wasDrag.v) > 0.35 ? 1 : 0)),
            wasDrag.startIndex - 1,
            wasDrag.startIndex + 1
        );
        setFocus(target, true);
    }
    root.addEventListener('pointerup', endDrag);
    root.addEventListener('pointercancel', endDrag);

    // Keyboard
    root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigateBy(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateBy(1);
        }
    });

    // Click a card to focus it
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            if (drag?.moved) return;
            setFocus(i, true);
        });
    });

    arrowPrev?.addEventListener('click', () => navigateBy(-1));
    arrowNext?.addEventListener('click', () => navigateBy(1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => setFocus(i, true)));

    // Autoplay
    if (cfg.autoplay && !reduced && count > 1) {
        let hovered = false;
        let focused = false;
        let timer = null;

        const start = () => {
            if (timer) clearInterval(timer);
            timer = window.setInterval(() => {
                if (!hovered && !focused) navigateBy(1);
            }, Math.max(cfg.autoplayDelay, 600));
        };

        root.addEventListener('mouseenter', () => { hovered = true; });
        root.addEventListener('mouseleave', () => { hovered = false; });
        root.addEventListener('focusin', () => { focused = true; });
        root.addEventListener('focusout', () => { focused = false; });

        start();
    }

    layout(pos);
    notify(0);
}

document.querySelectorAll('.depth-carousel').forEach(initDepthCarousel);
