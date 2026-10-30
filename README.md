# Stipple

A one-page landing site for **Stipple**, a fictional SaaS that keeps every brand photo on brand. A team sets up one **Style Card** (grade, crop, type, colour), and every photo anyone exports goes through it, so posters, socials and shop windows all look like the same brand.

The visual identity follows the *Third Point* brand film: a black void, small floating cards, three card tones (electric blue, near-black, paper white), heavy uppercase wordmarks, micro text and a little square code in each layout. There is one heading style: a white dot, then a short serif line that types itself behind a blinking blue colon.

## Run it

Open `index.html` directly (double-click it in File Explorer), or serve the folder:

```bash
node .claude/serve.mjs stipple 5340
```

Run that from the `10k websites demo` folder, then open http://localhost:5340/. You need an internet connection for the fonts and GSAP/Lenis, which load from CDNs.

## Files

```
stipple/
├── index.html    all markup, section by section
├── style.css     tokens, components, one block per section, responsive at the end
├── script.js     all motion (GSAP + ScrollTrigger, Lenis smooth scroll)
├── favicon.svg   white Style Card with a blue seal on black
└── img/          18 WebP photos, max 720px wide (~530 KB total)
```

## Design system

| Token | Value | Use |
|---|---|---|
| `--black` | `#000` | page background (the void) |
| `--blue` | `#2A1BF2` | the one accent: cards, dots, seals, carets, bands |
| `--dark` | `#1C1C1C` | dark card tone |
| `--paper` | `#F2F2F0` | white card tone |
| `--serif` | Newsreader 500 | headings, quotes, prices, FAQ questions |
| `--sans` | Switzer 400–800 | UI, micro text, 800 uppercase wordmarks |
| `--u` | `min(8vw, 13vh)` | size unit for the hero cluster (`min(22vw, 12vh)` on phones) |
| `--s` | `min(11vw, 17vh)` | size unit for the Ferro spread tiles |

Photos are full colour. Buttons are white pills that turn blue on hover. Cards have square corners; only buttons, pills and the dock are rounded.

## Sections and motion

1. **Loader → hero.** The hero tiles start as a fanned deck with the Style Card on top, and a `Stipple · 000` counter runs while the hero images load. Then the deck deals out into the cluster. Everything starts hidden through `html.is-loading`, so nothing flashes.
2. **Hero (pinned, `1100vh`).** The cluster is six tiles: a tennis photo, Mei, a cyclist on a grey mount, a dancer, the white Style Card and a blue-dot poster. On scroll, the Style Card itself widens and turns from white to blue. The other tiles fly into their slots on the card (photos into the photo frames, the dot poster into the code square), cropping to each slot's shape. After that it's **one card** whose pieces glide between layouts while it recolours:
   `intro (blue) → photo (dark) → sizes (white spread) → Ferro (blue) → Kiln & Co (white) → North Paw (dark) → feed (blue)`.
   The card dips in scale as it turns into the customer cards. The heading retypes for every state.
3. **How it works (pinned).** Four rules (Grade, Crop, Type, Colour) are applied one by one to the same raw shot, which sits inside selection handles. The active rule expands with its explanation.
4. **Your feed, before and after.** Nine Ferro posts: messy on one side, run through the card on the other. A native range input drives the drag line, and it sweeps once by itself on arrival.
5. **Ferro shot once (pinned).** The Style Card deals out eight formats (poster, stories, social, shop window, kit tag, banner, feed post) while a counter runs to 1,240 exports.
6. **Pricing.** Three plans; the middle one is blue with a dashed selection frame.
7. **FAQ.** Native `<details>` items.
8. **Sign-up footer**, plus a bottom dock that appears after the hero and hides at the footer.

Reduced motion: the deck and the typing are skipped, and the scroll stories still work.

## Editing

**Hero cluster.** Each tile in `.cluster` sets `data-x` and `data-y` (offset from the centre, in `--u`), `data-w` (width in `--u`) and `data-r` (height ÷ width). `data-to` names the slot it flies into: `a` (main photo frame), `b` (second frame) or `qr`.

**Card states.** Text and images inside the card carry `v-<state>` classes, e.g. `<span class="v-kiln">`. One element can belong to several states. In `script.js`:
- `layout(name)`: where each piece sits, in % of the card, for each state.
- `TONE`: background and text colour per state.
- `MORPHS`: the order of states and the timeline time of each one.
- `LINES`: the hero heading for each state.

To add a customer, add its `v-<name>` spans and image to the card, add the name to `TONE`, to the customer branch of `layout()` and to `MORPHS` and `LINES`, then make `.hero` taller.

**How it works.** Change the copy in `.how__list`. The steps on the photo are the `howTl` tweens; their labels are `HOW_LABELS`.

**Before / after.** "Before" looks come from the `.m1`–`.m4` classes in `style.css`. "After" tiles are plain, `.f-blue` or `.f-dark`.

**Ferro spread.** Each `.ex` sets `data-x`/`data-y` (its % position on the stage), `--w` (width in `--s`) and `--r` (aspect ratio).

**Images.** Keep new photos as WebP, at most 720px wide, e.g.:

```bash
ffmpeg -i photo.jpg -vf "scale='min(720,iw)':-2" -c:v libwebp -quality 76 img/photo.webp
```

## Credits

Photos are stock photography, used as placeholders. Fonts: Newsreader (Google Fonts) and Switzer (Fontshare). Libraries: GSAP 3.12.5 with ScrollTrigger, and Lenis 1.1.13.
