// Level-2 response catalog. Each L1 response card has 3 follow-up chips
// that target an entry here. Both the Dashboard and Shareholders modules
// register entries in this single shared catalog.

import { TOP_HOLDERS } from './holders';
import { OWNERSHIP_CHANGES } from './ownershipChanges';
import { PEER_LIQUIDITY } from './peerLiquidity';
import { INSIDER_TRANSACTIONS } from './insiderTransactions';
import { SHORT_INTEREST } from './shortInterest';
import { UPCOMING_EVENTS } from './upcomingEvents';
import { DAILY_TRANSACTIONS } from './dailyTransactions';
import { LOCKUPS, LOCKUP_RELEASES } from './lockups';
import { TARGETS, PEER_GAPS } from './targets';

// Body type contracts:
//   { type: 'narrative' }                       → no body
//   { type: 'table', columns, rows }            → DataTable
//   { type: 'bars', data, highlightKey, fmt }   → BarChart
//   { type: 'metrics', items: [{label, value, sub}] } → row of stat blocks
//   { type: 'list', items: [{left, right, sub}] }     → date+description list
//   { type: 'kv', items: [{label, value}] }     → vertical key/value rows

export const RESPONSE_CATALOG = {
  /* ----- L2 from "Who's been buying?" ----- */

  'l2.buyers.full-list': {
    title: 'Full Owner List — Top 25',
    narrative:
      'Showing all 25 disclosed holders, ranked by capital. The top 25 control 54.2% of capital with the remainder split across roughly 3,470 smaller positions.',
    body: {
      type: 'table',
      mode: 'holders-with-link',
      columns: [
        { header: '#', key: 'rank', align: 'right' },
        { header: 'Owner', key: 'name' },
        { header: 'Capital %', key: 'capitalPct', align: 'right', fmt: 'pct' },
        { header: 'Type', key: 'type' },
      ],
      rows: TOP_HOLDERS,
    },
    source: 'Shareholders → Owners',
  },

  'l2.buyers.last-quarter': {
    title: 'Net Flow vs Last Quarter',
    narrative:
      'Waterfall of the past 30 days of register activity. 12 buyers added 116k shares; 8 sellers reduced 51k. Net effect: +65k shares into the active register.',
    body: {
      type: 'waterfall',
      data: [
        { label: 'Start', value: 0 },
        { label: 'Nordea', value: 45000 },
        { label: 'Invesco', value: 32100 },
        { label: 'Handelsbanken', value: 18500 },
        { label: 'AP4', value: 12000 },
        { label: 'Others', value: 8500 },
        { label: 'Aviva', value: -21204 },
        { label: 'Al Rajhi', value: -15800 },
        { label: 'Others', value: -13901 },
      ],
      valueFormatter: 'int',
    },
    source: 'Shareholders → Owner Changes',
  },

  'l2.buyers.foreign': {
    title: 'Foreign Buyers Only',
    narrative:
      'Filtering to non-Swedish holders shows 6 active positions among the top 25, controlling 26.4% of capital. The largest non-Swedish positions are concentrated in the Nordics and the US.',
    body: {
      type: 'table',
      mode: 'changes-with-link',
      columns: [
        { header: 'Owner', key: 'name' },
        { header: 'Country', key: 'country', align: 'center' },
        { header: 'Δ Shares', key: 'deltaShares', align: 'right', fmt: 'signedInt' },
        { header: 'Δ Capital', key: 'deltaCapital', align: 'right', fmt: 'signedPct' },
      ],
      rows: OWNERSHIP_CHANGES.filter((o) => o.country !== 'SE'),
    },
    source: 'Shareholders → Owner Changes',
  },

  /* ----- L2 from "Show me top 25 holders" ----- */

  'l2.top25.distribution': {
    title: 'Owner Distribution by Type',
    narrative:
      'Funds dominate the top 25 by count, but two large strategic positions (Brännemark and Aviva Perfusion) control nearly half of the disclosed capital.',
    body: {
      type: 'donut',
      data: [
        { key: 'individual', label: 'Individual', value: 23.57 },
        { key: 'other', label: 'Other / Strategic', value: 24.09 },
        { key: 'fund', label: 'Fund', value: 15.46 },
        { key: 'pension', label: 'Pension & Insurance', value: 5.10 },
      ],
      centerValue: '68.2%',
      centerLabel: 'Top 25',
      valueFormatter: 'pct',
    },
    source: 'Shareholders → Owner Distribution',
  },

  'l2.top25.institutional': {
    title: 'Institutional Holders Only',
    narrative:
      'Filtering out individuals and strategic blocks leaves 19 institutional holders controlling 19.6% of capital. The largest institution is Nordea Investment Funds at 3.45%.',
    body: {
      type: 'table',
      mode: 'holders-with-link',
      columns: [
        { header: '#', key: 'rank', align: 'right' },
        { header: 'Owner', key: 'name' },
        { header: 'Capital %', key: 'capitalPct', align: 'right', fmt: 'pct' },
        { header: 'Type', key: 'type' },
      ],
      rows: TOP_HOLDERS.filter(
        (h) => h.type !== 'Individual' && h.type !== 'Other'
      ),
    },
    source: 'Shareholders → Owners',
  },

  'l2.top25.new-entrants': {
    title: 'New in the Top 25 This Quarter',
    narrative:
      'Three holders moved into the top 25 over the past quarter. Aberdeen is the most meaningful entry — a first-time active position. Goldman Sachs AM and Avanza Pension are quant and aggregated-retail respectively.',
    body: {
      type: 'bars',
      data: [
        { key: 'aberdeen', label: 'Aberdeen Standard (Active)', value: 0.52 },
        { key: 'goldman', label: 'Goldman Sachs AM (Quant)', value: 0.24 },
        { key: 'avanza', label: 'Avanza Pension (Retail)', value: 0.19 },
      ],
      highlightKey: 'aberdeen',
      valueFormatter: 'pct',
    },
    source: 'Shareholders → Owner Changes',
  },

  /* ----- L2 from "Liquidity vs peers" ----- */

  'l2.liquidity.spread': {
    title: 'Spread Analysis',
    narrative:
      "INTEG B's average quoted spread is 38 basis points — nearly twice the 5-company peer median of 21 bps. Spread has widened 12 bps month-over-month as volume dropped in the post-Q4 quiet period.",
    body: {
      type: 'ring',
      value: 38,
      max: 100,
      suffix: ' bps',
      label: 'Avg spread',
      sub: 'vs 21 bps peer median',
      caption:
        'Best spread 22 bps (open auction) · Worst 74 bps (14:30 lull). Widened +12 bps MoM in the quiet period. Peer median 21 bps across 5 Nordic medtech peers.',
    },
    source: 'Liquidity → Spread',
  },

  'l2.liquidity.volume-trend': {
    title: 'Monthly Volume Trend',
    narrative:
      'Average daily volume has stepped up over the past 6 months, peaking after the Q4 2025 results in early February. March saw a return to baseline.',
    body: {
      type: 'bars',
      data: [
        { key: 'oct', label: 'Oct 2025', value: 12100 },
        { key: 'nov', label: 'Nov 2025', value: 14800 },
        { key: 'dec', label: 'Dec 2025', value: 11900 },
        { key: 'jan', label: 'Jan 2026', value: 17600 },
        { key: 'feb', label: 'Feb 2026', value: 24300 },
        { key: 'mar', label: 'Mar 2026', value: 18400 },
      ],
      highlightKey: 'mar',
      valueFormatter: 'eur',
    },
    source: 'Liquidity → Liquidity Analysis',
  },

  'l2.liquidity.block-trades': {
    title: 'Block Trades This Quarter',
    narrative:
      'Two block trades have crossed in Q1, both routed through Pareto Securities off-book. Combined, the blocks moved 79,200 shares (~0.26% of capital).',
    body: {
      type: 'bars',
      data: [
        { key: 'feb02', label: 'Feb 02 · Pareto off-book', value: 27800 },
        { key: 'mar14', label: 'Mar 14 · Pareto off-book', value: 51400 },
      ],
      highlightKey: 'mar14',
      valueFormatter: 'int',
    },
    source: 'Liquidity → Block Trades',
  },

  /* ----- L2 from "Any insider activity?" ----- */

  'l2.insider.all-tx': {
    title: 'All Insider Transactions',
    narrative:
      'Three PDMR notifications have been filed in 2026 to date. Net direction is mildly positive — purchases of 3,500 shares against a single 5,000-share disposal.',
    body: {
      type: 'table',
      mode: 'plain',
      columns: [
        { header: 'Date', key: 'date', fmt: 'date', nowrap: true },
        { header: 'Person', key: 'person' },
        { header: 'Role', key: 'role' },
        { header: 'Type', key: 'type' },
        { header: 'Shares', key: 'shares', align: 'right', fmt: 'signedInt' },
      ],
      rows: INSIDER_TRANSACTIONS.map((t) => ({
        ...t,
        shares: t.type === 'Disposal' ? -t.shares : t.shares,
      })),
    },
    source: 'Insider → Transactions',
  },

  'l2.insider.holdings': {
    title: 'Board & Management Holdings',
    narrative:
      'Combined board and executive ownership stands at 23.95% of capital, dominated by founder Richard Brännemark (23.19% alone). Remaining executives hold less than 0.8% combined.',
    body: {
      type: 'donut',
      data: [
        { key: 'brannemark', label: 'Richard Brännemark (CEO)', value: 23.19 },
        { key: 'lundstrom', label: 'Erik Lundström (Board)', value: 0.38 },
        { key: 'hellstrom', label: 'Anna Karin Hellström (CFO)', value: 0.21 },
        { key: 'other', label: 'Other board & exec', value: 0.17 },
      ],
      centerValue: '23.95%',
      centerLabel: 'Insider total',
      valueFormatter: 'pct',
    },
    source: 'Insider → Board & Management',
  },

  'l2.insider.trend': {
    title: 'Insider Ownership Trend',
    narrative:
      'Insider ownership has been broadly flat for the past 5 quarters with small quarterly PDMR buy/sell activity. The dip in Q1 2026 reflects the founder\u2019s 5,000-share estate-planning sale.',
    body: {
      type: 'bars',
      data: [
        { key: 'q1-25', label: 'Q1 2025', value: 23.9 },
        { key: 'q2-25', label: 'Q2 2025', value: 24.02 },
        { key: 'q3-25', label: 'Q3 2025', value: 24.09 },
        { key: 'q4-25', label: 'Q4 2025', value: 24.12 },
        { key: 'q1-26', label: 'Q1 2026', value: 23.95 },
      ],
      highlightKey: 'q1-26',
      valueFormatter: 'pct',
    },
    source: 'Insider → Trend',
  },

  /* ----- L2 from "Short interest trend" ----- */

  'l2.short.holders': {
    title: 'Disclosed Short Holders',
    narrative:
      'One disclosed short holder remains on the register. Below the 0.5% disclosure threshold, an estimated additional 1.5% of capital is short via undisclosed positions.',
    body: {
      type: 'table',
      mode: 'plain',
      columns: [
        { header: 'Holder', key: 'name' },
        { header: 'Country', key: 'country', align: 'center' },
        { header: 'Position', key: 'position', align: 'right', fmt: 'pct' },
        { header: 'Last change', key: 'lastChange', fmt: 'date', nowrap: true },
      ],
      rows: SHORT_INTEREST.holders,
    },
    source: 'Short → Short Holders',
  },

  'l2.short.vs-price': {
    title: 'Short Interest vs Stock Price',
    narrative:
      'Short interest has been declining steadily over the past 6 months as the share price recovered from its November lows. Days-to-cover sits at 4.2 days at current volume — well below the 10-day danger threshold.',
    body: {
      type: 'bars',
      data: [
        { key: 'm6', label: '6 months ago', value: 3.2 },
        { key: 'm5', label: '5 months ago', value: 3.0 },
        { key: 'm4', label: '4 months ago', value: 2.9 },
        { key: 'm3', label: '3 months ago', value: 2.8 },
        { key: 'm2', label: '2 months ago', value: 2.5 },
        { key: 'm1', label: '1 month ago', value: 2.3 },
        { key: 'now', label: 'Now', value: 2.1 },
      ],
      highlightKey: 'now',
      valueFormatter: 'pct',
    },
    source: 'Short → Short Analysis',
  },

  'l2.short.peers': {
    title: 'Peer Short Comparison',
    narrative:
      'Among 5 Nordic medtech peers, INTEG B has the second-lowest short interest. The sector average sits at 3.1% of float.',
    body: {
      type: 'bars',
      data: [
        { key: 'qkc', label: 'QuickCool', value: 5.4 },
        { key: 'ossb', label: 'OssDsign', value: 3.8 },
        { key: 'mdd', label: 'Medistim', value: 2.6 },
        { key: 'integ', label: 'Integrum', value: 2.1 },
        { key: 'bonex', label: 'BONESUPPORT', value: 1.7 },
      ],
      highlightKey: 'integ',
      valueFormatter: 'pct',
    },
    source: 'Short → Peer Comparison',
  },

  /* ----- L2 from "Upcoming IR events" ----- */

  'l2.events.calendar': {
    title: 'Add to Calendar',
    narrative:
      'Pick a destination calendar to receive ICS invites for the next 3 IR events. In the production app, this will sync directly with your work calendar.',
    body: {
      type: 'list',
      items: [
        { left: 'Apple Calendar', right: 'Sync via subscribed calendar (.ics)' },
        { left: 'Google Calendar', right: 'OAuth · push events with reminders' },
        { left: 'Outlook 365', right: 'Connect via Microsoft Graph' },
      ],
    },
    source: 'CRM → Events',
  },

  'l2.events.attendees': {
    title: 'Q4 2025 Earnings Call Attendees',
    narrative:
      '47 unique attendees joined the Q4 2025 call on February 4 — the highest attendance in 6 quarters. 18 sell-side analysts (12 firms) and 29 buy-side participants (24 institutions). 11 questions taken in Q&A.',
    body: {
      type: 'bars',
      data: [
        { key: 'q3-24', label: 'Q3 2024', value: 32 },
        { key: 'q4-24', label: 'Q4 2024', value: 36 },
        { key: 'q1-25', label: 'Q1 2025', value: 38 },
        { key: 'q2-25', label: 'Q2 2025', value: 41 },
        { key: 'q3-25', label: 'Q3 2025', value: 42 },
        { key: 'q4-25', label: 'Q4 2025', value: 47 },
      ],
      highlightKey: 'q4-25',
      valueFormatter: 'int',
    },
    source: 'CRM → Events',
  },

  'l2.events.roadshow': {
    title: 'Spring Roadshow Schedule',
    narrative:
      'A 5-city European roadshow is being planned for late May, immediately after the Q1 2026 results. Slots are being arranged through Carnegie and Berenberg.',
    body: {
      type: 'list',
      items: [
        ...UPCOMING_EVENTS.map((e) => ({
          left: e.date,
          right: `${e.type} · ${e.description}`,
          sub: e.location,
        })),
        {
          left: 'May 19',
          right: 'NDR · Stockholm',
          sub: 'Carnegie · 6 meetings booked',
        },
        {
          left: 'May 21',
          right: 'NDR · Copenhagen',
          sub: 'Carnegie · 4 meetings booked',
        },
        {
          left: 'May 27',
          right: 'NDR · London',
          sub: 'Berenberg · 9 meetings booked',
        },
      ],
    },
    source: 'CRM → Outreach',
  },
};

