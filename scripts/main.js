const body = document.body;
const header = document.getElementById("header");
const headerBackground = document.getElementById("headerBackground");
const headerLinks = document.getElementById("headerLinks");
const headerLink = document.querySelectorAll(".header-link");
const hamburgerMenu = document.getElementById("hamburgerMenu");

function smoothScroll(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
        return;
    }

    const headerHeight = header ? header.offsetHeight : 0;
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
    });
}

function toggleHamburgerMenu() {
    body.classList.toggle("expanded");
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
    link.addEventListener("click", () => {
        if (header.classList.contains("expanded")) {
            toggleHamburgerMenu();
        }
    });
});

document.querySelectorAll('.header-link[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href")?.slice(1);
        if (!targetId) {
            return;
        }

        event.preventDefault();
        smoothScroll(targetId);
    });
});

window.addEventListener("load", () => {
    const overlay = document.getElementById("overlay");
    if (!overlay) {
        return;
    }

    overlay.classList.add("hidden");
    document.body.classList.remove("loading");

    console.log("%c[Loader] Page chargée sans erreurs!", "color: green; font-weight: bold;");
});

window.addEventListener("error", (event) => {
    const overlay = document.getElementById("overlay");
    if (!overlay) {
        return;
    }

    overlay.classList.remove("hidden");
    document.body.classList.add("loading");

    setTimeout(() => {
        location.reload();
    }, 3000);

    const { message, filename, lineno, colno, error } = event;
    const errorMsg = `
Stats pour les nerds:
Message: ${message}
Erreur: ${error}
Source: ${filename}
Ligne: ${lineno}
Colonne: ${colno}
    `;

    console.error("%c[Loader] Une erreur est survenue ! Reload de la page.", "color: red; font-weight: bold;");
    console.error(errorMsg);

    event.preventDefault();
});
