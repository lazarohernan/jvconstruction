// ========================================
// Concrete Work Component - Fade In Animation
// ========================================

function initConcreteSection() {
    // Animate intro section
    const concreteIntro = document.querySelector('.concrete__intro');
    if (concreteIntro) {
        const introObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    introObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        introObserver.observe(concreteIntro);
    }

    // Los service cards dentro del horizontal scroll ya son visibles por CSS
    // No necesitan animación de fade-in

    // Horizontal scroll animation with GSAP (dentro de la sección Concrete)
    const horizontalWrapper = document.querySelector('.concrete__horizontal-wrapper');
    if (horizontalWrapper) {
        const track = horizontalWrapper.querySelector('.concrete__horizontal-track');
        const panels = gsap.utils.toArray('.concrete__horizontal-panel');
        const commitmentCards = gsap.utils.toArray('.concrete__commitment-card');
        const commitmentContent = document.querySelector('.concrete__commitment-content');

        if (panels.length > 0) {
            // Ocultar tarjetas y título inicialmente
            gsap.set(commitmentCards, { opacity: 0, y: 40, scale: 0.95 });
            if (commitmentContent) {
                gsap.set(commitmentContent.querySelector('h2'), { opacity: 0, y: 20 });
                gsap.set(commitmentContent.querySelector('.concrete__tag'), { opacity: 0, y: 20 });
            }

            // Timeline principal para el scroll horizontal
            const horizontalTl = gsap.timeline({
                scrollTrigger: {
                    trigger: horizontalWrapper,
                    start: 'bottom bottom',
                    end: () => '+=' + (track.scrollWidth - window.innerWidth + 800),
                    scrub: 0.5,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });

            // Fase 1: Mover del panel de servicios al panel de commitment (centrado)
            horizontalTl.to(track, {
                x: () => -window.innerWidth,
                ease: 'none',
                duration: 0.4
            });

            // Fase 2: Mostrar título y tag
            if (commitmentContent) {
                horizontalTl.to(commitmentContent.querySelector('.concrete__tag'), {
                    opacity: 1,
                    y: 0,
                    duration: 0.05
                });
                horizontalTl.to(commitmentContent.querySelector('h2'), {
                    opacity: 1,
                    y: 0,
                    duration: 0.05
                });
            }

            // Fase 3: Mostrar tarjetas una por una con stagger
            horizontalTl.to(commitmentCards, {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.08,
                duration: 0.25,
                ease: 'power2.out'
            });

            // Fase 4: Pausa breve después de que todas las tarjetas aparezcan
            horizontalTl.to({}, { duration: 0.1 });

            // Fase 5: Continuar al panel CTA
            horizontalTl.to(track, {
                x: () => -(track.scrollWidth - window.innerWidth),
                ease: 'none',
                duration: 0.3
            });
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConcreteSection);
} else {
    initConcreteSection();
}
