import type { FlowerKind, StickerDef } from '../types';

/**
 * ORIGINAL greeting-image stickers, generated locally as SVG.
 * Style: the "早安 / Good Morning" pictures seniors love to forward — a big blossom on a soft
 * bokeh background, bright bilingual text with shadows, a wish, a safety tip and a blessing line.
 * No photos or third-party artwork are used; the same SVG is shown on screen and exported to PNG.
 */

const ZH_FONT = `'PingFang SC','Hiragino Sans GB','Noto Sans CJK SC','Noto Sans SC','Source Han Sans SC','Microsoft YaHei','Heiti SC',sans-serif`;
const SCRIPT_FONT = `'Brush Script MT','Segoe Script','Snell Roundhand','Apple Chancery','Dancing Script','URW Chancery L',cursive`;
const SERIF_FONT = `Georgia,'Times New Roman',Times,serif`;

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Small deterministic PRNG so each sticker always looks the same. */
function rng(seedText: string) {
  let h = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

// ---------- petal shapes (pointing up from 0,0) ----------
type Shape = 'round' | 'ruffled' | 'pointed' | 'thin';
function petalPath(shape: Shape, L: number, W: number): string {
  const f = (n: number) => n.toFixed(1);
  switch (shape) {
    case 'ruffled':
      return `M0 0 C${f(W)} ${f(-L * 0.25)} ${f(W * 1.05)} ${f(-L * 0.8)} ${f(W * 0.55)} ${f(-L * 0.95)} Q${f(W * 0.3)} ${f(-L * 0.86)} ${f(W * 0.15)} ${f(-L)} Q0 ${f(-L * 0.9)} ${f(-W * 0.15)} ${f(-L)} Q${f(-W * 0.3)} ${f(-L * 0.86)} ${f(-W * 0.55)} ${f(-L * 0.95)} C${f(-W * 1.05)} ${f(-L * 0.8)} ${f(-W)} ${f(-L * 0.25)} 0 0Z`;
    case 'pointed':
      return `M0 0 C${f(W)} ${f(-L * 0.3)} ${f(W * 0.6)} ${f(-L * 0.78)} 0 ${f(-L)} C${f(-W * 0.6)} ${f(-L * 0.78)} ${f(-W)} ${f(-L * 0.3)} 0 0Z`;
    case 'thin':
      return `M0 0 C${f(W)} ${f(-L * 0.35)} ${f(W * 0.8)} ${f(-L * 0.9)} 0 ${f(-L)} C${f(-W * 0.8)} ${f(-L * 0.9)} ${f(-W)} ${f(-L * 0.35)} 0 0Z`;
    default:
      return `M0 0 C${f(W)} ${f(-L * 0.2)} ${f(W * 0.95)} ${f(-L * 0.85)} 0 ${f(-L)} C${f(-W * 0.95)} ${f(-L * 0.85)} ${f(-W)} ${f(-L * 0.2)} 0 0Z`;
  }
}

interface Ring {
  n: number;
  len: number; // relative to radius
  wid: number; // relative to radius
  shape: Shape;
  offset?: number; // degrees
  inner: string;
  outer: string;
}

interface FlowerSpec {
  rings: Ring[];
  center: 'stamen' | 'seed' | 'disc' | 'rose' | 'pod' | 'orchid';
  centerColor: string;
  edge: string;
}

const FLOWERS: Record<FlowerKind, FlowerSpec> = {
  plum: {
    rings: [{ n: 5, len: 1, wid: 0.62, shape: 'round', inner: '#ffffff', outer: '#ff5c9d' }],
    center: 'stamen',
    centerColor: '#c2255c',
    edge: '#d6336c',
  },
  peony: {
    rings: [
      { n: 8, len: 1, wid: 0.5, shape: 'ruffled', inner: '#ffd6e7', outer: '#e64980' },
      { n: 7, len: 0.78, wid: 0.45, shape: 'ruffled', offset: 22, inner: '#fff0f6', outer: '#f06595' },
      { n: 6, len: 0.5, wid: 0.36, shape: 'ruffled', offset: 8, inner: '#ffffff', outer: '#faa2c1' },
    ],
    center: 'stamen',
    centerColor: '#f59f00',
    edge: '#c2255c',
  },
  sunflower: {
    rings: [
      { n: 18, len: 1, wid: 0.2, shape: 'pointed', inner: '#f59f00', outer: '#ffd43b' },
      { n: 18, len: 0.86, wid: 0.18, shape: 'pointed', offset: 10, inner: '#f08c00', outer: '#fcc419' },
    ],
    center: 'seed',
    centerColor: '#5c3317',
    edge: '#e67700',
  },
  lotus: {
    rings: [],
    center: 'pod',
    centerColor: '#fab005',
    edge: '#e64980',
  },
  orchid: {
    rings: [
      { n: 3, len: 1, wid: 0.42, shape: 'round', offset: 0, inner: '#f8f0fc', outer: '#cc5de8' },
      { n: 2, len: 0.95, wid: 0.55, shape: 'round', offset: 60, inner: '#fff0f6', outer: '#d6336c' },
    ],
    center: 'orchid',
    centerColor: '#862e9c',
    edge: '#9c36b5',
  },
  hibiscus: {
    rings: [{ n: 5, len: 1, wid: 0.66, shape: 'ruffled', inner: '#c92a2a', outer: '#ff6b6b' }],
    center: 'stamen',
    centerColor: '#ffe066',
    edge: '#a61e4d',
  },
  chrysanthemum: {
    rings: [
      { n: 24, len: 1, wid: 0.1, shape: 'thin', inner: '#f08c00', outer: '#ffe066' },
      { n: 22, len: 0.78, wid: 0.1, shape: 'thin', offset: 8, inner: '#e8590c', outer: '#ffd43b' },
      { n: 18, len: 0.52, wid: 0.1, shape: 'thin', offset: 4, inner: '#d9480f', outer: '#fcc419' },
    ],
    center: 'disc',
    centerColor: '#e67700',
    edge: '#d9480f',
  },
  rose: {
    rings: [
      { n: 6, len: 1, wid: 0.62, shape: 'round', inner: '#c92a2a', outer: '#ff8787' },
      { n: 5, len: 0.74, wid: 0.58, shape: 'round', offset: 30, inner: '#a51111', outer: '#fa5252' },
      { n: 5, len: 0.5, wid: 0.5, shape: 'round', offset: 10, inner: '#8b0d0d', outer: '#e03131' },
    ],
    center: 'rose',
    centerColor: '#7a0b0b',
    edge: '#7a0b0b',
  },
  daisy: {
    rings: [
      { n: 20, len: 1, wid: 0.15, shape: 'thin', inner: '#e9ecef', outer: '#ffffff' },
      { n: 16, len: 0.8, wid: 0.15, shape: 'thin', offset: 9, inner: '#dee2e6', outer: '#ffffff' },
    ],
    center: 'disc',
    centerColor: '#fab005',
    edge: '#adb5bd',
  },
};

function bloom(uid: string, kind: FlowerKind, cx: number, cy: number, r: number, rot = 0): string {
  const spec = FLOWERS[kind];
  let defs = '';
  let body = '';

  if (kind === 'lotus') {
    const back = [-72, -48, -24, 0, 24, 48, 72];
    const front = [-52, -18, 18, 52];
    defs += `<linearGradient id="${uid}-lp" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${-r}"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#ffc9de"/><stop offset="1" stop-color="#f06595"/></linearGradient>`;
    for (const a of back)
      body += `<path d="${petalPath('pointed', r * 1.05, r * 0.3)}" fill="url(#${uid}-lp)" stroke="${spec.edge}" stroke-opacity=".35" transform="translate(${cx} ${cy}) rotate(${a}) scale(1 ${1 - Math.abs(a) / 300})"/>`;
    body += `<ellipse cx="${cx}" cy="${cy - r * 0.12}" rx="${r * 0.32}" ry="${r * 0.16}" fill="#fcc419"/>`;
    for (let i = 0; i < 7; i++)
      body += `<circle cx="${(cx - r * 0.2 + i * r * 0.066).toFixed(1)}" cy="${(cy - r * 0.14).toFixed(1)}" r="${(r * 0.022).toFixed(1)}" fill="#e67700"/>`;
    for (const a of front)
      body += `<path d="${petalPath('pointed', r * 0.8, r * 0.28)}" fill="url(#${uid}-lp)" stroke="${spec.edge}" stroke-opacity=".35" transform="translate(${cx} ${cy + r * 0.05}) rotate(${a})"/>`;
    return `<defs>${defs}</defs>${body}`;
  }

  spec.rings.forEach((ring, ri) => {
    const gid = `${uid}-r${ri}`;
    const L = ring.len * r;
    defs += `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${(-L).toFixed(1)}"><stop offset="0" stop-color="${ring.inner}"/><stop offset="1" stop-color="${ring.outer}"/></linearGradient>`;
    for (let i = 0; i < ring.n; i++) {
      const a = rot + (ring.offset ?? 0) + (360 / ring.n) * i;
      const d = petalPath(ring.shape, L, ring.wid * r);
      body += `<path d="${d}" fill="url(#${gid})" stroke="${spec.edge}" stroke-opacity=".3" stroke-width="1" transform="translate(${cx} ${cy}) rotate(${a.toFixed(1)})"/>`;
      if (ring.shape !== 'thin' && ri === 0)
        body += `<path d="M0 ${(-L * 0.12).toFixed(1)} L0 ${(-L * 0.7).toFixed(1)}" stroke="#ffffff" stroke-opacity=".35" stroke-width="2" transform="translate(${cx} ${cy}) rotate(${a.toFixed(1)})"/>`;
    }
  });

  switch (spec.center) {
    case 'stamen': {
      const n = kind === 'hibiscus' ? 0 : 22;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + 0.13 * (i % 3);
        const len = r * (0.32 + 0.12 * ((i * 7) % 5) / 5);
        const x = cx + Math.cos(a) * len;
        const y = cy + Math.sin(a) * len;
        body += `<path d="M${cx} ${cy} L${x.toFixed(1)} ${y.toFixed(1)}" stroke="#fff3bf" stroke-width="1.6" stroke-opacity=".9"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 0.03).toFixed(1)}" fill="#fab005"/>`;
      }
      body += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.13).toFixed(1)}" fill="${spec.centerColor}" opacity=".85"/>`;
      if (kind === 'hibiscus') {
        const ex = cx + r * 0.62;
        const ey = cy - r * 0.62;
        body += `<path d="M${cx} ${cy} Q${cx + r * 0.3} ${cy - r * 0.2} ${ex} ${ey}" stroke="#ffe3e3" stroke-width="${(r * 0.05).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
        for (let i = 0; i < 9; i++)
          body += `<circle cx="${(ex + Math.cos(i) * r * 0.08).toFixed(1)}" cy="${(ey + Math.sin(i) * r * 0.08).toFixed(1)}" r="${(r * 0.035).toFixed(1)}" fill="#ffd43b"/>`;
      }
      break;
    }
    case 'seed': {
      defs += `<radialGradient id="${uid}-seed"><stop offset="0" stop-color="#8b5a2b"/><stop offset="1" stop-color="${spec.centerColor}"/></radialGradient>`;
      body += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.4).toFixed(1)}" fill="url(#${uid}-seed)"/>`;
      for (let i = 0; i < 90; i++) {
        const a = i * 2.39996;
        const d = Math.sqrt(i / 90) * r * 0.36;
        body += `<circle cx="${(cx + Math.cos(a) * d).toFixed(1)}" cy="${(cy + Math.sin(a) * d).toFixed(1)}" r="${(r * 0.018).toFixed(1)}" fill="#3b2412" opacity=".8"/>`;
      }
      break;
    }
    case 'disc': {
      body += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.22).toFixed(1)}" fill="${spec.centerColor}"/>`;
      for (let i = 0; i < 30; i++) {
        const a = i * 2.39996;
        const d = Math.sqrt(i / 30) * r * 0.19;
        body += `<circle cx="${(cx + Math.cos(a) * d).toFixed(1)}" cy="${(cy + Math.sin(a) * d).toFixed(1)}" r="${(r * 0.018).toFixed(1)}" fill="#ffe066"/>`;
      }
      break;
    }
    case 'rose': {
      for (let i = 0; i < 4; i++) {
        const rr = r * (0.28 - i * 0.06);
        body += `<path d="M${(cx - rr).toFixed(1)} ${cy} A${rr.toFixed(1)} ${(rr * 0.85).toFixed(1)} 0 1 1 ${(cx + rr * 0.6).toFixed(1)} ${(cy + rr * 0.6).toFixed(1)}" stroke="#ffa8a8" stroke-opacity=".7" stroke-width="2.5" fill="${i % 2 ? '#a51111' : '#c92a2a'}" transform="rotate(${i * 70} ${cx} ${cy})"/>`;
      }
      break;
    }
    case 'orchid': {
      body += `<path d="${petalPath('ruffled', r * 0.75, r * 0.45)}" fill="${spec.centerColor}" transform="translate(${cx} ${cy}) rotate(180)"/>`;
      body += `<path d="${petalPath('round', r * 0.45, r * 0.22)}" fill="#e599f7" opacity=".8" transform="translate(${cx} ${cy}) rotate(180)"/>`;
      body += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.1).toFixed(1)}" fill="#fff9db"/><circle cx="${cx}" cy="${cy + r * 0.02}" r="${(r * 0.05).toFixed(1)}" fill="#fab005"/>`;
      break;
    }
    default:
      break;
  }
  return `<defs>${defs}</defs>${body}`;
}

