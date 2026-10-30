// Page wiring: deck loader, typed headings, the one-card hero story, four rules, before/after, Ferro spread, smooth scroll.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => innerWidth < 900;
const unit = () => Math.min(innerWidth * (mobile() ? 0.22 : 0.08), innerHeight * (mobile() ? 0.12 : 0.13)); // = CSS --u

gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();                                          // until the deck has dealt
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = $(a.getAttribute('href'));
  if (t) { e.preventDefault(); lenis.scrollTo(t); }
}));

/* ── The one heading: a white dot, then the line types itself behind a blinking blue colon ── */
const caret = '<span class="say__colon" aria-hidden="true">:</span>';
function type(el, text, speed = 42) {
  el.setAttribute('aria-label', text);
  clearTimeout(el._t);
  return new Promise(done => {
    let i = 0;
    const step = () => {
      el.innerHTML = text.slice(0, i) + caret;
      if (i++ < text.length) el._t = setTimeout(step, reduce ? 0 : speed);
      else done();
    };
    step();
  });
}
function erase(el, speed = 22) {
  clearTimeout(el._t);
  return new Promise(done => {
    let s = el.getAttribute('aria-label') || '';
    const step = () => {
      s = s.slice(0, -1);
      el.innerHTML = s + caret;
      if (s.length) el._t = setTimeout(step, speed);
      else { el.innerHTML = ''; done(); }
    };
    step();
  });
}
const wait = ms => new Promise(r => setTimeout(r, ms));
$$('.say').forEach(say => {
  const line = $('.say__line', say), dot = $('.say__dot', say);
  line.setAttribute('aria-label', line.dataset.text);
  line.innerHTML = '';
  if (say.classList.contains('say--hero')) return;
  ScrollTrigger.create({
    trigger: say, start: 'top 82%', once: true,
    onEnter: () => {
      gsap.from(dot, { scale: 0, duration: 0.5, ease: 'back.out(3)' });
      setTimeout(() => type(line, line.dataset.text), 350);
    },
  });
});

