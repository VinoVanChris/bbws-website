#!/usr/bin/env python3
"""
Scrape og:image from each producer's website, download, resize, and save as WebP.
Usage: python3 scripts/scrape-producer-images.py
Output: images/producers/{slug}.webp  (max 600px wide, optimised)
Run again to fill in any gaps — existing files are skipped.
"""

import re
import os
import ssl
import sys
import time
import urllib.request
import urllib.error
from html.parser import HTMLParser
from io import BytesIO
from pathlib import Path
from urllib.parse import urlparse, urljoin

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow required: pip install Pillow")

# ── Producer list ────────────────────────────────────────────────────────────
PRODUCERS = [
    # Wineries
    ("Le Vieux Pin",               "https://levieuxpin.ca",                     "le-vieux-pin"),
    ("Black Hills Estate",         "https://blackhillswinery.com",              "black-hills"),
    ("Burrowing Owl Estate",       "https://www.burrowingowlwine.ca",           "burrowing-owl"),
    ("Tinhorn Creek",              "https://www.tinhorn.com",                   "tinhorn-creek"),
    ("Road 13 Vineyards",          "https://road13vineyards.com",               "road-13"),
    ("Painted Rock",               "https://paintedrock.ca",                    "painted-rock"),
    ("Blue Mountain Vineyard",     "https://bluemountainwinery.com",            "blue-mountain"),
    ("Quails Gate",                "https://quailsgate.com",                    "quails-gate"),
    ("Mission Hill Family Estate", "https://missionhillwinery.com",             "mission-hill"),
    ("Sperling Vineyards",         "https://sperlingvineyards.com",             "sperling"),
    ("CedarCreek Estate Winery",   "https://cedarcreek.bc.ca",                 "cedarcreek"),
    ("Tantalus Vineyards",         "https://tantalus.ca",                       "tantalus"),
    ("Orofino Vineyards",          "https://orofinovineyards.com",              "orofino"),
    ("Clos du Soleil",             "https://closdusoleil.ca",                   "clos-du-soleil"),
    ("Wild Goose Vineyards",       "https://wildgoosewinery.com",               "wild-goose"),
    ("Whispering Horse Winery",    "https://www.whisperinghorsewinery.com",     "whispering-horse"),
    ("A Sunday in August",         "https://asundayinaugust.com",               "a-sunday-in-august"),
    ("Averill Creek Vineyard",     "https://averillcreek.ca",                   "averill-creek"),
    ("Blue Grouse Estate Winery",  "https://www.bluegrousevineyards.com",       "blue-grouse"),
    # Distilleries
    ("Ampersand Distilling",       "https://ampersanddistilling.com",           "ampersand"),
    ("Sons of Vancouver",          "https://sonsofvancouver.ca",                "sons-of-vancouver"),
    ("Shelter Point Distillery",   "https://www.shelterpointdistillery.com",    "shelter-point"),
    ("Macaloneys Island Distillery","https://macaloneys.com",                   "macaloneys"),
    ("Phillips Brewing Malting",   "https://phillipsbeer.com",                  "phillips"),
    # Breweries
    ("33 Acres",                   "https://www.33acresbrew.com",               "33-acres"),
    ("Backcountry Brewing",        "https://backcountrybrewing.com",            "backcountry"),
    ("Bridge Brewing",             "https://bridgebrewing.com",                 "bridge-brewing"),
    ("Central City Brewing",       "https://centralcitybrewing.com",            "central-city"),
    ("Dageraad Brewing",           "https://dageraadbrewing.com",               "dageraad"),
    ("Driftwood Brewery",          "https://driftwoodbeer.com",                 "driftwood"),
    ("Four Winds Brewing",         "https://fourwindsbrewing.ca",               "four-winds"),
    ("Fuggles and Warlock",        "https://www.fugglesandwarlock.com",         "fuggles-warlock"),
    ("Hoyne Brewing",              "https://hoynebrewing.ca",                   "hoyne"),
    ("Longwood Brewery",           "https://www.longwoodbrewery.com",           "longwood"),
    ("Main Street Brewing",        "https://www.mainstreetbrewing.ca",          "main-street"),
    ("Okanagan Spring",            "https://www.okspring.com",                  "okanagan-spring"),
    ("Parallel 49",                "https://parallel49brewing.com",             "parallel-49"),
    ("Powell Street Craft Brewery","https://powellbeer.com",                    "powell-street"),
    ("Red Truck Beer",             "https://redtruckbeer.com",                  "red-truck"),
    ("Stanley Park Brewing",       "https://stanleyparkbrewing.com",            "stanley-park"),
    ("Steamworks Brewing",         "https://steamworks.com",                    "steamworks"),
    ("Strange Fellows Brewing",    "https://strangefellowsbrewing.com",         "strange-fellows"),
    ("Twin Sails Brewing",         "https://twinsailsbrewing.com",              "twin-sails"),
    ("Vancouver Island Brewing",   "https://www.vancouverislandbrewing.com",    "vi-brewing"),
    ("Whistler Brewing",           "https://www.whistlerbeer.com",              "whistler-brewing"),
    ("Yellow Dog Brewing",         "https://www.yellowdogbrew.com",             "yellow-dog"),
    # Farms
    ("Farmersdotter Organics",     "https://www.farmersdotter.ca",              "farmersdotter"),
]

