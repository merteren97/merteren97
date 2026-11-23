import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, '..', 'assets');
fs.mkdirSync(ASSETS_DIR, { recursive: true });

const USERNAME = process.env.GITHUB_USERNAME || 'merteren97';
const TOKEN = process.env.PROFILE_STATS_TOKEN || process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.error('Missing GITHUB_TOKEN or PROFILE_STATS_TOKEN environment variable.');
  process.exit(1);
}

const FONT_SANS = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Cascadia Code', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const EXCLUDED_LANGUAGES = new Set([
  'HTML',
  'CSS',
  'SCSS',
  'Less',
  'Shell',
  'PowerShell',
  'Batchfile',
  'Dockerfile',
  'Makefile',
  'NSIS',
]);

const QUERY = `
query($login: String!) {
  user(login: $login) {
    name
    login
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes {
        name
        isPrivate
        stargazerCount
        languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoryContributions
      contributionCalendar {
        totalContributions
      }
    }
  }
}
`;

async function fetchStats() {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'merteren97-profile-stats',
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } }),
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL error: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`GitHub GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  const user = json.data.user;
  const repos = user.repositories.nodes || [];
  const cc = user.contributionsCollection;

  const langTotals = new Map();
  let totalStars = 0;

  for (const repo of repos) {
    totalStars += repo.stargazerCount || 0;
    for (const edge of repo.languages?.edges || []) {
      const name = edge.node?.name;
      if (!name || EXCLUDED_LANGUAGES.has(name)) continue;
      const prev = langTotals.get(name) || { name, color: edge.node.color || '#6366F1', size: 0 };
      prev.size += edge.size || 0;
      langTotals.set(name, prev);
    }
  }

  const sortedLangs = [...langTotals.values()].sort((a, b) => b.size - a.size).slice(0, 6);
  const topTotalBytes = sortedLangs.reduce((acc, l) => acc + l.size, 0) || 1;
  const languages = sortedLangs.map((l) => ({
    ...l,
    pct: (l.size / topTotalBytes) * 100,
  }));

  const totalContributions = cc.contributionCalendar?.totalContributions || 0;
  const totalCommitsAndPRs =
    (cc.totalCommitContributions || 0) +
    (cc.restrictedContributionsCount || 0) +
    (cc.totalPullRequestContributions || 0);

  return {
    totalRepos: user.repositories.totalCount || repos.length,
    totalContributions,
    totalCommitsAndPRs,
    totalPRs: cc.totalPullRequestContributions || 0,
    totalStars,
    languages,
    syncedDate: new Date().toISOString().slice(0, 10),
  };
}

const THEMES = {
  dark: {
    surfaceTop: '#12151e',
    surfaceBot: '#0c0f16',
    border: '#232836',
    hairline: '#1d2230',
    textPrimary: '#f4f6fb',
    textSecondary: '#94a0b8',
    textMuted: '#636f88',
    barTrack: '#1b202e',
  },
  light: {
    surfaceTop: '#ffffff',
    surfaceBot: '#f8fafc',
    border: '#e2e8f0',
    hairline: '#e8edf5',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    barTrack: '#e2e8f0',
  },
};

function fmtNum(n) {
  return new Intl.NumberFormat('en-US').format(n);
}

function esc(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function buildStatsSvg(stats, mode) {
  const t = THEMES[mode];
  const isDark = mode === 'dark';
  const w = 900;
  const h = 212;

  const metrics = [
    { label: 'CONTRIBUTIONS (1Y)', value: fmtNum(stats.totalContributions), sub: 'Rolling 12 months', accent: true },
    { label: 'REPOSITORIES', value: fmtNum(stats.totalRepos), sub: 'Owned codebases', accent: false },
    { label: 'COMMITS & PRs', value: fmtNum(stats.totalCommitsAndPRs), sub: `${fmtNum(stats.totalPRs)} pull requests`, accent: false },
    { label: 'BUILDING SINCE', value: '2008', sub: '18+ years', accent: false },
  ];

  // Open editorial crosshair grid (no heavy nested boxes!)
  const metricMarkup = metrics
    .map((m, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 30 + col * 206;
      const y = 62 + row * 62;
      return `
  <g>
    <text x="${x}" y="${y}" font-family="${FONT_MONO}" font-size="9" font-weight="600" letter-spacing="0.9" fill="${t.textMuted}">${esc(m.label)}</text>
    <text x="${x}" y="${y + 28}" font-family="${FONT_SANS}" font-size="24" font-weight="700" letter-spacing="-0.6" fill="${m.accent ? 'url(#brand)' : t.textPrimary}">${esc(m.value)}</text>
    <text x="${x + 178}" y="${y + 27}" text-anchor="end" font-family="${FONT_SANS}" font-size="10" fill="${t.textMuted}">${esc(m.sub)}</text>
  </g>`;
    })
    .join('');

  // Sleek 6px segmented bar
  const barX = 478;
  const barY = 58;
  const barW = 392;
  const barH = 6;
  let segX = barX;
  const barSegments = stats.languages
    .map((lang) => {
      const segW = Math.max(4, (lang.pct / 100) * barW);
      const rect = `<rect x="${segX.toFixed(1)}" y="${barY}" width="${segW.toFixed(1)}" height="${barH}" fill="${lang.color}" />`;
      segX += segW;
      return rect;
    })
    .join('\n      ');

  const langRows = stats.languages
    .map((lang, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 478 + col * 202;
      const y = 94 + row * 31;
      return `
  <g>
    <circle cx="${x + 4}" cy="${y - 3.5}" r="3.5" fill="${lang.color}" />
    <text x="${x + 15}" y="${y}" font-family="${FONT_SANS}" font-size="12" font-weight="600" fill="${t.textPrimary}">${esc(lang.name)}</text>
    <text x="${x + 188}" y="${y}" text-anchor="end" font-family="${FONT_MONO}" font-size="11" fill="${t.textSecondary}">${lang.pct.toFixed(1)}%</text>
    <rect x="${x}" y="${y + 6.5}" width="188" height="2" rx="1" fill="${t.barTrack}" />
    <rect x="${x}" y="${y + 6.5}" width="${Math.max(4, (lang.pct / 100) * 188).toFixed(1)}" height="2" rx="1" fill="${lang.color}" />
  </g>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.surfaceTop}" />
      <stop offset="100%" stop-color="${t.surfaceBot}" />
    </linearGradient>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#00D2FF" />
    </linearGradient>
    <clipPath id="bar-clip">
      <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="3" />
    </clipPath>
  </defs>

  <style>
    .live-dot { animation: blink 2.6s ease-in-out infinite; }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }
  </style>

  <rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="14" fill="url(#bg)" stroke="${t.border}" stroke-width="1" />

  <!-- Left header -->
  <circle cx="34" cy="30" r="3" fill="#10B981" class="live-dot" />
  <text x="45" y="33.5" font-family="${FONT_MONO}" font-size="10" font-weight="600" letter-spacing="1.2" fill="${t.textMuted}">GITHUB TELEMETRY</text>

  <!-- Open editorial crosshair dividers inside KPI zone -->
  <line x1="222" y1="54" x2="222" y2="160" stroke="${t.hairline}" stroke-width="1" />
  <line x1="30" y1="108" x2="424" y2="108" stroke="${t.hairline}" stroke-width="1" />
  ${metricMarkup}

  <!-- Center panel divider -->
  <line x1="450" y1="22" x2="450" y2="168" stroke="${t.hairline}" stroke-width="1" />

  <!-- Right header -->
  <text x="478" y="33.5" font-family="${FONT_MONO}" font-size="10" font-weight="600" letter-spacing="1.2" fill="${t.textMuted}">CODE FOOTPRINT</text>
  <text x="870" y="33.5" text-anchor="end" font-family="${FONT_MONO}" font-size="9.5" fill="${t.textMuted}">TOP 6 LANGUAGES</text>

  <!-- Sleek 6px segmented bar -->
  <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="3" fill="${t.barTrack}" />
  <g clip-path="url(#bar-clip)">
    ${barSegments}
  </g>

  ${langRows}

  <!-- Bottom footer hairline -->
  <line x1="26" y1="176" x2="${w - 26}" y2="176" stroke="${t.hairline}" stroke-width="1" />
  <text x="30" y="196" font-family="${FONT_MONO}" font-size="9.5" fill="${t.textMuted}">Synced daily via GitHub Actions · ${esc(stats.syncedDate)} UTC</text>
  <text x="870" y="196" text-anchor="end" font-family="${FONT_MONO}" font-size="9.5" fill="${isDark ? '#94a0b8' : '#475569'}">@${esc(USERNAME)}</text>
</svg>
`;
}

const stats = await fetchStats();
fs.writeFileSync(path.join(ASSETS_DIR, 'stats-dark.svg'), buildStatsSvg(stats, 'dark'), 'utf8');
fs.writeFileSync(path.join(ASSETS_DIR, 'stats-light.svg'), buildStatsSvg(stats, 'light'), 'utf8');
console.log('Generated refined v2 live telemetry SVGs.');