/* ── Hero: blue dots on the poster tile drift ── */
const DOTS = [[.08, .1, .3], [.46, .04, .26], [.7, .3, .24], [.18, .44, .22], [.52, .5, .3], [.06, .74, .16], [.36, .7, .2], [.72, .66, .22], [.8, .08, .12]];
$$('.cluster__dots span').forEach((d, i) => {
  const [x, y, r] = DOTS[i];
  d.style.cssText = `--x:${x * 100}%;--y:${y * 100}%;--d:${r * 100}%`;
  if (!reduce) gsap.to(d, { x: () => unit() * 0.05 * Math.cos(i), y: () => unit() * 0.05 * Math.sin(i * 2), duration: 1.6 + (i % 3) * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
});

/* ── Hero line: one line per card state. On the first it loops type → hold → erase;
      when the scroll moves the card on, it erases and types that state's line ── */
const heroLine = $('.say--hero .say__line');
const LINES = ['Keep every image on brand', 'It starts with one card', 'One card for every photo', 'Posters, socials, shop windows', 'Every brand gets one', 'Kiln & Co gets one', 'North Paw gets one', 'Seen your feed lately'];
let lineAt = -1, lineRun = 0;
async function setLine(i) {
  if (i === lineAt) return;
  lineAt = i;
  const run = ++lineRun, live = () => run === lineRun;
  if (heroLine.textContent) await erase(heroLine, 14);
  while (live()) {
    await type(heroLine, LINES[i], i ? 34 : 46);
    if (i || reduce || !live()) return;
    await wait(3600);
    if (!live()) return;
    await erase(heroLine);
    await wait(900);
  }
}

/* ── Hero scroll story (pinned): the white Style Card grows into ONE banner card. The card never
      swaps: its wordmark, text block, address, code square and two photo frames glide to each
      layout while it recolours. States: intro → photo → sizes → three customers → feed ── */
const stage = $('.stage'), face = $('.stage__face');
const el = { mark: $('.c-mark'), foot: $('.c-foot'), addr: $('.c-addr'), qr: $('.c-qr'), a: $('.c-a'), b: $('.c-b') };
const B = '#2A1BF2', D = '#1C1C1C', W = '#F2F2F0';
const TONE = { intro: [B, '#fff'], photo: [D, '#fff'], sizes: [W, '#111'], ferro: [B, '#fff'], kiln: [W, '#111'], north: [D, '#fff'], feed: [B, '#fff'] };
function layout(name) {                                // every piece in % of the card
  const R = stage.offsetWidth / stage.offsetHeight, px = 2.2, py = px * R, col = (100 - 2 * px) / 4;
  const full = { t: py, h: 100 - 2 * py }, low = 100 - py * 1.3, fw = R < 2 ? 46 : 30;
  if (name === 'photo') return {
    mark: { l: px, t: py }, foot: { l: px, t: low, yp: -100, w: fw }, addr: { l: 50, t: low, yp: -100 },
    qr: { l: 70, t: low, yp: -100, xp: 0 }, a: { l: 100 - px - 23, w: 23, ...full }, b: { l: 100 - px - 23, w: 23, ...full, o: 0 },
  };
  if (name === 'sizes') return {
    mark: { l: px + col * 2 + 1.5, t: py }, foot: { l: px, t: py, yp: 0, w: col - 2 }, addr: { l: px, t: 58, yp: 0 },
    qr: { l: px, t: 100 - py, yp: -100, xp: 0 }, a: { l: px + col, w: col, ...full }, b: { l: px + col * 3, w: col, ...full, o: 1 },
  };
  if (name === 'ferro' || name === 'kiln' || name === 'north') return {   // customer card: portrait left, quote beside it
    mark: { l: px + 27, t: py }, foot: { l: px + 27, t: low, yp: -100, w: R < 2 ? 40 : 30 }, addr: { l: 74, t: low, yp: -100 },
    qr: { l: 100 - px, t: low, yp: -100, xp: -100 }, a: { l: px, w: 24, ...full }, b: { l: px, w: 24, ...full, o: 0 },
  };
  const small = { l: 100 - px - 17, t: py, w: 17, h: (17 * R) / 1.55 };   // intro / feed: small wide photo top-right
  return {
    mark: { l: px, t: py }, foot: { l: px, t: low, yp: -100, w: fw }, addr: { l: 72, t: low, yp: -100 },
    qr: { l: 100 - px, t: low, yp: -100, xp: -100 }, a: small, b: { ...small, o: 0 },
  };
}
const css = (name, k) => {                             // tween vars for one piece, re-measured on refresh
  const v = layout(name)[k], out = { left: () => layout(name)[k].l + '%', top: () => layout(name)[k].t + '%' };
  if ('w' in v) out.width = () => layout(name)[k].w + '%';
  if ('h' in v) out.height = () => layout(name)[k].h + '%';
  out.xPercent = v.xp || 0;
  out.yPercent = v.yp || 0;
  out.opacity = 'o' in v ? v.o : 1;
  return out;
};
const VARIANTS = name => $$(`.stage .v-${name}`);
const ALL_V = $$('.stage [class*="v-"]');

function pose() {                                      // card transform that sits exactly on the cluster card
  const box = $('.hero__sticky').getBoundingClientRect(), c = $('.cluster__card').getBoundingClientRect();
  const w = stage.offsetWidth, h = stage.offsetHeight, s = c.height / h, side = ((w - c.width / s) / 2 / w) * 100;
  return { x: c.left + c.width / 2 - (box.left + box.width / 2), y: c.top + c.height / 2 - (box.top + box.height / 2), scale: s, clip: `inset(0.4% ${side + 0.2}% 0.4% ${side + 0.2}%)` };
}
const MORPHS = [['intro', 'photo', 1.75], ['photo', 'sizes', 3.3], ['sizes', 'ferro', 4.85], ['ferro', 'kiln', 6.4], ['kiln', 'north', 7.95], ['north', 'feed', 9.5]];
const STEPS = [0.5, ...MORPHS.map(m => m[2] + 0.55)];  // timeline times where the line changes
const heroTl = gsap.timeline({
  defaults: { ease: 'power3.inOut' },
  scrollTrigger: {
    trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 1.6, invalidateOnRefresh: true,
  },
  // read the animated time, not the scroll position, so the heading never trails the card
  onUpdate: () => setLine(STEPS.filter(t => heroTl.time() >= t).length),
});
// Text never overlaps: the old line leaves (up) before the new one arrives (from below).
// Photos inside a frame cross-fade, the new one on top first, then the old one goes.
const isText = n => n.tagName === 'SPAN';
function morph(from, to, at, dur = 1.1) {
  heroTl.fromTo(stage, { backgroundColor: TONE[from][0], color: TONE[from][1] }, { backgroundColor: TONE[to][0], color: TONE[to][1], duration: dur, immediateRender: false }, at);
  Object.keys(el).forEach((k, i) => heroTl.fromTo(el[k], css(from, k), { ...css(to, k), duration: dur, immediateRender: false }, at + i * 0.04));
  const out = VARIANTS(from).filter(n => !n.classList.contains('v-' + to)), inn = VARIANTS(to).filter(n => !n.classList.contains('v-' + from));
  heroTl.fromTo(out.filter(isText), { opacity: 1, y: 0 }, { opacity: 0, y: -8, duration: dur * 0.35, ease: 'power2.in', immediateRender: false }, at);
  heroTl.fromTo(inn.filter(isText), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: dur * 0.4, ease: 'power2.out', immediateRender: false }, at + dur * 0.6);
  heroTl.fromTo(inn.filter(n => !isText(n)), { opacity: 0 }, { opacity: 1, duration: dur * 0.6, ease: 'power1.inOut', immediateRender: false }, at + dur * 0.15);
  heroTl.fromTo(out.filter(n => !isText(n)), { opacity: 1 }, { opacity: 0, duration: dur * 0.25, ease: 'none', immediateRender: false }, at + dur * 0.75);
}
gsap.set(ALL_V.filter(n => !n.classList.contains('v-intro')), { opacity: 0 });
Object.keys(el).forEach(k => gsap.set(el[k], css('intro', k)));
gsap.set(stage, { backgroundColor: '#FFFFFF', color: '#111111' });
gsap.set([el.mark, el.foot, el.addr, el.qr, el.a], { opacity: 0 });

/* The other cluster tiles fly into their slot in the small blue card (photos → photo frames,
   dot poster → code square), cropping to the slot's shape, and dissolve into it as they land. */
const SMALL = () => (mobile() ? 0.6 : 0.4);
const deck = $$('.cluster .tile'), tiles = deck.filter(t => t.dataset.to);
deck.forEach(t => ['x', 'y', 'w', 'r'].forEach(k => t.style.setProperty('--' + k, t.dataset[k])));
const home = t => { const u = unit(), k = mobile() ? 0.78 : 1; return { x: t.dataset.x * u * k, y: t.dataset.y * u * k }; };
function flight(t) {                                   // offset + scale from the tile to its slot, both from the sticky centre
  const w0 = stage.offsetWidth, h0 = stage.offsetHeight, s = SMALL(), L = layout('intro')[t.dataset.to], u = unit(), p = home(t);
  const w = L.w ? (L.w / 100) * w0 : el.qr.offsetWidth, h = L.h ? (L.h / 100) * h0 : w;
  const left = (L.l / 100) * w0 + (L.xp ? -w : 0), top = (L.t / 100) * h0 + (L.yp ? -h : 0);
  const r = +t.dataset.r, slotR = h / w, tall = r > slotR, seen = tall ? 1 : r / slotR;
  const clip = tall ? `inset(${((1 - slotR / r) / 2) * 100}% 0% ${((1 - slotR / r) / 2) * 100}% 0%)` : `inset(0% ${((1 - seen) / 2) * 100}% 0% ${((1 - seen) / 2) * 100}%)`;
  return { x: (left + w / 2 - w0 / 2) * s - p.x, y: (top + h / 2 - h0 / 2) * s - p.y, scale: (w * s) / (t.dataset.w * u * seen), clip };
}
const LAND = 1.2;                                      // card and tiles arrive together
tiles.forEach((t, i) => {
  const at = 0.08 + i * 0.05, dur = LAND - at;
  heroTl.fromTo(t, { x: 0, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }, { x: () => flight(t).x, y: () => flight(t).y, scale: () => flight(t).scale, clipPath: () => flight(t).clip, duration: dur, ease: 'power2.inOut', immediateRender: false }, at)
    .fromTo(t, { opacity: 1 }, { opacity: 0, duration: dur * 0.3, ease: 'power1.in', immediateRender: false }, at + dur * 0.7);
});
heroTl
  .set(stage, { visibility: 'visible' }, 0.001)
  .set('.cluster__card', { visibility: 'hidden' }, 0.001)
  .fromTo(stage, { x: () => pose().x, y: () => pose().y, scale: () => pose().scale, clipPath: () => pose().clip },
    { x: 0, y: 0, scale: SMALL, clipPath: 'inset(0% 0% 0% 0%)', duration: LAND, ease: 'power2.inOut' }, 0)
  // One card: the white Style Card itself turns blue as it widens — its label fades, then the banner's pieces fade in
  .to(face, { opacity: 0, duration: 0.35, ease: 'power1.in' }, 0.3)
  .fromTo(stage, { backgroundColor: '#FFFFFF', color: '#111111' }, { backgroundColor: B, color: '#FFFFFF', duration: 0.75, ease: 'power1.inOut', immediateRender: false }, 0.35)
  .fromTo([el.mark, el.foot, el.addr, el.qr, el.a], { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power1.out', stagger: 0.05, immediateRender: false }, 0.75)
  .to(stage, { scale: 1, duration: 1.35, ease: 'power2.inOut' }, 1.45);
MORPHS.forEach(([from, to, at]) => morph(from, to, at));
// Into the customers the card turns blue and breathes: a short scale dip while its contents change.
const intoCustomers = MORPHS[2][2];
heroTl.to(stage, { scale: 0.9, duration: 0.55, ease: 'power2.inOut' }, intoCustomers).to(stage, { scale: 1, duration: 0.6, ease: 'power2.inOut' }, intoCustomers + 0.55);
heroTl.to({}, { duration: 0.8 }, 10.6);

/* ── Loader: the hero waits as a stacked deck in the middle while images load (counter at the
      bottom), then deals out into the cluster. Nothing jumps: every piece starts hidden in CSS. ── */
const count = $('.hero__count b');
function dealIn() {
  document.documentElement.classList.remove('is-loading');
  if (reduce) { $('.hero__count').remove(); setLine(0); lenis.start(); return; }
  gsap.timeline({ onComplete: () => { gsap.set(deck, { clearProps: 'zIndex' }); lenis.start(); ScrollTrigger.refresh(); } })
    .to('.hero__count', { opacity: 0, duration: 0.4 })
    .to(deck, { x: 0, y: 0, rotation: 0, scale: 1, duration: 1.3, ease: 'expo.inOut', stagger: { each: 0.07, from: 'end' } }, '<0.1')
    .fromTo('.say--hero', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.5')
    .from('.say--hero .say__dot', { scale: 0, duration: 0.5, ease: 'back.out(3)' }, '<')
    .add(() => setLine(0), '<0.3')
    .fromTo('.top, .hero__sub', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '<');
}
if (reduce) dealIn();
else {
  gsap.set(['.top', '.say--hero', '.hero__sub'], { opacity: 0 });
  // fanned stack, Style Card on top
  gsap.set(deck, { x: i => -home(deck[i]).x + [-14, 10, -6, 14, 0, 6][i], y: i => -home(deck[i]).y + [6, -8, 10, -4, 0, 4][i], rotation: i => [-9, 7, -4, 10, 0, 4][i], scale: 0.92, opacity: 1, zIndex: i => [3, 4, 2, 5, 9, 1][i] });
  const imgs = $$('.hero img');                        // only the hero waits; the rest load lazily
  let loaded = 0;
  const shown = { v: 0 };
  const done = Promise.all(imgs.map(im => (im.complete ? Promise.resolve() : new Promise(r => { im.addEventListener('load', r, { once: true }); im.addEventListener('error', r, { once: true }); })).then(() => loaded++)));
  const tickCount = () => { shown.v += ((loaded / imgs.length) * 100 - shown.v) * 0.12; count.textContent = String(Math.round(shown.v)).padStart(3, '0'); };
  gsap.ticker.add(tickCount);
  Promise.race([Promise.all([done, document.fonts.ready, wait(1200)]), wait(6000)]).then(() => {
    gsap.ticker.remove(tickCount);
    gsap.to(shown, { v: 100, duration: 0.35, ease: 'power2.out', onUpdate: () => (count.textContent = String(Math.round(shown.v)).padStart(3, '0')), onComplete: dealIn });
  });
}

/* ── How it works: the four rules, applied to one raw shot as you scroll ── */
const howItems = $$('.how__list li'), specState = $('.spec__state'), specLabel = $('.spec__label');
const HOW_LABELS = ['Raw shot', 'Graded', 'Cropped to 4:5', 'Wordmark set', 'On brand'];
const specW = () => $('.spec__frame').offsetWidth;
const howTl = gsap.timeline({
  defaults: { duration: 0.8, ease: 'power2.inOut' },
  scrollTrigger: { trigger: '.how', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true },
  onUpdate: () => {
    const t = howTl.time() - 0.3, on = Math.max(0, Math.min(3, Math.floor(t))), done = Math.max(0, Math.min(4, Math.floor(t + 0.2)));
    howItems.forEach((li, i) => li.classList.toggle('is-on', i === on));
    specLabel.textContent = HOW_LABELS[done];
    specState.classList.toggle('is-done', done === 4);
  },
});
howTl
  .fromTo('.spec__img', { filter: 'saturate(0.4) contrast(0.7) brightness(1.18)' }, { filter: 'saturate(1.1) contrast(1.08) brightness(1)' }, 0.3)
  .fromTo('.spec__frame', { height: () => specW() / 1.5 }, { height: () => specW() * 1.25 }, 1.3)
  .fromTo('.spec__img', { scale: 1 }, { scale: 1.12 }, 1.3)
  .fromTo('.spec__mark', { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 2.3)
  .fromTo('.spec__band', { height: 0 }, { height: '20%' }, 3.3)
  .to({}, { duration: 0.4 });
howItems[0].classList.add('is-on');

/* ── Before / with: the range input drives the line; it sweeps once to show what it does ── */
const cmpBox = $('.compare__box'), cmpRange = $('.compare__range');
const setP = v => { cmpBox.style.setProperty('--p', v + '%'); cmpRange.value = v; };
cmpRange.addEventListener('input', () => setP(+cmpRange.value));
ScrollTrigger.create({
  trigger: cmpBox, start: 'top 70%', once: true,
  onEnter: () => {
    if (reduce) return setP(50);
    const p = { v: 85 };
    gsap.timeline({ onUpdate: () => setP(Math.round(p.v)) })
      .to(p, { v: 12, duration: 1.6, ease: 'power2.inOut' })
      .to(p, { v: 50, duration: 1.1, ease: 'power2.inOut' }, '+=0.3');
  },
});

/* ── Ferro spread: the Style Card deals out every format one shoot became; the counter runs with it ── */
const exs = $$('.ex'), spreadN = $('.spread__n'), made = { n: 0 };
gsap.set(exs, { left: '50%', top: '50%', scale: 0.3, opacity: 0 });
const spreadTl = gsap.timeline({ scrollTrigger: { trigger: '.spread', start: 'top top', end: 'bottom bottom', scrub: 0.8 } });
exs.forEach((ex, i) => spreadTl.to(ex, { left: ex.dataset.x + '%', top: ex.dataset.y + '%', scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }, i * 0.35));
spreadTl.to(made, { n: 1240, duration: spreadTl.duration(), ease: 'none', onUpdate: () => (spreadN.textContent = Math.round(made.n).toLocaleString('en')) }, 0);
spreadTl.to({}, { duration: 0.6 });

/* ── Plans and questions rise in ── */
gsap.from('.plan', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.plans', start: 'top 85%', once: true } });
gsap.from('.faq details', { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.faq__list', start: 'top 85%', once: true } });

/* ── Bottom dock: after the hero, hidden at the footer ── */
const dock = $('.dock');
lenis.on('scroll', () => dock.classList.toggle('is-on', lenis.scroll > $('.hero').offsetHeight - innerHeight * 0.6 && $('#join').getBoundingClientRect().top > innerHeight * 0.7));
