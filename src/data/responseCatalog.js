// Level-2 response catalog for Dashboard follow-up chips.
// Each L1 response card has 3 follow-up chips that target an entry here.

import { TOP_HOLDERS } from './holders';
import { OWNERSHIP_CHANGES } from './ownershipChanges';
import { PEER_LIQUIDITY } from './peerLiquidity';
import { INSIDER_TRANSACTIONS } from './insiderTransactions';
import { SHORT_INTEREST } from './shortInterest';
import { UPCOMING_EVENTS } from './upcomingEvents';

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
      'Net of all moves in Q1, the shareholder base added 124 owners. 12 holders increased positions by a combined 116k shares; 8 reduced by 51k. The net effect raised free float by 0.3pp.',
    body: {
      type: 'metrics',
      items: [
        { label: 'Net new owners', value: '+124', sub: 'vs Q4 2025' },
        { label: 'Buyers', value: '12', sub: '+116k shares' },
        { label: 'Sellers', value: '8', sub: '−51k shares' },
        { label: 'Net flow', value: '+65k', sub: 'shares net buy' },
      ],
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
      type: 'bars',
      data: [
        { key: 'individual', label: 'Individual', value: 23.57 },
        { key: 'other', label: 'Other / Strategic', value: 24.09 },
        { key: 'fund', label: 'Fund', value: 15.46 },
        { key: 'pension', label: 'Pension & Insurance', value: 5.10 },
      ],
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
      'Three holders moved into the top 25 over the past quarter. Two are passive index increases; one is an active first-time position from Aberdeen.',
    body: {
      type: 'list',
      items: [
        {
          left: 'Aberdeen Standard',
          right: 'New active position · World Smaller Companies fund',
          sub: 'Entered #15 at 0.52%',
        },
        {
          left: 'Goldman Sachs AM',
          right: 'Quant entry · International Equity Insights',
          sub: 'Entered #22 at 0.24%',
        },
        {
          left: 'Avanza Pension',
          right: 'Aggregated retail pension flow',
          sub: 'Entered #24 at 0.19%',
        },
      ],
    },
    source: 'Shareholders → Owner Changes',
  },

  /* ----- L2 from "Liquidity vs peers" ----- */

  'l2.liquidity.spread': {
    title: 'Spread Analysis',
    narrative:
      "INTEG B's quoted spread averaged 38 basis points in March, up 12 bps month-over-month. The widening tracks lower volume in the post-Q4 quiet period.",
    body: {
      type: 'metrics',
      items: [
        { label: 'Avg spread', value: '38 bps', sub: '+12 bps MoM' },
        { label: 'Best spread', value: '22 bps', sub: 'open auction' },
        { label: 'Worst spread', value: '74 bps', sub: '14:30 lull' },
        { label: 'Peer median', value: '21 bps', sub: '5-co. set' },
      ],
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
      'Two block trades have crossed in Q1, both to the same counterparty (Pareto Securities). Combined, the blocks moved 79,200 shares (~0.26% of capital).',
    body: {
      type: 'list',
      items: [
        {
          left: 'Mar 14',
          right: 'Block · 51,400 sh @ 15.62 SEK',
          sub: 'Pareto Securities (off-book)',
        },
        {
          left: 'Feb 02',
          right: 'Block · 27,800 sh @ 14.95 SEK',
          sub: 'Pareto Securities (off-book)',
        },
      ],
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
      'Combined board and executive ownership stands at 23.95% of capital, dominated by founder Richard Brännemark. Remaining executives hold less than 0.5% combined.',
    body: {
      type: 'kv',
      items: [
        { label: 'Richard Brännemark — CEO & Founder', value: '23.19%' },
        { label: 'Erik Lundström — Board Member', value: '0.38%' },
        { label: 'Anna Karin Hellström — CFO', value: '0.21%' },
        { label: 'Other board & exec', value: '0.17%' },
        { label: 'Combined insider stake', value: '23.95%' },
      ],
    },
    source: 'Insider → Board & Management',
  },

  'l2.insider.trend': {
    title: 'Insider Ownership Trend',
    narrative:
      'Insider ownership has been flat for the past 12 months. The only material move was the founder\u2019s 5,000-share estate-planning sale in January.',
    body: {
      type: 'bars',
      data: [
        { key: 'q1-25', label: 'Q1 2025', value: 23.95 },
        { key: 'q2-25', label: 'Q2 2025', value: 23.95 },
        { key: 'q3-25', label: 'Q3 2025', value: 23.97 },
        { key: 'q4-25', label: 'Q4 2025', value: 23.97 },
        { key: 'q1-26', label: 'Q1 2026', value: 23.95 },
      ],
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
      'Short interest has been declining steadily as the share price recovered from its November lows. Days-to-cover sits at 4.2 days at current volume.',
    body: {
      type: 'metrics',
      items: [
        { label: 'Now', value: '2.1%', sub: 'of capital' },
        { label: '3 mo ago', value: '2.8%', sub: 'down 0.7pp' },
        { label: '6 mo ago', value: '3.2%', sub: 'down 1.1pp' },
        { label: 'Days to cover', value: '4.2', sub: 'at avg volume' },
      ],
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
      '47 unique attendees joined the Q4 2025 call on February 4. 18 sell-side analysts dialed in (representing 12 firms) and 29 buy-side participants from 24 institutions.',
    body: {
      type: 'kv',
      items: [
        { label: 'Total dial-ins', value: '47' },
        { label: 'Sell-side analysts', value: '18' },
        { label: 'Sell-side firms', value: '12' },
        { label: 'Buy-side attendees', value: '29' },
        { label: 'Buy-side institutions', value: '24' },
        { label: 'Q&A questions taken', value: '11' },
      ],
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

// Default expansion chips for each L2 card group.
export function getCatalogEntry(id) {
  return RESPONSE_CATALOG[id] || null;
}
