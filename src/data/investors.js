import { TOP_HOLDERS } from './holders';
import { COMPANY } from './company';
import { slugify } from '../utils/slug';

// Generate a 12-month synthetic capital % history given a current value and trend.
// Deterministic so identical input → identical output.
function generateHistory(current, trend) {
  if (trend === 'up') {
    const start = +(current * 0.85).toFixed(2);
    return Array.from({ length: 12 }, (_, i) =>
      +(start + (current - start) * (i / 11)).toFixed(2)
    );
  }
  if (trend === 'down') {
    const start = +(current * 1.15).toFixed(2);
    return Array.from({ length: 12 }, (_, i) =>
      +(start + (current - start) * (i / 11)).toFixed(2)
    );
  }
  // flat: tiny zigzag around current
  const wiggle = [0, 0.01, -0.01, 0.01, 0, -0.01, 0.01, 0, 0.01, -0.01, 0, 0];
  return wiggle.map((d) => +(current + d).toFixed(2));
}

// Per-investor narrative metadata. Capital/votes/type come from TOP_HOLDERS.
const PROFILES = {
  'richard-brannemark': {
    role: 'CEO & Founder',
    bio: 'Founder and CEO of Integrum AB. Co-developed the OPRA implant technology that defines the company\u2019s commercial portfolio. Largest single holder by both capital and votes.',
    tags: ['Insider', 'Founder', 'Long-term'],
    location: 'Gothenburg, Sweden',
    aum: null,
    lastContact: '2026-04-08',
    transactions: [
      { date: '2026-01-20', type: 'Disposal', shares: -5000, price: 15.50 },
    ],
    notes:
      'Direct shareholder; not subject to lock-up. Holdings unchanged for six quarters apart from a small estate-planning disposal in January 2026. Highly engaged in IR; attends every earnings call.',
  },
  'aviva-perfusion-as': {
    role: 'Strategic Investor',
    bio: 'Norwegian medtech holding company with concentrated positions in orthopedic and reconstructive specialists across the Nordics. Acquired its INTEG B stake in 2019.',
    tags: ['Strategic', 'Long-term', 'Reducing'],
    location: 'Oslo, Norway',
    aum: '€840M',
    lastContact: '2026-03-12',
    transactions: [
      { date: '2026-03-31', type: 'Disposal', shares: -21204, price: 15.85 },
      { date: '2026-02-18', type: 'Disposal', shares: -8500, price: 15.10 },
    ],
    notes:
      'Has been quietly trimming over the past two quarters. CIO indicated portfolio rebalancing rather than thesis change in the March meeting. Watch for further reductions.',
  },
  'nordea-investment-funds': {
    role: 'Asset Manager',
    bio: 'Asset management arm of Nordea Bank, the largest financial services group in the Nordics. Runs broad Nordic small-cap and healthcare strategies that hold INTEG B.',
    tags: ['Institutional', 'Active', 'Buying'],
    location: 'Stockholm, Sweden',
    aum: '€280B',
    lastContact: '2026-04-02',
    transactions: [
      { date: '2026-04-01', type: 'Acquisition', shares: 45000, price: 16.05 },
      { date: '2026-02-20', type: 'Acquisition', shares: 12000, price: 14.90 },
    ],
    notes:
      'PM Sofia Lindberg is constructive on the OPRA pipeline. Recently increased target weight in the Nordic Healthcare fund. Strong long-term conviction.',
  },
  'seb-life-international': {
    role: 'Insurance Holder',
    bio: 'Cross-border life insurance arm of SEB Group, holding equities on behalf of unit-linked policyholders across Europe.',
    tags: ['Institutional', 'Passive', 'Stable'],
    location: 'Luxembourg',
    aum: '€42B',
    lastContact: '2025-11-14',
    transactions: [],
    notes:
      'Holdings driven primarily by underlying fund mandates. Low engagement; no direct contact in past 6 months.',
  },
  'handelsbanken-fonder': {
    role: 'Asset Manager',
    bio: 'Fund management subsidiary of Svenska Handelsbanken. Operates Sweden\u2019s largest small-cap mutual fund.',
    tags: ['Institutional', 'Active', 'Buying'],
    location: 'Stockholm, Sweden',
    aum: '€85B',
    lastContact: '2026-03-25',
    transactions: [
      { date: '2026-03-22', type: 'Acquisition', shares: 18500, price: 15.40 },
    ],
    notes:
      'Added to position after Q4 2025 results. PM team views the OPRA US pivot favorably.',
  },
  'al-rajhi-capital': {
    role: 'Asset Manager',
    bio: 'Investment arm of Al Rajhi Bank, one of the largest Sharia-compliant financial institutions globally. Holds INTEG B in its Global Healthcare strategy.',
    tags: ['Institutional', 'Sharia', 'Reducing'],
    location: 'Riyadh, Saudi Arabia',
    aum: '$15B',
    lastContact: '2026-01-08',
    transactions: [
      { date: '2026-03-15', type: 'Disposal', shares: -15800, price: 15.60 },
    ],
    notes:
      'Trimming exposure as part of a broader Nordic underweight rotation. Limited two-way dialog historically.',
  },
  'fjarde-ap-fonden': {
    role: 'Pension Fund',
    bio: 'Fjärde AP-fonden (AP4) is one of five buffer funds in the Swedish national pension system. Manages capital for current and future pensioners.',
    tags: ['Pension', 'Long-term', 'ESG'],
    location: 'Stockholm, Sweden',
    aum: '€48B',
    lastContact: '2026-03-30',
    transactions: [
      { date: '2026-03-28', type: 'Acquisition', shares: 12000, price: 15.75 },
    ],
    notes:
      'Holds INTEG B in the Swedish Equity bucket. ESG team commented positively on the lifecycle assessment work in our 2025 sustainability report.',
  },
  'danske-bank-as': {
    role: 'Asset Manager',
    bio: 'Asset management division of Danske Bank, Denmark\u2019s largest bank, managing both retail funds and institutional mandates across the Nordics.',
    tags: ['Institutional', 'Passive', 'Stable'],
    location: 'Copenhagen, Denmark',
    aum: '€110B',
    lastContact: '2025-12-19',
    transactions: [],
    notes: 'Index-driven holding via the Nordic Small Cap mandate.',
  },
  'invesco-ltd': {
    role: 'Asset Manager',
    bio: 'Global independent investment manager. Holds INTEG B across several thematic small-cap funds, primarily its International Discovery strategy.',
    tags: ['Institutional', 'Active', 'Buying'],
    location: 'Atlanta, USA',
    aum: '$1.6T',
    lastContact: '2026-02-05',
    transactions: [
      { date: '2026-04-03', type: 'Acquisition', shares: 32100, price: 16.10 },
    ],
    notes:
      'Recently initiated coverage by US analyst team. Looking for an additional NDR slot in May before earnings.',
  },
  'goteborgs-universitet': {
    role: 'Endowment',
    bio: 'University of Gothenburg endowment fund. Maintains a small Swedish equity sleeve with a focus on local research-linked companies.',
    tags: ['Endowment', 'Local', 'Reducing'],
    location: 'Gothenburg, Sweden',
    aum: '€420M',
    lastContact: '2025-09-10',
    transactions: [
      { date: '2026-02-28', type: 'Disposal', shares: -8400, price: 14.75 },
    ],
    notes:
      'Historic position from the early commercialization phase. Slowly reducing as part of routine rebalancing.',
  },
  'lansforsakringar-fondforvaltning': {
    role: 'Asset Manager',
    bio: 'Mutual fund arm of the Länsförsäkringar group, Sweden\u2019s largest customer-owned insurance and banking cooperative.',
    tags: ['Institutional', 'Passive'],
    location: 'Stockholm, Sweden',
    aum: '€36B',
    lastContact: '2025-10-22',
    transactions: [],
    notes: 'Holds via the Sverige Aktiv fund. Low contact frequency.',
  },
  'carnegie-fonder': {
    role: 'Asset Manager',
    bio: 'Independent Stockholm-based asset manager focused on Nordic equities and credit. Long-only, fundamental approach.',
    tags: ['Institutional', 'Active', 'Stable'],
    location: 'Stockholm, Sweden',
    aum: '€10B',
    lastContact: '2026-02-14',
    transactions: [],
    notes: 'PM Henrik Söderberg holds the position in the Carnegie Småbolag fund.',
  },
  'ohman-fonder': {
    role: 'Asset Manager',
    bio: 'Family-owned Swedish asset manager with a heritage in Nordic equities and a stated ESG focus.',
    tags: ['Institutional', 'Active', 'Buying'],
    location: 'Stockholm, Sweden',
    aum: '€11B',
    lastContact: '2026-03-19',
    transactions: [
      { date: '2026-03-15', type: 'Acquisition', shares: 4200, price: 15.30 },
    ],
    notes: 'Quiet accumulator over the past two quarters via the Nordic Equity fund.',
  },
  'dnb-asset-management': {
    role: 'Asset Manager',
    bio: 'Asset management arm of DNB ASA, Norway\u2019s largest financial services group. Active in Nordic and Global mandates.',
    tags: ['Institutional', 'Active', 'Reducing'],
    location: 'Oslo, Norway',
    aum: '€80B',
    lastContact: '2025-12-04',
    transactions: [],
    notes: 'Trimmed marginally during the Q4 2025 sector rotation. Still in the position.',
  },
  'aberdeen-standard-investments': {
    role: 'Asset Manager',
    bio: 'Global asset manager (now abrdn) with deep expertise in international small caps and emerging healthcare.',
    tags: ['Institutional', 'Active', 'Buying'],
    location: 'London, United Kingdom',
    aum: '$640B',
    lastContact: '2026-04-01',
    transactions: [
      { date: '2026-03-25', type: 'Acquisition', shares: 8200, price: 15.55 },
    ],
    notes: 'New entrant to the top 25 this quarter. Initiated via the World Smaller Companies fund.',
  },
  'vanguard-group': {
    role: 'Asset Manager',
    bio: 'World\u2019s largest mutual fund and ETF provider. Holds INTEG B passively via index strategies tracking the FTSE Global Small Cap index.',
    tags: ['Institutional', 'Passive', 'Index'],
    location: 'Valley Forge, USA',
    aum: '$9.3T',
    lastContact: null,
    transactions: [],
    notes: 'Pure index holding. No direct dialog channel.',
  },
  'dimensional-fund-advisors': {
    role: 'Asset Manager',
    bio: 'Quantitative investment manager applying academic factor research, primarily small-cap value and profitability tilts.',
    tags: ['Institutional', 'Quant', 'Stable'],
    location: 'Austin, USA',
    aum: '$700B',
    lastContact: null,
    transactions: [],
    notes: 'Systematic holder. Position changes are model-driven; no IR meetings scheduled.',
  },
  'erik-lundstrom': {
    role: 'Board Member',
    bio: 'Independent board member of Integrum AB since 2021. Background in surgical robotics and medical device commercialization.',
    tags: ['Insider', 'Board', 'Buying'],
    location: 'Stockholm, Sweden',
    aum: null,
    lastContact: '2026-04-05',
    transactions: [
      { date: '2026-03-28', type: 'Acquisition', shares: 2500, price: 15.20 },
    ],
    notes: 'Most recent insider buyer. Filed a PDMR notification on March 28.',
  },
  'swedbank-robur-fonder': {
    role: 'Asset Manager',
    bio: 'Mutual fund subsidiary of Swedbank, one of the largest savings managers in Sweden.',
    tags: ['Institutional', 'Active', 'Reducing'],
    location: 'Stockholm, Sweden',
    aum: '€110B',
    lastContact: '2025-11-30',
    transactions: [
      { date: '2026-03-08', type: 'Disposal', shares: -5600, price: 14.90 },
    ],
    notes: 'Trimming via the Småbolagsfond Norden product. PM team is neutral.',
  },
  'nordnet-pensionsforsakring': {
    role: 'Pension Provider',
    bio: 'Insurance arm of Nordnet, the Nordic digital broker. Holds INTEG B on behalf of unit-linked retirement clients.',
    tags: ['Pension', 'Passive'],
    location: 'Stockholm, Sweden',
    aum: '€18B',
    lastContact: null,
    transactions: [],
    notes: 'Aggregated retail pension exposure. No direct IR channel.',
  },
  'alecta-pensionsforsakring': {
    role: 'Pension Fund',
    bio: 'Largest occupational pension fund in Sweden, managing retirement capital for 2.6M private-sector employees.',
    tags: ['Pension', 'Long-term', 'Stable'],
    location: 'Stockholm, Sweden',
    aum: '€115B',
    lastContact: '2025-10-08',
    transactions: [],
    notes: 'Long-standing core holding. Engagement focused on governance and ESG.',
  },
  'goldman-sachs-am': {
    role: 'Asset Manager',
    bio: 'Asset management division of Goldman Sachs. INTEG B sits within its International Equity Insights small-cap product.',
    tags: ['Institutional', 'Quant', 'Buying'],
    location: 'New York, USA',
    aum: '$2.7T',
    lastContact: '2026-03-02',
    transactions: [
      { date: '2026-02-22', type: 'Acquisition', shares: 6200, price: 14.95 },
    ],
    notes: 'New entrant in the top 25. Quant-driven entry but open to fundamental dialog.',
  },
  'berenberg-bank': {
    role: 'Private Bank',
    bio: 'Hamburg-based private and investment bank with a focused European small/mid-cap research franchise.',
    tags: ['Institutional', 'Active', 'Stable'],
    location: 'Hamburg, Germany',
    aum: '€36B',
    lastContact: '2026-01-22',
    transactions: [],
    notes: 'Sell-side coverage by Berenberg as well; held in the European Smaller Companies strategy.',
  },
  'avanza-pension': {
    role: 'Pension Provider',
    bio: 'Insurance arm of Avanza, the Nordic retail brokerage platform. Holds INTEG B on behalf of unit-linked retirement clients.',
    tags: ['Pension', 'Passive', 'Buying'],
    location: 'Stockholm, Sweden',
    aum: '€22B',
    lastContact: null,
    transactions: [],
    notes: 'Aggregated retail pension exposure. Mirror of underlying client interest.',
  },
  'state-street-global-advisors': {
    role: 'Asset Manager',
    bio: 'World\u2019s third-largest asset manager and operator of the SPDR ETF family. Holds INTEG B passively in its World Small Cap index funds.',
    tags: ['Institutional', 'Passive', 'Index'],
    location: 'Boston, USA',
    aum: '$4.1T',
    lastContact: null,
    transactions: [],
    notes: 'Pure index holding. No IR engagement channel.',
  },
};

