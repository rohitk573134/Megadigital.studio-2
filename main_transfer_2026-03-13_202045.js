/* ============================================
   MEGA DIGITAL STUDIO - MAIN.JS
   Core Website Functionality
   ============================================ */

(function() {
    'use strict';
    
    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    
    const DOM = {
        preloader: document.getElementById('preloader'),
        progressBar: document.getElementById('progress-bar'),
        preloaderPercent: document.getElementById('preloader-percent'),
        navbar: document.getElementById('navbar'),
        menuToggle: document.getElementById('menu-toggle'),
        mobileMenu: document.getElementById('mobile-menu'),
        cursor: document.getElementById('cursor'),
        cursorDot: document.getElementById('cursor-dot'),
        particlesContainer: document.getElementById('particles'),
        lightbox: document.getElementById('lightbox'),
        lightboxImg: document.getElementById('lightbox-img'),
        lightboxClose: document.querySelector('.lightbox-close'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        portfolioItems: document.querySelectorAll('.portfolio-item'),
        testimonialCards: document.querySelectorAll('.testimonial-card'),
        testimonialDots: document.querySelectorAll('.dot'),
        prevTestimonial: document.getElementById('prev-testimonial'),
        nextTestimonial: document.getElementById('next-testimonial'),
        whatsappBtn: document.querySelector('.whatsapp-btn'),
        navbarCta: document.querySelector('.navbar-cta'),
        btnGold: document.querySelector('.btn-gold'),
        btnWhatsapp: document.querySelector('.btn-whatsapp')
    };
    
    // ==========================================
    // STATE
    // ==========================================
    
    const state = {
        loadProgress: 0,
        currentTestimonial: 0,
        testimonialInterval: null,
        isMenuOpen: false,
        isLightboxOpen: false
    };
    
    // ==========================================
    // PRELOADER
    // ==========================================
    
    const Preloader = {
        init() {
            this.updateProgress();
        },
        
        updateProgress() {
            state.loadProgress += Math.random() * 12 + 3;
            
            if (state.loadProgress > 100) {
                state.loadProgress = 100;
            }
            
            if (DOM.progressBar) {
                DOM.progressBar.style.width = state.loadProgress + '%';
            }
            
            if (DOM.preloaderPercent) {
                DOM.preloaderPercent.textContent = Math.round(state.loadProgress) + '%';
            }
            
            if (state.loadProgress < 100) {
                setTimeout(() => this.updateProgress(), 80 + Math.random() * 100);
            } else {
                setTimeout(() => this.hide(), 600);
            }
        },
        
        hide() {
            if (DOM.preloader) {
                DOM.preloader.classList.add('hidden');
                
                setTimeout(() => {
                    // Initialize animations after preloader
                    if (window.animations) {
                        window.animations.init();
                    }
                    
                    // Initialize Three.js scene
                    if (window.initThreeScene) {
                        window.initThreeScene();
                    }
                }, 500);
            }
        }
    };
    
    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    
    const Cursor = {
        mouseX: 0,
        mouseY: 0,
        cursorX: 0,
        cursorY: 0,
        
        init() {
            if (!DOM.cursor || !DOM.cursorDot) return;
            
            // Check if touch device
            if ('ontouchstart' in window) {
                DOM.cursor.style.display = 'none';
                DOM.cursorDot.style.display = 'none';
                return;
            }
            
            document.addEventListener('mousemove', (e) => this.onMouseMove(e));
            this.addHoverEffects();
            this.animate();
        },
        
        onMouseMove(e) {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Instant update for dot
            if (DOM.cursorDot) {
                DOM.cursorDot.style.left = this.mouseX + 'px';
                DOM.cursorDot.style.top = this.mouseY + 'px';
            }
        },
        
        animate() {
            // Smooth follow for cursor
            this.cursorX += (this.mouseX - this.cursorX) * 0.15;
            this.cursorY += (this.mouseY - this.cursorY) * 0.15;
            
            if (DOM.cursor) {
                DOM.cursor.style.left = this.cursorX + 'px';
                DOM.cursor.style.top = this.cursorY + 'px';
            }
            
            requestAnimationFrame(() => this.animate());
        },
        
        addHoverEffects() {
            const hoverElements = document.querySelectorAll(
                'a, button, .service-card, .portfolio-item, .filter-btn, .social-link, .testimonial-nav-btn, .dot'
            );
            
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    DOM.cursor?.classList.add('hover');
                });
                
                el.addEventListener('mouseleave', () => {
                    DOM.cursor?.classList.remove('hover');
                });
            });
        }
    };
    
    // ==========================================
    // NAVBAR
    // ==========================================
    
    const Navbar = {
        init() {
            window.addEventListener('scroll', () => this.onScroll());
            
            if (DOM.menuToggle) {
                DOM.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
            }
            
            // Close mobile menu on link click
            const mobileLinks = DOM.mobileMenu?.querySelectorAll('a');
            mobileLinks?.forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });
            
            // Navbar CTA click
            if (DOM.navbarCta) {
                DOM.navbarCta.addEventListener('click', () => openWhatsApp());
            }
        },
        
        onScroll() {
            if (window.scrollY > 100) {
                DOM.navbar?.classList.add('scrolled');
            } else {
                DOM.navbar?.classList.remove('scrolled');
            }
        },
        
        toggleMobileMenu() {
            state.isMenuOpen = !state.isMenuOpen;
            
            DOM.menuToggle?.classList.toggle('active', state.isMenuOpen);
            DOM.mobileMenu?.classList.toggle('active', state.isMenuOpen);
            document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
        },
        
        closeMobileMenu() {
            state.isMenuOpen = false;
            DOM.menuToggle?.classList.remove('active');
            DOM.mobileMenu?.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    // ==========================================
    // PARTICLES
    // ==========================================
    
    const Particles = {
        init() {
            if (!DOM.particlesContainer) return;
            
            const particleCount = window.innerWidth < 768 ? 20 : 40;
            
            for (let i = 0; i < particleCount; i++) {
                this.createParticle();
            }
        },
        
        createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (15 + Math.random() * 20) + 's';
            particle.style.animationDelay = Math.random() * 20 + 's';
            
            DOM.particlesContainer.appendChild(particle);
        }
    };
    
    // ==========================================
    // PORTFOLIO FILTER
    // ==========================================
    
    const Portfolio = {
        init() {
            DOM.filterBtns.forEach(btn => {
                btn.addEventListener('click', () => this.filter(btn));
            });
            
            // Lightbox
            DOM.portfolioItems.forEach(item => {
                item.addEventListener('click', () => this.openLightbox(item));
            });
            
            DOM.lightboxClose?.addEventListener('click', () => this.closeLightbox());
            DOM.lightbox?.addEventListener('click', (e) => {
                if (e.target === DOM.lightbox) {
                    this.closeLightbox();
                }
            });
        },
        
        filter(btn) {
            // Update active state
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            DOM.portfolioItems.forEach(item => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                    item.style.pointerEvents = 'auto';
                } else {
                    item.style.opacity = '0.15';
                    item.style.transform = 'scale(0.95)';
                    item.style.pointerEvents = 'none';
                }
            });
        },
        
        openLightbox(item) {
            const imgSrc = item.querySelector('img')?.src;
            
            if (imgSrc && DOM.lightboxImg) {
                DOM.lightboxImg.src = imgSrc;
                DOM.lightbox?.classList.add('active');
                document.body.style.overflow = 'hidden';
                state.isLightboxOpen = true;
            }
        },
        
        closeLightbox() {
            DOM.lightbox?.classList.remove('active');
            document.body.style.overflow = '';
            state.isLightboxOpen = false;
        }
    };
    
    // ==========================================
    // TESTIMONIALS CAROUSEL
    // ==========================================
    
    const Testimonials = {
        init() {
            if (DOM.testimonialCards.length === 0) return;
            
            // Navigation buttons
            DOM.prevTestimonial?.addEventListener('click', () => this.prev());
            DOM.nextTestimonial?.addEventListener('click', () => this.next());
            
            // Dots
            DOM.testimonialDots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goTo(index));
            });
            
            // Auto-rotate
            this.startAutoRotate();
            
            // Pause on hover
            const carousel = document.querySelector('.testimonials-carousel');
            carousel?.addEventListener('mouseenter', () => this.stopAutoRotate());
            carousel?.addEventListener('mouseleave', () => this.startAutoRotate());
            
            // Touch swipe
            this.initTouchSwipe(carousel);
        },
        
        update() {
            DOM.testimonialCards.forEach((card, i) => {
                card.classList.remove('active', 'prev', 'next');
                
                if (i === state.currentTestimonial) {
                    card.classList.add('active');
                } else if (i === (state.currentTestimonial - 1 + DOM.testimonialCards.length) % DOM.testimonialCards.length) {
                    card.classList.add('prev');
                } else if (i === (state.currentTestimonial + 1) % DOM.testimonialCards.length) {
                    card.classList.add('next');
                }
            });
            
            DOM.testimonialDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === state.currentTestimonial);
            });
        },
        
        next() {
            state.currentTestimonial = (state.currentTestimonial + 1) % DOM.testimonialCards.length;
            this.update();
        },
        
        prev() {
            state.currentTestimonial = (state.currentTestimonial - 1 + DOM.testimonialCards.length) % DOM.testimonialCards.length;
            this.update();
        },
        
        goTo(index) {
            state.currentTestimonial = index;
            this.update();
        },
        
        startAutoRotate() {
            this.stopAutoRotate();
            state.testimonialInterval = setInterval(() => this.next(), 5000);
        },
        
        stopAutoRotate() {
            if (state.testimonialInterval) {
                clearInterval(state.testimonialInterval);
                state.testimonialInterval = null;
            }
        },
        
        initTouchSwipe(element) {
            if (!element) return;
            
            let touchStartX = 0;
            let touchEndX = 0;
            
            element.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            element.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
        },
        
        handleSwipe(startX, endX) {
            const swipeThreshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }
    };
    
    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    
    function smoothScroll(targetId) {
        const target = document.getElementById(targetId);
        
        if (target) {
            const offsetTop = target.offsetTop;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            Navbar.closeMobileMenu();
        }
    }
    
    // ==========================================
    // WHATSAPP
    // ==========================================
    
    function openWhatsApp() {
        const phoneNumber = '919876543210'; // Replace with actual number
        const message = encodeURIComponent(
            'Hi! I am interested in booking a photography session with Mega Digital Studio. Please share more details.'
        );
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
    
    // ==========================================
    // KEYBOARD NAVIGATION
    // ==========================================
    
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // Escape key
            if (e.key === 'Escape') {
                Portfolio.closeLightbox();
                Navbar.closeMobileMenu();
            }
            
            // Arrow keys for testimonials
            if (e.key === 'ArrowLeft') {
                Testimonials.prev();
            } else if (e.key === 'ArrowRight') {
                Testimonials.next();
            }
        });
    }
    
    // ==========================================
    // ACTIVE NAV STATE ON SCROLL
    // ==========================================
    
    function initActiveNavState() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-menu a');
        
        function updateActiveNav() {
            const scrollPos = window.scrollY + 200;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', throttle(updateActiveNav, 100));
    }
    
    // ==========================================
    // PAGE VISIBILITY API
    // ==========================================
    
    function initVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                Testimonials.stopAutoRotate();
            } else {
                Testimonials.startAutoRotate();
            }
        });
    }
    
    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ==========================================
    // LAZY LOADING IMAGES
    // ==========================================
    
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // ==========================================
    // INITIALIZE EVERYTHING
    // ==========================================
    
    function init() {
        // Start preloader
        Preloader.init();
        
        // Initialize components
        Cursor.init();
        Navbar.init();
        Particles.init();
        Portfolio.init();
        Testimonials.init();
        
        // Initialize utilities
        initKeyboardNav();
        initActiveNavState();
        initVisibilityHandler();
        initLazyLoading();
        
        // WhatsApp buttons
        DOM.whatsappBtn?.addEventListener('click', openWhatsApp);
        DOM.btnGold?.addEventListener('click', openWhatsApp);
        DOM.btnWhatsapp?.addEventListener('click', openWhatsApp);
        
        // Hero CTA buttons
        document.querySelector('.btn-primary')?.addEventListener('click', () => smoothScroll('portfolio'));
        document.querySelector('.btn-secondary')?.addEventListener('click', () => smoothScroll('contact'));
        
        // Scroll indicator
        document.querySelector('.scroll-indicator')?.addEventListener('click', () => smoothScroll('story-sky'));
        
        // Console Easter Egg
        console.log('%c✨ Mega Digital Studio ✨', 'font-size: 24px; font-weight: bold; color: #D4AF37; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
        console.log('%cPremium Photography | Port Blair, Andaman', 'font-size: 14px; color: #888;');
        console.log('%c📸 Capturing Stories From Sky To Soul', 'font-size: 12px; color: #F5F5F5;');
    }
    
    // ==========================================
    // EXPOSE GLOBAL FUNCTIONS
    // ==========================================
    
    window.smoothScroll = smoothScroll;
    window.openWhatsApp = openWhatsApp;
    window.closeMobileMenu = Navbar.closeMobileMenu.bind(Navbar);
    
    // ==========================================
    // START APPLICATION
    // ==========================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();