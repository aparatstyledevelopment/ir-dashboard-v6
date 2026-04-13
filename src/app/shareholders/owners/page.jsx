import { Link } from 'react-router-dom';
import ListScreen from '../../../components/screen/ListScreen';
import { TOP_HOLDERS } from '../../../data/holders';
import { flagFor } from '../../../utils/countryFlags';
import { formatPct } from '../../../utils/formatters';
import { slugify } from '../../../utils/slug';

export default function OwnersListPage() {
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
      render: (r) => (
        <Link to={`/investor/${slugify(r.name)}`} className="cb-link">
          {r.name}
        </Link>
      ),
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
      title="All shareholders"
      subtitle="3,498 identified holders · Top 25 shown below · remaining 3,473 holders combine to 45.8% of capital"
      backTo="/shareholders"
      backLabel="Back to Shareholders"
      searchPlaceholder="Search by name, country, or type…"
      searchFields={['name', 'country', 'type']}
      columns={columns}
      rows={TOP_HOLDERS}
    />
  );
}