OUT_DIR   = Path(__file__).parent.parent / "images" / "producers"
MAX_WIDTH = 600
QUALITY   = 82
TIMEOUT   = 14
HEADERS   = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}

# SSL context that skips verification (for sites with expired/bad certs)
SSL_UNVERIFIED = ssl.create_default_context()
SSL_UNVERIFIED.check_hostname = False
SSL_UNVERIFIED.verify_mode = ssl.CERT_NONE


class MetaImageParser(HTMLParser):
    """Extract og:image, twitter:image, and large <img> srcs from a page."""
    def __init__(self, base_url):
        super().__init__()
        self.base_url = base_url
        self.og_image = None
        self.twitter_image = None
        self.img_srcs = []   # all img src values
        self.in_head = True

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "body":
            self.in_head = False
        if tag == "meta":
            prop = a.get("property", "") or a.get("name", "")
            content = a.get("content", "")
            if prop == "og:image" and content and not self.og_image:
                self.og_image = self._abs(content)
            if prop in ("twitter:image", "twitter:image:src") and content and not self.twitter_image:
                self.twitter_image = self._abs(content)
        if tag == "img":
            src = a.get("src", "")
            if src and not src.startswith("data:"):
                self.img_srcs.append(self._abs(src))

    def _abs(self, url):
        if url.startswith("//"):
            return "https:" + url
        return urljoin(self.base_url, url)

    def best_image(self):
        return self.og_image or self.twitter_image or (self.img_srcs[0] if self.img_srcs else None)


def fetch_html(url, ssl_ctx=None):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=ssl_ctx) as resp:
            return resp.read(120000).decode("utf-8", errors="replace"), None
    except Exception as e:
        return None, str(e)


def get_image_url(site_url):
    """Try to find a good image URL from the site, with SSL fallback."""
    html, err = fetch_html(site_url)
    if html is None:
        # Retry with unverified SSL
        html, err2 = fetch_html(site_url, SSL_UNVERIFIED)
        if html is None:
            return None, f"{err} | ssl-fallback: {err2}"

    parser = MetaImageParser(site_url)
    parser.feed(html)
    img_url = parser.best_image()
    if not img_url:
        return None, "no image found in page"
    return img_url, None


def download_image(img_url):
    req = urllib.request.Request(img_url, headers=HEADERS)
    for ctx in (None, SSL_UNVERIFIED):
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
                return resp.read(), None
        except Exception as e:
            last_err = str(e)
    return None, last_err


def save_webp(data, out_path):
    try:
        img = Image.open(BytesIO(data)).convert("RGB")
    except Exception as e:
        return f"PIL open failed: {e}"
    w, h = img.size
    if w > MAX_WIDTH:
        img = img.resize((MAX_WIDTH, int(h * MAX_WIDTH / w)), Image.LANCZOS)
    img.save(out_path, "WEBP", quality=QUALITY, method=6)
    return None


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    failed = []

    for name, site_url, slug in PRODUCERS:
        out_path = OUT_DIR / f"{slug}.webp"
        if out_path.exists():
            print(f"  SKIP  {name}")
            continue

        print(f"  FETCH {name} ...", end=" ", flush=True)

        img_url, err = get_image_url(site_url)
        if not img_url:
            print(f"FAIL ({err})")
            failed.append((name, slug, err))
            time.sleep(0.5)
            continue

        data, err = download_image(img_url)
        if not data:
            print(f"FAIL download ({err})")
            failed.append((name, slug, f"download: {err}"))
            time.sleep(0.5)
            continue

        err = save_webp(data, out_path)
        if err:
            print(f"FAIL save ({err})")
            failed.append((name, slug, f"save: {err}"))
        else:
            kb = out_path.stat().st_size // 1024
            print(f"OK  {kb}KB  -> images/producers/{slug}.webp")

        time.sleep(0.9)

    print("\n── Summary ──────────────────────────────")
    total = len(PRODUCERS)
    n_fail = len(failed)
    n_skip = sum(1 for _, _, slug in PRODUCERS if (OUT_DIR / f"{slug}.webp").exists() and
                 not any(s == slug for _, s, _ in failed))
    print(f"  {total - n_fail} have images,  {n_fail} failed")
    if failed:
        print("\n  Still missing:")
        for name, slug, reason in failed:
            print(f"    {name}: {reason}")


if __name__ == "__main__":
    main()
