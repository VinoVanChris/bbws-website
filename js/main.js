/* Broadway Beer Wine & Spirits - Main JS */

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

// Nav dropdown — keyboard / click toggle (CSS handles hover for pointer users)
const navDropdownTrigger = document.querySelector('.nav-dropdown-trigger');
const navDropdownLi      = document.querySelector('.nav-dropdown');
if (navDropdownTrigger && navDropdownLi) {
  navDropdownTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navDropdownLi.classList.toggle('open');
    navDropdownTrigger.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('click', (e) => {
    if (!navDropdownLi.contains(e.target)) {
      navDropdownLi.classList.remove('open');
      navDropdownTrigger.setAttribute('aria-expanded', 'false');
    }
  });
  navDropdownTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navDropdownLi.classList.remove('open');
      navDropdownTrigger.setAttribute('aria-expanded', 'false');
      navDropdownTrigger.focus();
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
  if (!link.href) return;
  const linkPath = new URL(link.href).pathname.replace(/\/$/, '');
  if (linkPath === currentPath || (currentPath.endsWith('index.html') && linkPath === '')) {
    link.classList.add('active');
  }
});

// Shared blog post fetch - drives homepage grid and blog index page
const homepageBlogGrid = document.getElementById('homepage-blog-grid');
const blogIndexFeatured = document.getElementById('blog-featured');
const blogIndexGrid     = document.getElementById('blog-grid');

if (homepageBlogGrid || blogIndexFeatured || blogIndexGrid) {
  fetch('/data/posts.json')
    .then(r => r.json())
    .then(posts => {

      // ── Homepage: latest 3 posts ───────────────────────────────
      if (homepageBlogGrid) {
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
      }

      // ── Blog index: featured block (post 0 large, posts 1-3 mini) ──
      if (blogIndexFeatured && posts.length > 0) {
        const f = posts[0];
        const sidebar = posts.slice(1, 4).map(p => `
          <a href="${p.url}" class="blog-card-mini" style="text-decoration:none;">
            <div class="blog-card-img"><img src="${p.image}" alt="${p.tag}" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" /></div>
            <div class="blog-card-body">
              <p class="blog-card-tag">${p.tag}</p>
              <h3>${p.title}</h3>
              <span class="blog-card-date">${p.date}</span>
            </div>
          </a>`).join('');
        blogIndexFeatured.innerHTML = `
          <a href="${f.url}" class="blog-card blog-card-featured" style="text-decoration:none;">
            <div class="blog-card-img"><img src="${f.image}" alt="${f.tag}" style="width:100%;height:100%;object-fit:cover;display:block;" loading="eager" /></div>
            <div class="blog-card-body">
              <p class="blog-card-tag">${f.tag}</p>
              <h3>${f.title}</h3>
              <p>${f.excerpt}</p>
              <span class="blog-card-date">${f.date}</span>
            </div>
          </a>
          <div class="blog-sidebar">${sidebar}</div>`;
      }

      // ── Blog index: remaining posts in grid ────────────────────
      if (blogIndexGrid && posts.length > 4) {
        posts.slice(4).forEach(p => {
          const a = document.createElement('a');
          a.href = p.url;
          a.className = 'blog-card fade-in visible';
          a.dataset.tag = p.tag;
          a.style.textDecoration = 'none';
          a.innerHTML = `
            <div class="blog-card-img"><img src="${p.image}" alt="${p.tag}" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" /></div>
            <div class="blog-card-body">
              <p class="blog-card-tag">${p.tag}</p>
              <h3>${p.title}</h3>
              <p>${p.excerpt}</p>
              <span class="blog-card-date">${p.date}</span>
            </div>`;
          blogIndexGrid.appendChild(a);
        });
      }

    })
    .catch(() => {}); // fail silently if offline
}

// ── Related posts - populated on blog post pages ───────────────
const relatedSection = document.getElementById('blog-related-posts');
const relatedGrid    = document.getElementById('blog-related-grid');

if (relatedSection && relatedGrid) {
  fetch('/data/posts.json')
    .then(r => r.json())
    .then(posts => {
      const currentPath = window.location.pathname;
      const others = posts.filter(p => !currentPath.endsWith(p.url));
      const picks  = others.slice(0, 3);
      if (!picks.length) return;

      picks.forEach(p => {
        const a = document.createElement('a');
        a.href = p.url;
        a.style.cssText = 'display:block;text-decoration:none;background:var(--bg);border:1px solid rgba(0,0,0,0.08);border-radius:var(--radius);overflow:hidden;transition:border-color 0.2s;';
        a.innerHTML = `
          <img src="/${p.image}" alt="${p.title}" style="width:100%;height:160px;object-fit:cover;display:block;" loading="lazy" />
          <div style="padding:16px 20px;">
            <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);margin:0 0 6px;">${p.tag}</p>
            <p style="font-size:0.95rem;font-weight:600;color:var(--text);margin:0;line-height:1.4;">${p.title}</p>
          </div>`;
        relatedGrid.appendChild(a);
      });

      relatedSection.hidden = false;
    })
    .catch(() => {});
}

// Corporate page - service pill pre-selection
const corpServiceInput = document.getElementById('corp-service-input');
if (corpServiceInput) {
  document.querySelectorAll('.subject-pill[data-pill-service]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.subject-pill[data-pill-service]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      corpServiceInput.value = pill.dataset.pillService;
    });
  });

  document.querySelectorAll('.service-cta[data-service]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const service = btn.dataset.service;
      corpServiceInput.value = service;
      document.querySelectorAll('.subject-pill[data-pill-service]').forEach(p => {
        p.classList.toggle('active', p.dataset.pillService === service);
      });
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// Click-out conversion tracking - Uber Eats & DoorDash
// Replace with Bottlecapps purchase event once shop integration is live
document.querySelectorAll('a[href*="ubereats.com"], a[href*="doordash.com"]').forEach(link => {
  link.addEventListener('click', () => {
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        'send_to': 'AW-970988484/BkdzCIHUxpoYEMS3gM8D'
      });
    }
  });
});

// Blog index - category filter
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
