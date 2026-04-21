import ListScreen from '../../screen/ListScreen';
import { LOCKUPS, LOCKUP_SUMMARY } from '../../../data/lockups';
import { formatDateShort, formatNumber, formatPct } from '../../../utils/formatters';
import InvestorLink from '../InvestorLink';

export default function LockupsView() {
  const columns = [
    {
      header: 'Person',
      key: 'person',
      render: (r) => <InvestorLink name={r.person} />,
    },
    {
      header: 'Role',
      key: 'role',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{r.role}</span>
      ),
    },
    {
      header: 'Type',
      key: 'type',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{r.type}</span>
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
      header: 'Capital %',
      key: 'pctOfCapital',
      align: 'right',
      nowrap: true,
      weight: 500,
      render: (r) => formatPct(r.pctOfCapital),
    },
    {
      header: 'Expiry',
      key: 'expiryDate',
      nowrap: true,
      render: (r) => formatDateShort(r.expiryDate),
    },
  ];

  return (
    <ListScreen
      inArtifact
      title="Lock-ups"
      subtitle={`${LOCKUP_SUMMARY.activeAgreements} active agreements · ${formatNumber(LOCKUP_SUMMARY.totalShares)} shares locked (${LOCKUP_SUMMARY.pctOfCapital}% of capital) · next expiry ${formatDateShort(LOCKUP_SUMMARY.nextExpiryDate)}`}
      searchPlaceholder="Search by person, role, or type…"
      searchFields={['person', 'role', 'type']}
      columns={columns}
      rows={LOCKUPS}
    />
  );
}
