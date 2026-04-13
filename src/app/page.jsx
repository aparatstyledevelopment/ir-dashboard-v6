import { useOutletContext } from 'react-router-dom';
import { Users, TrendingUp, BarChart3, Calendar, UserCheck, ArrowDownUp } from 'lucide-react';
import { useModuleConversation } from '../hooks/useConversations';
import ConversationShell from '../components/conversation/ConversationShell';
import QuickActionsPanel from '../components/layout/QuickActionsPanel';
import ChatInput from '../components/dashboard/ChatInput';
import MorningBriefing from '../components/dashboard/MorningBriefing';
import SmartChips from '../components/dashboard/SmartChips';
import OwnershipChangesCard from '../components/dashboard/responses/OwnershipChangesCard';
import TopHoldersCard from '../components/dashboard/responses/TopHoldersCard';
import LiquidityComparisonCard from '../components/dashboard/responses/LiquidityComparisonCard';
import InsiderActivityCard from '../components/dashboard/responses/InsiderActivityCard';
import ShortInterestCard from '../components/dashboard/responses/ShortInterestCard';
import UpcomingEventsCard from '../components/dashboard/responses/UpcomingEventsCard';
import GenericResponseCard from '../components/dashboard/responses/GenericResponseCard';
import DynamicResponseCard from '../components/dashboard/responses/DynamicResponseCard';
import { getCatalogEntry } from '../data/responseCatalog';

const RESPONSE_TITLES = {
  ownership: 'Ownership Changes — Last 30 Days',
  topHolders: 'Top 25 Shareholders',
  liquidity: 'Liquidity Analysis vs Peers',
  insider: 'Insider & PDMR Activity',
  short: 'Short Interest Overview',
  events: 'Upcoming IR Calendar',
};

function getMessageTitle(message) {
  if (message.responseType === 'catalog') {
    const entry = getCatalogEntry(message.catalogId);
    return entry?.title || 'Card';
  }
  if (message.responseType === 'generic') {
    return message.query ? `Query: ${message.query}` : 'Custom query';
  }
  return RESPONSE_TITLES[message.responseType] || 'Card';
}

export default function DashboardPage() {
  const { showToast } = useOutletContext();
  const {
    messages,
    isTyping,
    attachments,
    sendChipQuery,
    sendCatalogQuery,
    sendTextQuery,
    isChipSpent,
    attachCard,
    removeAttachment,
    isAttached,
  } = useModuleConversation('dashboard');

  const handleChipSelect = (chip) => {
    sendChipQuery(chip.id, chip.responseType, chip.label);
  };

  const handleFollowUp = (chip) => {
    if (!chip) return;
    if (typeof chip === 'string') {
      sendTextQuery(chip);
      return;
    }
    if (chip.id && chip.id.startsWith('l2.')) {
      sendCatalogQuery(chip.id, chip.label);
      return;
    }
    sendTextQuery(chip.label || String(chip));
  };

  const handleSourceOpen = (moduleName) => {
    showToast(
      `In the full platform, this opens the ${moduleName} data view. Coming soon.`
    );
  };

  const sharedProps = {
    onFollowUp: handleFollowUp,
    onSourceOpen: handleSourceOpen,
    onShowToast: showToast,
    isChipSpent,
  };

  const renderResponse = (message) => {
    const ref = { id: message.id, title: getMessageTitle(message) };
    const cardProps = {
      ...sharedProps,
      onAttach: () => attachCard(ref),
      isAttached: isAttached(message.id),
    };
    switch (message.responseType) {
      case 'ownership':
        return <OwnershipChangesCard {...cardProps} />;
      case 'topHolders':
        return <TopHoldersCard {...cardProps} />;
      case 'liquidity':
        return <LiquidityComparisonCard {...cardProps} />;
      case 'insider':
        return <InsiderActivityCard {...cardProps} />;
      case 'short':
        return <ShortInterestCard {...cardProps} />;
      case 'events':
        return <UpcomingEventsCard {...cardProps} />;
      case 'generic':
        return (
          <GenericResponseCard
            query={message.query}
            attachments={message.attachments}
            {...cardProps}
          />
        );
      case 'catalog':
        return (
          <DynamicResponseCard
            catalogId={message.catalogId}
            {...cardProps}
          />
        );
      default:
        return null;
    }
  };

  const quickActions = [
    {
      id: 'qa.dash.top25',
      icon: Users,
      label: 'Top 25 holders',
      sub: 'Full list with capital and votes',
      onClick: () => sendChipQuery('top25', 'topHolders', 'Top 25'),
    },
    {
      id: 'qa.dash.buyers',
      icon: TrendingUp,
      label: 'Recent buyers & sellers',
      sub: 'Net flow over last 30 days',
      onClick: () => sendChipQuery('buyers', 'ownership', 'Buyers'),
    },
    {
      id: 'qa.dash.liquidity',
      icon: BarChart3,
      label: 'Liquidity check',
      sub: 'INTEG B vs Nordic peers',
      onClick: () => sendChipQuery('liquidity', 'liquidity', 'Liquidity'),
    },
    {
      id: 'qa.dash.insider',
      icon: UserCheck,
      label: 'Insider activity',
      sub: 'Recent PDMR filings',
      onClick: () => sendChipQuery('insider', 'insider', 'Insider'),
    },
    {
      id: 'qa.dash.short',
      icon: ArrowDownUp,
      label: 'Short interest',
      sub: 'Disclosed shorts and trend',
      onClick: () => sendChipQuery('short', 'short', 'Short'),
    },
    {
      id: 'qa.dash.events',
      icon: Calendar,
      label: 'IR calendar',
      sub: 'Next 30 days of events',
      onClick: () => sendChipQuery('events', 'events', 'Events'),
    },
  ];

  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        minHeight: 0,
        background: 'var(--bg)',
      }}
    >
      <QuickActionsPanel
        title="Dashboard quick actions"
        subtitle="Jump to a key view"
        actions={quickActions}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <ConversationShell
          briefing={<MorningBriefing />}
          chips={
            <SmartChips
              onSelect={handleChipSelect}
              isChipSpent={isChipSpent}
              onShowToast={showToast}
            />
          }
          messages={messages}
          isTyping={isTyping}
          renderResponse={renderResponse}
        />
        <div className="cb-input-gutter" style={{ flexShrink: 0 }}>
          <div
            style={{
              width: '100%',
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            <ChatInput
              onSubmit={sendTextQuery}
              attachments={attachments}
              onRemoveAttachment={removeAttachment}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
