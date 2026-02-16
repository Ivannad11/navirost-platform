document.addEventListener('DOMContentLoaded', () => {
    // Platform Tabs Logic
    const tabs = document.querySelectorAll('.platform-tab');
    const panes = document.querySelectorAll('.content-pane');

    if (tabs.length && panes.length) {
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // Deactivate all
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));

                // Activate clicked
                tab.classList.add('active');
                if (panes[index]) {
                    panes[index].classList.add('active');
                }
            });
        });

        // Auto-rotate tabs if user hasn't interacted
        let autoRotate = true;
        let currentIndex = 0;
        const rotateInterval = setInterval(() => {
            if (!autoRotate) {
                clearInterval(rotateInterval);
                return;
            }
            currentIndex = (currentIndex + 1) % tabs.length;
            tabs[currentIndex].click();
        }, 5000);

        // Stop auto-rotation on interaction
        document.querySelector('.platform-container').addEventListener('mouseenter', () => {
            autoRotate = false;
        });
        document.querySelector('.platform-container').addEventListener('touchstart', () => {
            autoRotate = false;
        }, { passive: true });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observer to elements that need animation
    const animatedElements = document.querySelectorAll('.tool-card, .stat-item, .section-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)';
        observer.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
