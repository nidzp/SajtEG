# ElectroGroup ITS Website

Static marketing site for ElectroGroup ITS. The project runs on top of Vite so you can develop locally with hot reload and generate an optimized production bundle before uploading to your host.

## Quick Start

```bash
npm install
npm run dev
```

The dev server binds to all interfaces (thanks to `--host` in `package.json`), so it works on the LAN if you need to test on mobile. Stop the server with `Ctrl+C`.

## Project Layout

- `index.html` – main landing page that visitors see at electrogroup.rs  
- `intro.html` – cinematic splash page that autoredirects to `index.html` after three seconds  
- `kontakt.html` – dedicated contact and support hub  
- `styles.css`, `script.js`, `support.js` – shared styling and JS logic  
- `assets/` – logos, hero video, gallery images and shared UI helpers

## Building for Production

The Vite build now bundles all three HTML entry points. Run:

```bash
npm run build
```

Output appears in `dist/`. Use `npm run preview` to serve that folder locally and double check everything before going live.

## Deploying to electrogroup.rs

1. **Prepare hosting**  
   Create a web root directory on your host (for example `/var/www/electrogroup` or the `public_html` folder on shared hosting). Make sure the web server points the domain `electrogroup.rs` (and optional `www.electrogroup.rs`) to this directory.

2. **Upload the build**  
   Copy the *contents* of `dist/` (not the folder itself) to the web root. You can use SFTP, rsync, or a control-panel file manager. Keep the folder structure intact (`assets`, fonts, etc.).

3. **Update DNS**  
   - Set an `A` record for `electrogroup.rs` pointing to the server IPv4 address.  
   - Set a `CNAME` record for `www` pointing to `electrogroup.rs` if you want both to resolve to the same site.  
   DNS propagation can take up to 24 hours.

4. **Issue HTTPS certificates**  
   Use Let’s Encrypt or your hosting provider’s SSL tool to create certificates for both `electrogroup.rs` and `www.electrogroup.rs`. Redirect HTTP to HTTPS once the certificates are active.

5. **Form handling**  
   The contact form posts to FormSubmit (`https://formsubmit.co/office@electrogroup.rs`). Log into FormSubmit, whitelist the production domain and configure any redirects (`_next` field) as needed. Test the form after deploying.

6. **Optional intro page**  
   If you want the cinematic intro (`intro.html`) to appear first, upload it as `index.html` temporarily or configure your server with a rewrite rule that serves `intro.html` on first visit and the main page afterwards. By default the root serves `index.html`.

7. **Health check**  
   Once DNS and SSL finish propagating, open `https://electrogroup.rs` in a private window, click through the gallery, the chat widget and the contact form to confirm all assets load correctly.

## Content Updates

- Replace hero video and logo in `assets/intro/intro.mp4` and `assets/logo.png`.  
- Update copy in `index.html` or `kontakt.html`; keep accents as HTML entities when editing from a terminal that lacks UTF-8.  
- Add or swap gallery images inside `assets/` and update `alt` text accordingly.  
- Adjust contact emails or phone numbers in `kontakt.html` and `script.js` (chat quick replies) if details change.

## Troubleshooting

- If `npm run build` fails, clear `node_modules/` and reinstall.  
- Missing assets after deployment usually mean the relative folder structure changed; re-upload the full `dist/` contents.  
- Slow hero video load times can be improved by transcoding `assets/intro/intro.mp4` to H.264 at 1080p and adding a lighter poster image.

## Next Steps

- Add analytics (for example Matomo or Plausible) by dropping the script into `index.html`.  
- Generate `sitemap.xml` and `robots.txt` before submitting the site to search engines.  
- Consider compressing gallery images with an optimizer to reduce payload for mobile visitors.