function leaf(cx: number, cy: number, len: number, angle: number, color = '#2f9e44'): string {
  return `<path d="M0 0 C${len * 0.35} ${-len * 0.25} ${len * 0.75} ${-len * 0.2} ${len} 0 C${len * 0.75} ${len * 0.2} ${len * 0.35} ${len * 0.25} 0 0Z" fill="${color}" transform="translate(${cx} ${cy}) rotate(${angle})"/><path d="M0 0 L${len * 0.9} 0" stroke="#d3f9d8" stroke-opacity=".5" stroke-width="2" transform="translate(${cx} ${cy}) rotate(${angle})"/>`;
}

function kopiCup(x: number, y: number): string {
  return `<g transform="translate(${x} ${y})">
    <path d="M-30 -70 q-10 -14 0 -28 q10 -14 0 -28" stroke="#ffffff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".85"/>
    <path d="M2 -66 q-10 -14 0 -28 q10 -14 0 -28" stroke="#ffffff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".85"/>
    <ellipse cx="0" cy="62" rx="92" ry="17" fill="#ffffff"/>
    <path d="M60 -18 q42 0 42 30 q0 30 -48 33" stroke="#ffffff" stroke-width="12" fill="none"/>
    <path d="M-66 -46 h132 l-10 92 q-5 18 -23 18 h-66 q-18 0 -23 -18Z" fill="#ffffff"/>
    <path d="M-66 -46 h132 l-2 14 h-128Z" fill="#7a4a24"/>
    <path d="M-20 8 c-14 -12 -6 -26 6 -20 c12 -6 20 8 6 20 l-6 6Z" fill="#e64980"/>
  </g>`;
}

