// Central share-content registry for every L1 card in the system.
// Each L1 card still owns its own rendering, but the underlying
// share payload ({ title, text, csv }) is built once here so both
// the card's own share menu AND cross-cutting features (/report,
// bulk PDF export) can resolve the same content from anywhere.

import { buildShareContent } from '../utils/shareContent';
import { OWNERSHIP_CHANGES } from './ownershipChanges';
import { TOP_HOLDERS } from './holders';
import { PEER_LIQUIDITY } from './peerLiquidity';
import { INSIDER_TRANSACTIONS } from './insiderTransactions';
import { UPCOMING_EVENTS } from './upcomingEvents';
import { DAILY_TRANSACTIONS } from './dailyTransactions';
import { LOCKUPS } from './lockups';
import {
  OWNER_TREND_12M,
  COUNTRY_BREAKDOWN,
  TYPE_BREAKDOWN,
} from './shareholderTrend';
import { TARGETS, PEER_GAPS, PEER_OVERLAP } from './targets';

const SHORT_TREND = [
  { when: '6 months ago', value: 3.2 },
  { when: '3 months ago', value: 2.8 },
  { when: '1 month ago', value: 2.3 },
  { when: 'Now', value: 2.1 },
];

const TREND_ROWS = OWNER_TREND_12M.months.map((m, i) => ({
  month: m,
  ownerCount: OWNER_TREND_12M.ownerCount[i],
  freeFloat: OWNER_TREND_12M.freeFloat[i],
  foreign: OWNER_TREND_12M.foreign[i],
}));

const LOOKALIKE_ROWS = TARGETS.filter(
  (t) => t.peersHolding.length >= 1 && t.priority !== 'Cold'
).map((t) => ({
  ...t,
  peersJoined: t.peersHolding.join('; '),
}));

const LO_ROWS = TARGETS.filter(
  (t) => t.type === 'Fund' && t.priority !== 'Cold'
);

const OVERLAP_ROWS = PEER_OVERLAP.funds.map((f) => {
  const row = { Fund: f.name };
  PEER_OVERLAP.peers.forEach((p, i) => {
    row[p] = f.holds[i] ? 'Yes' : 'No';
  });
  return row;
});

const EXIT_ROWS = [
  {
    name: 'Alliance Bernstein Intl Growth',
    country: 'US',
    lastSeen: '2025-12-18',
    lastPct: 0.31,
    reason: 'Rotation out of small-cap healthcare',
  },
  {
    name: 'Union Bancaire Privée',
    country: 'CH',
    lastSeen: '2025-10-04',
    lastPct: 0.24,
    reason: 'Mandate closure',
  },
  {
    name: 'BNP Paribas Smaller Europe',
    country: 'FR',
    lastSeen: '2025-08-22',
    lastPct: 0.18,
    reason: 'Sector underweight',
  },
  {
    name: 'Prudential International',
    country: 'GB',
    lastSeen: '2025-07-11',
    lastPct: 0.12,
    reason: 'PM change',
  },
];

