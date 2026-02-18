// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                accent: 'var(--color-accent)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
        }
    }
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Professional Mobile Menu Logic
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    function openMenu() {
        if (mobileMenu && menuOverlay) {
            mobileMenu.classList.remove('translate-x-full');
            menuOverlay.classList.remove('hidden');
            setTimeout(() => {
                menuOverlay.classList.remove('opacity-0');
            }, 10);
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMenu() {
        if (mobileMenu && menuOverlay) {
            mobileMenu.classList.add('translate-x-full');
            menuOverlay.classList.add('opacity-0');
            setTimeout(() => {
                menuOverlay.classList.add('hidden');
            }, 300);
            document.body.style.overflow = '';
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // Global toggleAccordion function
    window.toggleAccordion = function(id) {
        const submenu = document.getElementById(id);
        const button = event.currentTarget;
        const icon = button.querySelector('.fa-chevron-down');
        
        if (submenu.classList.contains('grid-rows-[0fr]')) {
            submenu.classList.remove('grid-rows-[0fr]', 'opacity-0');
            submenu.classList.add('grid-rows-[1fr]', 'opacity-100');
            button.classList.add('text-primary', 'bg-slate-50');
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        } else {
            submenu.classList.add('grid-rows-[0fr]', 'opacity-0');
            submenu.classList.remove('grid-rows-[1fr]', 'opacity-100');
            button.classList.remove('text-primary', 'bg-slate-50');
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        }
    };

    // Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('bg-white/95', 'shadow-md');
                header.classList.remove('bg-white');
            } else {
                header.classList.add('bg-white');
                header.classList.remove('bg-white/95', 'shadow-md');
            }
        }
    });

    // Hero Slider Logic
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const nextBtn = document.getElementById('next-slide');
    const prevBtn = document.getElementById('prev-slide');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (dots[i]) {
                    dots[i].classList.remove('active');
                }
                
                const content = slide.querySelector('.max-w-4xl');
                if (content) {
                    content.classList.remove('fade-in');
                }
            });

            slides[index].classList.add('active');
            if (dots[index]) {
                dots[index].classList.add('active');
            }
            
            setTimeout(() => {
                const content = slides[index].querySelector('.max-w-4xl');
                if (content) {
                    content.classList.add('fade-in');
                }
            }, 50);
            
            currentSlide = index;
        }

        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function prevSlide() {
            let prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
        }

        function startAutoSlide() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide();
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showSlide(i);
                startAutoSlide();
            });
        });

        startAutoSlide();
    }

    // Dynamic Copyright Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Toast Notification System
    function showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-exclamation',
            info: 'fa-circle-info'
        };

        toast.innerHTML = `
            <i class="fa-solid ${icons[type]}"></i>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
                if (container.childNodes.length === 0) {
                    container.remove();
                }
            }, 300);
        }, 5000);
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Form Data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // UI State - Loading
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sending...';

            try {
                const response = await fetch('http://127.0.0.1:8000/api/contact/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    // Success Toast
                    showToast(result.message || 'Message submitted successfully!', 'success');
                    contactForm.reset();
                } else {
                    // Error Toast from API
                    showToast(result.message || 'Something went wrong. Please try again later.', 'error');
                }
            } catch (error) {
                // Network Error Toast
                showToast('Unable to connect to server. Please check your connection.', 'error');
            } finally {
                // Reset Button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // Testimonial Slider Logic
    const testimonialTrack = document.getElementById('testimonial-track');
    let testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialPrev = document.getElementById('testimonial-prev');
    const testimonialNext = document.getElementById('testimonial-next');
    const testimonialDotsContainer = document.getElementById('testimonial-dots');

    if (testimonialTrack && testimonialSlides.length > 0) {
        let currentIndex = 0;
        let isTransitioning = false;
        let autoSlideInterval;
        const originalCount = testimonialSlides.length;

        // Clone slides for infinite effect
        // We clone enough to fill the screen twice to be safe
        const clonesBefore = [];
        const clonesAfter = []; e = originalCount;
        
        // Clone all slides and append
        testimonialSlides.forEach(slide => {
            const clone = slide.cloneNode(true);
            testimonialTrack.appendChild(clone);
        });

        // Re-select slides to include clones
        const allSlides = testimonialTrack.querySelectorAll('.testimonial-slide');

        function getSlidesToShow() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }

        function updateSlider(animate = true) {
            const slidesToShow = getSlidesToShow();
            const slideWidth = 100 / slidesToShow;
            
            if (!animate) {
                testimonialTrack.style.transition = 'none';
            } else {
                testimonialTrack.style.transition = 'transform 0.7s ease-in-out';
            }

            testimonialTrack.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
            
            // Update dots (use modulo to highlight the correct original dot)
            const dots = testimonialDotsContainer.querySelectorAll('button');
            const activeDotIndex = currentIndex % originalCount;
            dots.forEach((dot, i) => {
                dot.classList.toggle('bg-primary', i === activeDotIndex);
                dot.classList.toggle('bg-slate-300', i !== activeDotIndex);
                dot.classList.toggle('w-12', i === activeDotIndex);
                dot.classList.toggle('w-2.5', i !== activeDotIndex);
            });

            if (!animate) {
                // Force reflow
                testimonialTrack.offsetHeight;
                testimonialTrack.style.transition = 'transform 0.7s ease-in-out';
            }
        }

        function nextTestimonial() {
            if (isTransitioning) return;
            isTransitioning = true;
            
            currentIndex++;
            updateSlider();

            // Check for reset after transition
            setTimeout(() => {
                if (currentIndex >= originalCount) {
                    currentIndex = 0;
                    updateSlider(false);
                }
                isTransitioning = false;
            }, 700);
        }

        function prevTestimonial() {
            if (isTransitioning) return;
            isTransitioning = true;

            if (currentIndex === 0) {
                currentIndex = originalCount;
                updateSlider(false);
                // Trigger the actual move back from the snapped position
                setTimeout(() => {
                    currentIndex--;
                    updateSlider();
                }, 10);
            } else {
                currentIndex--;
                updateSlider();
            }

            setTimeout(() => {
                isTransitioning = false;
            }, 700);
        }

        function createDots() {
            testimonialDotsContainer.innerHTML = '';
            for (let i = 0; i < originalCount; i++) {
                const dot = document.createElement('button');
                dot.className = `h-2.5 rounded-full transition-all duration-300 ${i === currentIndex % originalCount ? 'bg-primary w-12' : 'bg-slate-300 w-2.5'}`;
                dot.addEventListener('click', () => {
                    if (isTransitioning) return;
                    currentIndex = i;
                    updateSlider();
                    startAutoSlide();
                });
                testimonialDotsContainer.appendChild(dot);
            }
        }

        function startAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextTestimonial, 5000);
        }

        // Event Listeners
        if (testimonialNext) testimonialNext.addEventListener('click', () => {
            nextTestimonial();
            startAutoSlide();
        });

        if (testimonialPrev) testimonialPrev.addEventListener('click', () => {
            prevTestimonial();
            startAutoSlide();
        });

        window.addEventListener('resize', () => {
            updateSlider(false);
        });

        // Initialize
        createDots();
        updateSlider(false);
        startAutoSlide();
    }

    // Service Slider Logic
    const serviceTrack = document.getElementById('service-track');
    let serviceSlides = document.querySelectorAll('.service-slide');
    const servicePrev = document.getElementById('service-prev');
    const serviceNext = document.getElementById('service-next');
    const serviceDotsContainer = document.getElementById('service-dots');

    if (serviceTrack && serviceSlides.length > 0) {
        let currentIndex = 0;
        let isTransitioning = false;
        let autoSlideInterval;
        const originalCount = serviceSlides.length;

        // Clone slides for infinite effect
        serviceSlides.forEach(slide => {
            const clone = slide.cloneNode(true);
            serviceTrack.appendChild(clone);
        });

        function getSlidesToShow() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }

        function updateSlider(animate = true) {
            const slidesToShow = getSlidesToShow();
            const slideWidth = 100 / slidesToShow;
            
            if (!animate) {
                serviceTrack.style.transition = 'none';
            } else {
                serviceTrack.style.transition = 'transform 0.7s ease-in-out';
            }

            serviceTrack.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
            
            const dots = serviceDotsContainer.querySelectorAll('button');
            const activeDotIndex = currentIndex % originalCount;
            dots.forEach((dot, i) => {
                dot.classList.toggle('bg-primary', i === activeDotIndex);
                dot.classList.toggle('bg-slate-300', i !== activeDotIndex);
                dot.classList.toggle('w-12', i === activeDotIndex);
                dot.classList.toggle('w-2.5', i !== activeDotIndex);
            });

            if (!animate) {
                serviceTrack.offsetHeight;
                serviceTrack.style.transition = 'transform 0.7s ease-in-out';
            }
        }

        function nextService() {
            if (isTransitioning) return;
            isTransitioning = true;
            
            currentIndex++;
            updateSlider();

            setTimeout(() => {
                if (currentIndex >= originalCount) {
                    currentIndex = 0;
                    updateSlider(false);
                }
                isTransitioning = false;
            }, 700);
        }

        function prevService() {
            if (isTransitioning) return;
            isTransitioning = true;

            if (currentIndex === 0) {
                currentIndex = originalCount;
                updateSlider(false);
                setTimeout(() => {
                    currentIndex--;
                    updateSlider();
                }, 10);
            } else {
                currentIndex--;
                updateSlider();
            }

            setTimeout(() => {
                isTransitioning = false;
            }, 700);
        }

        function createDots() {
            serviceDotsContainer.innerHTML = '';
            for (let i = 0; i < originalCount; i++) {
                const dot = document.createElement('button');
                dot.className = `h-2.5 rounded-full transition-all duration-300 ${i === currentIndex % originalCount ? 'bg-primary w-12' : 'bg-slate-300 w-2.5'}`;
                dot.addEventListener('click', () => {
                    if (isTransitioning) return;
                    currentIndex = i;
                    updateSlider();
                    startAutoSlide();
                });
                serviceDotsContainer.appendChild(dot);
            }
        }

        function startAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextService, 5000);
        }

        if (serviceNext) serviceNext.addEventListener('click', () => {
            nextService();
            startAutoSlide();
        });

        if (servicePrev) servicePrev.addEventListener('click', () => {
            prevService();
            startAutoSlide();
        });

        window.addEventListener('resize', () => {
            updateSlider(false);
        });

        createDots();
        updateSlider(false);
        startAutoSlide();
    }

});
