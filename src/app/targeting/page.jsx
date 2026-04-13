import { useOutletContext, useNavigate } from 'react-router-dom';
import { Target, GitCompare } from 'lucide-react';
import { useModuleConversation } from '../../hooks/useConversations';
import { createChatSubmitHandler } from '../../utils/slashCommands';
import ConversationShell from '../../components/conversation/ConversationShell';
import { renderAnyResponse } from '../../components/conversation/renderResponse';
import QuickActionsPanel from '../../components/layout/QuickActionsPanel';
import ChatInput from '../../components/dashboard/ChatInput';
import TargetingBriefing from '../../components/targeting/TargetingBriefing';
import TargetingChips from '../../components/targeting/TargetingChips';
import { getCatalogEntry } from '../../data/responseCatalog';

const RESPONSE_TITLES = {
  ownership: 'Ownership Changes — Last 30 Days',
  topHolders: 'Top 25 Shareholders',
  liquidity: 'Liquidity Analysis vs Peers',
  insider: 'Insider & PDMR Activity',
  short: 'Short Interest Overview',
  events: 'Upcoming IR Calendar',
  'sh.register': 'Shareholder Register',
  'sh.trend': 'Owner Count — 12 Months',
  'sh.geo': 'Holders by Country',
  'sh.type': 'Holders by Type',
  'sh.daily': 'Recent Register Transactions',
  'sh.lockup': 'Lock-up Agreements',
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
    sendBulkResponses,
    clearActiveSession,
    createSession,
    isChipSpent,
    attachCard,
    removeAttachment,
    isAttached,
  } = useModuleConversation('targeting');

  const handleChatSubmit = createChatSubmitHandler({
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
    return renderAnyResponse(message, cardProps);
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
      sub: 'All AI-prioritized candidates',
      onClick: () => navFromTargeting('/targeting/screener'),
    },
    {
      id: 'qa.tgt.compare',
      icon: GitCompare,
      label: 'Compare owners',
      sub: 'Peer holder overlap matrix',
      onClick: () => navFromTargeting('/targeting/compare-owners'),
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
          chatInputSlot={
            <ChatInput
              onSubmit={handleChatSubmit}
              attachments={attachments}
              onRemoveAttachment={removeAttachment}
            />
          }
        />
      </div>
    </main>
  );
}
