import ChipGroup from '../ui/ChipGroup';

export const SH_TOP_CHIPS = [
  { id: 'create-report', label: 'Create report', kind: 'report', reportId: 'shareholders' },
  { id: 'sh.register', label: 'Show full register', responseType: 'sh.register' },
  { id: 'sh.trend', label: 'Owner trend (12 months)', responseType: 'sh.trend' },
  { id: 'sh.geo', label: 'Geographic breakdown', responseType: 'sh.geo' },
  { id: 'sh.type', label: 'By owner type', responseType: 'sh.type' },
  { id: 'sh.daily', label: 'Daily transactions', responseType: 'sh.daily' },
  { id: 'sh.lockup', label: 'Lock-up status', responseType: 'sh.lockup' },
];

const SH_TOP_EXPANSION = [
  [
    { id: 'exp-sh-watchlist', label: 'Surface unusual holders to watch' },
    { id: 'exp-sh-similar', label: 'Find peers with similar register shape' },
    { id: 'exp-sh-predict', label: 'Predict next quarter movers' },
  ],
  [
    { id: 'exp-sh-priority', label: "Auto-prioritize this week's outreach" },
    { id: 'exp-sh-aligned', label: 'Detect aligned long-only candidates' },
    { id: 'exp-sh-sentiment', label: 'Score holder sentiment' },
  ],
];

const SH_TOP_EXPANDED_TOAST =
  "You've seen the AI suggestions for the shareholder briefing — register intelligence ships with production.";
const SH_TOP_MOCK_TOAST =
  'In production, this would synthesize register intel from filings, CRM, and 13F flows.';

export default function ShareholdersChips({ onSelect, isChipSpent, onShowToast }) {
  return (
    <ChipGroup
      chips={SH_TOP_CHIPS}
      expansionChips={SH_TOP_EXPANSION}
      expandedToast={SH_TOP_EXPANDED_TOAST}
      mockToast={SH_TOP_MOCK_TOAST}
      onChipClick={onSelect}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
    />
  );
}
