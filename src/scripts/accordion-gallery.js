/**
 * Accordion Gallery - vanilla port of the React Bits AccordionGallery,
 * driven by GSAP to match the rest of this site's animation style.
 */
import { gsap } from 'gsap';

function initAccordionGallery(root) {
    const panels = Array.from(root.querySelectorAll(':scope > .ag-panel'));
    if (!panels.length) return;

    const vertical = root.classList.contains('accordion-gallery--vertical');
    const count = panels.length;
    const trigger = root.dataset.trigger || 'hover';
    const expandRatio = Math.min(Math.max(parseFloat(root.dataset.expandRatio) || 0.52, 0.2), 0.9);
    const duration = parseFloat(root.dataset.duration) || 0.6;
    const ease = root.dataset.ease || 'power3.out';
    const parallax = parseFloat(root.dataset.parallax) || 0;
    const tilt = parseFloat(root.dataset.tilt) || 0;
    const stagger = parseFloat(root.dataset.stagger) || 0;
    const grayscaleOn = root.dataset.grayscale === '1';
    const showLabels = root.dataset.showLabels === '1';
    const gap = parseFloat(root.dataset.gap) || 10;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let active = Math.min(Math.max(parseInt(root.dataset.active, 10) || 0, 0), count - 1);
    let mediaSize = 320;
    let firstRun = true;
    let tl;

    function applyLayout(animate) {
        const grow = count > 1 ? (expandRatio * (count - 1)) / (1 - expandRatio) : 1;
        tl?.kill();
        const dur = animate && !prefersReduced ? duration : 0;
        tl = gsap.timeline();

        panels.forEach((panel, i) => {
            const isActive = i === active;
            const media = panel.querySelector('.ag-panel__media');
            const bar = panel.querySelector('.ag-panel__bar');
            const text = panel.querySelector('.ag-panel__text');

            const rot = isActive ? 0 : i < active ? tilt : -tilt;
            const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

            tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

            if (media) {
                const drift = Math.max(-1.5, Math.min(1.5, active - i));
                const shift = drift * parallax * mediaSize * 0.06;
                const gray = grayscaleOn ? (isActive ? 0 : 1) : 0;
                tl.to(media, {
                    xPercent: -50,
                    yPercent: -50,
                    x: vertical ? 0 : isActive ? 0 : shift,
                    y: vertical ? (isActive ? 0 : shift) : 0,
                    '--ag-gray': gray,
                    '--ag-dim': isActive ? 0 : 0.35,
                    duration: dur,
                    ease
                }, 0);
            }

            if (showLabels && bar && text) {
                if (isActive) {
                    tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
                } else {
                    tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
                }
            }

            panel.classList.toggle('ag-panel--active', isActive);
            if (isActive) {
                panel.setAttribute('aria-current', 'true');
            } else {
                panel.removeAttribute('aria-current');
            }
        });
    }

    function measure() {
        const rect = root.getBoundingClientRect();
        const total = vertical ? rect.height : rect.width;
        const usable = Math.max(total - gap * (count - 1), 120);
        const size = Math.max(140, usable * expandRatio * 1.22);
        mediaSize = size;
        root.style.setProperty('--ag-media-size', `${size}px`);
        applyLayout(!firstRun);
    }

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    measure();
    firstRun = false;

    function setActive(i) {
        if (i === active) return;
        active = i;
        applyLayout(true);
    }

    panels.forEach((panel, i) => {
        if (trigger === 'hover') {
            panel.addEventListener('mouseenter', () => setActive(i));
        }
        panel.addEventListener('focus', () => setActive(i));
        panel.addEventListener('click', (e) => {
            if (i !== active) {
                e.preventDefault();
                setActive(i);
            }
        });
        panel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const next = (i + 1) % count;
                setActive(next);
                panels[next].focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = (i - 1 + count) % count;
                setActive(prev);
                panels[prev].focus();
            }
        });
    });
}

document.querySelectorAll('.accordion-gallery').forEach(initAccordionGallery);
