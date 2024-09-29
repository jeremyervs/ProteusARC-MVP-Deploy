// Add this at the beginning of the file, right after the DOMContentLoaded event listener

const hamburgerMenu = document.querySelector('.hamburger-menu');
const sideMenu = document.querySelector('.side-menu');
const body = document.body;

// Create overlay
const overlay = document.createElement('div');
overlay.classList.add('overlay');
body.appendChild(overlay);

hamburgerMenu.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
    body.classList.toggle('menu-open');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    sideMenu.classList.remove('open');
    body.classList.remove('menu-open');
    overlay.classList.remove('active');
});

// Close menu when a link is clicked
const menuLinks = document.querySelectorAll('.side-menu a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        sideMenu.classList.remove('open');
        body.classList.remove('menu-open');
        overlay.classList.remove('active');
    });
});

// Add smooth scrolling for menu links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Rest of the existing JavaScript code...
