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
        });
    } else {
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
