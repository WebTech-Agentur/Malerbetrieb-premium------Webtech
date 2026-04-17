document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // observer.unobserve(entry.target); // Optional: keep animating or just once
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Sticky Header style change
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = 'var(--shadow)';
        } else {
            header.style.padding = '0';
            header.style.boxShadow = 'none';
        }
    });

    // 3. Mobile Menu Toggle
    const setupMobileMenu = () => {
        const btn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.nav-links');
        
        if (btn) {
            btn.addEventListener('click', () => {
                nav.classList.toggle('mobile-active');
                const icon = btn.querySelector('i');
                if (nav.classList.contains('mobile-active')) {
                    icon.classList.replace('fa-bars', 'fa-times');
                } else {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            });
        }
    };
    setupMobileMenu();

    // 4. Smooth scroll for anchor links
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            // Check if it's an internal hash link
            const url = new URL(href, window.location.href);
            if (url.pathname === window.location.pathname && url.hash) {
                e.preventDefault();
                const target = document.querySelector(url.hash);
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navLinks = document.querySelector('.nav-links');
                    if (navLinks) navLinks.classList.remove('mobile-active');
                    const mobileMenuIcon = document.querySelector('.mobile-menu-btn i');
                    if (mobileMenuIcon) mobileMenuIcon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    });


});

// 7. Project Filtering Logic
function initProjectFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectItems = document.querySelectorAll(".project-item");

    if (filterButtons.length && projectItems.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove("active"));
                // Add active class to clicked button
                btn.classList.add("active");

                const filter = btn.textContent.trim().toLowerCase();

                projectItems.forEach(item => {
                    const category = item.getAttribute("data-category");
                    
                    if (filter === "alle") {
                        item.style.display = "block";
                        setTimeout(() => item.style.opacity = "1", 10);
                    } else if (category === filter) {
                        item.style.display = "block";
                        setTimeout(() => item.style.opacity = "1", 10);
                    } else {
                        item.style.opacity = "0";
                        setTimeout(() => item.style.display = "none", 300);
                    }
                });
            });
        });
    }
}

// 8. Dynamic Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The higher the slower

    const startCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const count = +el.innerText.replace(/[+%]/g, '');
        const inc = target / speed;

        if (count < target) {
            const nextCount = Math.ceil(count + inc);
            el.innerText = nextCount + (el.innerText.includes('%') ? '%' : (el.innerText.includes('+') || target > 15 ? '+' : ''));
            
            // Re-apply symbols correctly
            if (el.getAttribute('data-suffix')) {
                el.innerText = nextCount + el.getAttribute('data-suffix');
            }

            setTimeout(() => startCounter(el), 1);
        } else {
            el.innerText = target + (el.getAttribute('data-suffix') || '');
        }
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (!el.classList.contains('counted')) {
                    el.classList.add('counted');
                    startCounter(el);
                }
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

document.addEventListener("DOMContentLoaded", () => {
    initProjectFilters();
    initCounters();
});
