import { Link } from 'react-router-dom';
import ResponseCard from '../../dashboard/responses/ResponseCard';
import DataTable from '../../ui/DataTable';
import { DAILY_TRANSACTIONS } from '../../../data/dailyTransactions';
import {
  formatDateShort,
  formatNumber,
} from '../../../utils/formatters';
import { flagFor } from '../../../utils/countryFlags';
import { slugify } from '../../../utils/slug';
import { buildShareContent } from '../../../utils/shareContent';

const SHARE = buildShareContent({
  title: 'Recent Register Transactions',
  narrative:
    '10 reportable transactions over the past 14 days. Net flow: +11,396 shares into the active register.',
  columns: [
    { header: 'Date', key: 'date' },
    { header: 'Owner', key: 'owner' },
    { header: 'Country', key: 'country' },
    { header: 'Type', key: 'type' },
    { header: 'Shares', key: 'shares' },
    { header: 'Value (SEK)', key: 'valueSEK' },
  ],
  rows: DAILY_TRANSACTIONS,
});

export default function DailyTransactionsCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  const columns = [
    {
      header: 'Date',
      key: 'date',
      nowrap: true,
      render: (r) => formatDateShort(r.date),
    },
    {
      header: 'Owner',
      key: 'owner',
      render: (r) => (
        <Link to={`/investor/${slugify(r.owner)}`} className="cb-link">
          {r.owner}
        </Link>
      ),
    },
    {
      header: 'Country',
      key: 'country',
      align: 'center',
      render: (r) => (
        <span style={{ fontSize: '13px' }} title={r.country}>
          {flagFor(r.country)}
        </span>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      render: (r) => (
        <span
          style={{
            color:
              r.type === 'BUY' ? 'var(--positive)' : 'var(--negative)',
            fontWeight: 600,
            fontSize: '11px',
            letterSpacing: '0.04em',
          }}
        >
          {r.type === 'BUY' ? '▲ BUY' : '▼ SELL'}
        </span>
      ),
    },
    {
      header: 'Shares',
      key: 'shares',
      align: 'right',
      nowrap: true,
      render: (r) => formatNumber(r.shares),
    },
    {
      header: 'Value (SEK)',
      key: 'valueSEK',
      align: 'right',
      nowrap: true,
      render: (r) => formatNumber(r.valueSEK),
    },
  ];

  return (
    <ResponseCard
      title="Recent Register Transactions"
      followUps={[
        { id: 'l2.sh.tx.last7', label: 'Last 7 days only' },
        { id: 'l2.sh.tx.large', label: 'Large transactions only (>€100k)' },
        { id: 'l2.sh.tx.byowner', label: 'Group by owner' },
      ]}
      expansionChips={[
        [
          { id: 'exp.sh.tx.cluster', label: 'Surface unusual trade clusters' },
          { id: 'exp.sh.tx.coord', label: 'Detect coordinated activity' },
          { id: 'exp.sh.tx.fcst', label: 'Forecast next-day flow' },
        ],
        [
          { id: 'exp.sh.tx.signature', label: 'Match against known fund signatures' },
          { id: 'exp.sh.tx.alert', label: 'Set transaction alerts' },
          { id: 'exp.sh.tx.tape', label: 'Cross-reference with raw tape' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for transactions — trade-stream intelligence ships with production."
      mockToast="In production, this would join the register tape with broker flow signals."
      sourceModule="Shareholders → Daily Transactions"
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
          lineHeight: 1.65,
          margin: '0 0 14px',
          letterSpacing: '-0.01em',
        }}
      >
        <span className="cb-num">10</span> reportable transactions in the past{' '}
        <span className="cb-num">14</span> days.{' '}
        <span className="cb-pos">7 buys</span> totalling{' '}
        <span className="cb-pos">+40,500 shares</span>,{' '}
        <span className="cb-neg">3 sells</span> totalling{' '}
        <span className="cb-neg">−29,104 shares</span>. Net flow:{' '}
        <span className="cb-pos">+11,396 shares</span> into the active register.
      </p>
      <DataTable columns={columns} rows={DAILY_TRANSACTIONS} />
    </ResponseCard>
  );
}
