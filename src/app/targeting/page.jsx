import { useOutletContext, useNavigate } from 'react-router-dom';
import { Target, Users, GitCompare, Mail, LayoutDashboard } from 'lucide-react';
import { useModuleConversation } from '../../hooks/useConversations';
import ConversationShell from '../../components/conversation/ConversationShell';
import QuickActionsPanel from '../../components/layout/QuickActionsPanel';
import ChatInput from '../../components/dashboard/ChatInput';
import TargetingBriefing from '../../components/targeting/TargetingBriefing';
import TargetingChips from '../../components/targeting/TargetingChips';
import PriorityTargetsCard from '../../components/targeting/responses/PriorityTargetsCard';
import LookalikeCard from '../../components/targeting/responses/LookalikeCard';
import PeerGapsCard from '../../components/targeting/responses/PeerGapsCard';
import CompareOwnersCard from '../../components/targeting/responses/CompareOwnersCard';
import LongOnlyMissingCard from '../../components/targeting/responses/LongOnlyMissingCard';
import RecentExitsCard from '../../components/targeting/responses/RecentExitsCard';
import GenericResponseCard from '../../components/dashboard/responses/GenericResponseCard';
import DynamicResponseCard from '../../components/dashboard/responses/DynamicResponseCard';
import { getCatalogEntry } from '../../data/responseCatalog';

const RESPONSE_TITLES = {
  'tgt.priority': 'Prioritized Targets',
  'tgt.lookalike': 'Lookalike Holders',
  'tgt.peergaps': 'Peer Gap Analysis',
  'tgt.compare': 'Compare Owners',
  'tgt.longonly': 'Long-only Missing',
  'tgt.exits': 'Recently Exited',
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

export default function TargetingPage() {
  const { showToast } = useOutletContext();
  const navigate = useNavigate();
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
  } = useModuleConversation('targeting');

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
      case 'tgt.priority':
        return <PriorityTargetsCard {...cardProps} />;
      case 'tgt.lookalike':
        return <LookalikeCard {...cardProps} />;
      case 'tgt.peergaps':
        return <PeerGapsCard {...cardProps} />;
      case 'tgt.compare':
        return <CompareOwnersCard {...cardProps} />;
      case 'tgt.longonly':
        return <LongOnlyMissingCard {...cardProps} />;
      case 'tgt.exits':
        return <RecentExitsCard {...cardProps} />;
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

  const navFromTargeting = (to) =>
    navigate(to, {
      state: {
        contextModule: 'targeting',
        backTo: '/targeting',
        backLabel: 'Back to Targeting',
      },
    });

  const quickActions = [
    {
      id: 'qa.tgt.screener',
      icon: Target,
      label: 'Target screener',
      sub: 'All prioritized candidates',
      onClick: () => navFromTargeting('/targeting/screener'),
    },
    {
      id: 'qa.tgt.compare',
      icon: GitCompare,
      label: 'Compare owners',
      sub: 'Peer holder overlap matrix',
      onClick: () =>
        sendChipQuery('tgt.compare', 'tgt.compare', 'Compare owners'),
    },
    {
      id: 'qa.tgt.owners',
      icon: Users,
      label: 'Current shareholders',
      sub: 'Our full register',
      onClick: () => navFromTargeting('/shareholders/owners'),
    },
    {
      id: 'qa.tgt.contacts',
      icon: Mail,
      label: 'CRM contacts',
      sub: 'Tracked people at target firms',
      onClick: () => navFromTargeting('/crm/people'),
    },
    {
      id: 'qa.tgt.dash',
      icon: LayoutDashboard,
      label: 'Dashboard overview',
      sub: 'Cross-module briefing',
      onClick: () => navigate('/'),
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
        title="Targeting quick actions"
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
          briefing={<TargetingBriefing />}
          chips={
            <TargetingChips
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
