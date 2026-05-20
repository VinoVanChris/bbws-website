#!/usr/bin/env python3
"""
Scrape one hero image per distillery, save as WebP to images/distilleries/.
Run from repo root: python3 scripts/scrape_distilleries.py
"""
import os, sys, io, time, urllib.request, urllib.parse
from html.parser import HTMLParser
from PIL import Image

# (slug, homepage_for_og_scrape, hardcoded_fallback_url)
# Hardcoded URLs used when scraping fails (403/timeout/no og:image).
# Sources: official brand CDNs + Wikimedia Commons (CC-BY-SA).
DISTILLERIES = [
    # ── ISLAY ─────────────────────────────────────────────────────────────
    ('ardbeg',
     'https://www.ardbeg.com',
     'https://upload.wikimedia.org/wikipedia/commons/f/f2/Ardbeg_Distillery%2C_Islay_-_geograph.org.uk_-_4150964.jpg'),
    ('laphroaig',
     'https://www.laphroaig.com',
     'https://www.laphroaig.com/sites/default/files/styles/original/public/2024-12/Book-a-Tour-Laphroaig-Distillery_1.jpg.webp?itok=5kzpuBxr'),
    ('lagavulin',
     'https://www.lagavulin.com',
     'https://upload.wikimedia.org/wikipedia/commons/f/fc/2019-05-05_Lagavulin_Distillery.jpg'),
    ('bowmore',
     'https://www.bowmore.com',
     'https://upload.wikimedia.org/wikipedia/commons/3/3a/Morrison_Bowmore%2C_Islay.jpg'),
    ('bruichladdich',
     'https://www.bruichladdich.com',
     'https://upload.wikimedia.org/wikipedia/commons/0/0d/Distilleryreflection.jpg'),
    # ── SPEYSIDE ──────────────────────────────────────────────────────────
    ('glenfiddich',
     'https://www.glenfiddich.com',
     'https://upload.wikimedia.org/wikipedia/commons/8/8d/Glenfiddich_Distillery_View.jpg'),
    ('macallan',
     'https://www.themacallan.com',
     'https://upload.wikimedia.org/wikipedia/commons/0/0f/The_Macallan_malt_whisky_Distillery_-_geograph.org.uk_-_112253.jpg'),
    ('aberlour',
     'https://www.aberlour.com',
     'https://upload.wikimedia.org/wikipedia/commons/8/80/Aberlour_Distillery_-_panoramio.jpg'),
    ('glenlivet',
     'https://www.theglenlivet.com',
     'https://upload.wikimedia.org/wikipedia/commons/5/51/The_Glenlivet_Distillery_-_geograph.org.uk_-_885316.jpg'),
    # ── HIGHLANDS ─────────────────────────────────────────────────────────
    ('glenmorangie',
     'https://www.glenmorangie.com',
     'https://www.glenmorangie.com/cdn/shop/files/Still_House_18YO.jpg?v=1733395773&width=2048'),
    ('dalmore',
     'https://www.thedalmore.com',
     'https://upload.wikimedia.org/wikipedia/commons/a/aa/Dalmore_Distillery_-_geograph.org.uk_-_958488.jpg'),
    ('oban',
     'https://www.malts.com/en-row/distilleries/oban',
     'https://upload.wikimedia.org/wikipedia/commons/6/6a/Oban_Distillery_-_geograph.org.uk_-_4192307.jpg'),
    # ── ISLANDS ───────────────────────────────────────────────────────────
    ('talisker',
     'https://www.malts.com/en-row/distilleries/talisker',
     'https://upload.wikimedia.org/wikipedia/commons/e/ec/Talisker_distillery.jpg'),
    ('highland-park',
     'https://www.highlandparkwhisky.com',
     'https://upload.wikimedia.org/wikipedia/commons/d/de/Highland_Park_Distillery_-_geograph.org.uk_-_2090032.jpg'),
    # ── CAMPBELTOWN ───────────────────────────────────────────────────────
    ('springbank',
     'https://springbankwhisky.com',
     'https://upload.wikimedia.org/wikipedia/commons/f/f8/Springbank_Distillery%2C_Campbeltown.jpg'),
    # ── LOWLANDS ──────────────────────────────────────────────────────────
    ('auchentoshan',
     'https://www.auchentoshan.com',
     'https://upload.wikimedia.org/wikipedia/commons/4/43/Auchentoshan_Distillery_-_panoramio.jpg'),
    # ── JAPAN ─────────────────────────────────────────────────────────────
    ('yamazaki',
     'https://www.theyamazaki.jp/en/',
     'https://upload.wikimedia.org/wikipedia/commons/2/25/YamazakiDistillery_01.jpg'),
    ('nikka-yoichi',
     'https://www.nikka.com/eng/distilleries/yoichi/',
     None),  # og:image usually works
    # ── IRELAND ───────────────────────────────────────────────────────────
    ('midleton',
     'https://www.jamesonwhiskey.com',
     None),  # try og:image first
    ('bushmills',
     'https://www.bushmills.com',
     'https://upload.wikimedia.org/wikipedia/commons/a/af/Old_Bushmills_Distillery.jpg'),
    # ── AMERICA ───────────────────────────────────────────────────────────
    ('buffalo-trace',
     'https://www.buffalotracedistillery.com',
     'https://cms.buffalotracedistillery.com/wp-content/uploads/2025/08/footer-iamge.jpg'),
    ('woodford-reserve',
     'https://www.woodfordreserve.com',
     None),  # og:image works
    ('angels-envy',
     'http://www.angelsenvy.com/',
     'https://d3cqmwe6z7cbal.cloudfront.net/wp-content/uploads/sites/2/2026/02/13113931/FY27_AngelsEnvy_3UPBanner_DistilleryTours.jpg'),
    ('four-roses',
     'https://www.fourrosesbourbon.com',
     None),  # og:image works
    # ── CANADA ────────────────────────────────────────────────────────────
    ('forty-creek',
     'https://www.fortycreekwhisky.com',
     'https://fortycreekwhisky.com/wp-content/uploads/2022/09/Home_-_Desktop_-_Forty_Experience.jpeg'),
    ('hiram-walker',
     'https://www.hiramwalker.com',
     'https://upload.wikimedia.org/wikipedia/commons/b/bd/Walkerville_Ontario_LOC_det.4a19916.jpg'),
    ('crown-royal',
     'https://www.crownroyal.com',
     None),  # og:image works
    ('alberta-distillers',
     'https://www.albertadistillers.com',
     'https://www.albertadistillers.com/sites/default/files/styles/original/public/2025-07/mountain-sky-trees-alberta.jpg.webp?itok=C4FGdNj6'),
    ('highwood',
     'http://www.bearfacewhisky.com/',
     'https://www.bearfacewhisky.com/wp-content/themes/bearface/includes/img/elemental-aging-photo.jpg'),
    ('shelter-point',
     'https://shelterpointdistillery.com',
     None),  # try og:image; DNS may resolve now
    ('okanagan-spirits',
     'https://okanaganspirits.com',
     None),  # og:image works
]