/* ============================================================ */
/* Shareholders module — L2 catalog (l2.sh.*)                    */
/* ============================================================ */

Object.assign(RESPONSE_CATALOG, {
  /* ----- L2 from "Show full register" ----- */

  'l2.sh.register.search': {
    title: 'Search the Register',
    narrative:
      'Smart search across all 3,498 holders. In production you can filter by name, country, type, holding range, or recent activity — the result set updates live as you refine.',
    body: {
      type: 'kv',
      items: [
        { label: 'Search by name', value: '"Nordea", "Brännemark", "Aviva"' },
        { label: 'Filter by country', value: 'SE, NO, US, SA, GB, DE, DK …' },
        { label: 'Filter by type', value: 'Fund, Pension, Strategic, Individual' },
        { label: 'Holding range', value: '0–0.1% / 0.1–1% / 1–5% / 5%+' },
        { label: 'Last update window', value: '7d / 30d / 90d / 12mo' },
      ],
    },
    source: 'Shareholders → Search',
  },

  'l2.sh.register.export': {
    title: 'Export Register',
    narrative:
      'Export the full register in 4 formats. The export includes owner name, country, type, capital %, votes %, share count, and last-update timestamp.',
    body: {
      type: 'list',
      items: [
        {
          left: 'CSV',
          right: 'Best for spreadsheets · ~210 KB',
          sub: 'UTF-8, comma-separated',
        },
        {
          left: 'Excel',
          right: 'Multi-sheet workbook · ~340 KB',
          sub: 'Includes pivot-ready Owner / Trend / Lockup sheets',
        },
        {
          left: 'PDF',
          right: 'Board-ready report · ~520 KB',
          sub: 'Branded layout with charts',
        },
        {
          left: 'JSON',
          right: 'For programmatic use · ~180 KB',
          sub: 'Stable schema with versioning',
        },
      ],
    },
    source: 'Shareholders → Export',
  },

  'l2.sh.register.history': {
    title: 'Register Snapshot History',
    narrative:
      'Weekly owner count over the past 6 weeks. Net growth of +38 owners from the March 1 snapshot to today. The system retains 24 monthly snapshots plus the most recent 12 weekly diffs.',
    body: {
      type: 'bars',
      data: [
        { key: 'w1', label: 'Mar 08', value: 3465 },
        { key: 'w2', label: 'Mar 15', value: 3472 },
        { key: 'w3', label: 'Mar 22', value: 3478 },
        { key: 'w4', label: 'Mar 29', value: 3486 },
        { key: 'w5', label: 'Apr 05', value: 3492 },
        { key: 'w6', label: 'Apr 12', value: 3498 },
      ],
      highlightKey: 'w6',
      valueFormatter: 'int',
    },
    source: 'Shareholders → History',
  },

  /* ----- L2 from "Owner trend" ----- */

  'l2.sh.trend.composition': {
    title: 'Composition Trend by Type',
    narrative:
      'Fund ownership has grown +1.4pp over 12 months while individuals shrank −0.8pp and the strategic block −0.7pp. Showing the current composition as a stacked bar for the 5 holder types.',
    body: {
      type: 'stacked',
      label: 'Current holder type mix (100% of capital)',
      data: [
        { key: 'individual', label: 'Individual', value: 32.4 },
        { key: 'fund', label: 'Fund', value: 25.8 },
        { key: 'strategic', label: 'Strategic', value: 24.1 },
        { key: 'pension', label: 'Pension', value: 11.6 },
        { key: 'bank', label: 'Bank', value: 6.1 },
      ],
      valueFormatter: 'pct',
    },
    source: 'Shareholders → Owner Trend',
  },

  'l2.sh.trend.foreign': {
    title: 'Foreign Ownership — 12 Month Trend',
    narrative:
      "Foreign ownership has declined 1.3pp from 21.4% to 20.1% over 12 months. The decline is almost entirely driven by Aviva Perfusion's gradual reduction.",
    body: {
      type: 'bars',
      data: [
        { key: 'm1', label: 'May 25', value: 21.38 },
        { key: 'm3', label: 'Jul 25', value: 21.02 },
        { key: 'm6', label: 'Oct 25', value: 20.55 },
        { key: 'm9', label: 'Jan 26', value: 20.22 },
        { key: 'm12', label: 'Apr 26', value: 20.08 },
      ],
      highlightKey: 'm12',
      valueFormatter: 'pct',
    },
    source: 'Shareholders → Owner Trend',
  },

  'l2.sh.trend.concentration': {
    title: 'Top-25 Concentration Trend',
    narrative:
      'Top 25 controlled 55.5% of capital 12 months ago. Today they control 54.2% — a 1.3pp decline driven by founder + Aviva reductions.',
    body: {
      type: 'bars',
      data: [
        { key: 't1', label: 'May 25', value: 55.50 },
        { key: 't3', label: 'Jul 25', value: 55.30 },
        { key: 't6', label: 'Oct 25', value: 54.92 },
        { key: 't9', label: 'Jan 26', value: 54.50 },
        { key: 't12', label: 'Apr 26', value: 54.20 },
      ],
      highlightKey: 't12',
      valueFormatter: 'pct',
    },
    source: 'Shareholders → Owner Trend',
  },

  /* ----- L2 from "Geographic breakdown" ----- */

  'l2.sh.geo.europe': {
    title: 'European Holders',
    narrative:
      'European holders (excluding Sweden) control 24.9% of capital. Norway dominates at 21.7%, then Denmark 1.5%, UK 1.2%, Germany 0.5%, others 0.0%.',
    body: {
      type: 'bars',
      data: [
        { key: 'no', label: 'Norway', value: 21.71 },
        { key: 'dk', label: 'Denmark', value: 1.52 },
        { key: 'gb', label: 'United Kingdom', value: 1.21 },
        { key: 'de', label: 'Germany', value: 0.46 },
      ],
      valueFormatter: 'pct',
    },
    source: 'Shareholders → Geography',
  },

  'l2.sh.geo.americas': {
    title: 'Americas Holders',
    narrative:
      'US institutions hold 3.16% across 42 disclosed positions. The largest are Invesco (1.23%), Vanguard (0.48%), and Dimensional Fund Advisors (0.42%). No Canadian or Latin American holders are currently disclosed.',
    body: {
      type: 'table',
      mode: 'plain',
      columns: [
        { header: 'Holder', key: 'name' },
        { header: 'Capital %', key: 'capitalPct', align: 'right', fmt: 'pct' },
        { header: 'Type', key: 'type' },
      ],
      rows: TOP_HOLDERS.filter((h) => h.country === 'US'),
    },
    source: 'Shareholders → Geography',
  },

  'l2.sh.geo.asia': {
    title: 'Asia & MENA Holders',
    narrative:
      'Saudi Arabia represents 1.98% of capital through Al Rajhi Capital — essentially our entire Asia/MENA exposure. Japan, Hong Kong, Singapore, and UAE are all structurally under-represented and worth exploring on the next roadshow cycle.',
    body: {
      type: 'donut',
      data: [
        { key: 'sa', label: 'Saudi Arabia', value: 1.98 },
        { key: 'opportunity', label: 'Untapped Asia & MENA', value: 0.01 },
      ],
      centerValue: '1.98%',
      centerLabel: 'Asia/MENA',
      valueFormatter: 'pct',
    },
    source: 'Shareholders → Geography',
  },

  /* ----- L2 from "By owner type" ----- */

  'l2.sh.type.funds': {
    title: 'Fund Holders Detail',
    narrative:
      '218 fund holders combine to 25.8% of capital. The top 5 funds (Nordea, Handelsbanken, Carnegie, Öhman, Swedbank Robur) control roughly half of the fund total.',
    body: {
      type: 'table',
      mode: 'holders-with-link',
      columns: [
        { header: '#', key: 'rank', align: 'right' },
        { header: 'Fund', key: 'name' },
        { header: 'Capital %', key: 'capitalPct', align: 'right', fmt: 'pct' },
      ],
      rows: TOP_HOLDERS.filter((h) => h.type === 'Fund').slice(0, 10),
    },
    source: 'Shareholders → Owner Distribution',
  },

  'l2.sh.type.individuals': {
    title: 'Individual Holders Detail',
    narrative:
      '2,891 individual holders combine to 32.4% of capital. The founder alone holds 23.19% — about 72% of the entire individual segment. The remaining ~9.2% is spread across 2,890 retail holders (median holding ~240 shares).',
    body: {
      type: 'donut',
      data: [
        { key: 'founder', label: 'Richard Brännemark (founder)', value: 23.19 },
        { key: 'board', label: 'Erik Lundström (board)', value: 0.38 },
        { key: 'retail', label: 'Other 2,889 retail individuals', value: 8.83 },
      ],
      centerValue: '32.4%',
      centerLabel: 'Individuals',
      valueFormatter: 'pct',
    },
    source: 'Shareholders → Owner Distribution',
  },

  'l2.sh.type.strategic': {
    title: 'Strategic / Other Holders',
    narrative:
      '12 strategic / other-type holders control 24.1% of capital. The vast majority is concentrated in Aviva Perfusion AS (21.13%). Universities, foundations, and private holding companies make up the remainder.',
    body: {
      type: 'list',
      items: [
        { left: '21.13%', right: 'Aviva Perfusion AS', sub: 'Norwegian strategic, IPO-era holder' },
        { left: '1.98%', right: 'Al Rajhi Capital', sub: 'Saudi sovereign-linked holding' },
        { left: '0.98%', right: 'Göteborgs Universitet', sub: 'University endowment' },
        { left: '0.01%', right: '9 smaller private holdings', sub: 'Foundations, holding companies' },
      ],
    },
    source: 'Shareholders → Owner Distribution',
  },

  /* ----- L2 from "Daily transactions" ----- */

  'l2.sh.tx.last7': {
    title: 'Last 7 Days Transactions',
    narrative:
      '7 reportable transactions in the past 7 days. Net flow is +20,496 shares (5 buys totalling 36.4k, 3 sells totalling 16.0k).',
    body: {
      type: 'table',
      mode: 'plain',
      columns: [
        { header: 'Date', key: 'date', fmt: 'date', nowrap: true },
        { header: 'Owner', key: 'owner' },
        { header: 'Type', key: 'type' },
        { header: 'Shares', key: 'shares', align: 'right', fmt: 'int' },
      ],
      rows: DAILY_TRANSACTIONS.slice(0, 7),
    },
    source: 'Shareholders → Daily Transactions',
  },

  'l2.sh.tx.large': {
    title: 'Large Transactions (>€100k value)',
    narrative:
      '5 transactions exceeded €100k in value over the past 14 days. Aviva Perfusion accounted for the two largest, both on the sell side. Nordea and Invesco contributed the largest buys.',
    body: {
      type: 'table',
      mode: 'plain',
      columns: [
        { header: 'Date', key: 'date', fmt: 'date', nowrap: true },
        { header: 'Owner', key: 'owner' },
        { header: 'Type', key: 'type' },
        { header: 'Value (SEK)', key: 'valueSEK', align: 'right', fmt: 'int' },
      ],
      rows: DAILY_TRANSACTIONS.filter((t) => t.valueSEK >= 100_000),
    },
    source: 'Shareholders → Daily Transactions',
  },

  'l2.sh.tx.byowner': {
    title: 'Transactions Grouped by Owner (14 days)',
    narrative:
      'Running waterfall of the 9 most active owners over the past 14 days. Net effect: −10,504 shares out of the active register. Aviva Perfusion is the largest net seller (−21,204); Nordea and Invesco lead the buy side.',
    body: {
      type: 'waterfall',
      data: [
        { label: 'Start', value: 0 },
        { label: 'Nordea', value: 12500 },
        { label: 'Invesco', value: 10400 },
        { label: 'Handelsbanken', value: 5500 },
        { label: 'Aberdeen', value: 4800 },
        { label: 'Goldman', value: 3200 },
        { label: 'AP4', value: 2700 },
        { label: 'Öhman', value: 1400 },
        { label: 'Al Rajhi', value: -7900 },
        { label: 'Aviva', value: -21204 },
      ],
      valueFormatter: 'int',
    },
    source: 'Shareholders → Daily Transactions',
  },

  /* ----- L2 from "Lock-up status" ----- */

  'l2.sh.lockup.timeline': {
    title: 'Lock-up Expiry Timeline',
    narrative:
      'Three lock-up agreements are active. The founder block (4.20M shares = 13.69% of capital) expires June 30, 2026. Two smaller restricted-stock packages release later in 2026 and 2027. Bars show months until expiry.',
    body: {
      type: 'bars',
      data: LOCKUPS.map((l) => {
        const now = new Date('2026-04-13');
        const exp = new Date(l.expiryDate);
        const months = Math.round(
          (exp - now) / (1000 * 60 * 60 * 24 * 30.44)
        );
        return {
          key: l.person,
          label: `${l.person} · ${l.pctOfCapital.toFixed(2)}%`,
          value: months,
        };
      }),
      highlightKey: 'Richard Brännemark',
      valueFormatter: 'int',
    },
    source: 'Shareholders → Lock-ups',
  },

  'l2.sh.lockup.persons': {
    title: 'Locked-up Insiders',
    narrative:
      'Three insiders currently hold locked shares. Brännemark dominates with 4.20M shares; Lundström and Hellström each hold smaller restricted-stock packages from board / executive grants.',
    body: {
      type: 'list',
      items: LOCKUPS.map((l) => ({
        left: l.person,
        right: `${l.role} · ${l.type}`,
        sub: `${l.shares.toLocaleString()} shares (${l.pctOfCapital.toFixed(2)}%) · expires ${l.expiryDate}`,
      })),
    },
    source: 'Shareholders → Lock-ups',
  },

  'l2.sh.lockup.history': {
    title: 'Lock-up Release History',
    narrative:
      'Two lock-ups have released in the past 24 months: 1.20M shares from the original IPO 180-day lock-up in March 2024, and 240k shares from a board package vesting tranche in November 2024. Both released without material price impact.',
    body: {
      type: 'list',
      items: LOCKUP_RELEASES.map((l) => ({
        left: l.date,
        right: `${l.person} · ${l.note}`,
        sub: `${l.shares.toLocaleString()} shares (${l.pctOfCapital.toFixed(2)}%)`,
      })),
    },
    source: 'Shareholders → Lock-ups',
  },
});

