# Stipple: Project Card

Everything someone needs to rebuild this exact site: the prompts, workflow, tools and history.

---

## Short description (30 max)
**Brand-photo consistency SaaS**

## Description
Stipple is a one-page landing site for a fictional SaaS. A team sets up one **Style Card** (grade, crop, type, colour), and every photo anyone exports goes through it, so posters, socials and shop windows all look like one brand. The look follows the *Third Point* brand film: a black void, small floating cards in three tones (electric blue, near-black, paper), heavy uppercase wordmarks and one typed serif line as the only heading. The hero is a cluster of tiles. On scroll the Style Card grows into one banner card, and the other tiles fly into its slots. That one card then morphs through product states and customer cards.

## Type
Landing page / marketing site (one page, static HTML/CSS/JS, no build step)

## Vibe
Dark, minimal brand-identity film: black void, electric blue #2A1BF2, small objects floating in space, quiet typed serif lines, and smooth one-card morphs on scroll

## Category
SaaS / Creative tools (brand photography and asset consistency)

## Claude model used most
**Claude Opus 5.5** (`claude-opus-5-5`)

## How many tries
**About 12 rounds**, mostly over Oct 27–28, 2026:
v1 paper + pixel serif (hated) → v2 Grail ring hero (hero liked) → v3 dark + ASCII/B&W images (rejected) → v4 ring hero upgraded + Lloyds headline → v5 Naked City + Third Point hero ("Grail replica" fix) → v6 whole site in the Third Point identity → v7 product-loop hero (hated: labels on images) → v8 Style Card grows into the banners → v9 one shared-element card + envelope loader → v10 six hero tiles morph into the card → v11 customers folded into the hero, deck loader, explainer sections → finalise.
Each round also had several smaller fix prompts.

---

## Main prompt

> Build a one-page landing site for **Stipple**, a fictional SaaS that keeps every brand photo on brand. A team sets up one **Style Card** (grade, crop, type, colour), and every export runs through it. Headline: "Keep every image on brand." Use plain HTML/CSS/JS (index.html, style.css, script.js), with GSAP 3.12.5 + ScrollTrigger and Lenis 1.1.13 from jsDelivr. No framework.
>
> **Identity (Third Point brand film):** a black `#000` void with small floating cards in three tones: blue `#2A1BF2`, dark `#1C1C1C` and paper `#F2F2F0`. Blue is the only accent. Use Switzer 400–800 (Fontshare) for UI, micro text and 800 uppercase wordmarks. Use Newsreader 500 for the one heading style: a white dot, then a short serif line that types itself behind a blinking blue colon. Cards have square corners; only buttons, pills and the dock are rounded. Buttons are white pills that turn blue on hover. Use full-colour sports and fashion stock photos, with **no captions or labels on hero images**.
>
> **Loader:** the hero tiles start as a fanned deck with the Style Card on top. A `Stipple · 000` counter runs while the hero images load, then the deck deals out into the cluster. Use `html.is-loading` so nothing flashes.
>
> **Hero (pinned, ~1100vh):** a cluster of 6 tiles (tennis photo, portrait, cyclist, dancer, white Style Card, blue-dot poster). On scroll the Style Card widens and turns blue. The other tiles fly into its slots (photo frames, code square), and clip-path crops them to each slot's shape. From then on it's **ONE card** whose pieces (wordmark, text block, address, code square, 2 photo frames) glide between % layouts while the card recolours: intro (blue) → photo (dark) → sizes (white spread) → Ferro (blue) → Kiln & Co (white) → North Paw (dark) → feed (blue). It dips in scale for the customer cards, and the typed heading retypes for each state. Text goes out, then in; never crossfade whole slides.
>
> **Sections:** How it works (pinned: 4 rules Grade/Crop/Type/Colour applied one by one to a raw shot inside selection handles) → Your feed, before and after (9 posts, a native range input drag line that sweeps once by itself) → Ferro shot once (pinned: the Style Card deals out 8 formats while a counter runs to 1,240 exports) → Pricing (3 sharp cards, the middle one blue with a dashed selection frame) → FAQ (native `<details>`) → sign-up footer. Add a bottom dock pill that appears after the hero and hides at the footer.
>
> Support reduced motion (skip the deck and the typing; the scroll stories still work). Use lazy WebP images up to 720px wide. Add a favicon: a white Style Card with a blue seal on black.

