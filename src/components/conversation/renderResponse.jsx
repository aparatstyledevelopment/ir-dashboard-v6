// Global response renderer. Any module page can render ANY response type
// (dashboard, shareholders, or targeting L1 + every L2 catalog entry +
// generic / free-text), which is what the /all slash command needs.

import OwnershipChangesCard from '../dashboard/responses/OwnershipChangesCard';
import TopHoldersCard from '../dashboard/responses/TopHoldersCard';
import LiquidityComparisonCard from '../dashboard/responses/LiquidityComparisonCard';
import InsiderActivityCard from '../dashboard/responses/InsiderActivityCard';
import ShortInterestCard from '../dashboard/responses/ShortInterestCard';
import UpcomingEventsCard from '../dashboard/responses/UpcomingEventsCard';

import RegisterCard from '../shareholders/responses/RegisterCard';
import OwnerTrendCard from '../shareholders/responses/OwnerTrendCard';
import GeographyCard from '../shareholders/responses/GeographyCard';
import OwnerTypeCard from '../shareholders/responses/OwnerTypeCard';
import DailyTransactionsCard from '../shareholders/responses/DailyTransactionsCard';
import LockUpsCard from '../shareholders/responses/LockUpsCard';

import PriorityTargetsCard from '../targeting/responses/PriorityTargetsCard';
import LookalikeCard from '../targeting/responses/LookalikeCard';
import PeerGapsCard from '../targeting/responses/PeerGapsCard';
import CompareOwnersCard from '../targeting/responses/CompareOwnersCard';
import LongOnlyMissingCard from '../targeting/responses/LongOnlyMissingCard';
import RecentExitsCard from '../targeting/responses/RecentExitsCard';

import GenericResponseCard from '../dashboard/responses/GenericResponseCard';
import DynamicResponseCard from '../dashboard/responses/DynamicResponseCard';
import ReportGeneratingCard from '../shared/ReportGeneratingCard';
import ReportReadyCard from '../shared/ReportReadyCard';

const L1_COMPONENTS = {
  // Dashboard
  ownership: OwnershipChangesCard,
  topHolders: TopHoldersCard,
  liquidity: LiquidityComparisonCard,
  insider: InsiderActivityCard,
  short: ShortInterestCard,
  events: UpcomingEventsCard,
  // Shareholders
  'sh.register': RegisterCard,
  'sh.trend': OwnerTrendCard,
  'sh.geo': GeographyCard,
  'sh.type': OwnerTypeCard,
  'sh.daily': DailyTransactionsCard,
  'sh.lockup': LockUpsCard,
  // Targeting
  'tgt.priority': PriorityTargetsCard,
  'tgt.lookalike': LookalikeCard,
  'tgt.peergaps': PeerGapsCard,
  'tgt.compare': CompareOwnersCard,
  'tgt.longonly': LongOnlyMissingCard,
  'tgt.exits': RecentExitsCard,
};

export const ALL_L1_TYPES = Object.keys(L1_COMPONENTS);

export const DASHBOARD_L1_TYPES = [
  'ownership',
  'topHolders',
  'liquidity',
  'insider',
  'short',
  'events',
];
export const SHAREHOLDERS_L1_TYPES = [
  'sh.register',
  'sh.trend',
  'sh.geo',
  'sh.type',
  'sh.daily',
  'sh.lockup',
];
export const TARGETING_L1_TYPES = [
  'tgt.priority',
  'tgt.lookalike',
  'tgt.peergaps',
  'tgt.compare',
  'tgt.longonly',
  'tgt.exits',
];

export function renderAnyResponse(message, sharedProps) {
  if (!message) return null;
  if (message.responseType === 'report-generating') {
    return <ReportGeneratingCard reportId={message.reportId} />;
  }
  if (message.responseType === 'report-ready') {
    return <ReportReadyCard reportId={message.reportId} />;
  }
  if (message.responseType === 'generic') {
    return (
      <GenericResponseCard
        query={message.query}
        attachments={message.attachments}
        {...sharedProps}
      />
    );
  }
  if (message.responseType === 'catalog') {
    return (
      <DynamicResponseCard
        catalogId={message.catalogId}
        {...sharedProps}
      />
    );
  }
  const Component = L1_COMPONENTS[message.responseType];
  if (!Component) return null;
  return <Component {...sharedProps} />;
}
