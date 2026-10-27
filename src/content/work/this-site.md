---
title: "This Site: A Window With a Frame"
kicker: "Anonymity is not a lack of identity; it is control over the frame."
dek: "Astro, Cloudflare Pages, and a single D1 database run a portfolio with a guestbook, private contact, and no tracking — by leaving most things out."
period: "2026-10"
category: "Systems"
stack: ["Astro", "TypeScript", "Cloudflare Pages", "Pages Functions", "D1", "Wrangler"]
status: "Shipped"
featured: false
order: 8
---

Most personal sites make the same bargain. Open the page, and a dozen third-party scripts wake up: analytics, font CDNs, tag managers. The page loads your browser's fingerprints before it loads the text. A portfolio is a document someone chose to read, and the infrastructure around it treats that choice as inventory. I wanted a site that asks nothing of the visitor except attention.

## The Failure in the World

Most personal sites are written for recruiters. That pressure pushes design toward a résumé with rounded corners: the writing optimized for skim-speed, everything a call to action. I did not want that, and I did not want the other extreme — a blog that decays into a diary, where every passing mood gets a permalink.

So I set two constraints that were mostly about refusal. First, no third-party dependencies I add at runtime: no Google Fonts, no external analytics, no tracking cookies. The only cookie is the admin session, and it is HttpOnly and SameSite=Strict. Second, the site would be written from a private archive and published selectively. Most of what I write stays local. What appears is a selection, not a feed.

There is one exception I do not control: the is-a.dev DNS zone injects a Cloudflare Web Analytics beacon into proxied pages. The site's CSP blocks the beacon, so it never runs, but the request is still made.

## What I Did

The frontend is a static Astro build. Astro renders every page to HTML at build time and ships almost no JavaScript. The interactivity a public site genuinely needs is small: a guestbook form, a contact form, and a view counter. Those go through Pages Functions, serverless endpoints that run on Cloudflare next to the static files. Guestbook entries and messages live in D1, Cloudflare's SQLite.

Everything else — reading, browsing, these case studies — is a file on a CDN. The page arrives finished.

The visual system uses warm paper tones and a vertical-line motif. The line runs down the page as a rule, a spine, a coordinate. It is the site's signature and its argument: truth is perpendicular to time. Time is the horizontal axis — the feed, what happened in order. Truth cuts across it at a right angle, and the line keeps the vertical axis visible.

## How It Works

Views are counted per page without tracking anyone. A small function increments a counter keyed to the path. No identifier is stored against the visitor. The number exists; the visitor does not.

The guestbook is open, with guardrails. Entries post immediately after a rate-limit and spam check, and I can hide or delete anything. There is no account and no email requirement. The contact form writes into a private table. An admin dashboard handles messages, hides guestbook entries, and reads the counters.

Fonts are self-hosted through Fontsource and bundled into the build, so the visitor's IP is never handed to a font server.

## What Broke, and What I Learned

The hardest decision was what not to build. No comments at all, only a guestbook. A comments section on a solo site turns into a support forum for arguments I never made. A guestbook is lower-stakes: people say hello, or they don't. The moderation is the same frame logic applied to the front door.

The second refusal was structural. A full framework runtime would make the contact form and counter trivial, and would ship a large JavaScript bundle to every visitor for three small features. The static build plus a handful of functions keeps the reading side pure and isolates the dynamic part to the endpoints that need it. The cost is that every new interactive feature has to justify its own endpoint.

The first version also had a moderation mismatch. I wrote the interface around approval-before-posting, then built the backend to publish immediately with a rate limit and a spam filter. The copy caught up to the code, not the other way around. It is a good reminder that a portfolio's claims are part of its surface area.

## Limits and Next

I did not publish the personal material. Publishing is a deliberate act of moving a file, not a default. The site is not the self. It is a window with a frame, and the frame is the argument: someone chose its proportions, chose what the glass shows, chose what stays behind the wall.

What remains unresolved is scale. The design assumes few visitors and low write volume. The guestbook already has per-IP rate limits, but a real flood of traffic would need more moderation than one person can do by hand. The view counter raises a question I have not answered: what is a view? It counts page loads by path, honestly. It does not measure attention, and I am not going to pretend it does.
