// ========================================
// Services Section - Scroll Animation (Sticky + ScrollTrigger)
// ========================================

function initServicesSection() {
    const servicesWrapper = document.querySelector('.services-wrapper');
    const servicesIntro = document.querySelector('.services__intro');
    const servicesIntroBg = document.querySelector('.services__intro-bg');
    const servicesIntroContent = document.querySelector('.services__intro-content');
    const cardOverlays = gsap.utils.toArray('.service-image-card__overlay');

    if (!servicesWrapper || !servicesIntro || cardOverlays.length === 0) return;

    // Initial states - Intro visible, overlays hidden
    gsap.set(servicesIntro, { autoAlpha: 1 });
    gsap.set(servicesIntroBg, { autoAlpha: 1 });
    gsap.set(servicesIntroContent, { autoAlpha: 1 });
    gsap.set(cardOverlays, { autoAlpha: 0 });

    // Timeline vinculado al scroll del wrapper (NO usa pin)
    const servicesTl = gsap.timeline({
        scrollTrigger: {
            trigger: servicesWrapper,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            markers: false
        }
    });

    // Fase 1: Pausa inicial - mostrar título (20%)
    servicesTl.to({}, { duration: 0.2 });

    // Fase 2: Fade out del contenido del intro (15%)
    servicesTl.to(servicesIntroContent, {
        autoAlpha: 0,
        y: -50,
        duration: 0.15,
        ease: 'none'
    });

    // Fase 3: Fade out del blur (10%)
    servicesTl.to(servicesIntroBg, {
        autoAlpha: 0,
        duration: 0.1,
        ease: 'none'
    });

    // Fase 4: Ocultar intro completamente
    servicesTl.set(servicesIntro, { autoAlpha: 0 });

    // Fase 5: Revelar tarjetas con stagger (40%)
    servicesTl.to(cardOverlays, {
        autoAlpha: 1,
        duration: 0.4,
        stagger: {
            each: 0.04,
            from: 'start'
        },
        ease: 'none'
    });

    // Fase 6: Pausa final - mostrar todas las tarjetas (15%)
    servicesTl.to({}, { duration: 0.15 });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesSection);
} else {
    initServicesSection();
}
