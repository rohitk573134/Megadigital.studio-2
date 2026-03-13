/* ============================================
   MEGA DIGITAL STUDIO - ANIMATIONS
   GSAP Animations & Scroll Effects
   ============================================ */

class Animations {
    constructor() {
        this.isInitialized = false;
        this.scrollTriggers = [];
    }
    
    init() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not available');
            return;
        }
        
        // Register plugins
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        
        // Set defaults
        gsap.defaults({
            ease: 'power3.out',
            duration: 1
        });
        
        this.initHeroAnimations();
        this.initScrollAnimations();
        this.initParallaxEffects();
        this.initServiceCardAnimations();
        this.initPortfolioAnimations();
        this.initTestimonialAnimations();
        this.initCtaAnimations();
        
        this.isInitialized = true;
    }
    
    // ==========================================
    // HERO ANIMATIONS
    // ==========================================
    
    initHeroAnimations() {
        const heroTl = gsap.timeline({
            defaults: { ease: 'power3.out' }
        });
        
        heroTl
            .to('.hero-badge', {
                opacity: 1,
                y: 0,
                duration: 0.8
            })
            .to('.hero-title', {
                opacity: 1,
                y: 0,
                duration: 1,
                onComplete: () => {
                    document.querySelector('.hero-title')?.classList.add('animated');
                }
            }, '-=0.4')
            .to('.hero-services', {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, '-=0.6')
            .to('.hero-location', {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, '-=0.5')
            .to('.hero-cta-group', {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, '-=0.4')
            .add(() => {
                document.querySelector('.scroll-indicator')?.classList.add('visible');
            }, '-=0.2');
    }
    
    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    
    initScrollAnimations() {
        // Section Headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 60,
                duration: 1
            });
        });
        
        // Story Sections
        gsap.utils.toArray('.story-section').forEach((section, index) => {
            const content = section.querySelector('.story-content');
            const bg = section.querySelector('.story-bg');
            const number = section.querySelector('.story-number');
            
            // Content reveal
            gsap.from(content, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    end: 'center center',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 80,
                duration: 1.2
            });
            
            // Background parallax
            gsap.to(bg, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: '15%'
            });
            
            // Number parallax
            if (number) {
                gsap.to(number, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 0.5
                    },
                    y: '-20%',
                    opacity: 0.1
                });
            }
        });
    }
    
    // ==========================================
    // PARALLAX EFFECTS
    // ==========================================
    
    initParallaxEffects() {
        // Hero parallax on scroll
        gsap.to('.parallax-layer-1', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: '30%'
        });
        
        // Mouse parallax for hero
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
            
            gsap.to('#parallax-1', {
                x: moveX,
                y: moveY,
                duration: 0.5
            });
        });
    }
    
    // ==========================================
    // SERVICE CARD ANIMATIONS
    // ==========================================
    
    initServiceCardAnimations() {
        const serviceCards = gsap.utils.toArray('.service-card');
        
        // Staggered reveal
        gsap.from(serviceCards, {
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 80%'
            },
            opacity: 0,
            y: 60,
            stagger: 0.15,
            duration: 0.9
        });
        
        // 3D Tilt effect
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;
                
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    scale: 1.02,
                    duration: 0.3,
                    transformPerspective: 1000
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                    duration: 0.5
                });
            });
        });
    }
    
    // ==========================================
    // PORTFOLIO ANIMATIONS
    // ==========================================
    
    initPortfolioAnimations() {
        const portfolioItems = gsap.utils.toArray('.portfolio-item');
        
        // Staggered reveal
        gsap.from(portfolioItems, {
            scrollTrigger: {
                trigger: '.portfolio-grid',
                start: 'top 80%'
            },
            opacity: 0,
            y: 40,
            stagger: 0.1,
            duration: 0.7
        });
        
        // Filter animation
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                portfolioItems.forEach(item => {
                    const category = item.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        gsap.to(item, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.5,
                            pointerEvents: 'auto'
                        });
                    } else {
                        gsap.to(item, {
                            opacity: 0.15,
                            scale: 0.95,
                            duration: 0.5,
                            pointerEvents: 'none'
                        });
                    }
                });
            });
        });
    }
    
    // ==========================================
    // TESTIMONIAL ANIMATIONS
    // ==========================================
    
    initTestimonialAnimations() {
        gsap.from('.testimonials-carousel', {
            scrollTrigger: {
                trigger: '.testimonials',
                start: 'top 70%'
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
    }
    
    // ==========================================
    // CTA ANIMATIONS
    // ==========================================
    
    initCtaAnimations() {
        gsap.from('.cta-content', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 70%'
            },
            opacity: 0,
            y: 60,
            duration: 1
        });
        
        // Glow animation enhancement
        gsap.to('.cta-glow', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top center',
                end: 'bottom center',
                scrub: 1
            },
            scale: 1.5,
            opacity: 0.8
        });
    }
    
    // ==========================================
    // SMOOTH SCROLL TO SECTION
    // ==========================================
    
    scrollToSection(targetId) {
        const target = document.getElementById(targetId);
        
        if (target) {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: target,
                    offsetY: 0
                },
                ease: 'power3.inOut'
            });
        }
    }
    
    // ==========================================
    // REFRESH SCROLL TRIGGERS
    // ==========================================
    
    refresh() {
        ScrollTrigger.refresh();
    }
    
    // ==========================================
    // DESTROY
    // ==========================================
    
    destroy() {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        this.isInitialized = false;
    }
}

// Initialize Animations
const animations = new Animations();

// Export for use in main.js
window.animations = animations;
