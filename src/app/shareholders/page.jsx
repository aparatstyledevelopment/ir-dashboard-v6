import { useOutletContext, useNavigate } from 'react-router-dom';
import { Users, ArrowDownUp, Lock, ArrowUpDown } from 'lucide-react';
import { useModuleConversation } from '../../hooks/useConversations';
import { createChatSubmitHandler } from '../../utils/slashCommands';
import ConversationShell from '../../components/conversation/ConversationShell';
import QuickActionsPanel from '../../components/layout/QuickActionsPanel';
import ChatInput from '../../components/dashboard/ChatInput';
import ShareholdersBriefing from '../../components/shareholders/ShareholdersBriefing';
import ShareholdersChips from '../../components/shareholders/ShareholdersChips';
import RegisterCard from '../../components/shareholders/responses/RegisterCard';
import OwnerTrendCard from '../../components/shareholders/responses/OwnerTrendCard';
import GeographyCard from '../../components/shareholders/responses/GeographyCard';
import OwnerTypeCard from '../../components/shareholders/responses/OwnerTypeCard';
import DailyTransactionsCard from '../../components/shareholders/responses/DailyTransactionsCard';
import LockUpsCard from '../../components/shareholders/responses/LockUpsCard';
import GenericResponseCard from '../../components/dashboard/responses/GenericResponseCard';
import DynamicResponseCard from '../../components/dashboard/responses/DynamicResponseCard';
import { getCatalogEntry } from '../../data/responseCatalog';

const RESPONSE_TITLES = {
  'sh.register': 'Shareholder Register',
  'sh.trend': 'Owner Count — 12 Months',
  'sh.geo': 'Holders by Country',
  'sh.type': 'Holders by Type',
  'sh.daily': 'Recent Register Transactions',
  'sh.lockup': 'Lock-up Agreements',
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

export default function ShareholdersPage() {
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
  } = useModuleConversation('shareholders');

  const SH_L1_TYPES = [
    'sh.register',
    'sh.trend',
    'sh.geo',
    'sh.type',
    'sh.daily',
    'sh.lockup',
  ];

  const handleChatSubmit = createChatSubmitHandler({
    l1Types: SH_L1_TYPES,
    moduleName: 'Shareholders',
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

  const handleAttach = (ref) => {
    const result = attachCard(ref);
    if (!result.ok && result.reason === 'limit-reached') {
      showToast('You can attach up to 5 cards at a time. Remove one first.');
    }
  };

  const sharedProps = {
    onFollowUp: handleFollowUp,
    onSourceOpen: handleSourceOpen,
    onShowToast: showToast,
    isChipSpent,
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
      case 'sh.register':
        return <RegisterCard {...cardProps} />;
      case 'sh.trend':
        return <OwnerTrendCard {...cardProps} />;
      case 'sh.geo':
        return <GeographyCard {...cardProps} />;
      case 'sh.type':
        return <OwnerTypeCard {...cardProps} />;
      case 'sh.daily':
        return <DailyTransactionsCard {...cardProps} />;
      case 'sh.lockup':
        return <LockUpsCard {...cardProps} />;
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
          <DynamicResponseCard catalogId={message.catalogId} {...cardProps} />
        );
      default:
        return null;
    }
  };

  const navFromShareholders = (to) =>
    navigate(to, {
      state: {
        contextModule: 'shareholders',
        backTo: '/shareholders',
        backLabel: 'Back to Shareholders',
      },
    });

  const quickActions = [
    {
      id: 'qa.sh.owners',
      icon: Users,
      label: 'Full shareholder register',
      sub: '3,498 identified holders',
      onClick: () => navFromShareholders('/shareholders/owners'),
    },
    {
      id: 'qa.sh.daily',
      icon: ArrowDownUp,
      label: 'Daily transactions (T+2)',
      sub: 'Last 14 days of register flow',
      onClick: () => navFromShareholders('/shareholders/daily-transactions'),
    },
    {
      id: 'qa.sh.changes',
      icon: ArrowUpDown,
      label: 'Owner changes (30d)',
      sub: 'Net moves over the last month',
      onClick: () => navFromShareholders('/shareholders/owner-changes'),
    },
    {
      id: 'qa.sh.lockup',
      icon: Lock,
      label: 'Lock-up agreements',
      sub: 'Active agreements & expiry',
      onClick: () => navFromShareholders('/shareholders/lockups'),
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
        title="Shareholders quick actions"
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
          briefing={<ShareholdersBriefing />}
          chips={
            <ShareholdersChips
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
