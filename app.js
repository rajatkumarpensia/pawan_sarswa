// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initCountdownTimer();
    initScrollAnimations();
    initGalleryModal();
    initRSVPForm();
    initParallaxEffects();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu after clicking
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Countdown Timer
function initCountdownTimer() {
    const weddingDate = new Date('Febraury 15, 2026 18:00:00').getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            // Wedding has passed
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    // Update countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.bride-info, .groom-info, .program-item, .gallery-item, .fade-in-up, .fade-in-left, .fade-in-right'
    );

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Staggered animation for gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // Staggered animation for program items
    const programItems = document.querySelectorAll('.program-item');
    programItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
    });
}

// Gallery Modal
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');

    // Open modal
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('.gallery-image');
            if (img) {
                const imgSrc = img.src;
                const imgAlt = img.alt;

                modalImage.src = imgSrc;
                modalImage.alt = imgAlt;
                modal.classList.remove('hidden');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// RSVP Form
function initRSVPForm() {
    const rsvpForm = document.getElementById('rsvp-form');

    if (!rsvpForm) return;

    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show loading state
        const submitBtn = rsvpForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Get form data
        const formData = new FormData(rsvpForm);
        const guestName = formData.get('guestName');
        const guestEmail = formData.get('guestEmail');
        const guestPhone = formData.get('guestPhone');
        const guestCount = formData.get('guestCount');
        const dietaryPreferences = formData.get('dietaryPreferences');
        const message = formData.get('message');
        
        // Get selected events
        const selectedEvents = [];
        const eventCheckboxes = document.querySelectorAll('input[name="events"]:checked');
        eventCheckboxes.forEach(checkbox => {
            selectedEvents.push(checkbox.value);
        });

        // Basic validation
        if (!guestName || !guestEmail) {
            showNotification('Please fill in all required fields.', 'error');
            resetSubmitButton(submitBtn, originalText);
            return;
        }

        if (selectedEvents.length === 0) {
            showNotification('Please select at least one event to attend.', 'error');
            resetSubmitButton(submitBtn, originalText);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guestEmail)) {
            showNotification('Please enter a valid email address.', 'error');
            resetSubmitButton(submitBtn, originalText);
            return;
        }

        // Simulate form submission with proper feedback
        showNotification('Processing your RSVP...', 'info');
        
        setTimeout(() => {
            // Create RSVP summary
            const eventNames = {
                'tilak': 'Tilak Ceremony',
                'haldi': 'Haldi Ceremony',
                'mehendi': 'Mehendi Function',
                'wedding': 'Main Wedding Ceremony',
                'reception': 'Reception'
            };
            
            const selectedEventNames = selectedEvents.map(event => eventNames[event]).join(', ');
            
            showNotification(
                `Thank you ${guestName}! Your RSVP has been confirmed for: ${selectedEventNames}. We look forward to celebrating with you!`, 
                'success'
            );
            
            // Reset form after successful submission
            rsvpForm.reset();
            resetSubmitButton(submitBtn, originalText);
            
            // Optional: Scroll to top or show confirmation section
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
        }, 2000);
    });

    function resetSubmitButton(button, originalText) {
        button.textContent = originalText;
        button.disabled = false;
    }
}

