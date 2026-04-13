import { useState } from 'react';
import Chip from './Chip';

const DEFAULT_EXPANSION = [
  [
    { id: 'exp-deep-dive', label: 'AI deep-dive on this' },
    { id: 'exp-explain', label: "Explain like I'm new" },
    { id: 'exp-report', label: 'Generate one-page report' },
  ],
  [
    { id: 'exp-peer', label: 'Compare with peer companies' },
    { id: 'exp-history', label: 'Show 5-year history' },
    { id: 'exp-deck', label: 'Export to slide deck' },
  ],
];

const DEFAULT_EXPANDED_TOAST =
  "You've seen the AI suggestions for this view — full continuous expansion ships in the production model.";
const DEFAULT_MOCK_TOAST =
  'Mockup suggestion — this would trigger an AI deep-dive in the finished product.';

// Normalize expansionChips into an array of stages.
// Accepts either a flat array (single stage) or an array of arrays (multi-stage).
function normalizeStages(expansionChips) {
  const raw = expansionChips || DEFAULT_EXPANSION;
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return Array.isArray(raw[0]) ? raw : [raw];
}

export default function ChipGroup({
  chips = [],
  expansionChips,
  expandedToast,
  mockToast,
  onChipClick,
  onShowToast,
  isChipSpent,
  showExpand = true,
}) {
  const stages = normalizeStages(expansionChips);
  const [stageIndex, setStageIndex] = useState(0);
  const expandedMsg = expandedToast || DEFAULT_EXPANDED_TOAST;
  const mockMsg = mockToast || DEFAULT_MOCK_TOAST;

  const handleExpand = () => {
    if (stageIndex >= stages.length) {
      onShowToast?.(expandedMsg);
    } else {
      setStageIndex(stageIndex + 1);
    }
  };

  const handleMockClick = () => {
    onShowToast?.(mockMsg);
  };

  const visibleExpansion = stages.slice(0, stageIndex).flat();

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
      {visibleExpansion.map((c, i) => (
        <Chip key={c.id || `exp-${i}`} mock onClick={handleMockClick}>
          {c.label}
        </Chip>
      ))}
      {showExpand && (
        <Chip
          variant="expand"
          onClick={handleExpand}
          ariaLabel={
            stageIndex >= stages.length
              ? 'AI Expand (no more suggestions)'
              : 'AI Expand suggestions'
          }
          title="AI Expand"
        />
      )}
    </div>
  );
}
