import Chip from '../ui/Chip';

export const TOP_CHIPS = [
  { id: 'buyers', label: "Who's been buying?", responseType: 'ownership' },
  { id: 'top25', label: 'Show me top 25 holders', responseType: 'topHolders' },
  { id: 'liquidity', label: 'Liquidity vs peers', responseType: 'liquidity' },
  { id: 'insider', label: 'Any insider activity?', responseType: 'insider' },
  { id: 'short', label: 'Short interest trend', responseType: 'short' },
  { id: 'events', label: 'Upcoming IR events', responseType: 'events' },
];

export default function SmartChips({ onSelect, isChipSpent }) {
  return (
    <div
      className="no-scrollbar"
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        flexWrap: 'nowrap',
        paddingBottom: '2px',
      }}
    >
      {TOP_CHIPS.map((c) => (
        <Chip
          key={c.id}
          onClick={() => onSelect(c)}
          spent={isChipSpent ? isChipSpent(c.id) : false}
        >
          {c.label}
        </Chip>
      ))}
    </div>
  );
}
