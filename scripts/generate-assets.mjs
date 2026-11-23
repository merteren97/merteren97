import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, '..', 'assets');
fs.mkdirSync(ASSETS_DIR, { recursive: true });

// Official AtrisHub geometric mark path (viewBox="394 1205 736 675")
const ATRIS_LOGO_PATH =
  'M8730 2659 l0 -675 -38 -57 c-21 -31 -56 -86 -77 -122 -40 -68 -48 -81 -192 -305 -49 -77 -109 -173 -132 -213 -24 -41 -84 -136 -134 -212 -51 -76 -119 -182 -152 -235 -33 -53 -90 -143 -126 -199 -37 -57 -85 -134 -108 -172 -23 -38 -70 -113 -104 -166 -34 -53 -113 -177 -176 -275 -113 -177 -193 -303 -265 -418 -21 -33 -91 -143 -155 -245 -167 -263 -337 -533 -495 -786 -28 -43 -89 -140 -137 -214 -47 -75 -96 -155 -108 -178 -12 -23 -30 -48 -41 -54 -11 -7 -20 -17 -20 -23 0 -5 -30 -57 -66 -115 -37 -58 -105 -168 -152 -245 -47 -77 -111 -178 -142 -225 -32 -47 -88 -134 -125 -195 -38 -60 -102 -160 -142 -222 -65 -99 -78 -113 -107 -119 -47 -8 -1383 -1 -1392 8 -4 4 4 25 18 45 14 21 60 94 102 163 43 69 87 139 98 155 11 17 71 113 134 215 62 102 145 235 184 295 181 282 326 511 401 635 46 74 124 198 174 275 50 77 115 181 145 230 29 50 83 135 120 190 58 88 174 273 254 405 15 25 59 95 99 156 40 60 86 131 102 158 112 177 363 572 431 678 35 54 71 112 80 130 9 18 67 110 129 203 157 239 210 328 197 333 -6 2 -48 26 -94 54 -46 28 -126 75 -178 103 -235 129 -301 166 -395 220 -155 91 -222 128 -330 184 -55 29 -101 54 -104 57 -2 2 43 26 100 53 57 27 216 103 353 170 137 66 250 121 252 121 2 0 108 51 236 114 128 62 361 175 518 251 440 212 959 464 1235 599 277 136 295 144 313 145 9 1 12 -140 12 -675z m130 -1947 c68 -116 164 -277 214 -357 49 -80 166 -273 261 -430 430 -712 683 -1129 865 -1430 108 -179 231 -381 272 -450 370 -614 472 -784 544 -905 l82 -140 -2410 -3 c-1326 -1 -2413 0 -2415 1 -5 6 450 752 516 847 10 14 26 41 36 60 9 19 63 107 120 195 109 170 451 715 518 827 l40 67 51 -33 c28 -18 92 -54 141 -81 86 -46 597 -335 735 -415 326 -189 665 -378 672 -374 10 6 -102 197 -438 751 -99 164 -270 447 -380 628 -110 182 -207 341 -216 355 -16 24 -14 28 62 145 44 66 113 176 155 245 41 69 106 173 143 231 80 127 149 238 233 377 35 56 65 102 69 102 3 0 61 -96 130 -213z';

const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Cascadia Code', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const THEMES = {
  dark: {
    surfaceTop: '#12151e',
    surfaceBot: '#0c0f16',
    surfaceElevated: '#161a26',
    border: '#232836',
    borderSoft: '#1a1f2c',
    hairline: '#1d2230',
    grid: '#1c2230',
    textPrimary: '#f4f6fb',
    textSecondary: '#94a0b8',
    textMuted: '#636f88',
    badgeBg: '#161b28',
    badgeBorder: '#283044',
    badgeText: '#b8c3d9',
    btnBg: '#11151f',
    btnBorder: '#242b3c',
    btnText: '#e2e8f4',
    btnSub: '#7f8ca6',
    glowOpacity: '0.13',
  },
  light: {
    surfaceTop: '#ffffff',
    surfaceBot: '#f8fafc',
    surfaceElevated: '#f1f5f9',
    border: '#e2e8f0',
    borderSoft: '#edf2f7',
    hairline: '#e8edf5',
    grid: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    badgeBg: '#f1f5f9',
    badgeBorder: '#dbe3ee',
    badgeText: '#334155',
    btnBg: '#ffffff',
    btnBorder: '#d8e0ec',
    btnText: '#0f172a',
    btnSub: '#64748b',
    glowOpacity: '0.09',
  },
};

