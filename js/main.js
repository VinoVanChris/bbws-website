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

// Homepage — render latest blog posts from data/posts.json
const blogGrid = document.getElementById('homepage-blog-grid');
if (blogGrid) {
  fetch('/data/posts.json')
    .then(r => r.json())
    .then(posts => {
      posts.slice(0, 3).forEach(p => {
        const a = document.createElement('a');
        a.href = p.url;
        a.className = 'blog-card fade-in visible';
        a.style.textDecoration = 'none';
        a.innerHTML = `
          <div class="blog-card-img"><img src="${p.image}" alt="${p.tag}" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" /></div>
          <div class="blog-card-body">
            <p class="blog-card-tag">${p.tag}</p>
            <h3>${p.title}</h3>
            <p>${p.excerpt}</p>
            <span class="blog-card-date">${p.date}</span>
          </div>`;
        blogGrid.appendChild(a);
      });
    })
    .catch(() => {}); // fail silently if offline
}

// Blog index — category filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
