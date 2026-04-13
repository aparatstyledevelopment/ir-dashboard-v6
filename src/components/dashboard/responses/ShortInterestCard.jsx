import ResponseCard from './ResponseCard';
import BarChart from '../../ui/BarChart';
import { formatPct } from '../../../utils/formatters';
import { buildShareContent } from '../../../utils/shareContent';

const SHORT_TREND = [
  { when: '6 months ago', value: 3.2 },
  { when: '3 months ago', value: 2.8 },
  { when: '1 month ago', value: 2.3 },
  { when: 'Now', value: 2.1 },
];

const SHARE = buildShareContent({
  title: 'Short Interest Overview',
  narrative:
    'Short interest in INTEG B currently stands at 2.1% of capital, down from 2.8% three months ago. One disclosed short holder remains on the register: Marshall Wace LLP at 0.62%.',
  columns: [
    { header: 'When', key: 'when' },
    { header: 'Short %', key: 'value' },
  ],
  rows: SHORT_TREND,
});

export default function ShortInterestCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  return (
    <ResponseCard
      title="Short Interest Overview"
      followUps={[
        { id: 'l2.short.holders', label: 'Show short holders' },
        { id: 'l2.short.vs-price', label: 'Short vs stock price' },
        { id: 'l2.short.peers', label: 'Peer short comparison' },
      ]}
      expansionChips={[
        [
          { id: 'exp.short.squeeze', label: 'Squeeze-risk forecast' },
          { id: 'exp.short.closers', label: 'Identify likely short closers' },
          { id: 'exp.short.rotation', label: 'Sector short rotation signals' },
        ],
        [
          { id: 'exp.short.borrow', label: 'Estimate borrow-cost trajectory' },
          { id: 'exp.short.ladder', label: 'Detect short ladder build-up' },
          { id: 'exp.short.narrative', label: 'Auto-draft anti-short narrative' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for short interest — squeeze risk modelling ships with production."
      mockToast="In production, this would join borrow data, options flow, and short tape."
      sourceModule="Short → Short Analysis"
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
      onAttach={onAttach}
      isAttached={isAttached}
      shareContent={SHARE}
    >
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: '0 0 14px',
          letterSpacing: '-0.01em',
        }}
      >
        Short interest in INTEG B currently stands at{' '}
        <span className="cb-num">2.1%</span> of capital,{' '}
        <span className="cb-pos">down from 2.8% three months ago</span>. One
        disclosed short holder remains on the register:{' '}
        <span className="cb-strong">Marshall Wace LLP</span> with a{' '}
        <span className="cb-num">0.62%</span> position, unchanged since
        February.
      </p>
      <BarChart
        data={[
          { key: 'm6', label: '6 months ago', value: 3.2 },
          { key: 'm3', label: '3 months ago', value: 2.8 },
          { key: 'm1', label: '1 month ago', value: 2.3 },
          { key: 'now', label: 'Now', value: 2.1 },
        ]}
        highlightKey="now"
        valueFormatter={formatPct}
      />
    </ResponseCard>
  );
}
