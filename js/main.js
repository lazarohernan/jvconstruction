/**
 * J & V Construction LLC - Main JavaScript
 * GSAP Animations and Interactions
 */

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// ========================================
// DOM Elements
// ========================================
const navbar = document.querySelector('.navbar');
const mobileToggle = document.querySelector('.navbar__toggle');
const navMenu = document.querySelector('.navbar__menu');
const navLinks = document.querySelectorAll('.navbar__link');

// ========================================
// Hero Animations
// ========================================
function initHeroAnimations() {
    const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    heroTl
        .to('.hero__tagline', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3
        })
        .to('.hero__title-word', {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15
        }, '-=0.4')
        .to('.hero__subtitle', {
            opacity: 1,
            duration: 0.8
        }, '-=0.6')
        .to('.hero__cta', {
            opacity: 1,
            y: 0,
            duration: 0.6
        }, '-=0.4');
}

// ========================================
// Background Shapes Animation
// ========================================
function initShapesAnimation() {
    gsap.to('.hero__shape', {
        y: 'random(-30, 30)',
        x: 'random(-30, 30)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
            each: 0.5,
            from: 'random'
        }
    });
}

// ========================================
// Parallax Effect on Mouse Move
// ========================================
function initParallaxEffect() {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    if (isTouchDevice) return;

    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        gsap.to('.hero__shape--1', {
            x: mouseX * 30,
            y: mouseY * 30,
            duration: 1,
            ease: 'power2.out'
        });

        gsap.to('.hero__shape--2', {
            x: mouseX * -20,
            y: mouseY * -20,
            duration: 1,
            ease: 'power2.out'
        });

        gsap.to('.hero__shape--3', {
            x: mouseX * 40,
            y: mouseY * 40,
            duration: 1,
            ease: 'power2.out'
        });
    });
}

// ========================================
// Navbar Scroll Effect
// ========================================
function initNavbarScroll() {
    // El navbar solo se activa después de que termine el efecto del hero
    // El hero está fijado por 150vh, entonces esperamos a que pase eso
    ScrollTrigger.create({
        trigger: '.hero',
        start: 'bottom top',
        onEnter: () => navbar.classList.add('navbar--scrolled'),
        onLeaveBack: () => navbar.classList.remove('navbar--scrolled')
    });
}

// ========================================
// Scroll Reveal Animations
// ========================================
function initScrollAnimations() {
    // Value Cards
    gsap.utils.toArray('.value-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1
        });
    });

    // About Image
    gsap.to('.about__image', {
        scrollTrigger: {
            trigger: '.about__image',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        x: 0,
        duration: 0.8
    });

    // Service Cards (old style)
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: i * 0.08
        });
    });

    // Service Icon Cards (new style)
    gsap.utils.toArray('.service-icon-card').forEach((card, i) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: i * 0.06
        });
    });

    // Feature Items
    gsap.utils.toArray('.feature-item').forEach((item, i) => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.15
        });
    });

    // Contact Items
    gsap.utils.toArray('.contact__item').forEach((item, i) => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: i * 0.1
        });
    });

    // Social Link
    gsap.to('.contact__social', {
        scrollTrigger: {
            trigger: '.contact__social',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        duration: 0.6,
        delay: 0.3
    });
}