export const SHARE_MAP = {
  // ----- Dashboard -----
  ownership: buildShareContent({
    title: 'Ownership Changes — Last 30 Days',
    narrative:
      'Net buying activity has been moderate over the past 30 days, with 12 owners increasing positions and 8 decreasing. The largest single move was Nordea Investment Funds adding 45,000 shares.',
    sourceQuery:
      'SELECT name, country, delta_shares, delta_capital_pct, direction\nFROM register_changes\nWHERE event_date >= CURRENT_DATE - INTERVAL \'30 days\'\nORDER BY ABS(delta_capital_pct) DESC;',
    columns: [
      { header: 'Owner', key: 'name' },
      { header: 'Country', key: 'country' },
      { header: 'Delta Shares', key: 'deltaShares' },
      { header: 'Delta Capital %', key: 'deltaCapital' },
      { header: 'Direction', key: 'direction' },
    ],
    rows: OWNERSHIP_CHANGES,
  }),
  topHolders: buildShareContent({
    title: 'Top 25 Shareholders by Capital %',
    narrative:
      'The top 25 holders control 54.2% of capital. Concentration has decreased by 1.3 percentage points since last quarter.',
    sourceQuery:
      'SELECT rank, name, country, capital_pct, votes_pct, type\nFROM shareholders\nWHERE disclosed = true\nORDER BY capital_pct DESC\nLIMIT 25;',
    columns: [
      { header: 'Rank', key: 'rank' },
      { header: 'Owner', key: 'name' },
      { header: 'Country', key: 'country' },
      { header: 'Capital %', key: 'capitalPct' },
      { header: 'Votes %', key: 'votesPct' },
      { header: 'Type', key: 'type' },
    ],
    rows: TOP_HOLDERS,
  }),
  liquidity: buildShareContent({
    title: 'Liquidity Analysis — INTEG B vs Peers',
    narrative:
      "INTEG B's average daily turnover of €18,400 ranks 4th among its 5-company peer group. Spread has widened 12 basis points month-over-month.",
    sourceQuery:
      'SELECT name, ticker, avg_daily_turnover_eur, avg_trades_per_day, vwap, currency\nFROM liquidity_metrics\nWHERE ticker IN (SELECT ticker FROM peer_group WHERE anchor = \'INTEG B\');',
    columns: [
      { header: 'Company', key: 'name' },
      { header: 'Ticker', key: 'ticker' },
      { header: 'Avg Daily Turnover (EUR)', key: 'avgDailyTurnoverEUR' },
      { header: 'Avg Trades / Day', key: 'avgTradesPerDay' },
      { header: 'VWAP', key: 'vwap' },
      { header: 'Currency', key: 'currency' },
    ],
    rows: PEER_LIQUIDITY,
  }),
  insider: buildShareContent({
    title: 'Insider & PDMR Activity',
    narrative:
      'No new PDMR transactions in the past 14 days. Total insider ownership is 23.95% of capital, dominated by Richard Brännemark at 23.19%.',
    sourceQuery:
      'SELECT event_date, person, role, type, shares, price, value_sek\nFROM insider_transactions\nWHERE event_date >= CURRENT_DATE - INTERVAL \'90 days\'\nORDER BY event_date DESC;',
    columns: [
      { header: 'Date', key: 'date' },
      { header: 'Person', key: 'person' },
      { header: 'Role', key: 'role' },
      { header: 'Type', key: 'type' },
      { header: 'Shares', key: 'shares' },
      { header: 'Price', key: 'price' },
      { header: 'Value (SEK)', key: 'value' },
    ],
    rows: INSIDER_TRANSACTIONS,
  }),
  short: buildShareContent({
    title: 'Short Interest Overview',
    narrative:
      'Short interest in INTEG B currently stands at 2.1% of capital, down from 2.8% three months ago. One disclosed short holder remains on the register: Marshall Wace LLP at 0.62%.',
    sourceQuery:
      'SELECT period_label AS "when", short_pct AS value\nFROM short_interest_trend\nWHERE ticker = \'INTEG B\'\nORDER BY period_index ASC;',
    columns: [
      { header: 'When', key: 'when' },
      { header: 'Short %', key: 'value' },
    ],
    rows: SHORT_TREND,
  }),
  events: buildShareContent({
    title: 'Upcoming IR Calendar',
    narrative:
      'You have 3 upcoming events in the next 30 days. Q1 2026 earnings call expected around May 8. 1-on-1 with Nordea Asset Management in Stockholm on April 22. AGM confirmed for May 15 at Gothenburg Conference Centre.',
    sourceQuery:
      'SELECT event_date AS "date", type, description, location\nFROM ir_calendar\nWHERE event_date >= CURRENT_DATE\nORDER BY event_date ASC;',
    columns: [
      { header: 'Date', key: 'date' },
      { header: 'Type', key: 'type' },
      { header: 'Description', key: 'description' },
      { header: 'Location', key: 'location' },
    ],
    rows: UPCOMING_EVENTS,
  }),

  // ----- Shareholders -----
  'sh.register': buildShareContent({
    title: 'Shareholder Register',
    narrative:
      '3,498 identified holders. The top 25 control 54.2% of capital. The remaining 3,473 holders own 45.8% (~14.0M shares).',
    sourceQuery:
      'SELECT rank, name, country, capital_pct, votes_pct, type\nFROM shareholders\nWHERE disclosed = true\nORDER BY capital_pct DESC;',
    columns: [
      { header: 'Rank', key: 'rank' },
      { header: 'Owner', key: 'name' },
      { header: 'Country', key: 'country' },
      { header: 'Capital %', key: 'capitalPct' },
      { header: 'Votes %', key: 'votesPct' },
      { header: 'Type', key: 'type' },
    ],
    rows: TOP_HOLDERS,
  }),
  'sh.trend': buildShareContent({
    title: 'Owner Count — Trailing 12 Months',
    narrative:
      'Owner count has grown from 3,374 to 3,498 (+124, +3.7%) over the past 12 months. Net additions accelerated in Q1 2026.',
    sourceQuery:
      'SELECT month, owner_count, free_float_pct, foreign_pct\nFROM shareholder_trend_monthly\nWHERE month >= CURRENT_DATE - INTERVAL \'12 months\'\nORDER BY month ASC;',
    columns: [
      { header: 'Month', key: 'month' },
      { header: 'Owners', key: 'ownerCount' },
      { header: 'Free Float %', key: 'freeFloat' },
      { header: 'Foreign %', key: 'foreign' },
    ],
    rows: TREND_ROWS,
  }),
  'sh.geo': buildShareContent({
    title: 'Holders by Country',
    narrative:
      'Sweden dominates at 68.4% of capital. Norway is the second-largest country at 21.7%, almost entirely from one strategic holder (Aviva Perfusion).',
    sourceQuery:
      'SELECT country_name AS label, country AS code, SUM(capital_pct) AS capital_pct, COUNT(*) AS owner_count\nFROM shareholders\nGROUP BY country\nORDER BY capital_pct DESC;',
    columns: [
      { header: 'Country', key: 'label' },
      { header: 'Code', key: 'country' },
      { header: 'Capital %', key: 'capitalPct' },
      { header: 'Owners', key: 'ownerCount' },
    ],
    rows: COUNTRY_BREAKDOWN,
  }),
  'sh.type': buildShareContent({
    title: 'Holders by Type',
    narrative:
      'Individuals (mainly the founder + retail) own 32.4%. Funds hold 25.8%, strategic blocks 24.1%, pension/insurance 11.6%, banks 6.1%.',
    sourceQuery:
      'SELECT type, SUM(capital_pct) AS capital_pct, COUNT(*) AS owner_count, classification_note AS note\nFROM shareholders\nGROUP BY type\nORDER BY capital_pct DESC;',
    columns: [
      { header: 'Type', key: 'type' },
      { header: 'Capital %', key: 'capitalPct' },
      { header: 'Owners', key: 'ownerCount' },
      { header: 'Note', key: 'note' },
    ],
    rows: TYPE_BREAKDOWN,
  }),
  'sh.daily': buildShareContent({
    title: 'Recent Register Transactions',
    narrative:
      '10 reportable transactions over the past 14 days. Net flow: +11,396 shares into the active register.',
    sourceQuery:
      'SELECT event_date AS "date", owner, country, type, shares, value_sek\nFROM register_transactions\nWHERE event_date >= CURRENT_DATE - INTERVAL \'14 days\'\nORDER BY event_date DESC;',
    columns: [
      { header: 'Date', key: 'date' },
      { header: 'Owner', key: 'owner' },
      { header: 'Country', key: 'country' },
      { header: 'Type', key: 'type' },
      { header: 'Shares', key: 'shares' },
      { header: 'Value (SEK)', key: 'valueSEK' },
    ],
    rows: DAILY_TRANSACTIONS,
  }),
  'sh.lockup': buildShareContent({
    title: 'Lock-up Agreements',
    narrative:
      '4.34M shares (14.15% of capital) are currently locked up across 3 active agreements. The next major expiry is the founder block of 4.20M shares on June 30, 2026.',
    sourceQuery:
      'SELECT person, role, shares, pct_of_capital, expiry_date, type\nFROM lockup_agreements\nWHERE status = \'active\'\nORDER BY expiry_date ASC;',
    columns: [
      { header: 'Person', key: 'person' },
      { header: 'Role', key: 'role' },
      { header: 'Shares', key: 'shares' },
      { header: 'Capital %', key: 'pctOfCapital' },
      { header: 'Expiry', key: 'expiryDate' },
      { header: 'Type', key: 'type' },
    ],
    rows: LOCKUPS,
  }),

  // ----- Targeting -----
  'tgt.priority': buildShareContent({
    title: 'Prioritized Targets',
    narrative:
      'Top 8 AI-prioritized targets. Polar Capital Healthcare leads with a 92/100 fit score — already holds 3 of our 5 closest peers.',
    sourceQuery:
      'SELECT name, firm, type, country, aum, priority, ai_score AS score, rationale\nFROM investor_candidates\nWHERE holds_ticker = \'INTEG B\' = false\nORDER BY ai_score DESC\nLIMIT 25;',
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'Firm', key: 'firm' },
      { header: 'Type', key: 'type' },
      { header: 'Country', key: 'country' },
      { header: 'AUM', key: 'aum' },
      { header: 'Priority', key: 'priority' },
      { header: 'Score', key: 'score' },
      { header: 'Rationale', key: 'rationale' },
    ],
    rows: TARGETS,
  }),
  'tgt.lookalike': buildShareContent({
    title: 'Lookalike Holders',
    narrative:
      '6 candidates match our current holder DNA on at least 2 traits (peer overlap, type, style, geography).',
    sourceQuery:
      'SELECT name, country, string_agg(peer_ticker, \'; \') AS peers_joined, ai_score AS score, priority\nFROM investor_candidates\nJOIN peer_holdings USING (investor_id)\nWHERE peer_holdings_count >= 1\nGROUP BY investor_id\nORDER BY ai_score DESC;',
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'Country', key: 'country' },
      { header: 'Shared peers', key: 'peersJoined' },
      { header: 'Score', key: 'score' },
      { header: 'Priority', key: 'priority' },
    ],
    rows: LOOKALIKE_ROWS,
  }),
  'tgt.peergaps': buildShareContent({
    title: 'Peer Holders — Gap Analysis',
    narrative:
      '47 institutional holders own at least one of our 5 closest peers but not INTEG B. 18 of them hold 2 or more peers — highest-conversion candidates.',
    sourceQuery:
      'SELECT peer_ticker AS peer, holder, country, holding_pct, status\nFROM peer_holdings\nWHERE peer_ticker IN (SELECT ticker FROM peer_group WHERE anchor = \'INTEG B\')\n  AND holder NOT IN (SELECT name FROM shareholders WHERE ticker = \'INTEG B\')\nORDER BY holding_pct DESC;',
    columns: [
      { header: 'Peer', key: 'peer' },
      { header: 'Holder', key: 'holder' },
      { header: 'Country', key: 'country' },
      { header: 'Holds peer %', key: 'holdingPct' },
      { header: 'Status', key: 'status' },
    ],
    rows: PEER_GAPS,
  }),
  'tgt.compare': buildShareContent({
    title: 'Compare Owners — INTEG B vs 4 Peers',
    narrative:
      'Overlap matrix across INTEG B and our 4 closest peers. Cells mark ownership of each fund across each peer.',
    sourceQuery:
      'SELECT fund_name AS "Fund", peer_ticker, holds\nFROM peer_overlap_matrix\nWHERE peer_ticker IN (SELECT ticker FROM peer_group)\nPIVOT (MAX(holds) FOR peer_ticker IN (peers));',
    columns: [
      { header: 'Fund', key: 'Fund' },
      ...PEER_OVERLAP.peers.map((p) => ({ header: p, key: p })),
    ],
    rows: OVERLAP_ROWS,
  }),
  'tgt.longonly': buildShareContent({
    title: 'Long-only Funds Missing INTEG B',
    narrative:
      'Long-only funds that are a strong fit and not currently holding INTEG B. Sorted by AI fit score.',
    sourceQuery:
      'SELECT name, firm AS manager, country, aum, ai_score AS score, priority\nFROM investor_candidates\nWHERE fund_style = \'Long-only\'\n  AND holds_ticker = \'INTEG B\' = false\n  AND priority != \'Cold\'\nORDER BY ai_score DESC;',
    columns: [
      { header: 'Fund', key: 'name' },
      { header: 'Manager', key: 'firm' },
      { header: 'Country', key: 'country' },
      { header: 'AUM', key: 'aum' },
      { header: 'Score', key: 'score' },
      { header: 'Priority', key: 'priority' },
    ],
    rows: LO_ROWS,
  }),
  'tgt.exits': buildShareContent({
    title: 'Recently Exited Holders',
    narrative:
      '4 institutional holders have exited the register in the past 12 months. Each is a potential winback candidate.',
    sourceQuery:
      'SELECT name AS holder, country, last_seen_date AS last_seen, last_capital_pct AS last_pct, exit_reason AS reason\nFROM shareholders\nWHERE status = \'exited\'\n  AND last_seen_date >= CURRENT_DATE - INTERVAL \'12 months\'\nORDER BY last_seen_date DESC;',
    columns: [
      { header: 'Holder', key: 'name' },
      { header: 'Country', key: 'country' },
      { header: 'Last seen', key: 'lastSeen' },
      { header: 'Last %', key: 'lastPct' },
      { header: 'Reason', key: 'reason' },
    ],
    rows: EXIT_ROWS,
  }),
};

export function getShareForL1Type(responseType) {
  return SHARE_MAP[responseType] || null;
}