export function getInvestor(slug) {
  const holder = TOP_HOLDERS.find((h) => slugify(h.name) === slug);
  const profile = PROFILES[slug];
  if (!holder && !profile) return null;
  const base = holder || {};
  const shares = base.capitalPct
    ? Math.round((base.capitalPct / 100) * COMPANY.sharesOutstanding)
    : null;
  const marketValueSEK = shares ? shares * COMPANY.price : null;
  const trend = base.trend || 'flat';
  const history = generateHistory(base.capitalPct || 0, trend);
  return {
    slug,
    name: base.name || 'Unknown investor',
    country: base.country || null,
    type: base.type || (profile?.role ?? null),
    capitalPct: base.capitalPct || 0,
    votesPct: base.votesPct || 0,
    rank: base.rank || null,
    deltaCapital: base.deltaCapital || 0,
    trend,
    shares,
    marketValueSEK,
    history,
    role: profile?.role || base.type || 'Holder',
    bio: profile?.bio || 'No additional profile data available for this holder.',
    tags: profile?.tags || [],
    location: profile?.location || null,
    aum: profile?.aum || null,
    lastContact: profile?.lastContact || null,
    transactions: profile?.transactions || [],
    notes: profile?.notes || null,
  };
}

export function listInvestorSlugs() {
  return TOP_HOLDERS.map((h) => slugify(h.name));
}
