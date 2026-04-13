import ChipGroup from '../ui/ChipGroup';

export const TGT_TOP_CHIPS = [
  {
    id: 'tgt.priority',
    label: 'Show prioritized targets',
    responseType: 'tgt.priority',
  },
  {
    id: 'tgt.lookalike',
    label: 'Find lookalike holders',
    responseType: 'tgt.lookalike',
  },
  {
    id: 'tgt.peergaps',
    label: "Peers we're not matching",
    responseType: 'tgt.peergaps',
  },
  {
    id: 'tgt.compare',
    label: 'Compare our top 5 vs peers',
    responseType: 'tgt.compare',
  },
  {
    id: 'tgt.longonly',
    label: 'Long-only funds missing us',
    responseType: 'tgt.longonly',
  },
  {
    id: 'tgt.exits',
    label: 'Recently-exited holders',
    responseType: 'tgt.exits',
  },
];

const TGT_TOP_EXPANSION = [
  [
    { id: 'exp-tgt-roadshow', label: 'Plan next roadshow by target cluster' },
    { id: 'exp-tgt-brief', label: 'Auto-generate target engagement brief' },
    { id: 'exp-tgt-peer', label: 'Find funds watching our peers' },
  ],
  [
    { id: 'exp-tgt-rank', label: 'Re-rank by conviction & fit' },
    { id: 'exp-tgt-intro', label: 'Identify warm intros via sell-side' },
    { id: 'exp-tgt-calendar', label: 'Match targets to upcoming events' },
  ],
];

const TGT_TOP_EXPANDED_TOAST =
  "You've seen the AI suggestions for targeting — full continuous discovery ships with production.";
const TGT_TOP_MOCK_TOAST =
  'In production, this would refresh targeting from live filings, peer registers, and CRM signals.';

export default function TargetingChips({ onSelect, isChipSpent, onShowToast }) {
  return (
    <ChipGroup
      chips={TGT_TOP_CHIPS}
      expansionChips={TGT_TOP_EXPANSION}
      expandedToast={TGT_TOP_EXPANDED_TOAST}
      mockToast={TGT_TOP_MOCK_TOAST}
      onChipClick={onSelect}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
    />
  );
}
