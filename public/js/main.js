// ========================================
// MAIN JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    initMobileMenu();
    
    // Scroll to Top Button
    initScrollToTop();
    
    // Smooth Scroll
    initSmoothScroll();
    
    // Animations on Scroll
    initScrollAnimations();
    
    // Quotes Carousel
    initQuotesCarousel();
    
    // Mosque Images Carousel
    initMosqueCarousel();
    
    // Language Selector
    initLanguageSelector();
    
    // Adhesion Form
    initAdhesionForm();
    
    // Modal System
    if (window.modalSystem) {
        window.modalSystem.init();
    }
});

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on a link
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    if (scrollBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.actualite-card, .pole-card, .impact-card, .quick-contact-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ========================================
// QUOTES CAROUSEL
// ========================================
function initQuotesCarousel() {
    const carousel = document.querySelector('.quotes-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.quote-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentSlide = 0;
    let autoplayInterval;
    
    // Show slide function
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    // Next slide function
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoplay();
        });
    });
    
    // Start autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000); // Change every 5 seconds
    }
    
    // Reset autoplay
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        startAutoplay();
    });
    
    // Initialize
    showSlide(0);
    startAutoplay();
}

// ========================================
// LANGUAGE SELECTOR
// ========================================
function initLanguageSelector() {
    const selector = document.querySelector('.language-selector');
    if (!selector) return;
    
    const button = selector.querySelector('.language-button');
    const dropdown = selector.querySelector('.language-dropdown');
    const options = selector.querySelectorAll('.language-option');
    
    // Toggle dropdown
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        dropdown.classList.remove('active');
    });
    
    // Handle language selection
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = option.dataset.lang;
            
            // Set cookie for 1 year
            document.cookie = `lang=${lang}; path=/; max-age=31536000`;
            
            // Reload page to apply new language
            window.location.reload();
        });
    });
}

// ========================================
// ADHESION FORM
// ========================================
function initAdhesionForm() {
    const form = document.getElementById('adhesionForm');
    if (!form) return;
    
    const contributionRadios = form.querySelectorAll('input[name="contribution"]');
    const customContributionGroup = document.getElementById('customContributionGroup');
    const customContributionInput = document.getElementById('customContribution');
    
    // Show/hide custom contribution input
    contributionRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'custom') {
                customContributionGroup.style.display = 'block';
                customContributionInput.required = true;
            } else {
                customContributionGroup.style.display = 'none';
                customContributionInput.required = false;
            }
        });
    });
    
    // Email confirmation validation
    const emailInput = document.getElementById('email');
    const emailConfirmInput = document.getElementById('emailConfirm');
    
    emailConfirmInput.addEventListener('input', () => {
        if (emailInput.value !== emailConfirmInput.value) {
            emailConfirmInput.setCustomValidity('Les adresses e-mail ne correspondent pas');
        } else {
            emailConfirmInput.setCustomValidity('');
        }
    });
    
    // IBAN formatting
    const ibanInput = document.getElementById('iban');
    if (ibanInput) {
        ibanInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '').toUpperCase();
            let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formatted;
        });
    }
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch('/adhesion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Votre adhésion a été enregistrée avec succès ! Un email de confirmation vous sera envoyé.');
                form.reset();
            } else {
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    });
}

// ========================================
// MOSQUE IMAGES CAROUSEL
// ========================================
function initMosqueCarousel() {
    const carouselContainer = document.querySelector('.mosque-images-carousel .carousel-container');
    if (!carouselContainer) return;
    
    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    const prevBtn = carouselContainer.querySelector('.carousel-prev');
    const nextBtn = carouselContainer.querySelector('.carousel-next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    // Image error handling
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            img.addEventListener('error', function() {
                this.src = '/images/Logo_CIMG_VF_GT_MOSAIQUE.png';
            });
        }
    });
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
        });
        slides[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto-advance every 6 seconds
    setInterval(nextSlide, 6000);
    
    // Initialize first slide
    showSlide(0);
}
