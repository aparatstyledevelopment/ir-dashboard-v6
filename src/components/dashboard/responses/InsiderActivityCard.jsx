import ResponseCard from './ResponseCard';
import DataTable from '../../ui/DataTable';
import { INSIDER_TRANSACTIONS } from '../../../data/insiderTransactions';
import { formatDateShort, formatSignedInt, formatPrice } from '../../../utils/formatters';

export default function InsiderActivityCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  return (
    <ResponseCard
      title="Insider & PDMR Activity"
      followUps={[
        { id: 'l2.insider.all-tx', label: 'Show all insider transactions' },
        { id: 'l2.insider.holdings', label: 'Board & management holdings' },
        { id: 'l2.insider.trend', label: 'Insider ownership trend' },
      ]}
      expansionChips={[
        [
          { id: 'exp.ins.predict', label: 'Predict next insider trade' },
          { id: 'exp.ins.options', label: 'Cross-reference with options activity' },
          { id: 'exp.ins.minutes', label: 'Sentiment from board minutes' },
        ],
        [
          { id: 'exp.ins.vesting', label: 'Estimate vesting cliff impact' },
          { id: 'exp.ins.conviction', label: 'Map insider conviction over time' },
          { id: 'exp.ins.boardbrief', label: 'Auto-draft board briefing' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for insider activity — intent inference ships with production."
      mockToast="In production, this would join PDMR filings with options flow and meeting minutes."
      sourceModule="Insider → Transactions"
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
      onAttach={onAttach}
      isAttached={isAttached}
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
        No new PDMR transactions in the past 14 days. Total insider ownership
        is <span className="cb-num">23.95%</span> of capital, dominated by{' '}
        <span className="cb-strong">Richard Brännemark</span>{' '}
        (<span className="cb-num">23.19%</span>). Showing the 3 most recent
        filings below.
      </p>
      <DataTable
        columns={[
          {
            header: 'Date',
            key: 'date',
            nowrap: true,
            width: '72px',
            render: (r) => formatDateShort(r.date),
          },
          { header: 'Person', key: 'person' },
          {
            header: 'Role',
            key: 'role',
            render: (r) => (
              <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                {r.role}
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
                    r.type === 'Acquisition'
                      ? 'var(--positive)'
                      : 'var(--negative)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {r.type === 'Acquisition' ? '▲ BUY' : '▼ SELL'}
              </span>
            ),
          },
          {
            header: 'Shares',
            key: 'shares',
            align: 'right',
            nowrap: true,
            render: (r) =>
              formatSignedInt(
                r.type === 'Acquisition' ? r.shares : -r.shares
              ),
          },
          {
            header: 'Price',
            key: 'price',
            align: 'right',
            nowrap: true,
            render: (r) => formatPrice(r.price, 'SEK'),
          },
        ]}
        rows={INSIDER_TRANSACTIONS}
      />
    </ResponseCard>
  );
}
