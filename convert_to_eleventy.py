#!/usr/bin/env python3
"""Convert existing HTML files into Eleventy Nunjucks templates in src/."""

import re, os, json, textwrap

# ── helpers ──────────────────────────────────────────────────────────────────

def get(pattern, text, group=1, flags=re.DOTALL):
    m = re.search(pattern, text, flags)
    return m.group(group).strip() if m else ""

def get_attr(tag_pattern, attr, text):
    """Find a tag matching tag_pattern, then extract an attribute value."""
    m = re.search(tag_pattern, text, re.DOTALL)
    if not m:
        return ""
    tag = m.group(0)
    a = re.search(rf'{attr}="([^"]*)"', tag)
    return a.group(1).strip() if a else ""

def og(prop, text):
    return get_attr(rf'<meta\s[^>]*property="{prop}"[^>]*>', 'content', text)

def tw(name, text):
    return get_attr(rf'<meta\s[^>]*name="{name}"[^>]*>', 'content', text)

def meta(name, text):
    return get_attr(rf'<meta\s[^>]*name="{name}"[^>]*>', 'content', text)

def yaml_str(val):
    """Wrap a string value for YAML front matter — quote if needed."""
    if not val:
        return '""'
    # If it contains : or # or starts with special chars, double-quote it
    needs_quoting = any(c in val for c in [':', '#', "'", '"', '[', ']', '{', '}', '&', '*', '!', '|', '>', '%', '@', '`', '\n'])
    if needs_quoting:
        escaped = val.replace('\\', '\\\\').replace('"', '\\"')
        return f'"{escaped}"'
    return val

def extract_nav_page(text):
    # Find the active nav link
    m = re.search(r'<a href="([^"]+)" class="active"', text)
    if not m:
        return 'home'
    href = m.group(1)
    mapping = {
        'index.html': 'home', '../index.html': 'home',
        'about.html': 'about', '../about.html': 'about',
        'blog.html': 'blog', '../blog.html': 'blog',
        'corporate.html': 'corporate', '../corporate.html': 'corporate',
        'contact.html': 'contact', '../contact.html': 'contact',
        'events.html': 'events', '../events.html': 'events',
    }
    return mapping.get(href, 'home')

def extract_schema(text):
    """Extract the JSON-LD script content."""
    m = re.search(r'<script type="application/ld\+json">\s*(.*?)</script>', text, re.DOTALL)
    if not m:
        return ""
    return m.group(1).strip()

def extract_hero_preload(text):
    """Extract the hero image preload link attrs."""
    m = re.search(r'<link rel="preload" href="([^"]+)" as="image"[^>]*/>', text)
    if not m:
        return "", ""
    href = m.group(1)
    type_m = re.search(r'type="([^"]+)"', m.group(0))
    mime = type_m.group(1) if type_m else "image/webp"
    return href, mime

def extract_page_content(text):
    """
    Extract the page body: from after </div> (closing mobile-nav)
    to just before <footer class="site-footer">.
    Also strip the trailing <script src="*main.js"></script>.
    """
    # End of mobile-nav block
    # Find the closing tag of mobile-nav div
    m_start = re.search(r'</div>\s*\n\s*\n\s*(?=<main|<!--)', text)
    if not m_start:
        # fallback: find end of mobile-nav div
        m_start = re.search(r'(id="mobile-nav"[^>]*>.*?</div>)', text, re.DOTALL)
        if m_start:
            start_pos = m_start.end()
        else:
            start_pos = 0
    else:
        start_pos = m_start.start() + len('</div>\n')

    # Start of footer
    m_end = re.search(r'\n\s+<footer class="site-footer">', text)
    if not m_end:
        m_end = re.search(r'<footer class="site-footer">', text)
    end_pos = m_end.start() if m_end else len(text)

    content = text[start_pos:end_pos]

    # Strip the main.js script tag (root or ../ variant)
    content = re.sub(r'\n\s*<script src="(?:\.\.\/)?js/main\.js"></script>', '', content)

    # Strip empty leading/trailing lines
    content = content.strip()
    return content

