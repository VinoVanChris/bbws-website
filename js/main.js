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
const homepageBlogGrid = document.getElementById('homepage-blog-grid');
if (homepageBlogGrid) {
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
        homepageBlogGrid.appendChild(a);
      });
    })
    .catch(() => {}); // fail silently if offline
}

// Blog index — category filter
// Maps specific post tags to the broader filter categories on the buttons
const tagToCategory = {
  'Wine':        'Wine',
  'Natural Wine':'Wine',
  'BC Wine':     'Wine',
  'Seasonal':    'Wine',
  'Beer':        'Beer',
  'Spirits':     'Spirits',
  'Food & Wine': 'Food & Wine',
  'Shop News':   'Shop News',
  'Gift Guide':  'Shop News',
};

const filterBtns   = document.querySelectorAll('.filter-btn');
const blogGrid     = document.getElementById('blog-grid');
const blogFeatured = document.getElementById('blog-featured');
const noResults    = document.getElementById('blog-no-results');

if (filterBtns.length && blogGrid) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter; // 'all' or a category name

      // Show/hide the featured section (only visible when "All" is selected)
      if (blogFeatured) blogFeatured.hidden = (filter !== 'all');

      // Filter grid cards
      const cards = blogGrid.querySelectorAll('.blog-card');
      let visible = 0;
      cards.forEach(card => {
        const category = tagToCategory[card.dataset.tag] || card.dataset.tag || '';
        const show = filter === 'all' || category === filter;
        card.hidden = !show;
        if (show) visible++;
      });

      // Show empty-state message if nothing matched
      if (noResults) noResults.hidden = (visible > 0);
    });
  });
}
