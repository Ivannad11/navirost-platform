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

// Early Access Form Handler
const earlyAccessForm = document.getElementById('early-access-form');
if (earlyAccessForm) {
    earlyAccessForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('email-input');
        const messageEl = document.getElementById('form-message');
        const email = emailInput.value.trim();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            messageEl.textContent = '❌ Введите корректный email';
            messageEl.style.color = '#DC2626';
            return;
        }
        
        let emails = JSON.parse(localStorage.getItem('earlyAccessEmails') || '[]');
        
        if (emails.includes(email)) {
            messageEl.textContent = '⚠️ Этот email уже в списке';
            messageEl.style.color = '#F59E0B';
            return;
        }
        
        emails.push(email);
        localStorage.setItem('earlyAccessEmails', JSON.stringify(emails));
        
        messageEl.textContent = '✅ Вы в списке! Напишем, как только запустимся';
        messageEl.style.color = '#16A34A';
        emailInput.value = '';
        
        console.log('New email registered:', email);
    });
}

// Burger Menu
const burgerBtn = document.getElementById('burger-btn');
const navLinks = document.getElementById('nav-links');

if (burgerBtn && navLinks) {
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!burgerBtn.contains(e.target) && !navLinks.contains(e.target)) {
            burgerBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Бургер-меню (дубликат для совместимости)
document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.getElementById('burger-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (burgerBtn) {
        burgerBtn.addEventListener('click', function() {
            burgerBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Закрыть меню при клике на ссылку
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                burgerBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});
