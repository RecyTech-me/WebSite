// Smooth Scroll Functionality
function smoothScroll(linkId, targetId) {
    const targetElement = document.getElementById(targetId);
    let elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    if (targetId === "home") {
        elementPosition -= 80;
    }
    window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
    });
}

// Hamburger Menu Functionality
const body = document.body;
const header = document.getElementById("header");
const headerBackground = document.getElementById("headerBackground");
const headerLinks = document.getElementById("headerLinks");
const headerLink = document.querySelectorAll(".header-link");
const hamburgerMenu = document.getElementById("hamburgerMenu");

function toggleHamburgerMenu() {
    body.classList.toggle("expanded")
    header.classList.toggle("expanded");
    headerBackground.classList.toggle("expanded");
    headerLinks.classList.toggle("expanded");
    hamburgerMenu.classList.toggle("expanded");
}

hamburgerMenu.addEventListener("click", toggleHamburgerMenu);

window.addEventListener("resize", () => {
    if (window.innerWidth > 800 && header.classList.contains("expanded")) {
        toggleHamburgerMenu();
    }
});

headerLink.forEach((link) => {
    link.addEventListener('click', () => {
        if (header.classList.contains('expanded')) {
            toggleHamburgerMenu();
        }
    });
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const contenu = document.getElementById('message').value.trim();
    const sendButton = document.getElementById('sendButton');

    if (!email || !contenu) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    sendButton.disabled = true;
    sendButton.textContent = 'Envoi en cours...';

    try {
        const response = await fetch('api/utils/send_contact.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({email, contenu})
        });

        const data = await response.text();

        if (data === "true") {
            sendButton.textContent = 'Envoyé';
            contactForm.reset();

            setTimeout(() => {
                sendButton.disabled = false;
                sendButton.textContent = 'Envoyer';
            }, 2000);
        } else {
            throw new Error('Une erreur est survenue lors de l\'envoi du message.');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
        sendButton.disabled = false;
        sendButton.textContent = 'Réessayer';
    }
});

// Page Load Overlay Handling
window.addEventListener('load', () => {
    const overlay = document.getElementById('overlay');
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';

    setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = 'auto';
    }, 500);

    console.log('%c[Loader] Page chargée sans erreurs!', 'color: green; font-weight: bold;');
});

// Global Error Handling and Reload
window.addEventListener('error', event => {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';

    setTimeout(() => {
        location.reload();
    }, 3000);

    const {message, filename, lineno, colno, error} = event;
    const errorMsg = `
Stats pour les nerds:
Message: ${message}
Erreur: ${error}
Source: ${filename}
Ligne: ${lineno}
Colonne: ${colno}
    `;

    console.error('%c[Loader] Une erreur est survenue ! Reload de la page.', 'color: red; font-weight: bold;');
    console.error(errorMsg);

    event.preventDefault();
});

// Scroll Animation for Elements
document.addEventListener('DOMContentLoaded', () => {
    const elements = [
        document.getElementById("recycling"),
        document.getElementById("inclusive"),
        document.getElementById("imageTitleContainer"),
        ...document.querySelectorAll(".section-title"),
        ...document.querySelectorAll(".section-text")
    ].filter(el => el);

    window.addEventListener("scroll", () => {
        const clientHeight = document.documentElement.clientHeight;

        elements.forEach(element => {
            const topElementToTopViewport = element.getBoundingClientRect().top;

            if (topElementToTopViewport <= clientHeight * 0.80) {
                element.classList.add("active");
            }
        });
    });
});