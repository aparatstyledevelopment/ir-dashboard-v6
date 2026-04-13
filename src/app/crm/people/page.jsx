import ListScreen from '../../../components/screen/ListScreen';
import { CONTACTS } from '../../../data/contacts';
import { flagFor } from '../../../utils/countryFlags';
import { formatDateShort } from '../../../utils/formatters';

const SENTIMENT_COLOR = {
  positive: 'var(--positive)',
  neutral: 'var(--text-tertiary)',
  negative: 'var(--negative)',
};

const SENTIMENT_LABEL = {
  positive: '● Positive',
  neutral: '● Neutral',
  negative: '● Negative',
};

export default function PeopleListPage() {
  const columns = [
    {
      header: 'Name',
      key: 'name',
      weight: 500,
    },
    {
      header: 'Firm',
      key: 'firm',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)' }}>{r.firm}</span>
      ),
    },
    {
      header: 'Role',
      key: 'role',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{r.role}</span>
      ),
    },
    {
      header: 'Country',
      key: 'country',
      align: 'center',
      render: (r) => <span style={{ fontSize: '13px' }}>{flagFor(r.country)}</span>,
    },
    {
      header: 'Tier',
      key: 'tier',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{r.tier}</span>
      ),
    },
    {
      header: 'Sentiment',
      key: 'sentiment',
      render: (r) => (
        <span
          style={{
            color: SENTIMENT_COLOR[r.sentiment],
            fontSize: '11px',
            fontWeight: 500,
          }}
        >
          {SENTIMENT_LABEL[r.sentiment]}
        </span>
      ),
    },
    {
      header: 'Last contact',
      key: 'lastContact',
      nowrap: true,
      render: (r) => (
        <span style={{ color: 'var(--text-tertiary)' }}>{formatDateShort(r.lastContact)}</span>
      ),
    },
  ];

  return (
    <ListScreen
      title="All contacts"
      subtitle={`${CONTACTS.length} tracked contacts across ${new Set(CONTACTS.map((c) => c.firm)).size} firms`}
      backTo="/"
      backLabel="Back to Dashboard"
      searchPlaceholder="Search by name, firm, role, or tag…"
      searchFields={['name', 'firm', 'role', 'country', 'tier']}
      columns={columns}
      rows={CONTACTS}
    />
  );
}
