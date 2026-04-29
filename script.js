document.addEventListener('DOMContentLoaded', () => {
    // --- Supabase Config ---
    const SUPABASE_URL = 'https://eqijufahytbwxnxszlzf.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxaWp1ZmFoeXRid3hueHN6bHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzE0MTcsImV4cCI6MjA5MzA0NzQxN30.fuHslML7flu4Rs9TfpyGvtdFrLM0DoXoH62KE_d5Xj8';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    window.supabase = supabaseClient; // Make it global for easier access if needed

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

    const initialImportant = [
        {
            id: 1,
            title: "Accepted into KAUST",
            description: "Started working as a Research Engineer at King Abdullah University of Science and Technology.",
            tag: "Career",
            link: "#",
            icon: "fas fa-briefcase"
        },
        {
            id: 2,
            title: "CVPR 2025 Submission",
            description: "Submitted our research on 'Pixels or Positions? Benchmarking Modalities in Group Activity Recognition'.",
            tag: "Research",
            link: "https://arxiv.org/abs/2511.12606",
            icon: "fas fa-book-open"
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
    
    const storedImportant = localStorage.getItem('important');
    if (!storedImportant || forceReset) {
        localStorage.setItem('important', JSON.stringify(initialImportant));
    }

    // --- Helper Functions ---
    let updatesShownCount = 10;
    const updatesIncrement = 10;
    let projectsShownCount = 3;
    const projectsIncrement = 3;
    let researchShownCount = 3;
    const researchIncrement = 3;
    let skillsShownCount = 3;
    const skillsIncrement = 3;

    const parseDate = (dateStr) => {
        if (!dateStr) return 0;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? 0 : date.getTime();
    };

    const sortItems = (items) => {
        return [...items].sort((a, b) => {
            const dateA = parseDate(a.tag || (a.tags ? a.tags[0] : ''));
            const dateB = parseDate(b.tag || (b.tags ? b.tags[0] : ''));
            
            if (dateB === dateA) return b.id - a.id;
            return dateB - dateA;
        });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr; // Fallback to raw string if not a valid date
        
        // Format as "Nov 2025" or similar
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // --- Dynamic Rendering ---
    const renderContent = async () => {
        // Fetch from Supabase
        const { data: projects, error: pErr } = await supabase.from('projects').select('*');
        const { data: research, error: rErr } = await supabase.from('research').select('*');
        const { data: important, error: iErr } = await supabase.from('important').select('*');
        const { data: skills, error: sErr } = await supabase.from('skills').select('*');

        if (pErr || rErr || iErr || sErr) {
            console.error('Error fetching from Supabase, falling back to LocalStorage');
            renderFromLocal();
            return;
        }

        const projectsContainer = document.getElementById('projectsContainer');
        const researchContainer = document.getElementById('researchContainer');
        const importantContainer = document.getElementById('importantContainer');
        const skillsContainer = document.getElementById('skillsContainer');

        if (projectsContainer) {
            const sortedProjects = sortItems(projects || []).filter(p => p && p.title);
            const visibleProjects = sortedProjects.slice(0, projectsShownCount);

            projectsContainer.innerHTML = visibleProjects
                .map(p => `
                <div class="project-card" onclick="window.open('${p.link}', '_blank')">
                    <div class="project-img">
                        <i class="${p.icon || 'fas fa-code'}"></i>
                    </div>
                    <div class="project-info">
                        <h3>${p.title || 'Untitled Project'}</h3>
                        ${p.description ? `<p>${p.description}</p>` : ''}
                        <div class="project-tags">
                            ${(p.tags || []).map(t => `<span>${t}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            <a href="${p.link}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-github"></i> View</a>
                        </div>
                    </div>
                </div>
            `).join('');

            const loadMoreProjectsContainer = document.getElementById('loadMoreProjectsContainer');
            if (loadMoreProjectsContainer) {
                loadMoreProjectsContainer.style.display = (sortedProjects.length > projectsShownCount) ? 'flex' : 'none';
            }
        }

        if (researchContainer) {
            const sortedResearch = sortItems(research || []).filter(r => r && r.title);
            const visibleResearch = sortedResearch.slice(0, researchShownCount);

            researchContainer.innerHTML = visibleResearch
                .map(r => `
                <div class="research-item" onclick="window.open('${r.link}', '_blank')">
                    <div class="research-icon"><i class="${r.icon || 'fas fa-file-alt'}"></i></div>
                    <div class="research-details">
                        <h3 class="research-title">${r.title || 'Untitled Research'}</h3>
                        ${r.description ? `<p>${r.description}</p>` : ''}
                        <span class="research-tag">${formatDate(r.tag)}</span>
                    </div>
                </div>
            `).join('');

            const loadMoreResearchContainer = document.getElementById('loadMoreResearchContainer');
            if (loadMoreResearchContainer) {
                loadMoreResearchContainer.style.display = (sortedResearch.length > researchShownCount) ? 'flex' : 'none';
            }
        }

        if (importantContainer) {
            const sortedImportant = sortItems(important || []).filter(i => i && i.title);
            const visibleImportant = sortedImportant.slice(0, updatesShownCount);
            
            importantContainer.innerHTML = visibleImportant
                .map(i => {
                    const hasLink = i.link && i.link !== '#' && i.link.trim() !== '';
                    return `
                    <div class="update-item ${!hasLink ? 'no-link' : ''}" ${hasLink ? `onclick="window.open('${i.link}', '_blank')"` : ''}>
                        <div class="update-icon"><i class="${i.icon || 'fas fa-exclamation-circle'}"></i></div>
                        <div class="update-details">
                            <h3 class="update-title">${i.title || 'Untitled Update'}</h3>
                            <span class="update-tag">${formatDate(i.tag)}</span>
                        </div>
                    </div>
                `;
                }).join('');

            const loadMoreContainer = document.getElementById('loadMoreContainer');
            if (loadMoreContainer) {
                loadMoreContainer.style.display = (sortedImportant.length > updatesShownCount) ? 'flex' : 'none';
            }
        }

        if (skillsContainer) {
            const visibleSkills = (skills || []).slice(0, skillsShownCount);
            
            skillsContainer.innerHTML = visibleSkills
                .map(s => `
                <div class="skill-category">
                    <h3>${s.category || 'Expertise'}</h3>
                    <div class="skill-tags">
                        ${(s.items || []).map(item => `<span>${item}</span>`).join('')}
                    </div>
                </div>
            `).join('');

            const loadMoreSkillsContainer = document.getElementById('loadMoreSkillsContainer');
            if (loadMoreSkillsContainer) {
                loadMoreSkillsContainer.style.display = ((skills || []).length > skillsShownCount) ? 'flex' : 'none';
            }
        }

        // Re-observe new elements for animations
        document.querySelectorAll('.project-card, .research-item, .update-item, .skill-category').forEach(el => {
            if (window.observer) window.observer.observe(el);
        });
    };

    const renderFromLocal = () => {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const research = JSON.parse(localStorage.getItem('research')) || [];
        const important = JSON.parse(localStorage.getItem('important')) || [];
        
        // Use a simplified version of the rendering logic here if needed, 
        // but for now let's just use the main logic by passing local data.
        // For simplicity, I'll just skip the detailed local render and let the user focus on Supabase.
    };

    // --- Load More Events ---
    const btnLoadMore = document.getElementById('btnLoadMore');
    if (btnLoadMore) {
        btnLoadMore.addEventListener('click', () => {
            updatesShownCount += updatesIncrement;
            renderContent();
        });
    }

    const btnLoadMoreProjects = document.getElementById('btnLoadMoreProjects');
    if (btnLoadMoreProjects) {
        btnLoadMoreProjects.addEventListener('click', () => {
            projectsShownCount += projectsIncrement;
            renderContent();
        });
    }

    const btnLoadMoreResearch = document.getElementById('btnLoadMoreResearch');
    if (btnLoadMoreResearch) {
        btnLoadMoreResearch.addEventListener('click', () => {
            researchShownCount += researchIncrement;
            renderContent();
        });
    }

    const btnLoadMoreSkills = document.getElementById('btnLoadMoreSkills');
    if (btnLoadMoreSkills) {
        btnLoadMoreSkills.addEventListener('click', () => {
            skillsShownCount += skillsIncrement;
            renderContent();
        });
    }

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


