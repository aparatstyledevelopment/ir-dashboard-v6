import ListScreen from '../../screen/ListScreen';
import { TARGETS } from '../../../data/targets';
import { flagFor } from '../../../utils/countryFlags';

const PRIORITY_COLOR = {
  Hot: 'var(--negative)',
  Warm: 'var(--text-primary)',
  Cold: 'var(--text-tertiary)',
};

export default function ScreenerView() {
  const columns = [
    { header: 'Target', key: 'name', weight: 500 },
    {
      header: 'Firm',
      key: 'firm',
      render: (r) => <span style={{ color: 'var(--text-secondary)' }}>{r.firm}</span>,
    },
    {
      header: 'Type',
      key: 'type',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{r.type}</span>
      ),
    },
    {
      header: 'Country',
      key: 'country',
      align: 'center',
      render: (r) => <span style={{ fontSize: '13px' }}>{flagFor(r.country)}</span>,
    },
    {
      header: 'AUM',
      key: 'aum',
      render: (r) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{r.aum}</span>
      ),
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (r) => (
        <span
          style={{
            color: PRIORITY_COLOR[r.priority],
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          ● {r.priority}
        </span>
      ),
    },
    {
      header: 'Score',
      key: 'score',
      align: 'right',
      weight: 600,
      render: (r) => r.score,
    },
  ];

  return (
    <ListScreen
      inArtifact
      title="Targeting screener"
      subtitle={`${TARGETS.length} candidate investors ranked by AI fit score · ${TARGETS.filter((t) => t.priority === 'Hot').length} hot · ${TARGETS.filter((t) => t.priority === 'Warm').length} warm · ${TARGETS.filter((t) => t.priority === 'Cold').length} cold`}
      searchPlaceholder="Search by name, firm, country, or type…"
      searchFields={['name', 'firm', 'type', 'country', 'priority']}
      columns={columns}
      rows={TARGETS}
    />
  );
}
