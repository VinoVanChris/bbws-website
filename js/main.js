/* Broadway Beer Wine & Spirits — Main JS */

// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const isOpen = mobileNav.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
    }
  });
}

// Fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => entries.forEach(el => el.isIntersecting && el.target.classList.add('visible')),
  { threshold: 0.12 }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Mark active nav link
const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const linkPath = new URL(link.href).pathname.replace(/\/$/, '');
  if (linkPath === currentPath || (currentPath.endsWith('index.html') && linkPath === '')) {
    link.classList.add('active');
  }
});
