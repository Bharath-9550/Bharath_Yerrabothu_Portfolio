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

document.querySelectorAll('.reveal, .experience-item, .featured-project, .skills-grid article, .domain-grid article, .concept-flow > *, .certification-card').forEach((element, index) => {
  if (!element.classList.contains('reveal')) element.classList.add('reveal-item');
  const group = element.closest('.skills-grid, .domain-grid, .concept-flow, .certification-grid, .timeline');
  if (group) {
    const siblings = [...group.children].filter((child) => child.matches('article, div, span'));
    element.style.setProperty('--reveal-delay', `${siblings.indexOf(element) * 90}ms`);
  }
  revealObserver.observe(element);
});

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

const certificationTrack = document.getElementById('certification-track');
const certificationCards = certificationTrack ? [...certificationTrack.querySelectorAll('.certification-card')] : [];
const carouselDots = document.querySelector('.carousel-dots');
const previousCertification = document.querySelector('.carousel-prev');
const nextCertification = document.querySelector('.carousel-next');

if (certificationTrack && carouselDots && certificationCards.length) {
  const dots = certificationCards.map((card, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Show certification ${index + 1}`);
    dot.addEventListener('click', () => card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }));
    carouselDots.appendChild(dot);
    return dot;
  });

  const getActiveCard = () => {
    const trackLeft = certificationTrack.getBoundingClientRect().left;
    return certificationCards.reduce((closest, card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Infinity }).index;
  };

  const updateCarousel = () => {
    const activeIndex = getActiveCard();
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
      dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
    });
    previousCertification.disabled = certificationTrack.scrollLeft <= 2;
    nextCertification.disabled = certificationTrack.scrollLeft + certificationTrack.clientWidth >= certificationTrack.scrollWidth - 2;
  };

  const moveCarousel = (direction) => {
    const activeIndex = getActiveCard();
    const targetIndex = Math.max(0, Math.min(certificationCards.length - 1, activeIndex + direction));
    certificationCards[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  previousCertification.addEventListener('click', () => moveCarousel(-1));
  nextCertification.addEventListener('click', () => moveCarousel(1));
  certificationTrack.addEventListener('scroll', updateCarousel, { passive: true });
  window.addEventListener('resize', updateCarousel, { passive: true });
  updateCarousel();
}
