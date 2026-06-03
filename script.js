document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());

async function loadComponent(id, file) {
    try {
        const res = await fetch(file);
        const html = await res.text();
        document.getElementById(id).innerHTML = html;
    } catch (e) {
        console.error('Failed to load', file, e);
    }
}

function setActiveLink() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === page);
    });
}

function initApp() {
    const nav = document.getElementById("nav");
    const menuBtn = document.getElementById("menuBtn");
    const mobilePanel = document.getElementById("mobilePanel");
    const revealItems = document.querySelectorAll(".reveal");
    const faqButtons = document.querySelectorAll(".faq-question");

    if (!menuBtn || !mobilePanel) return;

    document.body.appendChild(mobilePanel);

    window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 8);
    });

    menuBtn.addEventListener("click", () => {
        const isOpen = menuBtn.classList.toggle("open");
        mobilePanel.classList.toggle("open", isOpen);
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        mobilePanel.setAttribute("aria-hidden", String(!isOpen));
    });

    mobilePanel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuBtn.classList.remove("open");
            mobilePanel.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
            mobilePanel.setAttribute("aria-hidden", "true");
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    revealItems.forEach((item) => observer.observe(item));

    faqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.closest(".faq-item");
            document.querySelectorAll(".faq-item.open").forEach((openItem) => {
                if (openItem !== item) openItem.classList.remove("open");
            });
            item.classList.toggle("open");
        });
    });
}

async function init() {
    await Promise.all([
        loadComponent('nav', 'Components/navbar.html'),
        loadComponent('footer', 'Components/footer.html')
    ]);

    document.querySelector('.page').style.visibility = 'visible';
    setActiveLink();
    initApp();
}

document.addEventListener('DOMContentLoaded', init);
