# Broadway Beer Wine & Spirits — Website

Static site skeleton for broadwaybeerwine.ca. Built to replace the Squarespace site.

## Pages

| Page | File | Notes |
|------|------|-------|
| Home | `index.html` | Hero, features, blog preview, CTA |
| About Us | `about.html` | Story, values, team |
| Shop | External | Redirects to `shop.broadwaybeerwine.ca` |
| Blog | `blog.html` | Post grid, category filters, newsletter signup |
| Events | `events.html` | Upcoming + past events, email signup |
| Contact | `contact.html` | Contact form, hours, corporate gifting |

## Stack

Plain HTML / CSS / JS — no build step. Deploy directly to Netlify.

## Local development

Open any `.html` file in a browser, or use a local server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deploy to Netlify

1. Push this repo to GitHub
2. Connect repo in [Netlify](https://app.netlify.com) → **Add new site → Import an existing project**
3. Build command: *(leave blank)*
4. Publish directory: `.`
5. Deploy

The `netlify.toml` handles the `/shop` redirect and cache headers automatically.

## What's next

- [ ] Add real photography (hero, store, team, blog posts)
- [ ] Add phone number and social media URLs
- [ ] Confirm address and hours
- [ ] Wire contact form to Netlify Forms (add `netlify` attribute to `<form>`)
- [ ] Add logo SVG/PNG to nav
- [ ] Set up custom domain
- [ ] Blog — decide on CMS (Decap CMS, Contentful, or markdown files)
- [ ] Events — same CMS decision
- [ ] Add Google Maps embed to contact page
- [ ] Age gate (optional)

