import { useOutletContext } from 'react-router-dom';
import { useModuleConversation } from '../hooks/useConversations';
import { createChatSubmitHandler } from '../utils/slashCommands';
import { resolveAttachedShares } from '../utils/resolveShare';
import { openReportPdf } from '../utils/pdf';
import ConversationShell from '../components/conversation/ConversationShell';
import {
  renderAnyResponse,
  DASHBOARD_L1_TYPES,
} from '../components/conversation/renderResponse';
import QuickActionsPanel from '../components/layout/QuickActionsPanel';
import ChatInput from '../components/dashboard/ChatInput';
import { QUICK_ACTIONS } from '../data/quickActions';
import MorningBriefing from '../components/dashboard/MorningBriefing';
import SmartChips from '../components/dashboard/SmartChips';
import { getCatalogEntry } from '../data/responseCatalog';

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

export default function DashboardPage() {
  const { showToast, artifacts } = useOutletContext();
  const {
    messages,
    isTyping,
    attachments,
    sendChipQuery,
    sendCatalogQuery,
    sendTextQuery,
    sendBulkResponses,
    sendReportQuery,
    clearActiveSession,
    createSession,
    isChipSpent,
    attachCard,
    removeAttachment,
    isAttached,
  } = useModuleConversation('dashboard');

  const openScreen = (screen) =>
    artifacts.openArtifact({ type: 'screen', payload: { screen } });

  const qa = QUICK_ACTIONS.dashboard;
  const quickActions = qa.items.map((item) => ({
    ...item,
    onClick: () => openScreen(item.screen),
  }));

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
      `Dashboard Report — ${shares.length} cards`
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
  void DASHBOARD_L1_TYPES;

  const handleChipSelect = (chip) => {
    if (chip.kind === 'report') {
      sendReportQuery(chip.reportId, chip.id, chip.label);
      return;
    }
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

  const sharedProps = {
    onFollowUp: handleFollowUp,
    onSourceOpen: (moduleName, message) => {
      artifacts.openArtifact({
        type: 'evidence',
        payload: { message, sourceModule: moduleName },
      });
    },
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
      message,
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

  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        minHeight: 0,
        minWidth: 0,
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* Mobile only — FAB + bottom sheet */}
      <QuickActionsPanel
        title="Dashboard quick actions"
        subtitle="Jump to a key view"
        actions={quickActions}
        mobileOnly
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