## Follow-up prompts (in order)
1. "I don't like the paper + pixel serif look. Redo it." → Grail-style ring hero
2. "Make it dark." → "Why are all the images ASCII? No pixelated text. Why are all the images dark?"
3. "Restore the ring hero with better animation. Keep the pricing cards and the dock pill."
4. "The hero looks like a replica of the Grail app. Use nakedcityfilms.com and these 3 Third Point brand-film recordings."
5. "I don't like the photo-scale animation, but I love the small typed serif line. Did you check the videos and update the other sections?"
6. "The hero looks nice but has no meaning. Research on Mobbin. Use only blue, black and white."
7. "I hate the texts and labels on the hero images. Go back to the cluster and envelope, and make the Style Card grow into the banners." *(option A)*
8. "Okayish, right direction. Make the envelope the loader. The banner states must read as ONE card."
9. "Add more hero images and make the cluster itself morph into the card. Fix the overlapping text."
10. "Fold the brand cards into the hero morph, replace the loader, add explainer sections from Mobbin." *(colour photos brought back)*
11. "Finalise: favicon, optimise images, README."

---

## Workflow
1. **Brief → hero → review.** Build the hero, show it, keep only what's praised.
2. **Reference study.** Capture nakedcityfilms.com (a canvas hero) with timed headless screenshots. Extract frames from the Third Point recordings to study the type, colour, composition and motion.
3. **Apply references to every section in the same round**, not just the hero.
4. **Mobbin research** for meaning and explainer patterns: Lovart before/after, Fourmula counter, Vimeo type-on-photo, Jasper selection handles, V7 before/after.
5. **Shared-element morph.** Build the hero as one `.stage` whose pieces tween between per-state layouts with a GSAP ScrollTrigger timeline (scrub 1.4).
6. **Verify.** Use headless Edge (`shoot2.mjs`: load ms / hero time / selector@progress), because the in-app pane pauses rAF when it's hidden. Check desktop and mobile, overlap and the console.
7. **Finalise.** Re-encode images with ffmpeg to WebP ≤720px (1.1 MB → 0.53 MB), move unused images to the Recycle Bin, lazy-load below the fold, add the favicon, and write the README as a design and editing guide.

## Tech stack
- HTML, CSS (custom properties, `cqh` units, clip-path, CSS 3D), vanilla JS
- GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13 (jsDelivr)
- Fonts: Newsreader 500 (Google Fonts), Switzer 400–800 (Fontshare)
- 18 WebP photos (~530 KB), `favicon.svg`

### Gotchas worth knowing
- GSAP folds the CSS `translate` property into its transform, so centre animated tiles with negative margins.
- A global `img { max-width: 100% }` collapses images inside absolutely positioned 3D items, so set `max-width: none` there.
- In a morph, fade out only the outgoing variants, or old text comes back and overlaps.
- CSS 3D flaps need a distinct `translateZ` each to avoid z-fighting.

---

## Skills used
| Skill | Used? | Notes |
|---|---|---|
| `anthropic-skills:built-in-browser` | ✅ | In-app preview (`stipple`, port 5340); headless Edge was used for real motion checks |
| `ponytail` | ✅ | Active in the workspace during the late rounds and finalise (lean 3-file output) |
| `impeccable` | ❓ | Not recorded in the project notes. Check the original session before claiming it |
| `design-taste-frontend` | ❓ | Not recorded |

**Recommended if you rebuild it:** `impeccable` (polish and critique passes), `design-taste-frontend` (avoids a templated look), `ponytail` (keeps it to 3 lean files).

## Connectors / MCPs used
| Connector | Used? | What for |
|---|---|---|
| **Mobbin** | ✅ | Hero-meaning and explainer patterns: Lovart, Fourmula, Vimeo, Jasper, V7 |
| **Claude Browser (in-app)** | ✅ | Dev-server preview and click checks |
| **Higgsfield** | ❌ | Not used. All photos are real stock photography (AI imagery was avoided on purpose) |

## Other tools
- **Stock photography** (sports, fashion portraits) as placeholders, re-encoded to WebP
- **ffmpeg / libwebp** for resizing (`scale='min(720,iw)':-2`, quality 76)
- **Headless Edge over CDP** (scratchpad `shoot2.mjs`, `nk.mjs`) for timed screenshots and scroll scrubbing
- `.claude/serve.mjs` as the static server (`node .claude/serve.mjs stipple 5340`)

## References
Third Point brand identity film (3 screen recordings: the main identity), nakedcityfilms.com (blue-block intro, frame growing to full screen), Grail app (the early ring hero, later dropped as too close), Lloyds (headline style), plus Mobbin: Lovart, Fourmula, Vimeo, Jasper, V7. Earlier appendix research: tines, clipo, grail, berd.