function esc(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderAtrisLogo({ x, y, width, height, gradId }) {
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="394 1205 736 675" preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0,1559) scale(0.1,-0.1)" fill="url(#${gradId})" stroke="none">
      <path d="${ATRIS_LOGO_PATH}" />
    </g>
  </svg>`;
}

function buildHeroSvg(mode) {
  const t = THEMES[mode];
  const isDark = mode === 'dark';

  const systems = [
    { num: '01', name: 'AtrisAgent', kind: 'AI Orchestrator', color: '#6366f1' },
    { num: '02', name: 'AtrisWork', kind: 'Multi-AI IDE', color: '#10b981' },
    { num: '03', name: 'AtrisChat', kind: 'WebRTC Suite', color: '#38bdf8' },
    { num: '04', name: 'AtrisVoice', kind: 'On-Device STT', color: '#a78bfa' },
  ];

  const indexRows = systems
    .map((sys, i) => {
      const y = 88 + i * 41;
      const sep =
        i < systems.length - 1
          ? `<line x1="652" y1="${y + 16}" x2="848" y2="${y + 16}" stroke="${t.hairline}" stroke-width="1" />`
          : '';
      return `
    <g>
      <text x="652" y="${y}" font-family="${FONT_MONO}" font-size="9.5" fill="${t.textMuted}">${sys.num}</text>
      <circle cx="678" cy="${y - 3.5}" r="2.8" fill="${sys.color}" />
      <text x="688" y="${y}" font-family="${FONT_SANS}" font-size="11.5" font-weight="600" fill="${t.textPrimary}">${esc(sys.name)}</text>
      <text x="848" y="${y}" text-anchor="end" font-family="${FONT_MONO}" font-size="9.5" fill="${t.textMuted}">${esc(sys.kind)}</text>
      ${sep}
    </g>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="270" viewBox="0 0 900 270" fill="none">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.surfaceTop}" />
      <stop offset="100%" stop-color="${t.surfaceBot}" />
    </linearGradient>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#00D2FF" />
    </linearGradient>
    <linearGradient id="top-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366F1" stop-opacity="0" />
      <stop offset="28%" stop-color="#6366F1" stop-opacity="${isDark ? '0.65' : '0.45'}" />
      <stop offset="56%" stop-color="#00D2FF" stop-opacity="${isDark ? '0.75' : '0.50'}" />
      <stop offset="100%" stop-color="#00D2FF" stop-opacity="0" />
    </linearGradient>
    <radialGradient id="ambient-light" cx="28%" cy="0%" r="72%">
      <stop offset="0%" stop-color="#5865F2" stop-opacity="${t.glowOpacity}" />
      <stop offset="55%" stop-color="#00D2FF" stop-opacity="${isDark ? '0.04' : '0.03'}" />
      <stop offset="100%" stop-color="#00D2FF" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="emblem-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#5865F2" stop-opacity="${isDark ? '0.22' : '0.12'}" />
      <stop offset="100%" stop-color="#00D2FF" stop-opacity="0" />
    </radialGradient>
    <pattern id="arch-grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="${t.grid}" stroke-width="0.6" stroke-opacity="${isDark ? '0.45' : '0.7'}" />
    </pattern>
    <radialGradient id="grid-fade" cx="65%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <mask id="grid-mask">
      <rect width="900" height="270" fill="url(#grid-fade)" />
    </mask>
    <clipPath id="hero-clip">
      <rect x="0.75" y="0.75" width="898.5" height="268.5" rx="16" />
    </clipPath>
  </defs>

  <style>
    .orbit { transform-origin: 546px 135px; animation: spin 42s linear infinite; }
    .pulse { animation: breathe 3s ease-in-out infinite; }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes breathe {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  </style>

  <g clip-path="url(#hero-clip)">
    <rect x="0.75" y="0.75" width="898.5" height="268.5" rx="16" fill="url(#bg)" />
    <rect x="0" y="0" width="900" height="270" fill="url(#arch-grid)" mask="url(#grid-mask)" />
    <rect x="0" y="0" width="900" height="270" fill="url(#ambient-light)" />
    <!-- Whisper-thin top specular accent -->
    <rect x="0" y="0.75" width="900" height="1.5" fill="url(#top-sheen)" />
  </g>

  <rect x="0.75" y="0.75" width="898.5" height="268.5" rx="16" stroke="${t.border}" stroke-width="1" />

  <!-- LEFT EDITORIAL COLUMN -->
  <circle cx="42" cy="40" r="3.2" fill="#10B981" class="pulse" />
  <text x="54" y="43.5" font-family="${FONT_MONO}" font-size="10.5" font-weight="600" letter-spacing="1.4" fill="${t.textMuted}">ATRISHUB · SYSTEMS &amp; AI ARCHITECTURE</text>

  <text x="38" y="102" font-family="${FONT_SANS}" font-size="40" font-weight="700" letter-spacing="-1.1" fill="${t.textPrimary}">E. Mert Eren</text>

  <text x="38" y="132" font-family="${FONT_SANS}" font-size="15.5" font-weight="600" fill="url(#brand)">Software Engineer &amp; Systems Architect</text>

  <text x="38" y="164" font-family="${FONT_SANS}" font-size="13.5" fill="${t.textSecondary}">Architecting local-first AI developer workspaces, real-time WebRTC</text>
  <text x="38" y="185" font-family="${FONT_SANS}" font-size="13.5" fill="${t.textSecondary}">platforms, and autonomous engineering tools in Rust, TypeScript &amp; Tauri.</text>

  <!-- Subtle bottom metadata line -->
  <line x1="38" y1="214" x2="452" y2="214" stroke="${t.hairline}" stroke-width="1" />
  <text x="38" y="238" font-family="${FONT_MONO}" font-size="10.5" fill="${t.textMuted}">ISTANBUL, TR</text>
  <text x="128" y="238" font-family="${FONT_MONO}" font-size="10.5" fill="${t.border}">/</text>
  <text x="144" y="238" font-family="${FONT_MONO}" font-size="10.5" fill="${t.textMuted}">SINCE 2008</text>
  <text x="224" y="238" font-family="${FONT_MONO}" font-size="10.5" fill="${t.border}">/</text>
  <text x="240" y="238" font-family="${FONT_MONO}" font-size="10.5" font-weight="600" fill="${t.textSecondary}">ATRISHUB.COM</text>

  <!-- CENTER-RIGHT SCULPTURAL ATRIS MEDALLION -->
  <g>
    <circle cx="546" cy="135" r="78" fill="url(#emblem-glow)" />
    <circle cx="546" cy="135" r="56" stroke="${t.border}" stroke-width="1" stroke-dasharray="2 6" class="orbit" />
    <circle cx="546" cy="135" r="41" fill="${t.surfaceElevated}" stroke="${t.border}" stroke-width="1" />
    <!-- Subtle geometric crosshair ticks -->
    <line x1="546" y1="68" x2="546" y2="75" stroke="${t.textMuted}" stroke-opacity="0.45" stroke-width="1" />
    <line x1="546" y1="195" x2="546" y2="202" stroke="${t.textMuted}" stroke-opacity="0.45" stroke-width="1" />
    <line x1="479" y1="135" x2="486" y2="135" stroke="${t.textMuted}" stroke-opacity="0.45" stroke-width="1" />
    <line x1="606" y1="135" x2="613" y2="135" stroke="${t.textMuted}" stroke-opacity="0.45" stroke-width="1" />
    ${renderAtrisLogo({ x: 525, y: 116, width: 42, height: 39, gradId: 'brand' })}
  </g>

  <!-- Vertical divider -->
  <line x1="628" y1="34" x2="628" y2="236" stroke="${t.hairline}" stroke-width="1" />

  <!-- RIGHT ARCHITECTURAL SYSTEM INDEX -->
  <text x="652" y="44" font-family="${FONT_MONO}" font-size="9.5" font-weight="600" letter-spacing="1.2" fill="${t.textMuted}">ACTIVE ECOSYSTEM</text>
  <text x="848" y="44" text-anchor="end" font-family="${FONT_MONO}" font-size="9.5" fill="${t.textMuted}">04 SYSTEMS</text>
  <line x1="652" y1="54" x2="848" y2="54" stroke="${t.hairline}" stroke-width="1" />
  ${indexRows}
</svg>
`;
}

// Custom ultra-minimal hairline pill buttons (replaces noisy shields.io badges)
function buildConnectButtonSvg({ label, value, iconPath, accent, dividerX, width }, mode) {
  const t = THEMES[mode];
  const h = 34;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}" viewBox="0 0 ${width} ${h}" fill="none">
  <rect x="0.75" y="0.75" width="${width - 1.5}" height="${h - 1.5}" rx="9" fill="${t.btnBg}" stroke="${t.btnBorder}" stroke-width="1" />
  <g transform="translate(13, 9.5)" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none">
    ${iconPath}
  </g>
  <text x="35" y="21" font-family="${FONT_SANS}" font-size="11.5" font-weight="600" fill="${t.btnSub}">${esc(label)}</text>
  <line x1="${dividerX}" y1="10" x2="${dividerX}" y2="24" stroke="${t.hairline}" stroke-width="1" />
  <text x="${dividerX + 11}" y="21" font-family="${FONT_MONO}" font-size="11" font-weight="500" fill="${t.btnText}">${esc(value)}</text>
</svg>
`;
}

const CONNECT_BUTTONS = [
  {
    id: 'btn-website',
    label: 'Web',
    value: 'atrishub.com ↗',
    accent: '#6366F1',
    dividerX: 69,
    width: 186,
    iconPath:
      '<circle cx="7.5" cy="7.5" r="6" /><line x1="1.5" y1="7.5" x2="13.5" y2="7.5" /><path d="M7.5 1.5a9.5 9.5 0 0 1 2.4 6 9.5 9.5 0 0 1-2.4 6 9.5 9.5 0 0 1-2.4-6 9.5 9.5 0 0 1 2.4-6z" />',
  },
  {
    id: 'btn-linkedin',
    label: 'LinkedIn',
    value: 'E. Mert Eren ↗',
    accent: '#38BDF8',
    dividerX: 92,
    width: 210,
    iconPath:
      '<rect x="1.5" y="1.5" width="12" height="12" rx="2.2" /><line x1="4.8" y1="6.5" x2="4.8" y2="10.5" /><circle cx="4.8" cy="4.4" r="0.6" fill="#38BDF8" /><path d="M7.8 10.5V7.9c0-1 .7-1.6 1.5-1.6s1.4.6 1.4 1.6v2.6" />',
  },
  {
    id: 'btn-email',
    label: 'Email',
    value: 'merteren1997@gmail.com',
    accent: '#10B981',
    dividerX: 76,
    width: 248,
    iconPath:
      '<rect x="1.5" y="2.8" width="12" height="9.4" rx="1.8" /><path d="M2.2 3.8l5.3 4 5.3-4" />',
  },
];

const STANDARD_CARDS = [
  {
    id: 'atrisagent',
    name: 'AtrisAgent',
    badge: 'Open Source',
    badgeColorDark: '#818cf8',
    badgeColorLight: '#4f46e5',
    accentStart: '#6366F1',
    accentEnd: '#38BDF8',
    desc1: 'Mission-driven orchestrator for Codex CLI, Claude Code,',
    desc2: 'Antigravity & OpenCode across isolated Git worktrees.',
    stack: 'TypeScript · Next.js · Rust · Tauri v2',
    cta: 'github.com ↗',
  },
  {
    id: 'atriswork',
    name: 'AtrisWork',
    badge: 'AtrisHub',
    badgeColorDark: '#34d399',
    badgeColorLight: '#059669',
    accentStart: '#10B981',
    accentEnd: '#06B6D4',
    desc1: 'Multi-AI terminal IDE running parallel CLI & shell PTY',
    desc2: 'sessions in a dynamic split-grid workspace with alerts.',
    stack: 'TypeScript · Rust · Tauri v2 · PTY',
    cta: 'work.atrishub.com ↗',
  },
  {
    id: 'atrischat',
    name: 'AtrisChat',
    badge: 'AtrisHub',
    badgeColorDark: '#38bdf8',
    badgeColorLight: '#0284c7',
    accentStart: '#38BDF8',
    accentEnd: '#6366F1',
    desc1: 'Real-time team communication combining Markdown code',
    desc2: 'messaging, low-latency WebRTC voice & 60 FPS screenshare.',
    stack: 'Next.js · LiveKit · WebRTC · PostgreSQL',
    cta: 'chat.atrishub.com ↗',
  },
  {
    id: 'atrisvoice',
    name: 'AtrisVoice',
    badge: 'AtrisHub',
    badgeColorDark: '#a78bfa',
    badgeColorLight: '#7c3aed',
    accentStart: '#8B5CF6',
    accentEnd: '#00D2FF',
    desc1: '100% on-device Whisper AI speech-to-text with auto',
    desc2: 'language detection and global hotkey editor injection.',
    stack: 'Rust · Tauri v2 · Whisper AI · CUDA',
    cta: 'voice.atrishub.com ↗',
  },
];

function buildStandardCardSvg(card, mode) {
  const t = THEMES[mode];
  const isDark = mode === 'dark';
  const w = 440;
  const h = 166;
  const badgeColor = isDark ? card.badgeColorDark : card.badgeColorLight;
  const badgeW = card.badge.length * 6.5 + 18;
  const badgeX = w - 22 - badgeW;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <defs>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${card.accentStart}" />
      <stop offset="100%" stop-color="${card.accentEnd}" />
    </linearGradient>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.surfaceTop}" />
      <stop offset="100%" stop-color="${t.surfaceBot}" />
    </linearGradient>
    <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${card.accentStart}" stop-opacity="0" />
      <stop offset="25%" stop-color="${card.accentStart}" stop-opacity="${isDark ? '0.55' : '0.35'}" />
      <stop offset="70%" stop-color="${card.accentEnd}" stop-opacity="0" />
    </linearGradient>
    <radialGradient id="wash" cx="12%" cy="0%" r="65%">
      <stop offset="0%" stop-color="${card.accentStart}" stop-opacity="${isDark ? '0.09' : '0.05'}" />
      <stop offset="100%" stop-color="${card.accentStart}" stop-opacity="0" />
    </radialGradient>
    <clipPath id="clip">
      <rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="14" />
    </clipPath>
  </defs>

  <g clip-path="url(#clip)">
    <rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="14" fill="url(#bg)" />
    <rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" fill="url(#wash)" />
    <rect x="0.75" y="0.75" width="${w - 1.5}" height="1.25" fill="url(#sheen)" />
  </g>
  <rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="14" stroke="${t.border}" stroke-width="1" />

  <!-- Icon -->
  <rect x="22" y="20" width="34" height="34" rx="9" fill="${t.surfaceElevated}" stroke="${t.border}" stroke-width="1" />
  ${renderAtrisLogo({ x: 28.5, y: 27, width: 21, height: 19.5, gradId: 'accent' })}

  <!-- Title -->
  <text x="68" y="43" font-family="${FONT_SANS}" font-size="18" font-weight="700" letter-spacing="-0.3" fill="${t.textPrimary}">${esc(card.name)}</text>

  <!-- Restrained badge -->
  <rect x="${badgeX.toFixed(1)}" y="26" width="${badgeW.toFixed(1)}" height="22" rx="11" fill="${t.badgeBg}" stroke="${t.badgeBorder}" stroke-width="1" />
  <text x="${(badgeX + badgeW / 2).toFixed(1)}" y="40.5" text-anchor="middle" font-family="${FONT_MONO}" font-size="9.5" font-weight="600" fill="${badgeColor}">${esc(card.badge)}</text>

  <!-- Clean description -->
  <text x="22" y="80" font-family="${FONT_SANS}" font-size="12.8" fill="${t.textSecondary}">${esc(card.desc1)}</text>
  <text x="22" y="100" font-family="${FONT_SANS}" font-size="12.8" fill="${t.textSecondary}">${esc(card.desc2)}</text>

  <!-- Subtle bottom divider + typographic stack & link -->
  <line x1="22" y1="124" x2="${w - 22}" y2="124" stroke="${t.hairline}" stroke-width="1" />
  <text x="22" y="146" font-family="${FONT_MONO}" font-size="10.2" fill="${t.textMuted}">${esc(card.stack)}</text>
  <text x="${w - 22}" y="146" text-anchor="end" font-family="${FONT_SANS}" font-size="11" font-weight="600" fill="${badgeColor}">${esc(card.cta)}</text>
</svg>
`;
}

// Generate all dark + light assets
for (const mode of ['dark', 'light']) {
  fs.writeFileSync(path.join(ASSETS_DIR, `hero-${mode}.svg`), buildHeroSvg(mode), 'utf8');
  for (const btn of CONNECT_BUTTONS) {
    fs.writeFileSync(
      path.join(ASSETS_DIR, `${btn.id}-${mode}.svg`),
      buildConnectButtonSvg(btn, mode),
      'utf8'
    );
  }
  for (const card of STANDARD_CARDS) {
    fs.writeFileSync(
      path.join(ASSETS_DIR, `card-${card.id}-${mode}.svg`),
      buildStandardCardSvg(card, mode),
      'utf8'
    );
  }
}

console.log('Generated refined v2 Atris AI ecosystem SVG assets.');
