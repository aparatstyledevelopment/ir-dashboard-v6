import { useOutletContext } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  Globe,
  PieChart,
  ArrowDownUp,
  Lock,
} from 'lucide-react';
import { useModuleConversation } from '../../hooks/useConversations';
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
  } = useModuleConversation('shareholders');

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

  const quickActions = [
    {
      id: 'qa.sh.register',
      icon: Users,
      label: 'Shareholder register',
      sub: 'Top 25 + the long tail',
      onClick: () =>
        sendChipQuery('sh.register', 'sh.register', 'Show full register'),
    },
    {
      id: 'qa.sh.daily',
      icon: ArrowDownUp,
      label: 'Daily transactions',
      sub: 'Last 14 days of register flow',
      onClick: () =>
        sendChipQuery('sh.daily', 'sh.daily', 'Daily transactions'),
    },
    {
      id: 'qa.sh.trend',
      icon: TrendingUp,
      label: 'Owner trend',
      sub: '12-month register growth',
      onClick: () => sendChipQuery('sh.trend', 'sh.trend', 'Owner trend'),
    },
    {
      id: 'qa.sh.geo',
      icon: Globe,
      label: 'Geographic breakdown',
      sub: 'Capital % by country',
      onClick: () => sendChipQuery('sh.geo', 'sh.geo', 'Geography'),
    },
    {
      id: 'qa.sh.type',
      icon: PieChart,
      label: 'By owner type',
      sub: 'Funds, individuals, strategics',
      onClick: () => sendChipQuery('sh.type', 'sh.type', 'Owner type'),
    },
    {
      id: 'qa.sh.lockup',
      icon: Lock,
      label: 'Lock-up status',
      sub: 'Active agreements & expiry',
      onClick: () => sendChipQuery('sh.lockup', 'sh.lockup', 'Lock-ups'),
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
