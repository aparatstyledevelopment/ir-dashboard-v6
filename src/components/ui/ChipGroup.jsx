import { useState } from 'react';
import Chip from './Chip';

const DEFAULT_EXPANSION = [
  { id: 'exp-deep-dive', label: 'AI deep-dive on this' },
  { id: 'exp-explain', label: "Explain like I'm new" },
  { id: 'exp-report', label: 'Generate one-page report' },
];

export default function ChipGroup({
  chips = [],
  expansionChips,
  onChipClick,
  onShowToast,
  isChipSpent,
  showExpand = true,
}) {
  const [expanded, setExpanded] = useState(false);
  const expansion = expansionChips || DEFAULT_EXPANSION;

  const handleExpand = () => {
    if (expanded) {
      onShowToast?.(
        'AI Expand is illustrative — full suggestions arrive in the finished product.'
      );
    } else {
      setExpanded(true);
    }
  };

  const handleMockClick = () => {
    onShowToast?.(
      'Mockup suggestion — this would trigger an AI deep-dive in the finished product.'
    );
  };

  return (
    <div className="cb-chip-group">
      {chips.map((c, i) => (
        <Chip
          key={c.id || `chip-${i}`}
          onClick={() => onChipClick?.(c)}
          spent={isChipSpent ? isChipSpent(c.id) : false}
        >
          {c.label}
        </Chip>
      ))}
      {expanded &&
        expansion.map((c, i) => (
          <Chip
            key={c.id || `exp-${i}`}
            mock
            onClick={handleMockClick}
          >
            {c.label}
          </Chip>
        ))}
      {showExpand && (
        <Chip
          variant="expand"
          onClick={handleExpand}
          ariaLabel={
            expanded
              ? 'AI Expand (already expanded)'
              : 'AI Expand suggestions'
          }
          title="AI Expand"
        />
      )}
    </div>
  );
}
