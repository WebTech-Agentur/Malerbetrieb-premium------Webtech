document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal animations on scroll
    initRevealAnimations();
    
    // 2. Sticky Header style change
    initStickyHeader();

    // 3. Mobile Menu & Submenu Logic
    initMobileMenu();

    // 4. Smooth scroll for anchor links
    initSmoothScroll();

    // 5. Project Filtering Logic
    initProjectFilters();

    // 6. Dynamic Counter Animation
    initCounters();
});

// --- Initialization Functions ---

function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

function initStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = 'var(--shadow)';
        } else {
            header.style.padding = '0';
            header.style.boxShadow = 'none';
        }
    });
}

function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-links');
    const megaItems = document.querySelectorAll('.has-mega');
    
    if (btn && nav) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('mobile-active');
            const icon = btn.querySelector('i');
            
            if (nav.classList.contains('mobile-active')) {
                icon.classList.replace('fa-bars', 'fa-times');
                document.body.style.overflow = 'hidden'; 
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                document.body.style.overflow = '';
                // Close all submenus when menu is closed
                megaItems.forEach(item => item.classList.remove('submenu-active'));
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('mobile-active') && !nav.contains(e.target) && !btn.contains(e.target)) {
                nav.classList.remove('mobile-active');
                btn.querySelector('i').classList.replace('fa-times', 'fa-bars');
                document.body.style.overflow = '';
            }
        });
    }

    // Submenu Toggle for Mobile
    megaItems.forEach(item => {
        const megaLink = item.querySelector('a');
        if (megaLink) {
            megaLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    const isActive = item.classList.contains('submenu-active');
                    
                    // Close other submenus (if any)
                    megaItems.forEach(i => i.classList.remove('submenu-active'));
                    
                    // Toggle current
                    if (!isActive) {
                        item.classList.add('submenu-active');
                    }
                }
            });
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.startsWith('mailto:')) return;

            try {
                // Check if it's an internal hash link
                const url = new URL(href, window.location.href);
                if (url.pathname === window.location.pathname && url.hash) {
                    const target = document.querySelector(url.hash);
                    if (target) {
                        e.preventDefault();
                        const headerOffset = 100;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu
                        const navLinks = document.querySelector('.nav-links');
                        if (navLinks && navLinks.classList.contains('mobile-active')) {
                            navLinks.classList.remove('mobile-active');
                            const btnIcon = document.querySelector('.mobile-menu-btn i');
                            if (btnIcon) btnIcon.classList.replace('fa-times', 'fa-bars');
                            document.body.style.overflow = '';
                        }
                    }
                }
            } catch (error) {
                // Not a valid URL for standard constructor, might be local hash or path
                if (href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        window.scrollTo({
                            top: target.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
}

function initProjectFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectItems = document.querySelectorAll(".project-item");

    if (filterButtons.length && projectItems.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.textContent.trim().toLowerCase();

                projectItems.forEach(item => {
                    const category = item.getAttribute("data-category");
                    if (filter === "alle" || category === filter) {
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

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const speed = 200;

    const startCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const count = +el.innerText.replace(/[+%]/g, '');
        const inc = target / speed;

        if (count < target) {
            const nextCount = Math.ceil(count + inc);
            if (el.getAttribute('data-suffix')) {
                el.innerText = nextCount + el.getAttribute('data-suffix');
            } else {
                el.innerText = nextCount + (el.innerText.includes('%') ? '%' : (el.innerText.includes('+') || target > 15 ? '+' : ''));
            }
            setTimeout(() => startCounter(el), 1);
        } else {
            el.innerText = target + (el.getAttribute('data-suffix') || '');
        }
    };

    const counterObserver = new IntersectionObserver((entries) => {
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
