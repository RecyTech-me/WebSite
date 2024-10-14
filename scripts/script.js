// Navigation - Smooth Scroll
function smoothScroll(linkId, targetId) {
    const targetElement = document.getElementById(targetId);
    let elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    if (targetId === "product") {
        elementPosition -= 80;
    }
    window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
    });
}

// Hamburger menu
const body = document.body;
const header = document.getElementById("mainHeader");
const headerBackground = document.getElementById("headerBackground");
const headerTitle = document.getElementById("headerTitle");
const headerLinks = document.getElementById("headerLinks");
const headerLink = document.querySelectorAll(".header-link");
const hamburgerMenu = document.getElementById("hamburgerMenu");

function toggleHamburgerMenu() {
    body.classList.toggle("is-hamburger-active");
    header.classList.toggle("is-hamburger-active");
    headerBackground.classList.toggle("is-hamburger-active");
    headerTitle.classList.toggle("is-hamburger-active");
    headerLinks.classList.toggle("is-hamburger-active");
    hamburgerMenu.classList.toggle("active");

    if (headerLinks.classList.contains("is-hamburger-active")) {
        headerLink.forEach((el, index) => {
            el.classList.add('is-hamburger-active');
            body.style.overflow = "hidden"
        });
    } else {
        body.style.overflow = "scroll"
        headerLink.forEach(el => el.style.display = "none");
        headerLink.forEach(el => el.classList.remove('is-hamburger-active'));
        setTimeout(function() {
            headerLink.forEach(el => el.style.display = "flex");
        }, 100);
    }
}

hamburgerMenu.addEventListener("click", toggleHamburgerMenu);

window.addEventListener("resize", () => {
    if (window.innerWidth > 700 && header.classList.contains("is-hamburger-active")) {
        toggleHamburgerMenu();
    }
});

headerLink.forEach((link) => {
    link.addEventListener('click', () => {
        if (header.classList.contains('is-hamburger-active')) {
            toggleHamburgerMenu();
        }
    });
});

// Contact Form
document.getElementById('contactForm').addEventListener('submit', async function(event) {
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
            document.getElementById('contactForm').reset();
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

// Load
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

// Crash Handling
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

    // Empêche l'affichage de l'erreur dans la console du navigateur
    event.preventDefault();
});