// ========================================
// Mobile Menu Toggle
// ========================================
function initMobileMenu() {
    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('navbar__menu--active');
        
        // Animate hamburger bars
        const bars = mobileToggle.querySelectorAll('.navbar__toggle-bar');
        const isActive = navMenu.classList.contains('navbar__menu--active');
        
        if (isActive) {
            gsap.to(bars[0], { rotation: 45, y: 8, duration: 0.3 });
            gsap.to(bars[1], { opacity: 0, duration: 0.3 });
            gsap.to(bars[2], { rotation: -45, y: -8, duration: 0.3 });
        } else {
            gsap.to(bars[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(bars[1], { opacity: 1, duration: 0.3 });
            gsap.to(bars[2], { rotation: 0, y: 0, duration: 0.3 });
        }
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('navbar__menu--active');
            const bars = mobileToggle.querySelectorAll('.navbar__toggle-bar');
            gsap.to(bars[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(bars[1], { opacity: 1, duration: 0.3 });
            gsap.to(bars[2], { rotation: 0, y: 0, duration: 0.3 });
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('navbar__menu--active')) {
            navMenu.classList.remove('navbar__menu--active');
            const bars = mobileToggle.querySelectorAll('.navbar__toggle-bar');
            gsap.to(bars[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(bars[1], { opacity: 1, duration: 0.3 });
            gsap.to(bars[2], { rotation: 0, y: 0, duration: 0.3 });
        }
    });
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Image Reveal Hover Effect
// ========================================
function initImageReveal() {
    const revealContainers = document.querySelectorAll('.image-reveal');
    
    revealContainers.forEach(container => {
        const topLayer = container.querySelector('.image-reveal__top');
        
        // Mouse enter - reveal from center
        container.addEventListener('mouseenter', () => {
            gsap.to(topLayer, {
                clipPath: 'inset(0 50% 0 50%)',
                duration: 0.6,
                ease: 'power2.inOut'
            });
        });
        
        // Mouse leave - hide back to full
        container.addEventListener('mouseleave', () => {
            gsap.to(topLayer, {
                clipPath: 'inset(0 0 0 0)',
                duration: 0.6,
                ease: 'power2.inOut'
            });
        });
        
        // Mouse move - directional reveal effect
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate distance from center for parallax effect
            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;
            
            gsap.to('.image-reveal__bottom', {
                x: -moveX,
                y: -moveY,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ========================================
// Hero Scroll Reveal Animation
// ========================================
function initHeroScrollReveal() {
    const topImage = document.querySelector('.hero__image--top');
    const initialText = document.querySelector('.hero__text--initial');
    const secondaryText = document.querySelector('.hero__text--secondary');
    const ctaContainer = document.querySelector('.hero__cta-container');
    const scrollIndicator = document.querySelector('.hero__scroll-indicator');
    
    if (!topImage || !initialText || !secondaryText) return;

    // Timeline para el scroll reveal con pin
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 1,
            anticipatePin: 1
        }
    });

    // Animar la imagen superior revelando de arriba hacia abajo
    tl.to(topImage, {
        clipPath: 'inset(100% 0 0 0)',
        ease: 'none'
    }, 0);

    // Crossfade entre textos con efecto 3D en eje Z
    // Texto inicial: se aleja (z negativo) y desaparece
    tl.to(initialText, {
        opacity: 0,
        z: -500,
        ease: 'power2.in'
    }, 0.1);

    // Texto secundario: viene de atrás (z positivo) hacia el frente
    tl.fromTo(secondaryText, 
        { 
            opacity: 0, 
            z: 500
        },
        { 
            opacity: 1, 
            z: 0,
            ease: 'power2.out'
        }, 
        0.4
    );

    // Fade out del scroll indicator
    tl.to(scrollIndicator, {
        opacity: 0,
        y: 20,
        ease: 'power2.in'
    }, 0);

    // Animación inicial del texto (sin scroll)
    gsap.from('.hero__title-large', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        ease: 'power4.out',
        delay: 0.3
    });

    gsap.from('.hero__subtitle-large', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.6
    });

    gsap.from(scrollIndicator, {
        duration: 1,
        opacity: 0,
        y: -20,
        ease: 'power2.out',
        delay: 1.2
    });
}

// ========================================
// Value Cards Scroll Animation
// ========================================
function initValueCardsAnimation() {
    const valueCards = document.querySelectorAll('.value-card');
    if (!valueCards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    valueCards.forEach(card => observer.observe(card));

    // Animate section headers (values + features)
    const sectionHeaders = document.querySelectorAll('.values .section-header, .features .section-header');
    if (sectionHeaders.length) {
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    headerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        sectionHeaders.forEach(el => headerObserver.observe(el));
    }
}

// ========================================
// Scroll Reveal for All Sections
// ========================================
function initGlobalScrollReveal() {
    const sections = document.querySelectorAll('.section, .about__content, .about__image, .service-card, .feature-item, .contact__content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in-visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    });

    sections.forEach(section => {
        section.classList.add('fade-in-element');
        observer.observe(section);
    });
}

// ========================================
// Initialize Everything
// ========================================
function init() {
    initHeroAnimations();
    initShapesAnimation();
    initParallaxEffect();
    initNavbarScroll();
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initImageReveal();
    initHeroScrollReveal();
    initValueCardsAnimation();
    initGlobalScrollReveal();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Refresh ScrollTrigger on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});