OUT_DIR   = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'images', 'distilleries')
MAX_WIDTH = 900
QUALITY   = 82
TIMEOUT   = 18
HEADERS   = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                  'AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}


class OGParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.og_image = None
        self.tw_image = None

    def handle_starttag(self, tag, attrs):
        if tag != 'meta':
            return
        d = dict(attrs)
        prop = d.get('property', '') or d.get('name', '')
        content = d.get('content', '')
        if prop == 'og:image' and not self.og_image:
            self.og_image = content
        if prop == 'twitter:image' and not self.tw_image:
            self.tw_image = content


def fetch_html(url):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return r.read().decode('utf-8', errors='replace'), r.url
    except Exception as e:
        return None, str(e)


def fetch_bytes(url):
    req = urllib.request.Request(url, headers={**HEADERS, 'Accept': 'image/*,*/*;q=0.8'})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return r.read()
    except Exception:
        return None


def resolve_url(base, url):
    if not url:
        return None
    if url.startswith('//'):
        return 'https:' + url
    if url.startswith('/'):
        p = urllib.parse.urlparse(base)
        return f'{p.scheme}://{p.netloc}{url}'
    if not url.startswith('http'):
        return None
    return url


def save_webp(slug, data):
    try:
        img = Image.open(io.BytesIO(data)).convert('RGB')
        if img.width > MAX_WIDTH:
            h = int(img.height * MAX_WIDTH / img.width)
            img = img.resize((MAX_WIDTH, h), Image.LANCZOS)
        out = os.path.normpath(os.path.join(OUT_DIR, slug + '.webp'))
        img.save(out, 'WEBP', quality=QUALITY, method=6)
        return out, img.size
    except Exception as e:
        return None, str(e)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    ok, fail = [], []

    for slug, home_url, fallback_url in DISTILLERIES:
        out_path = os.path.normpath(os.path.join(OUT_DIR, slug + '.webp'))
        if os.path.exists(out_path):
            print(f'  ✓ {slug} (already exists)')
            ok.append(slug)
            continue

        print(f'  → {slug}')
        img_url = fallback_url

        # Try og:image scrape first (unless we have a hardcoded fallback)
        if not img_url:
            html, final_url = fetch_html(home_url)
            if html:
                parser = OGParser()
                parser.feed(html[:80000])
                raw = parser.og_image or parser.tw_image
                img_url = resolve_url(final_url or home_url, raw)
                if img_url:
                    print(f'      og:image → {img_url[:90]}')
                else:
                    print(f'      no og:image found')
            else:
                print(f'      fetch failed: {final_url}')

        if img_url:
            data = fetch_bytes(img_url)
            if data and len(data) > 5000:
                path, size = save_webp(slug, data)
                if path:
                    print(f'      saved {size[0]}×{size[1]} → {os.path.basename(path)}')
                    ok.append(slug)
                else:
                    print(f'      convert error: {size}')
                    fail.append((slug, f'convert: {size}'))
            else:
                print(f'      download failed ({len(data) if data else 0} bytes)')
                fail.append((slug, 'no data'))
        else:
            fail.append((slug, 'no URL'))

        time.sleep(0.6)

    print(f'\n{"="*52}')
    print(f'Done: {len(ok)}/{len(DISTILLERIES)} saved')
    if fail:
        print('Failed:')
        for s, r in fail:
            print(f'  {s}: {r}')


if __name__ == '__main__':
    main()
