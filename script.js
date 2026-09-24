document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('nav-active');
        });
    }

    // 2. Smooth scrolling & closing mobile menu
    const navLinks = document.querySelectorAll('.nav-links a, .hero-buttons a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                
                // Close mobile menu
                if (navMenu && navMenu.classList.contains('nav-active')) {
                    navMenu.classList.remove('nav-active');
                }

                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerOffset = 70;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 3. Dynamic Navbar Background
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init on load

    // 4. Scroll Spy with IntersectionObserver
    const sections = document.querySelectorAll('.section');
    const navLinksList = document.querySelectorAll('.nav-links a');

    const spyOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of viewport
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksList.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, spyOptions);

    sections.forEach(section => spyObserver.observe(section));

    // 5. Reveal Animations with IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only reveal once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 6. Enhanced Typing Effect
    const typeWriterElement = document.getElementById('typewriter');
    if (typeWriterElement) {
        const phrases = [
            "Student Developer",
            "Problem Solver",
            "Tech Enthusiast"
        ];
        let currentPhraseIndex = 0;
        let isDeleting = false;
        let charIndex = 0;
        
        const typeLoop = () => {
            const currentPhrase = phrases[currentPhraseIndex];
            
            if (isDeleting) {
                typeWriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeWriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            // Adjust typing speed
            let typeSpeed = isDeleting ? 40 : 100;
            typeSpeed += Math.random() * 50; // Randomize slightly for a human feel

            // Behavior at end of phrase
            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000; // Pause at end of word before deleting
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length; // Move to next phrase
                typeSpeed = 500; // Pause before typing next word
            }

            setTimeout(typeLoop, typeSpeed);
        };
        
        setTimeout(typeLoop, 1000); // Initial delay
    }

    // 7. Dynamic Footer Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 8. Form Submission Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const statusMsg = document.getElementById('contact-form-status');
        const submitBtn = document.getElementById('contact-submit');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Mock a loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            statusMsg.style.display = 'none';

            // Simulate an API call / submission delay
            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                // Show success state and reset form
                contactForm.reset();
                statusMsg.textContent = 'Message sent successfully! I will get back to you soon.';
                statusMsg.style.color = '#34d399'; // subtle green matching dark theme
                statusMsg.style.display = 'block';

                // Hide message after a while
                setTimeout(() => {
                    statusMsg.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }

    // 9. Experiment Zone: More Projects (Highest Stars First)
    const moreProjectsBtn = document.getElementById('more-projects-btn');
    const moreProjectsBtnText = document.getElementById('more-projects-btn-text');
    const moreProjectsIcon = document.getElementById('more-projects-icon');
    const experimentGrid = document.getElementById('experiment-grid');
    const repoFilterWrapper = document.getElementById('repo-filter-wrapper');
    const repoSearchInput = document.getElementById('repo-search-input');

    if (moreProjectsBtn && experimentGrid) {
        let isExpanded = false;
        let allProjects = [];

        if (typeof githubProjects !== 'undefined' && Array.isArray(githubProjects)) {
            allProjects = [...githubProjects];
        }

        // Sort by highest stars descending
        allProjects.sort((a, b) => (b.stars || 0) - (a.stars || 0));

        // Background update from GitHub API if network is available
        fetch('https://api.github.com/users/SaiVatsal/repos?per_page=100')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && Array.isArray(data)) {
                    allProjects = data.map(r => ({
                        name: r.name,
                        stars: r.stargazers_count || 0,
                        forks: r.forks_count || 0,
                        lang: r.language || 'Code',
                        desc: r.description ? (r.description.length > 130 ? r.description.substring(0, 127) + '...' : r.description) : 'Open source repository by Sai Vatsal.',
                        url: r.html_url
                    })).sort((a, b) => (b.stars || 0) - (a.stars || 0));

                    if (isExpanded) {
                        renderProjects(getFilteredProjects());
                    }
                }
            })
            .catch(() => {});

        const initialCardsHTML = experimentGrid.innerHTML;

        function escapeHTML(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        function createProjectCard(project) {
            const card = document.createElement('a');
            card.href = project.url;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.className = 'exp-card';
            card.title = `View ${project.name} on GitHub`;
            card.innerHTML = `
                <div class="exp-header">
                    <h4>${escapeHTML(project.name)}</h4>
                    <span class="exp-stars">⭐ ${project.stars}</span>
                </div>
                <p>${escapeHTML(project.desc)}</p>
                <div class="exp-footer">
                    <span class="exp-lang">${escapeHTML(project.lang)}</span>
                    <span class="exp-link-icon">&rarr;</span>
                </div>
            `;
            return card;
        }

        function renderProjects(projectsList) {
            experimentGrid.innerHTML = '';
            if (projectsList.length === 0) {
                const searchVal = repoSearchInput ? repoSearchInput.value : '';
                experimentGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: var(--text-muted); background: var(--surface-color); border-radius: var(--border-radius); border: 1px dashed var(--border-color);">
                        <p style="margin-bottom: 0.5rem; font-size: 1.1rem; color: var(--text-main);">No matching projects found</p>
                        <p style="font-size: 0.9rem;">No repositories matching "<strong>${escapeHTML(searchVal)}</strong>". Try another keyword like Python, bot, or web.</p>
                    </div>
                `;
                return;
            }
            projectsList.forEach(p => {
                experimentGrid.appendChild(createProjectCard(p));
            });
        }

        function getFilteredProjects() {
            if (!repoSearchInput || !repoSearchInput.value.trim()) {
                return allProjects;
            }
            const query = repoSearchInput.value.toLowerCase().trim();
            return allProjects.filter(p => 
                p.name.toLowerCase().includes(query) || 
                (p.desc && p.desc.toLowerCase().includes(query)) ||
                (p.lang && p.lang.toLowerCase().includes(query))
            );
        }

        moreProjectsBtn.addEventListener('click', () => {
            if (!isExpanded) {
                isExpanded = true;
                if (repoFilterWrapper) repoFilterWrapper.style.display = 'block';
                if (moreProjectsBtnText) moreProjectsBtnText.textContent = 'Show Less';
                if (moreProjectsIcon) moreProjectsIcon.innerHTML = '<path d="M12 19V5M5 12l7-7 7 7"/>';
                renderProjects(getFilteredProjects());
            } else {
                isExpanded = false;
                if (repoFilterWrapper) {
                    repoFilterWrapper.style.display = 'none';
                    if (repoSearchInput) repoSearchInput.value = '';
                }
                if (moreProjectsBtnText) moreProjectsBtnText.textContent = 'More Projects (Highest Stars)';
                if (moreProjectsIcon) moreProjectsIcon.innerHTML = '<path d="M12 5v14M5 12l7 7 7-7"/>';
                experimentGrid.innerHTML = initialCardsHTML;
            }
        });

        if (repoSearchInput) {
            repoSearchInput.addEventListener('input', () => {
                if (isExpanded) {
                    renderProjects(getFilteredProjects());
                }
            });
        }
    }
});
