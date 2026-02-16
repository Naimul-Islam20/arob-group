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
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

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
});
