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
  [
    { id: 'exp-top-news', label: "Sentiment from yesterday's news flow" },
    { id: 'exp-top-quarter', label: "Compare to last quarter's briefing" },
    { id: 'exp-top-anomalies', label: 'Highlight unusual signals' },
  ],
  [
    { id: 'exp-top-execsnap', label: 'Generate exec snapshot' },
    { id: 'exp-top-dataroom', label: 'Find dataroom anomalies' },
    { id: 'exp-top-chatter', label: 'Compare with sector chatter' },
  ],
];

const TOP_EXPANDED_TOAST =
  "You've seen the AI suggestions for the morning briefing — continuous synthesis ships with production.";
const TOP_MOCK_TOAST =
  'In production, this would generate a fresh AI briefing card from live cross-module data.';

export default function SmartChips({ onSelect, isChipSpent, onShowToast }) {
  return (
    <ChipGroup
      chips={TOP_CHIPS}
      expansionChips={TOP_EXPANSION}
      expandedToast={TOP_EXPANDED_TOAST}
      mockToast={TOP_MOCK_TOAST}
      onChipClick={onSelect}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
    />
  );
}
