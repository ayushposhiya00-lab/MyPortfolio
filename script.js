// ============================================================
// Ayush Poshiya — Portfolio Script
// Optimized for: Smooth Scrolling, Responsive Interactions,
// Throttled Scroll Handling (Zero Layout Thrashing),
// Double-Submission Prevention, and Accessible Reduced Motion
// ============================================================

(function () {
    'use strict';

    // Motion preference detection
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReducedMotion = () => motionQuery.matches;

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navWrapper = document.querySelector('.nav-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // ============================================
    // Mobile Navigation Drawer Toggle
    // ============================================
    if (mobileMenuBtn && navWrapper) {
        function toggleMobileMenu() {
            const isExpanded = mobileMenuBtn.classList.toggle('active');
            navWrapper.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        }

        function closeMobileMenu() {
            if (navWrapper.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navWrapper.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navWrapper.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close on ESC key for keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }

    // ============================================
    // Smooth Scrolling for in-page anchors
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();

                // Close mobile menu if open
                if (navWrapper && navWrapper.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    navWrapper.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }

                const navHeight = navbar ? navbar.offsetHeight : 68;
                const targetPosition = targetId === '#home'
                    ? 0
                    : Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8);

                window.scrollTo({
                    top: targetPosition,
                    behavior: isReducedMotion() ? 'auto' : 'smooth'
                });

                // Update URL hash cleanly without causing sudden page jump
                if (window.history && window.history.pushState) {
                    window.history.pushState(null, '', targetId);
                }
            }
        });
    });

    // ============================================
    // Active Navigation Link Highlighting (IntersectionObserver)
    // ============================================
    let activeSectionId = 'home';

    function setActiveNavLink(id) {
        if (!id || id === activeSectionId) return;
        activeSectionId = id;
        navLinks.forEach(link => {
            const match = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', match);
        });
    }

    if ('IntersectionObserver' in window && sections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveNavLink(entry.target.getAttribute('id'));
                }
            });
        }, {
            root: null,
            rootMargin: '-25% 0px -65% 0px',
            threshold: 0
        });

        sections.forEach(sec => sectionObserver.observe(sec));
    }

    // ============================================
    // Throttled Scroll Listener (rAF) for Navbar & Boundary States
    // Avoids forced reflows and eliminates layout thrashing
    // ============================================
    let ticking = false;

    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;

                // Navbar scrolled background elevation
                if (navbar) {
                    if (scrollY > 20) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                }

                // Handle top and bottom boundary edge cases for active nav
                if (scrollY < 60) {
                    setActiveNavLink('home');
                } else if ((window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 50)) {
                    setActiveNavLink('contact');
                }

                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ============================================
    // Subtle Scroll-Reveal Animations
    // ============================================
    function initScrollReveal() {
        // Respect user's motion preference: if reduced motion, keep all items visible without transition
        if (isReducedMotion()) return;

        document.body.classList.add('js-reveal');
        const revealElements = document.querySelectorAll('.reveal-item');

        if (!('IntersectionObserver' in window)) {
            // Graceful fallback: reveal all immediately if no observer
            revealElements.forEach(el => el.classList.add('revealed'));
            return;
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveal);
    } else {
        initScrollReveal();
    }

    // ============================================
    // Skills & Toolkit Filter Tabs Logic
    // Single shared skills data array with dynamic sequential numbering
    // ============================================
    const SKILLS_DATA = [
        // PROGRAMMING (In ALL: true)
        { id: 'python', name: 'PYTHON', category: 'programming', categoryLabel: 'Programming', icon: 'devicon-python-plain colored', inAll: true },
        { id: 'cpp', name: 'C++', category: 'programming', categoryLabel: 'Programming', icon: 'devicon-cplusplus-plain colored', inAll: true },
        { id: 'java', name: 'JAVA (BASICS)', category: 'programming', categoryLabel: 'Programming', icon: 'devicon-java-plain colored', inAll: true },
        { id: 'sql', name: 'SQL', category: 'programming', categoryLabel: 'Programming', icon: 'fas fa-database skill-icon-custom', inAll: true },

        // DATA SCIENCE (In ALL: true)
        { id: 'numpy', name: 'NUMPY', category: 'data-science', categoryLabel: 'Data Science', icon: 'devicon-numpy-original colored', inAll: true },
        { id: 'pandas', name: 'PANDAS', category: 'data-science', categoryLabel: 'Data Science', icon: 'devicon-pandas-original colored', inAll: true },
        { id: 'matplotlib', name: 'MATPLOTLIB', category: 'data-science', categoryLabel: 'Data Science', icon: 'devicon-matplotlib-plain colored', inAll: true },

        // AI / ML (In ALL: true)
        { id: 'scikitlearn', name: 'SCIKIT-LEARN', category: 'ai-ml', categoryLabel: 'AI / ML', icon: 'devicon-scikitlearn-plain colored', inAll: true },
        { id: 'nlp', name: 'NLP', category: 'ai-ml', categoryLabel: 'AI / ML', icon: 'fas fa-brain skill-icon-custom', inAll: true },
        { id: 'tfidf', name: 'TF-IDF', category: 'ai-ml', categoryLabel: 'AI / ML', icon: 'fas fa-calculator skill-icon-custom', inAll: true },
        { id: 'cosine-similarity', name: 'COSINE SIMILARITY', category: 'ai-ml', categoryLabel: 'AI / ML', icon: 'fas fa-vector-square skill-icon-custom', inAll: true },
        { id: 'rag', name: 'RAG', category: 'ai-ml', categoryLabel: 'AI / ML', icon: 'fas fa-layer-group skill-icon-custom', inAll: true },
        { id: 'llm-apis', name: 'LLM APIS', category: 'ai-ml', categoryLabel: 'AI / ML', icon: 'fas fa-robot skill-icon-custom', inAll: true },

        // WEB & API (In ALL: true)
        { id: 'html', name: 'HTML', category: 'web-api', categoryLabel: 'Web & API', icon: 'devicon-html5-plain colored', inAll: true },
        { id: 'css', name: 'CSS', category: 'web-api', categoryLabel: 'Web & API', icon: 'devicon-css3-plain colored', inAll: true },
        { id: 'javascript', name: 'JAVASCRIPT', category: 'web-api', categoryLabel: 'Web & API', icon: 'devicon-javascript-plain colored', inAll: true },
        { id: 'fastapi', name: 'FASTAPI', category: 'web-api', categoryLabel: 'Web & API', icon: 'devicon-fastapi-plain colored', inAll: true },
        { id: 'rest-apis', name: 'REST APIS', category: 'web-api', categoryLabel: 'Web & API', icon: 'fas fa-network-wired skill-icon-custom', inAll: true },

        // TOOLS (In ALL: false — EXCLUDED from ALL, ONLY in TOOLS)
        { id: 'git', name: 'GIT', category: 'tools', categoryLabel: 'Tools & Platforms', icon: 'devicon-git-plain colored', inAll: false },
        { id: 'github', name: 'GITHUB', category: 'tools', categoryLabel: 'Tools & Platforms', icon: 'fab fa-github skill-icon-github', inAll: false },
        { id: 'jupyter', name: 'JUPYTER', category: 'tools', categoryLabel: 'Tools & Platforms', icon: 'devicon-jupyter-plain colored', inAll: false },
        { id: 'vscode', name: 'VS CODE', category: 'tools', categoryLabel: 'Tools & Platforms', icon: 'devicon-vscode-plain colored', inAll: false }
    ];

    function initSkillsFilter() {
        const skillsGrid = document.getElementById('skills-grid');
        const filterTabs = document.querySelectorAll('.skills-tab');
        if (!skillsGrid || filterTabs.length === 0) return;

        function renderSkills(filterKey) {
            let filtered;
            if (filterKey === 'all') {
                filtered = SKILLS_DATA.filter(skill => skill.inAll);
            } else {
                filtered = SKILLS_DATA.filter(skill => skill.category === filterKey);
            }

            const html = filtered.map((skill, index) => {
                const numStr = String(index + 1).padStart(2, '0');
                return `
                <div class="skill-card" data-skill-id="${skill.id}">
                    <div class="skill-card-top">
                        <span class="skill-card-num">${numStr}</span>
                        <div class="skill-card-icon">
                            <i class="${skill.icon}"></i>
                        </div>
                    </div>
                    <div class="skill-card-content">
                        <h3 class="skill-card-name">${skill.name}</h3>
                        <span class="skill-card-category">${skill.categoryLabel}</span>
                    </div>
                </div>`;
            }).join('');

            skillsGrid.innerHTML = html;
        }

        filterTabs.forEach((tab, tabIndex) => {
            tab.addEventListener('click', function () {
                const filterKey = this.getAttribute('data-filter');
                if (!filterKey) return;

                filterTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });

                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                if (isReducedMotion()) {
                    renderSkills(filterKey);
                } else {
                    skillsGrid.classList.add('is-filtering');
                    setTimeout(() => {
                        renderSkills(filterKey);
                        skillsGrid.classList.remove('is-filtering');
                    }, 90);
                }
            });

            // Accessible Arrow Key Navigation
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const direction = e.key === 'ArrowRight' ? 1 : -1;
                    const nextIndex = (tabIndex + direction + filterTabs.length) % filterTabs.length;
                    filterTabs[nextIndex].focus();
                    filterTabs[nextIndex].click();
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSkillsFilter);
    } else {
        initSkillsFilter();
    }

    // Footer dynamic year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ============================================
    // Contact Form Submission (Web3Forms API)
    // Guarded against double submissions & responsive feedback
    // ============================================
    const WEB3FORMS_ACCESS_KEY = '46da46d0-2294-4c3a-966e-29d58d372131';
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
        const btnIcon = submitBtn ? submitBtn.querySelector('.btn-icon') : null;
        const feedback = document.getElementById('formFeedback');
        let isSubmitting = false;

        const fields = {
            fullName: {
                el: document.getElementById('fullName'),
                err: document.getElementById('nameError'),
                valid: val => val.trim().length >= 2
            },
            email: {
                el: document.getElementById('email'),
                err: document.getElementById('emailError'),
                valid: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
            },
            phone: {
                el: document.getElementById('phone'),
                err: document.getElementById('phoneError'),
                valid: val => val.trim() === '' || /^[+\d][\d\s\-()]{6,}$/.test(val.trim())
            },
            subject: {
                el: document.getElementById('subject'),
                err: document.getElementById('subjectError'),
                valid: val => val.trim().length >= 2
            },
            message: {
                el: document.getElementById('message'),
                err: document.getElementById('messageError'),
                valid: val => val.trim().length >= 10
            }
        };

        const setFieldState = (field, isValid) => {
            if (field.el) field.el.classList.toggle('is-invalid', !isValid);
            if (field.err) field.err.classList.toggle('visible', !isValid);
        };

        // Live validation clearance while typing
        Object.values(fields).forEach(field => {
            if (!field.el) return;
            field.el.addEventListener('input', () => {
                if (field.el.classList.contains('is-invalid') && field.valid(field.el.value)) {
                    setFieldState(field, true);
                }
            });
        });

        const showFeedback = (type, text) => {
            if (!feedback) return;
            const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
            feedback.className = `form-feedback visible ${type}`;
            feedback.innerHTML = `<i class="fas ${icon}"></i><span>${text}</span>`;
        };

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Prevent double submission while in flight
            if (isSubmitting) return;

            if (feedback) feedback.className = 'form-feedback';

            // Validate all form fields
            let allValid = true;
            Object.values(fields).forEach(field => {
                if (!field.el) return;
                const isValid = field.valid(field.el.value);
                setFieldState(field, isValid);
                if (!isValid) allValid = false;
            });

            if (!allValid) {
                showFeedback('error', 'Please fill in all required fields accurately.');
                return;
            }

            // Enter loading / disabled state
            isSubmitting = true;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.setAttribute('aria-busy', 'true');
            }
            if (btnText) btnText.textContent = 'Sending Message...';
            if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin btn-icon';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_ACCESS_KEY,
                        subject: `Portfolio Inquiry: ${fields.subject.el.value.trim()}`,
                        from_name: 'Ayush Poshiya Portfolio',
                        name: fields.fullName.el.value.trim(),
                        email: fields.email.el.value.trim(),
                        phone: fields.phone.el.value.trim() || 'Not provided',
                        message: fields.message.el.value.trim()
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    showFeedback('success', 'Thank you! Your message has been sent successfully. I will get back to you soon.');
                    if (btnText) btnText.textContent = 'Message Sent!';
                    if (btnIcon) btnIcon.className = 'fas fa-check btn-icon';
                    contactForm.reset();

                    setTimeout(() => {
                        if (btnText) btnText.textContent = 'Send Message';
                        if (btnIcon) btnIcon.className = 'fas fa-paper-plane btn-icon';
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.removeAttribute('aria-busy');
                        }
                        isSubmitting = false;
                    }, 3000);
                } else {
                    throw new Error(data.message || 'Error submitting message');
                }
            } catch (err) {
                showFeedback('error', 'Could not send message automatically. Please reach out directly to ayushposhiya00@gmail.com.');
                if (btnText) btnText.textContent = 'Send Message';
                if (btnIcon) btnIcon.className = 'fas fa-paper-plane btn-icon';
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');
                }
                isSubmitting = false;
            }
        });
    }
})();
