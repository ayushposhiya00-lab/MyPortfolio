// ============================================
// Setup
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// Mobile Navigation Toggle
// ============================================
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

function toggleMenu() {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
}

mobileMenu.addEventListener('click', toggleMenu);
mobileMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
    }
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ============================================
// Smooth scrolling for in-page links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// Navbar background on scroll
// ============================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 80) {
        navbar.style.background = 'rgba(11, 18, 32, 0.98)';
        navbar.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.4)';
    } else {
        navbar.style.background = 'rgba(11, 18, 32, 0.85)';
        navbar.style.boxShadow = 'none';
    }
}, { passive: true });

// ============================================
// Active nav link based on scroll position
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 120) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}, { passive: true });

// ============================================
// Scroll reveal animations
// ============================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    const revealTargets = document.querySelectorAll(
        'section:not(#home), .skill-category, .project-card, .cert-card, .contact-card, .stat-item'
    );

    revealTargets.forEach((el, index) => {
        el.classList.add('fade-in');
        if (!prefersReducedMotion) {
            el.style.transitionDelay = `${Math.min(index % 4, 3) * 0.08}s`;
        }
        observer.observe(el);
    });

    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ============================================
// Terminal typewriter effect (hero signature element)
// ============================================
const terminalLines = [
    { kw: 'const', var: ' ayush', plain: ' = {' },
    { key: '  name', plain: ': ', str: '"Ayush Poshiya"', plain2: ',' },
    { key: '  role', plain: ': ', str: '"AI/ML & Data Science Aspirant"', plain2: ',' },
    { key: '  focus', plain: ': [', str: '"ML"', plain2: ', ', str2: '"Data Science"', plain3: ', ', str3: '"DSA"', plain4: '],' },
    { key: '  university', plain: ': ', str: '"CHARUSAT University"', plain2: ',' },
    { key: '  location', plain: ': ', str: '"Junagadh, Gujarat, India"', plain2: ',' },
    { plain: '};' }
];

function renderLineHTML(line) {
    let html = '';
    if (line.kw) html += `<span class="tk-kw">${line.kw}</span>`;
    if (line.var) html += `<span class="tk-var">${line.var}</span>`;
    if (line.key) html += `<span class="tk-key">${line.key}</span>`;
    if (line.plain) html += line.plain;
    if (line.str) html += `<span class="tk-str">${line.str}</span>`;
    if (line.plain2) html += line.plain2;
    if (line.str2) html += `<span class="tk-str">${line.str2}</span>`;
    if (line.plain3) html += line.plain3;
    if (line.str3) html += `<span class="tk-str">${line.str3}</span>`;
    if (line.plain4) html += line.plain4;
    return html;
}

function typeTerminal() {
    const codeEl = document.getElementById('terminal-code');
    if (!codeEl) return;

    if (prefersReducedMotion) {
        codeEl.innerHTML = terminalLines.map(renderLineHTML).join('\n');
        return;
    }

    let lineIndex = 0;

    function typeNextLine() {
        if (lineIndex >= terminalLines.length) return;
        const fullHTML = renderLineHTML(terminalLines[lineIndex]);
        // Reveal each line's HTML in one step (avoids breaking tags mid-type)
        const lineWrapper = document.createElement('div');
        lineWrapper.innerHTML = fullHTML;
        lineWrapper.style.opacity = '0';
        codeEl.appendChild(lineWrapper);

        requestAnimationFrame(() => {
            lineWrapper.style.transition = 'opacity 0.25s ease';
            lineWrapper.style.opacity = '1';
        });

        lineIndex++;
        setTimeout(typeNextLine, 220);
    }

    typeNextLine();
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeTerminal, 400);
});

// ============================================
// Animated stat counters
// ============================================
function animateValue(element, start, end, duration) {
    if (prefersReducedMotion) {
        element.textContent = end;
        return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

const statValues = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const value = parseInt(entry.target.dataset.value, 10);
            entry.target.classList.add('animated');
            animateValue(entry.target, 0, value, 1200);
        }
    });
}, { threshold: 0.5 });

statValues.forEach(stat => statObserver.observe(stat));

// ============================================
// Loaded state
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ============================================
// Contact form -> sends message to your email (Web3Forms)
// ============================================
const WEB3FORMS_ACCESS_KEY = '46da46d0-2294-4c3a-966e-29d58d372131'; // <-- apni key yahan paste karo

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const feedback = document.getElementById('formFeedback');

    const fields = {
        fullName: {
            el: document.getElementById('fullName'), err: document.getElementById('nameError'),
            valid: v => v.trim().length >= 2
        },
        email: {
            el: document.getElementById('email'), err: document.getElementById('emailError'),
            valid: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        },
        phone: {
            el: document.getElementById('phone'), err: document.getElementById('phoneError'),
            valid: v => v.trim() === '' || /^[+\d][\d\s\-()]{6,}$/.test(v.trim())
        }, // optional
        subject: {
            el: document.getElementById('subject'), err: document.getElementById('subjectError'),
            valid: v => v.trim().length >= 2
        },
        message: {
            el: document.getElementById('message'), err: document.getElementById('messageError'),
            valid: v => v.trim().length >= 10
        }
    };

    const setFieldState = (f, ok) => {
        f.el.classList.toggle('is-invalid', !ok);
        f.err.classList.toggle('visible', !ok);
    };

    // live-clear errors while typing
    Object.values(fields).forEach(f => {
        f.el.addEventListener('input', () => {
            if (f.el.classList.contains('is-invalid') && f.valid(f.el.value)) setFieldState(f, true);
        });
    });

    const showFeedback = (type, text) => {
        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        feedback.className = `form-feedback visible ${type}`;
        feedback.innerHTML = `<i class="fas ${icon}"></i><span>${text}</span>`;
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedback.className = 'form-feedback';

        // validate
        let allValid = true;
        Object.values(fields).forEach(f => {
            const ok = f.valid(f.el.value);
            setFieldState(f, ok);
            if (!ok) allValid = false;
        });
        if (!allValid) return;

        if (WEB3FORMS_ACCESS_KEY === 'fd6f6d74-c133-4588-ab0e-66ad6329f7fa') {
            showFeedback('error', 'Form is not set (access key missing).');
            return;
        }

        // loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin btn-icon';

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: `Portfolio: ${fields.subject.el.value.trim()}`,
                    from_name: 'Portfolio Website',
                    name: fields.fullName.el.value.trim(),
                    email: fields.email.el.value.trim(),   // reply karne par isi par jayega
                    phone: fields.phone.el.value.trim() || 'Not provided',
                    message: fields.message.el.value.trim()
                })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                showFeedback('success', 'Thank you! Your message has been sent. I will get back to you soon.');
                submitBtn.classList.add('success');
                btnText.textContent = 'Message Sent';
                if (btnIcon) btnIcon.className = 'fas fa-check btn-icon';
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.classList.remove('success');
                    btnText.textContent = 'Send Message';
                    if (btnIcon) btnIcon.className = 'fas fa-paper-plane btn-icon';
                    submitBtn.disabled = false;
                }, 4000);
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (err) {
            showFeedback('error', 'Message send nahi ho paya. Please thodi der baad try karein ya direct email karein.');
            btnText.textContent = 'Send Message';
            if (btnIcon) btnIcon.className = 'fas fa-paper-plane btn-icon';
            submitBtn.disabled = false;
        }
    });
}
