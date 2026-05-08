# AIShield Marketing Site

Pre-launch landing site for **AIShield** — mobile defense against AI-generated threats.
Built by **SpearCompute Sdn Bhd**, Malaysia.

---

## 📁 Structure

```
aishield-site/
├── index.html          # Home (hero, threats, demo, features, pricing, trust)
├── pricing.html        # Detailed pricing + comparison table + FAQ
├── privacy.html        # Privacy + PDPA + GDPR + Cookie policy (combined)
├── terms.html          # Terms of Service
├── contact.html        # Contact (Support / Sales / Press tabs)
├── assets/
│   ├── shared.css      # Shared design system (CSS vars, glass, nav, footer)
│   └── shared.js       # Shared JS (nav scroll, reveals, cookies, chat widget)
└── README.md
```

---

## 🎨 Design System (locked-in)

### Colors
```css
--bg: #0a0a0f          /* deep void */
--surface: #13131a     /* sections */
--card: #1a1a24        /* cards */
--indigo: #6366f1      /* primary accent */
--indigo-light: #818cf8
--green: #22c55e       /* safe / success */
--red: #ef4444         /* threat / danger */
--amber: #f59e0b       /* warning */
--text: #f4f4f8
--muted: #9898b0
```

### Typography
- **Outfit** (Google Fonts) — display + body
- **JetBrains Mono** — numbers, code, status

### Glass treatment (used sparingly on)
1. Top nav (when scrolled)
2. Demo widget on home
3. Pricing cards (Pro tier extra)
4. Cookie consent banner
5. Floating chat widget

---

## 🚀 Deploy to Cloudflare Pages

### Option A — Drag & drop (fastest, 30 seconds)
1. Open Cloudflare dashboard → **Pages** → **Create a project** → **Direct Upload**
2. Drop the entire `aishield-site/` folder
3. Done — you'll get a URL like `aishield-marketing-v2.pages.dev`

### Option B — Git-connected (recommended for v2)
1. Push this folder to a GitHub repo (e.g. `aishield-site`)
2. Cloudflare Pages → **Connect to Git** → select repo
3. Build settings:
   - **Build command:** *(leave empty — pure HTML)*
   - **Build output directory:** `/`
4. Set environment variables (none needed for static site)
5. Deploy

### Option C — Wrangler CLI
```bash
cd aishield-site
npx wrangler pages deploy . --project-name=aishield-marketing-v2
```

---

## 🔌 Live demo widget — wiring to Claude API

The home page demo widget calls `POST /api/anthropic` (your existing Worker proxy).

**It works automatically if your Cloudflare Worker proxy is at the same domain or a configured route.** If you deploy this site to a *new* Cloudflare Pages project, you need to either:

**Option 1 — Same project:** Add a Function at `functions/api/anthropic.js` that proxies to Anthropic. Cloudflare Pages will auto-route it.

**Option 2 — Worker route:** In Cloudflare dashboard, attach your existing `aishield-anthropic-proxy` Worker to a route on this domain like `your-site.pages.dev/api/anthropic*`.

**If `/api/anthropic` is unreachable**, the demo widget gracefully shows a "demo unavailable" message — it never breaks the page. Same for the chat widget — it falls back to a built-in FAQ.

---

## ✅ Pre-launch checklist

Before going live:

- [ ] Replace placeholder threat-card visuals with real screen recordings (lazy-loaded MP4s)
- [ ] Wire `/api/contact` endpoint for the Contact form (or use a service like Formspree/Resend)
- [ ] Set real DPO email forwarding (`dpo@aishield.com`)
- [ ] Set real support/sales/press email aliases
- [ ] Verify Cloudflare Worker proxy at `/api/anthropic` is live
- [ ] Add favicon to `assets/` and reference it in `<head>`
- [ ] Set up DNS for custom domain (e.g. `aishield.com`)
- [ ] Add Google Analytics / Plausible (if desired) — only loads if user accepts analytics cookies
- [ ] Submit sitemap.xml to Google Search Console

---

## 🛡 Compliance Built-In

- **PDPA (Malaysia, Act 709)** — full notice in `privacy.html#pdpa`
- **GDPR (EU)** — section in `privacy.html#gdpr`, EU representative
- **Cookie consent** — granular (Accept all / Necessary only / Customize)
- **Right to delete / export** — DPO contact + 14-day SLA
- **Data residency** — APAC (Cloudflare Singapore + Malaysia)

---

## 🔮 Future additions (when ready)

- About page (when team is bigger than 3 people)
- Blog (when there's content worth publishing)
- Help Center (when there are 500+ users)
- Status page (when uptime is monitored)
- Press / Media kit (when there's actual press)
- Engineering blog (when there's a technical story to tell)

**Resist the urge to add these now.** Empty pages hurt credibility more than missing pages.

---

## 📞 Questions?

`hello@aishield.com` · Selangor, Malaysia 🇲🇾
