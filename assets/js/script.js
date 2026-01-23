document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DEFINITIONS ---
    const menuBtn = document.querySelector('.menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    const navLinks = document.querySelectorAll('.mobile-nav .nav-link');
    const body = document.body;
    const header = document.getElementById('navbar');
    const htmlElement = document.documentElement;
    const themeBtns = document.querySelectorAll('.theme-btn');
    const backToTop = document.querySelector('.back-to-top');
    const hiddenElements = document.querySelectorAll('.hidden');
    const glowBlob = document.querySelector('.glow-blob');
    const timeDisplay = document.getElementById('timeDisplay');

    // --- 2. MOBILE MENU LOGIC ---
    function toggleMenu() {
        if (menuBtn && mobileNav && menuOverlay) {
            menuBtn.classList.toggle('active');   
            mobileNav.classList.toggle('active'); 
            menuOverlay.classList.toggle('active');
            body.classList.toggle('no-scroll');   
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('active')) toggleMenu();
        });
    });

    // --- 3. THEME TOGGLE LOGIC ---
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateAllThemeIcons(savedTheme);
    }

    // Update icons for ALL buttons (Desktop & Mobile)
    function updateAllThemeIcons(theme) {
        const icons = document.querySelectorAll('.theme-btn i');
        icons.forEach(icon => {
            if (theme === 'light') {
                icon.classList.remove('bx-sun');
                icon.classList.add('bx-moon');
            } else {
                icon.classList.remove('bx-moon');
                icon.classList.add('bx-sun');
            }
        });
    }

    // Attach event listeners to ALL theme buttons
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.classList.add('theme-transitioning');
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            updateAllThemeIcons(newTheme);
            
            setTimeout(() => {
                htmlElement.classList.remove('theme-transitioning');
            }, 300);
        });
    });

    // --- 4. SCROLL & HEADER LOGIC ---
    function handleScroll() {
        const scrollY = window.scrollY;

        // Header Transformation
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to Top Button
        if (backToTop) {
            backToTop.classList.toggle('show', scrollY > 300);
        }

        updateTimelineFill();
    }

    // Throttled Scroll Listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            handleScroll();
            scrollTimeout = null;
        }, 10);
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 5. TIMELINE ANIMATION ---
    function updateTimelineFill() {
        const timeline = document.querySelector('.timeline');
        const timelineFill = document.querySelector('.timeline-fill');
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        if (!timeline || !timelineFill || timelineItems.length === 0) return;
        
        const timelineRect = timeline.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (timelineRect.top < viewportHeight * 0.75 && timelineRect.bottom > 0) {
            const scrollProgress = Math.max(0, Math.min(1, 
                (viewportHeight * 0.75 - timelineRect.top) / (timelineRect.height)
            ));
            
            timelineFill.style.height = `${scrollProgress * 100}%`;
            
            timelineItems.forEach((item, index) => {
                const itemProgress = (index + 1) / timelineItems.length;
                if (scrollProgress >= itemProgress - 0.1) {
                    item.classList.add('active');
                }
            });
        }
    }

    // --- 6. SCROLL REVEAL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    hiddenElements.forEach(el => observer.observe(el));

    // --- 7. MOUSE GLOW ---
    if (glowBlob) {
        let rafId;
        document.addEventListener('mousemove', (e) => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                glowBlob.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
                rafId = null;
            });
        });
    }

    // --- 8. FOOTER TIME ---
    function updateTime() {
        if (timeDisplay) {
            const now = new Date();
            timeDisplay.textContent = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', minute: '2-digit', hour12: true 
            });
        }
    }
    updateTime();
    setInterval(updateTime, 60000);

    // Initial Trigger
    handleScroll();
});