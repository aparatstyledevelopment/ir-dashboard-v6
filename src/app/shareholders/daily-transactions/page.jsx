import { Link } from 'react-router-dom';
import ListScreen from '../../../components/screen/ListScreen';
import { DAILY_TRANSACTIONS } from '../../../data/dailyTransactions';
import { flagFor } from '../../../utils/countryFlags';
import { formatDateShort, formatNumber } from '../../../utils/formatters';
import { slugify } from '../../../utils/slug';

export default function DailyTransactionsListPage() {
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
      render: (r) => <span style={{ fontSize: '13px' }}>{flagFor(r.country)}</span>,
    },
    {
      header: 'Type',
      key: 'type',
      render: (r) => (
        <span
          style={{
            color: r.type === 'BUY' ? 'var(--positive)' : 'var(--negative)',
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
    <ListScreen
      title="Daily transactions T+2"
      subtitle="Reported register activity for the past 14 days. Transactions settle T+2."
      backTo="/shareholders"
      backLabel="Back to Shareholders"
      searchPlaceholder="Search by owner, country, or type…"
      searchFields={['owner', 'country', 'type']}
      columns={columns}
      rows={DAILY_TRANSACTIONS}
    />
  );
}