export interface StickerSvgOptions {
  size?: number;
  /** Community group shown as a watermark, like the group names on forwarded greeting images. */
  watermark?: string;
}

export function stickerSvg(sticker: StickerDef, opts: StickerSvgOptions = {}): string {
  const size = opts.size ?? 512;
  const d = sticker.design;
  const sid = `s-${sticker.id}`;
  const rand = rng(sticker.id);
  const [top, bottom, ...lights] = d.bokeh;

  // Bokeh lights (blurred discs) + tiny sparkles.
  let bokeh = '';
  for (let i = 0; i < 26; i++) {
    const c = lights[i % lights.length];
    bokeh += `<circle cx="${(rand() * 512).toFixed(0)}" cy="${(rand() * 512).toFixed(0)}" r="${(14 + rand() * 52).toFixed(0)}" fill="${c}" opacity="${(0.25 + rand() * 0.45).toFixed(2)}"/>`;
  }
  let sparkles = '';
  for (let i = 0; i < 18; i++)
    sparkles += `<circle cx="${(rand() * 512).toFixed(0)}" cy="${(rand() * 512).toFixed(0)}" r="${(1.5 + rand() * 3).toFixed(1)}" fill="#ffffff" opacity="${(0.5 + rand() * 0.5).toFixed(2)}"/>`;

  // Composition: blurred background blossoms, then the hero blossom with leaves.
  const fx = d.scene === 'kopi' ? 330 : 300;
  const fy = d.flower === 'lotus' ? 360 : 300;
  const heroR = d.flower === 'lotus' ? 170 : d.flower === 'chrysanthemum' || d.flower === 'sunflower' ? 150 : 140;

  const backBlooms =
    `<g filter="url(#${sid}-soft)" opacity=".75">${bloom(`${sid}-b1`, d.flower, 70, 210, 78, 20)}${bloom(`${sid}-b2`, d.flower, 470, 120, 64, 40)}</g>` +
    `<g filter="url(#${sid}-blur)" opacity=".55">${bloom(`${sid}-b3`, d.flower, 90, 470, 90, 5)}</g>`;

  const leaves =
    d.flower === 'lotus'
      ? `<ellipse cx="${fx - 10}" cy="${fy + 40}" rx="200" ry="44" fill="#2b8a3e"/><ellipse cx="${fx - 10}" cy="${fy + 34}" rx="180" ry="34" fill="#40c057"/><path d="M${fx - 10} ${fy + 34} L${fx + 150} ${fy + 20}" stroke="#2b8a3e" stroke-width="3"/>`
      : leaf(fx - 40, fy + 60, 150, 150) + leaf(fx + 40, fy + 70, 140, 30, '#37b24d') + leaf(fx + 10, fy + 90, 120, 95, '#2b8a3e');

  const scene =
    d.scene === 'sunrise'
      ? `<circle cx="256" cy="250" r="150" fill="url(#${sid}-sun)"/><rect x="0" y="330" width="512" height="182" fill="url(#${sid}-water)"/>`
      : '';

  // Text sizing
  const zhSize = Math.min(74, Math.floor(470 / d.zhTitle.length));
  const enSize = Math.min(38, Math.floor(470 / (d.enScript.length * 0.48)));
  const wishSize = Math.min(44, Math.floor(470 / d.zhWish.replace(/\s/g, '').length / 1.08));
  const blessSize = Math.min(52, Math.floor(480 / (d.blessing.length * 0.52)));
  const shadow = `filter="url(#${sid}-shadow)"`;
  const watermark = opts.watermark ?? 'ScamShield Kakis';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}" role="img" aria-label="${esc(sticker.name)} greeting sticker">