// Enhanced Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        max-width: 400px;
        font-family: var(--font-text);
    `;

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#10B981';
            break;
        case 'error':
            notification.style.background = '#EF4444';
            break;
        case 'warning':
            notification.style.background = '#F59E0B';
            break;
        default:
            notification.style.background = '#3B82F6';
    }

    // Style notification content
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: flex-start;
        gap: 8px;
    `;

    const notificationMessage = notification.querySelector('.notification-message');
    notificationMessage.style.cssText = `
        flex: 1;
        line-height: 1.4;
    `;

    const notificationClose = notification.querySelector('.notification-close');
    notificationClose.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    `;

    notificationClose.addEventListener('click', () => {
        removeNotification(notification);
    });

    notificationClose.addEventListener('mouseenter', () => {
        notificationClose.style.opacity = '1';
    });

    notificationClose.addEventListener('mouseleave', () => {
        notificationClose.style.opacity = '0.8';
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 6 seconds (longer for success messages)
    const autoRemoveTime = type === 'success' ? 8000 : 5000;
    setTimeout(() => {
        removeNotification(notification);
    }, autoRemoveTime);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return '✅';
        case 'error':
            return '❌';
        case 'warning':
            return '⚠️';
        default:
            return 'ℹ️';
    }
}

function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Parallax Effects
function initParallaxEffects() {
    let ticking = false;

    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        // Hero background parallax
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            const speed = 0.5;
            heroBackground.style.transform = `translateY(${scrollTop * speed}px)`;
        }

        // Floating elements
        const floatingElements = document.querySelectorAll('.heart-icon');
        floatingElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.1);
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px) scale(1)`;
        });

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add entrance animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
});

// Add hover effects for interactive elements
function initHoverEffects() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Card hover effects - already handled in CSS
}

// Initialize hover effects
initHoverEffects();

// Add floating animation to decorative elements
function initFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.scroll-arrow, .heart-icon');
    
    floatingElements.forEach((element, index) => {
        // Create unique floating animation for each element
        const duration = 3000 + (index * 500); // Vary duration
        const delay = index * 200; // Stagger animations
        
        element.style.animationDuration = `${duration}ms`;
        element.style.animationDelay = `${delay}ms`;
    });
}

initFloatingAnimations();

// Add text typing effect for hero section (optional enhancement)
function initTypingEffect() {
    const weddingLocation = document.querySelector('.wedding-location');
    if (weddingLocation) {
        const originalText = weddingLocation.textContent;
        weddingLocation.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                weddingLocation.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 2000);
    }
}

// Initialize typing effect
setTimeout(initTypingEffect, 1000);

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #D4AF37, #8B0000);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

initScrollProgress();

// Add click to directions functionality
document.addEventListener('DOMContentLoaded', function() {
    const directionsBtn = document.querySelector('.directions-btn');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function() {
            const address = encodeURIComponent('Lake Pichola, Udaipur, Rajasthan 313001, India');
            const googleMapsUrl = `https://www.google.com/maps/search/${address}`;
            window.open(googleMapsUrl, '_blank');
        });
    }
});

// Add intersection observer for navbar active states
function initNavbarActiveStates() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding link
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

initNavbarActiveStates();

// Performance optimization: Debounce scroll events
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

// Apply debouncing to expensive scroll operations
const debouncedParallax = debounce(function() {
    // Parallax effects handled in initParallaxEffects
}, 10);

// Additional form validation and user experience improvements
function enhanceFormExperience() {
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
            // Add validation feedback on blur
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#EF4444';
            } else {
                this.style.borderColor = '';
            }
        });
        
        // Real-time validation for email
        if (input.type === 'email') {
            input.addEventListener('input', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (this.value && !emailRegex.test(this.value)) {
                    this.style.borderColor = '#F59E0B';
                } else {
                    this.style.borderColor = '#10B981';
                }
            });
        }
    });
}

// Initialize form enhancements
enhanceFormExperience();

// Add preloader (optional)
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="wedding-rings">💍</div>
            <div class="loading-text">Loading our special day...</div>
        </div>
    `;
    
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #D4AF37, #8B0000);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: var(--font-text);
        text-align: center;
    `;
    
    const preloaderContent = preloader.querySelector('.preloader-content');
    preloaderContent.style.cssText = `
        text-align: center;
    `;
    
    const weddingRings = preloader.querySelector('.wedding-rings');
    weddingRings.style.cssText = `
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: spin 2s linear infinite;
    `;
    
    const loadingText = preloader.querySelector('.loading-text');
    loadingText.style.cssText = `
        font-size: 1.2rem;
        font-family: var(--font-serif);
    `;
    
    // Add spin animation
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `);
    
    document.body.appendChild(preloader);
    
    // Remove preloader when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }, 1000);
    });
}

// Initialize preloader
initPreloader();