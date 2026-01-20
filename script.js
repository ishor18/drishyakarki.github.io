document.addEventListener('DOMContentLoaded', () => {
    // --- Initial Data (only if localStorage is empty) ---
    const initialProjects = [
        {
            id: 1,
            title: "7amba",
            description: "A conversational AI assistant based on a fine-tuned Mamba model, deployed on HuggingFace.",
            tags: ["NLP", "Mamba", "HuggingFace"],
            link: "https://github.com/drishyakarki/7amba",
            icon: "fas fa-robot"
        },
        {
            id: 2,
            title: "GreenScan",
            description: "Web-integrated CNN (ResNet-18) for plant disease detection using a Flask API and React frontend.",
            tags: ["Computer Vision", "React", "Flask"],
            link: "https://github.com/drishyakarki/GreenScan",
            icon: "fas fa-leaf"
        },
        {
            id: 3,
            title: "TongueTechies",
            description: "It is primarily focused on the development of IndigeTranslate, an application designed to bridge language gaps for indigenous communities..",
            tags: ["Python", "Jupyter Notebook", "Dart"],
            link: "https://github.com/TongueTechies/",
            icon: "fas fa-language"
        }
    ];

    const initialResearch = [
        {
            id: 1,
            title: "Pixels or Positions? Benchmarking Modalities in Group Activity Recognition",
            description: "A study on broadcasting video vs. agent tracking in team sports like soccer. Submitted to CVPR 2025.",
            tag: "Nov 2025",
            link: "https://arxiv.org/abs/2511.12606",
            icon: "fas fa-video"
        },
        {
            id: 2,
            title: "EasyMath: A 0-shot Math Benchmark for SLMs",
            description: "A benchmark for small language models (SLMs) on arithmetic and algebraic problems.",
            tag: "May 2025",
            link: "https://arxiv.org/abs/2505.14852",
            icon: "fas fa-microchip"
        }
    ];

    // Initialize LocalStorage if empty or outdated
    const storedProjects = localStorage.getItem('projects');
    const storedResearch = localStorage.getItem('research');

    // Simple check: if stored projects don't have 'title', they are likely from an old version
    let forceReset = false;
    try {
        if (storedProjects) {
            const parsed = JSON.parse(storedProjects);
            if (parsed.length > 0 && !parsed[0].title) forceReset = true;
        }
    } catch (e) { forceReset = true; }

    if (!storedProjects || forceReset) {
        localStorage.setItem('projects', JSON.stringify(initialProjects));
    }
    if (!storedResearch || forceReset) {
        localStorage.setItem('research', JSON.stringify(initialResearch));
    }

    // --- Dynamic Rendering ---
    const renderContent = () => {
        const projects = JSON.parse(localStorage.getItem('projects'));
        const research = JSON.parse(localStorage.getItem('research'));

        const projectsContainer = document.getElementById('projectsContainer');
        const researchContainer = document.getElementById('researchContainer');

        if (projectsContainer) {
            projectsContainer.innerHTML = projects
                .filter(p => p && p.title)
                .map(p => `
                <div class="project-card" onclick="window.open('${p.link}', '_blank')">
                    <div class="project-img">
                        <i class="${p.icon || 'fas fa-code'}"></i>
                    </div>
                    <div class="project-info">
                        <h3>${p.title || 'Untitled Project'}</h3>
                        <p>${p.description || 'No description available.'}</p>
                        <div class="project-tags">
                            ${(p.tags || []).map(t => `<span>${t}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            <a href="${p.link}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-github"></i> View</a>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        if (researchContainer) {
            researchContainer.innerHTML = research
                .filter(r => r && r.title)
                .map(r => `
                <div class="research-item" onclick="window.open('${r.link}', '_blank')">
                    <div class="research-icon"><i class="${r.icon || 'fas fa-file-alt'}"></i></div>
                    <div class="research-details">
                        <h3 class="research-title">${r.title || 'Untitled Research'}</h3>
                        <p>${r.description || 'No description available.'}</p>
                        <span class="research-tag">${r.tag || ''}</span>
                    </div>
                </div>
            `).join('');
        }

        // Re-observe new elements for animations
        document.querySelectorAll('.project-card, .research-item').forEach(el => {
            el.classList.add('animate-up');
            if (window.observer) window.observer.observe(el);
        });
    };

    renderContent();

    // --- UI Logic ---
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('open');
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('open');
                }
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    window.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-up, .section, .skill-category').forEach(el => {
        window.observer.observe(el);
    });

    // --- Navbar Active State on Scroll ---
    const navLinksList = document.querySelectorAll('.nav-links a');
    const sectionObserverOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (id) {
                    navLinksList.forEach(link => {
                        link.classList.remove('active-link');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active-link');
                        }
                    });
                }
            }
        });
    }, sectionObserverOptions);

    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });

    // --- EmailJS Integration ---
    // PASTE YOUR KEYS HERE
    // --- EmailJS & Google Sheets Integration ---
    // PASTE YOUR KEYS HERE
    const EMAILJS_PUBLIC_KEY = 'ipFQK452e3OO4lhtZ';
    const EMAILJS_SERVICE_ID = 'service_k5zi9as';
    const EMAILJS_TEMPLATE_ID = 'template_4syi3oo';

    // PASTE YOUR GOOGLE SCRIPT URL HERE
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqdnauWoKS_TpfjG0JovO4LPCQ_8__oZpcLNN4zAYjLqjfaYoN0GKyMBLuuWlsKtsY/exec';

    // Initialize EmailJS
    if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    console.log('Script loaded. Contact form found:', contactForm);

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('🚀 Form submit triggered!');

            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerText;

            // 1. Check setup
            if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                alert('⚠️ EmailJS not configured!');
                return;
            }

            // 2. UI - Loading State
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            // 3. Prepare Data
            // For EmailJS, we pass the form element directly.
            // For Google Sheets, we need a JSON object.
            const formData = {
                name: contactForm.querySelector('input[name="from_name"]').value,
                email: contactForm.querySelector('input[name="from_email"]').value,
                message: contactForm.querySelector('textarea[name="message"]').value
            };

            // 4. Send to Both Services
            const emailPromise = emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this);

            const sheetPromise = (GOOGLE_SCRIPT_URL !== 'PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE')
                ? fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify(formData)
                })
                : Promise.resolve(); // Skip if URL not set

            Promise.all([emailPromise, sheetPromise])
                .then((values) => {
                    // Success UI
                    console.log('✅ EmailJS Success:', values[0]);
                    console.log('✅ Google Sheet Response (Opaque):', values[1]);

                    submitBtn.innerText = 'Message Sent!';
                    submitBtn.style.background = 'var(--accent-color)';
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.style.background = 'var(--primary-color)';
                        submitBtn.disabled = false;
                    }, 3000);
                })
                .catch((error) => {
                    console.error('❌ Submission Error:', error);
                    alert('Error sending message. Please try again.');
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});


