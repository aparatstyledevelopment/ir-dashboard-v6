import ResponseCard from './ResponseCard';
import DataTable from '../../ui/DataTable';
import { OWNERSHIP_CHANGES } from '../../../data/ownershipChanges';
import { flagFor } from '../../../utils/countryFlags';
import { formatSignedInt, formatSignedPct } from '../../../utils/formatters';

export default function OwnershipChangesCard({ onFollowUp, onSourceOpen }) {
  const columns = [
    {
      header: 'Owner',
      key: 'name',
      render: (r) => (
        <span style={{ color: 'var(--text-primary)' }}>{r.name}</span>
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
      header: 'Δ Shares',
      align: 'right',
      nowrap: true,
      render: (r) => formatSignedInt(r.deltaShares),
    },
    {
      header: 'Δ Capital',
      align: 'right',
      nowrap: true,
      render: (r) => formatSignedPct(r.deltaCapital),
    },
    {
      header: 'Dir',
      align: 'center',
      render: (r) =>
        r.direction === 'increase' ? (
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>▲</span>
        ) : (
          <span style={{ color: 'var(--text-tertiary)' }}>▼</span>
        ),
    },
  ];

  return (
    <ResponseCard
      title="Ownership Changes — Last 30 Days"
      followUps={[
        'View full owner list',
        'Compare to last quarter',
        'Show foreign buyers only',
      ]}
      sourceModule="Shareholders → Owner Changes"
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
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
        Net buying activity has been moderate over the past 30 days, with 12 owners increasing
        positions and 8 decreasing. The largest single move was Nordea Investment Funds adding
        45,000 shares.
      </p>
      <DataTable columns={columns} rows={OWNERSHIP_CHANGES} />
    </ResponseCard>
  );
}
