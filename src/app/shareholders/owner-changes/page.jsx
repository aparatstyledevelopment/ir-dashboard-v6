import { Link } from 'react-router-dom';
import ListScreen from '../../../components/screen/ListScreen';
import { OWNERSHIP_CHANGES } from '../../../data/ownershipChanges';
import { flagFor } from '../../../utils/countryFlags';
import { formatSignedInt, formatSignedPct } from '../../../utils/formatters';
import { slugify } from '../../../utils/slug';

export default function OwnerChangesListPage() {
  const columns = [
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
      header: 'Δ Shares',
      key: 'deltaShares',
      align: 'right',
      width: '120px',
      nowrap: true,
      render: (r) => formatSignedInt(r.deltaShares),
    },
    {
      header: 'Δ Capital',
      key: 'deltaCapital',
      align: 'right',
      width: '110px',
      nowrap: true,
      render: (r) => formatSignedPct(r.deltaCapital),
    },
    {
      header: 'Direction',
      key: 'direction',
      align: 'center',
      width: '96px',
      render: (r) =>
        r.direction === 'increase' ? (
          <span
            style={{ color: 'var(--positive)', fontWeight: 600, fontSize: '11px' }}
          >
            ▲ BUY
          </span>
        ) : (
          <span
            style={{ color: 'var(--negative)', fontWeight: 600, fontSize: '11px' }}
          >
            ▼ SELL
          </span>
        ),
    },
  ];

  return (
    <ListScreen
      title="Owner changes"
      subtitle="Net ownership moves over the past 30 days — 12 holders increased, 8 reduced, net +65k shares."
      searchPlaceholder="Search by owner or country…"
      searchFields={['name', 'country', 'direction']}
      columns={columns}
      rows={OWNERSHIP_CHANGES}
    />
  );
}