def build_front_matter(data):
    """Build YAML front matter string from a dict."""
    lines = ['---']
    for k, v in data.items():
        if v is None or v == '':
            continue
        if k == 'schema':
            # Multiline YAML literal block
            lines.append('schema: |')
            for line in v.splitlines():
                lines.append('  ' + line)
        else:
            lines.append(f'{k}: {yaml_str(v)}')
    lines.append('---')
    return '\n'.join(lines)

# ── conversion ───────────────────────────────────────────────────────────────

FILES = [
    ('index.html',     'src/index.html'),
    ('about.html',     'src/about.html'),
    ('blog.html',      'src/blog.html'),
    ('contact.html',   'src/contact.html'),
    ('corporate.html', 'src/corporate.html'),
    ('events.html',    'src/events.html'),
    ('404.html',       'src/404.html'),
    # blog posts
    ('blog/autumn-wines.html',              'src/blog/autumn-wines.html'),
    ('blog/bc-wine-month.html',             'src/blog/bc-wine-month.html'),
    ('blog/bernard-baudry-chinon.html',     'src/blog/bernard-baudry-chinon.html'),
    ('blog/cabernet-sauvignon-accident.html','src/blog/cabernet-sauvignon-accident.html'),
    ('blog/delivery-kitsilano.html',        'src/blog/delivery-kitsilano.html'),
    ('blog/la-brujula-squid.html',          'src/blog/la-brujula-squid.html'),
    ('blog/malbec-argentina.html',          'src/blog/malbec-argentina.html'),
    ('blog/mothers-day-2026.html',          'src/blog/mothers-day-2026.html'),
    ('blog/natural-wine-jules-chauvet.html','src/blog/natural-wine-jules-chauvet.html'),
    ('blog/skaha-vineyard-equus.html',      'src/blog/skaha-vineyard-equus.html'),
]

for src_path, dst_path in FILES:
    text = open(src_path).read()

    title       = get(r'<title>(.*?)</title>', text)
    description = meta('description', text)
    canonical   = get_attr(r'<link rel="canonical"[^>]*>', 'href', text)
    robots      = meta('robots', text)
    nav_page    = extract_nav_page(text)

    og_type    = og('og:type', text)
    og_title   = og('og:title', text)
    og_desc    = og('og:description', text)
    og_image   = og('og:image', text)
    og_w       = og('og:image:width', text)
    og_h       = og('og:image:height', text)

    # Only store ogTitle if it differs from title
    if og_title == title:
        og_title = ''
    # Only store ogDesc if it differs from description
    if og_desc == description:
        og_desc = ''

    schema         = extract_schema(text)
    published_time = og('article:published_time', text)
    preload_hero, preload_type = extract_hero_preload(text)

    # Build front matter
    fm = {}
    fm['layout']  = 'base.njk'
    fm['title']   = title
    fm['navPage'] = nav_page
    if robots:
        fm['robots'] = robots
    fm['description'] = description
    fm['canonical']   = canonical
    if og_type and og_type != 'website':
        fm['ogType'] = og_type
    if og_title:
        fm['ogTitle'] = og_title
    if og_desc:
        fm['ogDescription'] = og_desc
    fm['ogImage'] = og_image
    if og_w:
        fm['ogImageWidth'] = og_w
    if og_h:
        fm['ogImageHeight'] = og_h
    if published_time:
        fm['publishedTime'] = published_time
    if preload_hero:
        fm['preloadHero']     = preload_hero
        fm['preloadHeroType'] = preload_type
    if schema:
        fm['schema'] = schema

    content = extract_page_content(text)

    out = build_front_matter(fm) + '\n' + content + '\n'

    os.makedirs(os.path.dirname(dst_path) if os.path.dirname(dst_path) else '.', exist_ok=True)
    open(dst_path, 'w').write(out)
    print(f'  ✓ {src_path} → {dst_path}')

print('\nDone. All templates written to src/')