<defs>
  <linearGradient id="${sid}-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
  <radialGradient id="${sid}-vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
  <linearGradient id="${sid}-foot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>
  <radialGradient id="${sid}-sun"><stop offset="0" stop-color="#fff9db"/><stop offset=".35" stop-color="#ffe066" stop-opacity=".9"/><stop offset="1" stop-color="#ffa94d" stop-opacity="0"/></radialGradient>
  <linearGradient id="${sid}-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#74c0fc" stop-opacity=".6"/><stop offset="1" stop-color="#1c7ed6" stop-opacity=".85"/></linearGradient>
  <filter id="${sid}-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="${sid}-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.5"/></filter>
  <filter id="${sid}-shadow" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="2" dy="3" stdDeviation="2.4" flood-color="#000" flood-opacity=".7"/></filter>
  <clipPath id="${sid}-clip"><rect width="512" height="512" rx="28"/></clipPath>
</defs>
<g clip-path="url(#${sid}-clip)">
  <rect width="512" height="512" fill="url(#${sid}-bg)"/>
  ${scene}
  <g filter="url(#${sid}-blur)">${bokeh}</g>
  ${backBlooms}
  ${leaves}
  ${bloom(`${sid}-hero`, d.flower, fx, fy, heroR, 8)}
  ${d.scene === 'kopi' ? kopiCup(120, 360) : ''}
  ${sparkles}
  <rect width="512" height="512" fill="url(#${sid}-vig)"/>
  <rect y="380" width="512" height="132" fill="url(#${sid}-foot)"/>

  <text x="500" y="24" text-anchor="end" font-family="${SERIF_FONT}" font-weight="700" font-size="15" fill="#ffffff" ${shadow}>${esc(watermark)}</text>
  <text x="256" y="${(30 + zhSize).toFixed(0)}" text-anchor="middle" font-family="${ZH_FONT}" font-weight="900" font-size="${zhSize}" fill="${d.titleColor ?? '#fff200'}" stroke="#7a3d00" stroke-width="1.5" paint-order="stroke" ${shadow}>${esc(d.zhTitle)}</text>
  <text x="256" y="${(30 + zhSize + enSize + 6).toFixed(0)}" text-anchor="middle" font-family="${SCRIPT_FONT}" font-style="italic" font-weight="700" font-size="${enSize}" fill="${d.scriptColor ?? '#ff2e63'}" stroke="#ffffff" stroke-width="3" paint-order="stroke">${esc(d.enScript)}</text>
  <text x="256" y="300" text-anchor="middle" font-family="${ZH_FONT}" font-weight="900" font-size="${wishSize}" fill="${d.wishColor ?? '#3bdcff'}" stroke="#0b3954" stroke-width="1.5" paint-order="stroke" ${shadow}>${esc(d.zhWish)}</text>
  <text x="256" y="336" text-anchor="middle" font-family="${SERIF_FONT}" font-weight="700" font-size="22" fill="#ffffff" ${shadow}>${esc(d.tip)}</text>
  <text x="256" y="488" text-anchor="middle" font-family="${SERIF_FONT}" font-weight="700" font-size="${blessSize}" fill="#ffffff" ${shadow}>${esc(d.blessing)}</text>
</g>
</svg>`;
}

export function stickerDataUrl(sticker: StickerDef, opts?: StickerSvgOptions): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(stickerSvg(sticker, opts))}`;
}

/** Bilingual message to send along with the sticker. */
export function greetingText(sticker: StickerDef): string {
  return `${sticker.design.zhTitle} ${sticker.design.zhWish}\n${sticker.greeting}`;
}
