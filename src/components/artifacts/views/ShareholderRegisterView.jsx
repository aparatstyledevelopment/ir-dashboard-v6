import ListScreen from '../../screen/ListScreen';
import { TOP_HOLDERS } from '../../../data/holders';
import { flagFor } from '../../../utils/countryFlags';
import { formatPct } from '../../../utils/formatters';
import InvestorLink from '../InvestorLink';

export default function ShareholderRegisterView() {
  const columns = [
    {
      header: '#',
      key: 'rank',
      align: 'right',
      nowrap: true,
      width: '48px',
      render: (r) => <span style={{ color: 'var(--text-tertiary)' }}>{r.rank}</span>,
    },
    {
      header: 'Owner',
      key: 'name',
      render: (r) => <InvestorLink name={r.name} />,
    },
    {
      header: 'Country',
      key: 'country',
      align: 'center',
      width: '72px',
      render: (r) => <span style={{ fontSize: '13px' }}>{flagFor(r.country)}</span>,
    },
    {
      header: 'Type',
      key: 'type',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{r.type}</span>
      ),
    },
    {
      header: 'Capital %',
      key: 'capitalPct',
      align: 'right',
      width: '100px',
      weight: 500,
      render: (r) => formatPct(r.capitalPct),
    },
    {
      header: 'Votes %',
      key: 'votesPct',
      align: 'right',
      width: '100px',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)' }}>{formatPct(r.votesPct)}</span>
      ),
    },
  ];

  return (
    <ListScreen
      inArtifact
      title="All shareholders"
      subtitle="3,498 identified holders · Top 25 shown below · remaining 3,473 holders combine to 45.8% of capital"
      searchPlaceholder="Search by name, country, or type…"
      searchFields={['name', 'country', 'type']}
      columns={columns}
      rows={TOP_HOLDERS}
    />
  );
}
