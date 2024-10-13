// Navigation 
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

// Menu hamburger
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

// Formulaire contact

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const contenu = document.getElementById('message').value;

    const sendButton = document.getElementById('sendButton');
    sendButton.disabled = true;
    sendButton.textContent = 'Envoi en cours...';

    fetch('api/utils/send_contact.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}&contenu=${encodeURIComponent(contenu)}`
    })
    .then(response => response.text())
    .then(data => {
        if (data === "true") {
            sendButton.textContent = 'Envoyé';
        } else {
            alert('Une erreur est survenue lors de l\'envoi du message.');
            sendButton.disabled = false;
            sendButton.textContent = 'Réessayer';
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
        sendButton.disabled = false;
        sendButton.textContent = 'Réessayer';
    });
});


// load
window.onload = function() {
    const overlay = document.getElementById('overlay');
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
    
    setTimeout(() => {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';  
    }, 500);

    console.log('%c[Loader] Page chargée sans erreurs!', 'color: green; font-weight: bold;')
};

// Crash

window.onerror = function(message, source, lineno, colno, error) {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';

    setTimeout(function() {
        location.reload();
    }, 3000);   
    const messagelog = `
Stats pour les nerds:
Message: ${message}
Erreur: ${error}
Source: ${source}
Ligne: ${lineno}
Colonne: ${colno}
    `;

    console.log('%c[Loader] Une erreur est survenue ! Reload de la page.', 'color: red; font-weight: bold;');
    console.log(messagelog);
    return true;
};
