/**
 * J & V Construction LLC - Main JavaScript
 * GSAP Animations and Interactions
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    gsap.from('.hero__title-large', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
    });

    gsap.from('.hero__subtitle-large', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.45
    });

    gsap.from('.hero__cta', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.65
    });
}

// ========================================
// Navbar Scroll Effect
// ========================================
function initNavbarScroll() {
    // El navbar cambia a estilo "scrolled" apenas se sale del hero
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
// Section Header Scroll Animation
// ========================================
function initSectionHeaderAnimation() {
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
    initNavbarScroll();
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initImageReveal();
    initSectionHeaderAnimation();
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
