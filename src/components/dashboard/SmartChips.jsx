import ChipGroup from '../ui/ChipGroup';

export const TOP_CHIPS = [
  { id: 'buyers', label: "Who's been buying?", responseType: 'ownership' },
  { id: 'top25', label: 'Show me top 25 holders', responseType: 'topHolders' },
  { id: 'liquidity', label: 'Liquidity vs peers', responseType: 'liquidity' },
  { id: 'insider', label: 'Any insider activity?', responseType: 'insider' },
  { id: 'short', label: 'Short interest trend', responseType: 'short' },
  { id: 'events', label: 'Upcoming IR events', responseType: 'events' },
];

const TOP_EXPANSION = [
  { id: 'exp-top-news', label: "Sentiment from yesterday's news flow" },
  { id: 'exp-top-quarter', label: "Compare to last quarter's briefing" },
  { id: 'exp-top-anomalies', label: 'Highlight unusual signals' },
];

export default function SmartChips({ onSelect, isChipSpent, onShowToast }) {
  return (
    <ChipGroup
      chips={TOP_CHIPS}
      expansionChips={TOP_EXPANSION}
      onChipClick={onSelect}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
    />
  );
}
