import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Users,
  ArrowDownUp,
  Lock,
  Target,
  Mail,
} from 'lucide-react';
import { useModuleConversation } from '../hooks/useConversations';
import { createChatSubmitHandler } from '../utils/slashCommands';
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
  const navigate = useNavigate();
  const {
    messages,
    isTyping,
    attachments,
    sendChipQuery,
    sendCatalogQuery,
    sendTextQuery,
    sendBulkResponses,
    clearActiveSession,
    createSession,
    isChipSpent,
    attachCard,
    removeAttachment,
    isAttached,
  } = useModuleConversation('dashboard');

  const DASHBOARD_L1_TYPES = [
    'ownership',
    'topHolders',
    'liquidity',
    'insider',
    'short',
    'events',
  ];

  const handleChatSubmit = createChatSubmitHandler({
    l1Types: DASHBOARD_L1_TYPES,
    moduleName: 'Dashboard',
    sendTextQuery,
    sendBulkResponses,
    clearActiveSession,
    createSession,
    showToast,
  });

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

  const handleAttach = (ref) => {
    const result = attachCard(ref);
    if (!result.ok && result.reason === 'limit-reached') {
      showToast('You can attach up to 5 cards at a time. Remove one first.');
    }
  };

  const renderResponse = (message) => {
    const attachable = message.responseType !== 'generic';
    const ref = { id: message.id, title: getMessageTitle(message) };
    const cardProps = {
      ...sharedProps,
      onAttach: attachable ? () => handleAttach(ref) : undefined,
      isAttached: attachable ? isAttached(message.id) : false,
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

  const navFromDashboard = (to) =>
    navigate(to, {
      state: {
        contextModule: 'dashboard',
        backTo: '/',
        backLabel: 'Back to Dashboard',
      },
    });

  const quickActions = [
    {
      id: 'qa.dash.owners',
      icon: Users,
      label: 'All shareholders',
      sub: '3,498 identified holders',
      onClick: () => navFromDashboard('/shareholders/owners'),
    },
    {
      id: 'qa.dash.contacts',
      icon: Mail,
      label: 'All contacts',
      sub: 'IR CRM database',
      onClick: () => navFromDashboard('/crm/people'),
    },
    {
      id: 'qa.dash.transactions',
      icon: ArrowDownUp,
      label: 'Daily transactions',
      sub: 'Register flow (T+2)',
      onClick: () => navFromDashboard('/shareholders/daily-transactions'),
    },
    {
      id: 'qa.dash.lockups',
      icon: Lock,
      label: 'Lock-up agreements',
      sub: 'Active lock-ups & expiry',
      onClick: () => navFromDashboard('/shareholders/lockups'),
    },
    {
      id: 'qa.dash.targets',
      icon: Target,
      label: 'Targeting screener',
      sub: 'AI-prioritized prospects',
      onClick: () => navFromDashboard('/targeting/screener'),
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
          position: 'relative',
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
        <div className="cb-chat-overlay">
          <div className="cb-chat-overlay-inner">
            <ChatInput
              onSubmit={handleChatSubmit}
              attachments={attachments}
              onRemoveAttachment={removeAttachment}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
