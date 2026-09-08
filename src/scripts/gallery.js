// ========================================
// Gallery Component - Horizontal Scroll Animation
// ========================================

function initGalleryScroll() {
    const galleryTrack = document.querySelector('.gallery__track');
    if (!galleryTrack) return;

    const trackWidth = galleryTrack.scrollWidth;
    const viewportWidth = window.innerWidth;
    const distance = trackWidth - viewportWidth;

    gsap.to(galleryTrack, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
            trigger: '.gallery',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
        }
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryScroll);
} else {
    initGalleryScroll();
}
