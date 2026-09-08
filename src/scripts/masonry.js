/**
 * Masonry - vanilla port of the React Bits Masonry component, driven by
 * GSAP to match the rest of this site's animation style. Images keep
 * their full color (no grayscale).
 */
import { gsap } from 'gsap';

const BREAKPOINTS = [
    { query: '(min-width:1500px)', columns: 5 },
    { query: '(min-width:1000px)', columns: 4 },
    { query: '(min-width:600px)', columns: 3 },
    { query: '(min-width:400px)', columns: 2 },
];

function getColumns() {
    for (const bp of BREAKPOINTS) {
        if (window.matchMedia(bp.query).matches) return bp.columns;
    }
    return 1;
}

function getInitialPosition(item, containerRect, animateFromOpt) {
    let direction = animateFromOpt;
    if (direction === 'random') {
        const directions = ['top', 'bottom', 'left', 'right'];
        direction = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (direction) {
        case 'top':
            return { x: item.x, y: -200 };
        case 'bottom':
            return { x: item.x, y: window.innerHeight + 200 };
        case 'left':
            return { x: -200, y: item.y };
        case 'right':
            return { x: window.innerWidth + 200, y: item.y };
        case 'center':
            return {
                x: containerRect.width / 2 - item.w / 2,
                y: containerRect.height / 2 - item.h / 2
            };
        default:
            return { x: item.x, y: item.y + 100 };
    }
}

let lightboxEls = null;

function getLightbox() {
    if (lightboxEls) return lightboxEls;

    const overlay = document.createElement('div');
    overlay.className = 'masonry-lightbox';
    overlay.setAttribute('aria-hidden', 'true');

    const closeBtn = document.createElement('button');
    closeBtn.className = 'masonry-lightbox__close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '&times;';

    const img = document.createElement('img');
    img.className = 'masonry-lightbox__img';
    img.alt = '';

    overlay.append(closeBtn, img);
    document.body.appendChild(overlay);

    function close() {
        overlay.classList.remove('masonry-lightbox--open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('masonry-lightbox-active');
    }

    function open(src) {
        img.src = src;
        overlay.classList.add('masonry-lightbox--open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('masonry-lightbox-active');
    }

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target === closeBtn) close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    lightboxEls = { open, close };
    return lightboxEls;
}

function initMasonry(root) {
    const wrappers = Array.from(root.querySelectorAll(':scope > .masonry-item-wrapper'));
    if (!wrappers.length) return;

    const ease = root.dataset.ease || 'power3.out';
    const duration = parseFloat(root.dataset.duration) || 0.6;
    const stagger = parseFloat(root.dataset.stagger) || 0.05;
    const animateFrom = root.dataset.animateFrom || 'bottom';
    const scaleOnHover = root.dataset.scaleOnHover === '1';
    const hoverScale = parseFloat(root.dataset.hoverScale) || 0.95;
    const blurToFocus = root.dataset.blurToFocus === '1';

    const items = wrappers.map((el) => ({
        el,
        id: el.dataset.key,
        height: parseFloat(el.dataset.height) || 300,
        url: el.dataset.url || '',
        img: el.dataset.img || ''
    }));

    let hasMounted = false;

    function layout() {
        const containerRect = root.getBoundingClientRect();
        const width = containerRect.width;
        if (!width) return;

        const columns = getColumns();
        const colHeights = new Array(columns).fill(0);
        const columnWidth = width / columns;

        const grid = items.map((item) => {
            const col = colHeights.indexOf(Math.min(...colHeights));
            const x = columnWidth * col;
            const h = item.height / 2;
            const y = colHeights[col];
            colHeights[col] += h;
            return { ...item, x, y, w: columnWidth, h };
        });

        root.style.height = `${Math.max(...colHeights)}px`;

        grid.forEach((item, index) => {
            const target = { x: item.x, y: item.y, width: item.w, height: item.h };

            if (!hasMounted) {
                const initialPos = getInitialPosition(item, containerRect, animateFrom);
                gsap.fromTo(item.el, {
                    opacity: 0,
                    x: initialPos.x,
                    y: initialPos.y,
                    width: item.w,
                    height: item.h,
                    ...(blurToFocus ? { filter: 'blur(10px)' } : {})
                }, {
                    opacity: 1,
                    ...target,
                    ...(blurToFocus ? { filter: 'blur(0px)' } : {}),
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: index * stagger
                });
            } else {
                gsap.to(item.el, {
                    ...target,
                    duration,
                    ease,
                    overwrite: 'auto'
                });
            }
        });
    }

    function handleEnter(el) {
        if (scaleOnHover) {
            gsap.to(el, { scale: hoverScale, duration: 0.3, ease: 'power2.out' });
        }
    }

    function handleLeave(el) {
        if (scaleOnHover) {
            gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.out' });
        }
    }

    items.forEach((item) => {
        item.el.style.position = 'absolute';
        item.el.style.top = '0';
        item.el.style.left = '0';
        item.el.style.willChange = 'transform, width, height, opacity';

        item.el.style.cursor = 'pointer';
        item.el.addEventListener('click', () => {
            if (item.url) {
                window.open(item.url, '_blank', 'noopener');
            } else if (item.img) {
                getLightbox().open(item.img);
            }
        });

        item.el.addEventListener('mouseenter', () => handleEnter(item.el));
        item.el.addEventListener('mouseleave', () => handleLeave(item.el));
    });

    layout();
    hasMounted = true;

    const ro = new ResizeObserver(() => layout());
    ro.observe(root);
}

document.querySelectorAll('.masonry-list').forEach(initMasonry);