/* ============================================================ */
/* Targeting module — L2 catalog (l2.tgt.*)                       */
/* ============================================================ */

Object.assign(RESPONSE_CATALOG, {
  /* ----- L2 from "Prioritized targets" ----- */

  'l2.tgt.priority.hot': {
    title: 'Hot Targets Only',
    narrative:
      "Filtering to 'Hot' priority shows 6 candidates — all with AI fit scores of 81+ and an existing relationship to our closest peers. These should move to the top of this quarter's outreach plan.",
    body: {
      type: 'table',
      mode: 'plain',
      columns: [
        { header: '#', key: 'rank', align: 'right' },
        { header: 'Target', key: 'name' },
        { header: 'Country', key: 'country', align: 'center' },
        { header: 'Score', key: 'score', align: 'right' },
      ],
      rows: TARGETS.filter((t) => t.priority === 'Hot').map((t, i) => ({
        ...t,
        rank: i + 1,
      })),
    },
    source: 'Targeting → Screener',
  },

  'l2.tgt.priority.details': {
    title: 'Score Breakdown — Polar Capital Healthcare',
    narrative:
      'The AI fit score for Polar Capital Healthcare is 92/100. A high-conviction match driven primarily by peer overlap and sector fit. No negative factors.',
    body: {
      type: 'ring',
      value: 92,
      max: 100,
      suffix: '',
      label: 'Fit score',
      sub: 'out of 100',
      caption:
        'Peer overlap (+28) · Sector fit (+24) · Mandate alignment (+18) · Historical behaviour (+14) · Geography (+8). Total 92/100.',
    },
    source: 'Targeting → Screener',
  },

  'l2.tgt.priority.outreach': {
    title: 'Draft Outreach Sequence',
    narrative:
      'A 4-touch outreach sequence for the top target. Touch 1 is a cold intro via Berenberg (our sell-side relationship). Touch 2–4 escalate over 3 weeks.',
    body: {
      type: 'list',
      items: [
        {
          left: 'Touch 1',
          right: 'Cold intro via Berenberg analyst',
          sub: 'Sector briefing email with Q4 results attached',
        },
        {
          left: 'Touch 2',
          right: '1-on-1 call invitation',
          sub: '2 weeks later, direct from IR',
        },
        {
          left: 'Touch 3',
          right: 'Site visit offer',
          sub: 'Stockholm HQ or London meeting',
        },
        {
          left: 'Touch 4',
          right: 'Investor day invite',
          sub: 'Next scheduled quarterly call',
        },
      ],
    },
    source: 'Targeting → Screener',
  },

  /* ----- L2 from "Lookalike holders" ----- */

  'l2.tgt.look.criteria': {
    title: 'Lookalike Matching Criteria',
    narrative:
      'The AI lookalike engine combines 5 weighted traits into a single match score. Peer overlap and investment style carry the most weight — together they account for 55% of the match signal.',
    body: {
      type: 'stacked',
      label: 'Weight of each trait in the composite match score',
      data: [
        { key: 'peer', label: 'Peer overlap', value: 30 },
        { key: 'style', label: 'Investment style', value: 25 },
        { key: 'duration', label: 'Holding duration', value: 20 },
        { key: 'geo', label: 'Geographic fit', value: 15 },
        { key: 'esg', label: 'ESG alignment', value: 10 },
      ],
      valueFormatter: 'pct',
    },
    source: 'Targeting → Compare Owners',
  },

  'l2.tgt.look.heatmap': {
    title: 'Peer Overlap vs AI Fit Score',
    narrative:
      'Bubble map of candidate targets. X-axis: number of our peers they already hold. Y-axis: AI fit score. Bubble size: AUM. The upper-right cluster is the highest-conviction cohort.',
    body: {
      type: 'bubbles',
      data: [
        { id: 't1', label: 'Polar Capital', x: 3, y: 92, size: 16, priority: 'Hot' },
        { id: 't2', label: 'Allianz GI', x: 2, y: 88, size: 20, priority: 'Hot' },
        { id: 't3', label: 'Fidelity', x: 1, y: 86, size: 14, priority: 'Hot' },
        { id: 't4', label: 'Columbia', x: 1, y: 85, size: 12, priority: 'Hot' },
        { id: 't5', label: 'Impax', x: 1, y: 83, size: 14, priority: 'Hot' },
        { id: 't6', label: 'Skagen', x: 0, y: 81, size: 14, priority: 'Hot' },
        { id: 't7', label: 'AKO', x: 1, y: 76, size: 18, priority: 'Warm' },
        { id: 't8', label: 'abrdn', x: 2, y: 74, size: 10, priority: 'Warm' },
        { id: 't9', label: 'T.Rowe', x: 0, y: 72, size: 18, priority: 'Warm' },
        { id: 't10', label: 'Evli', x: 2, y: 71, size: 8, priority: 'Warm' },
      ],
      xAxis: { label: '# of peers held' },
      yAxis: { label: 'AI Fit Score' },
      xMax: 5,
      yMax: 100,
    },
    source: 'Targeting → Compare Owners',
  },

  'l2.tgt.look.esg': {
    title: 'ESG-Aligned Lookalikes',
    narrative:
      '2 of our top lookalike candidates have a stated ESG tilt that aligns with our sustainability narrative: Impax (environmental markets) and Öhman (Nordic ESG).',
    body: {
      type: 'list',
      items: [
        {
          left: 'Impax AM Environmental',
          right: 'Environmental Markets · £12B AUM',
          sub: 'Our lifecycle assessment aligns with their screening framework',
        },
        {
          left: 'Öhman Fonder',
          right: 'Nordic ESG · €11B AUM',
          sub: 'Already accumulating via the Nordic Equity fund',
        },
      ],
    },
    source: 'Targeting → Compare Owners',
  },

  /* ----- L2 from "Peers we're not matching" ----- */

  'l2.tgt.gap.byPeer': {
    title: 'Peer Gaps Grouped by Peer',
    narrative:
      'Holders of our peers that are NOT on our register, grouped by which peer they own. BONESUPPORT has the widest gap — 18 institutional holders own it that don\'t own us. OssDsign 12, Medistim 10, QuickCool 4.',
    body: {
      type: 'bars',
      data: [
        { key: 'bone', label: 'BONESUPPORT', value: 18 },
        { key: 'oss', label: 'OssDsign', value: 12 },
        { key: 'medi', label: 'Medistim', value: 10 },
        { key: 'qkc', label: 'QuickCool', value: 4 },
      ],
      highlightKey: 'bone',
      valueFormatter: 'int',
    },
    source: 'Targeting → Compare Owners',
  },

  'l2.tgt.gap.multi': {
    title: 'Holders of 2+ Peers — Prime Targets',
    narrative:
      '18 holders own 2 or more of our closest peers without holding INTEG B. These are the highest-conversion peer-gap candidates because they already believe in the thesis — they just haven\'t found us yet.',
    body: {
      type: 'table',
      mode: 'plain',
      columns: [
        { header: 'Holder', key: 'holder' },
        { header: 'Country', key: 'country', align: 'center' },
        { header: 'Holds peer %', key: 'holdingPct', align: 'right', fmt: 'pct' },
      ],
      rows: PEER_GAPS,
    },
    source: 'Targeting → Compare Owners',
  },

  'l2.tgt.gap.contact': {
    title: 'Start Outreach List',
    narrative:
      'Drafted a 12-person outreach list from the top peer-gap candidates. 5 have existing warm intros via our sell-side relationships; 7 require cold approach.',
    body: {
      type: 'list',
      items: [
        { left: '5 warm intros', right: 'Via Berenberg, Carnegie sell-side', sub: 'Expected response rate ~40%' },
        { left: '7 cold approaches', right: 'Direct IR contact needed', sub: 'Expected response rate ~12%' },
        { left: 'Estimated wins', right: '3–4 first meetings', sub: 'Over 8-week engagement window' },
      ],
    },
    source: 'Targeting → Compare Owners',
  },

  /* ----- L2 from "Compare our top 5 vs peers" ----- */

  'l2.tgt.cmp.overlap': {
    title: 'Peer Overlap as a Stack',
    narrative:
      'Peer-level overlap in our top 25 — what fraction of our top holders also own each of our 4 closest peers. BONESUPPORT is the highest-overlap peer at 62%; QuickCool the lowest at 12%.',
    body: {
      type: 'stacked',
      label: 'Share of top-25 holders that also own each peer',
      data: [
        { key: 'bone', label: 'BONESUPPORT', value: 62 },
        { key: 'medi', label: 'Medistim', value: 48 },
        { key: 'oss', label: 'OssDsign', value: 40 },
        { key: 'qkc', label: 'QuickCool', value: 12 },
      ],
      valueFormatter: 'pct',
    },
    source: 'Targeting → Compare Owners',
  },

  'l2.tgt.cmp.unique': {
    title: 'Unique to INTEG B',
    narrative:
      'Holders that appear in our register but NOT in any peer register — 6 institutional positions representing 8.2% of capital. These are our "distinctive" holders and worth nurturing as a differentiated story.',
    body: {
      type: 'donut',
      data: [
        { key: 'seb', label: 'SEB Life International (LU)', value: 2.87 },
        { key: 'rajhi', label: 'Al Rajhi Capital (SA)', value: 1.98 },
        { key: 'gbg', label: 'Göteborgs Universitet (SE)', value: 0.98 },
        { key: 'lans', label: 'Länsförsäkringar (SE)', value: 0.87 },
        { key: 'carnegie', label: 'Carnegie Fonder (SE)', value: 0.76 },
        { key: 'other', label: '2 smaller holders', value: 0.4 },
      ],
      centerValue: '8.2%',
      centerLabel: 'Unique to us',
      valueFormatter: 'pct',
    },
    source: 'Targeting → Compare Owners',
  },

  'l2.tgt.cmp.gap': {
    title: 'Shared by 3+ Peers, Not Us',
    narrative:
      '4 holders own at least 3 of our 4 closest peers but not INTEG B. These are the most glaring gaps and should be the top priority for peer-gap outreach.',
    body: {
      type: 'list',
      items: [
        { left: 'Fjärde AP-fonden', right: 'Holds 4 of 4 peers', sub: '(wait — already holds us at 1.76%)' },
        { left: 'Polar Capital Healthcare', right: 'Holds 3 of 4 peers', sub: 'Not on our register' },
        { left: 'Handelsbanken Fonder', right: 'Holds 3 of 4 peers', sub: '(already holds us at 2.34%)' },
        { left: 'Impax AM Environmental', right: 'Holds 3 of 4 peers', sub: 'Not on our register' },
      ],
    },
    source: 'Targeting → Compare Owners',
  },

  /* ----- L2 from "Long-only missing" ----- */

  'l2.tgt.lo.esg': {
    title: 'ESG-Aligned Long-Only Targets',
    narrative:
      '3 ESG-tilted long-only funds match our sustainability narrative and are not currently holding INTEG B. All 3 have a demonstrated appetite for small-cap medtech.',
    body: {
      type: 'list',
      items: [
        { left: 'Impax AM', right: 'Environmental Markets · £12B', sub: 'UK · Hot · Score 83' },
        { left: 'Columbia Threadneedle', right: 'Responsible Global Equity · $1B', sub: 'US · Warm · Score 72' },
        { left: 'Skagen Funds', right: 'Skagen Global · €6B', sub: 'Norway · Hot · Score 81' },
      ],
    },
    source: 'Targeting → Screener',
  },

  'l2.tgt.lo.nordic': {
    title: 'Nordic Long-Only Mandates',
    narrative:
      '4 Nordic long-only funds have structural underweight in Swedish medtech and no current position in INTEG B. Highest fit: Skagen and Evli.',
    body: {
      type: 'list',
      items: [
        { left: 'Skagen Global', right: 'Norway · €6B · Score 81', sub: 'Nordic value, currently underweight healthcare' },
        { left: 'Evli Nordic Small Cap', right: 'Finland · €1.2B · Score 71', sub: 'Holds 2 peers' },
        { left: 'Norron Active', right: 'Sweden · €800M · Score 68', sub: 'Quick to add Nordic healthcare historically' },
        { left: 'Storebrand ASA', right: 'Norway · €95B · Score 64', sub: 'Nordic equity sleeve' },
      ],
    },
    source: 'Targeting → Screener',
  },

  'l2.tgt.lo.global': {
    title: 'Global Small-Cap Mandates',
    narrative:
      '5 global small-cap mandates are a structural fit for INTEG B. Largest by AUM: Allianz GI Europe (€48B) and T. Rowe Price International Discovery ($12B).',
    body: {
      type: 'list',
      items: [
        { left: 'Allianz GI European Equity Growth', right: 'Germany · €48B', sub: 'Score 88' },
        { left: 'T. Rowe Price International Discovery', right: 'US · $12B', sub: 'Score 72' },
        { left: 'Fidelity Intl Small Cap', right: 'UK · £3.8B', sub: 'Score 86' },
        { left: 'Kempen European Small Cap', right: 'Netherlands · €3B', sub: 'Score 69' },
        { left: 'abrdn World Smaller Companies', right: 'UK · £2.1B', sub: 'Score 74' },
      ],
    },
    source: 'Targeting → Screener',
  },

  /* ----- L2 from "Recently exited" ----- */

  'l2.tgt.exit.winback': {
    title: 'Winback Probability',
    narrative:
      '2 of our 4 recent exits score above 60 on the AI winback-probability model: Alliance Bernstein (sector rotation — reversible) and Prudential (PM change — new PM is open to Nordic small-cap). The other 2 are mandate closures with near-zero reversal odds.',
    body: {
      type: 'ring',
      value: 68,
      max: 100,
      suffix: '',
      label: 'Winback prob.',
      sub: 'average across 2',
      caption:
        'Alliance Bernstein 72/100 · Prudential 64/100 · UBP 12/100 · BNP Paribas 8/100. Top candidates respond well to a 3-touch sequence with pipeline updates and peer comparables.',
    },
    source: 'Targeting → Compare Owners',
  },

  'l2.tgt.exit.reason': {
    title: 'Exit Reason Breakdown',
    narrative:
      'Of 4 exits in the past 12 months, 2 were sector rotations, 1 a mandate closure, 1 a PM change. None were thesis changes — exit reasons are all mechanical, not fundamental.',
    body: {
      type: 'donut',
      data: [
        { key: 'rot', label: 'Sector rotation', value: 50 },
        { key: 'mandate', label: 'Mandate closure', value: 25 },
        { key: 'pm', label: 'PM change', value: 25 },
      ],
      centerValue: '4',
      centerLabel: 'Exits',
      valueFormatter: 'pct',
    },
    source: 'Targeting → Compare Owners',
  },

  'l2.tgt.exit.sequence': {
    title: 'Winback Outreach Sequence',
    narrative:
      'A 3-touch winback sequence. Touch 1 references the change in their portfolio. Touch 2 shares a pipeline update. Touch 3 offers a catch-up call.',
    body: {
      type: 'list',
      items: [
        { left: 'Touch 1', right: '"We noticed you rotated — here\'s our latest"', sub: 'Pipeline update email' },
        { left: 'Touch 2', right: '"Peer thesis check-in"', sub: '3 weeks later, with peer comparables' },
        { left: 'Touch 3', right: 'Direct catch-up call invite', sub: '6 weeks later, from senior IR' },
      ],
    },
    source: 'Targeting → Compare Owners',
  },
});

// Default expansion chips for each L2 card group.
export function getCatalogEntry(id) {
  return RESPONSE_CATALOG[id] || null;
}
