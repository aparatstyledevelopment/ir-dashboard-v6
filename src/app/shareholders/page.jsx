import { useOutletContext } from 'react-router-dom';
import { Users, ArrowDownUp, Lock, ArrowUpDown } from 'lucide-react';
import { useModuleConversation } from '../../hooks/useConversations';
import { createChatSubmitHandler } from '../../utils/slashCommands';
import { resolveAttachedShares } from '../../utils/resolveShare';
import { openReportPdf } from '../../utils/pdf';
import ConversationShell from '../../components/conversation/ConversationShell';
import { renderAnyResponse } from '../../components/conversation/renderResponse';
import QuickActionsPanel from '../../components/layout/QuickActionsPanel';
import ChatInput from '../../components/dashboard/ChatInput';
import ShareholdersBriefing from '../../components/shareholders/ShareholdersBriefing';
import ShareholdersChips from '../../components/shareholders/ShareholdersChips';
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

export default function ShareholdersPage() {
  const { showToast, artifacts } = useOutletContext();
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

  const handleReport = () => {
    const shares = resolveAttachedShares(attachments, messages);
    if (shares.length === 0) {
      showToast(
        'Attach cards first (use the + button), then send /report to generate a PDF.'
      );
      return;
    }
    const ok = openReportPdf(
      shares,
      `Shareholders Report — ${shares.length} cards`
    );
    if (!ok) {
      showToast('Could not open the print window. Check pop-up blockers.');
      return;
    }
    showToast(
      `Opening a ${shares.length}-card PDF report. Choose "Save as PDF" to download.`
    );
  };

  const handleChatSubmit = createChatSubmitHandler({
    sendTextQuery,
    sendBulkResponses,
    clearActiveSession,
    createSession,
    showToast,
    onReport: handleReport,
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

  const handleAttach = (ref) => {
    const result = attachCard(ref);
    if (!result.ok && result.reason === 'limit-reached') {
      showToast('You can attach up to 5 cards at a time. Remove one first.');
    }
  };

  const sharedProps = {
    onFollowUp: handleFollowUp,
    onShowToast: showToast,
    isChipSpent,
  };

  const renderResponse = (message) => {
    const attachable = message.responseType !== 'generic';
    const ref = { id: message.id, title: getMessageTitle(message) };
    const cardProps = {
      ...sharedProps,
      onSourceOpen: (moduleName) =>
        artifacts.openArtifact({
          type: 'evidence',
          payload: { message, sourceModule: moduleName },
        }),
      onAttach: attachable ? () => handleAttach(ref) : undefined,
      isAttached: attachable ? isAttached(message.id) : false,
    };
    return renderAnyResponse(message, cardProps);
  };

  const openScreen = (screen) =>
    artifacts.openArtifact({ type: 'screen', payload: { screen } });

  const quickActions = [
    {
      id: 'qa.sh.owners',
      icon: Users,
      label: 'Full shareholder register',
      sub: '3,498 identified holders',
      onClick: () => openScreen('shareholders-owners'),
    },
    {
      id: 'qa.sh.daily',
      icon: ArrowDownUp,
      label: 'Daily transactions (T+2)',
      sub: 'Last 14 days of register flow',
      onClick: () => openScreen('shareholders-daily-transactions'),
    },
    {
      id: 'qa.sh.changes',
      icon: ArrowUpDown,
      label: 'Owner changes (30d)',
      sub: 'Net moves over the last month',
      onClick: () => openScreen('shareholders-owner-changes'),
    },
    {
      id: 'qa.sh.lockup',
      icon: Lock,
      label: 'Lock-up agreements',
      sub: 'Active agreements & expiry',
      onClick: () => openScreen('shareholders-lockups'),
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
