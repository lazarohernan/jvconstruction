// ========================================
// Horizontal Scroll Component - GSAP ScrollTrigger
// ========================================

function initHorizontalScroll() {
    const horizontalSection = document.querySelector('.horizontal-scroll');
    if (!horizontalSection) return;

    const wrapper = horizontalSection.querySelector('.horizontal-scroll__wrapper');
    const panels = gsap.utils.toArray('.horizontal-scroll__panel');
    
    if (!panels.length) return;

    // Calculate total scroll width
    const totalWidth = wrapper.scrollWidth;
    const windowWidth = window.innerWidth;
    const scrollDistance = totalWidth - windowWidth;

    // Create horizontal scroll animation
    gsap.to(wrapper, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
            trigger: horizontalSection,
            start: 'top top',
            end: () => `+=${scrollDistance}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    // Animate list items when they come into view
    const listItems = document.querySelectorAll('.horizontal-scroll__list-item');
    if (listItems.length) {
        const itemObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    itemObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        listItems.forEach(item => itemObserver.observe(item));
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHorizontalScroll);
} else {
    initHorizontalScroll();
}

// Refresh on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
