const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navLinks.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    menuButton.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55%' });
sections.forEach((section) => sectionObserver.observe(section));

const glow = document.querySelector('.cursor-glow');
if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    glow.style.setProperty('--x', `${event.clientX}px`);
    glow.style.setProperty('--y', `${event.clientY}px`);
  }, { passive: true });
}

document.getElementById('year').textContent = new Date().getFullYear();

const profilePhoto = document.getElementById('profile-photo');
const profileFrame = document.getElementById('profile-frame');
const showPhotoPlaceholder = () => profileFrame.classList.add('photo-missing');

profilePhoto.addEventListener('error', showPhotoPlaceholder);
profilePhoto.addEventListener('load', () => profileFrame.classList.remove('photo-missing'));
if (profilePhoto.complete && profilePhoto.naturalWidth === 0) showPhotoPlaceholder();
