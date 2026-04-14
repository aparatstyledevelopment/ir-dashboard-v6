// Small dispatcher for slash commands shared by every module page.
// /all dispatches EVERY card across the whole system (all L1 cards
// from Dashboard + Shareholders + Targeting, plus every L2 catalog
// entry). The shared <renderAnyResponse> helper (see
// src/components/conversation/renderResponse.jsx) handles any of
// those response types on any page, so a single conversation can
// contain cards from any module.

import { ALL_L1_TYPES } from '../components/conversation/renderResponse';
import { RESPONSE_CATALOG } from '../data/responseCatalog';

function buildAllCards() {
  const l1 = ALL_L1_TYPES.map((responseType) => ({ responseType }));
  const l2 = Object.keys(RESPONSE_CATALOG).map((catalogId) => ({
    responseType: 'catalog',
    catalogId,
  }));
  return [...l1, ...l2];
}

export function createChatSubmitHandler({
  sendTextQuery,
  sendBulkResponses,
  clearActiveSession,
  createSession,
  showToast,
  onReport,
}) {
  return function handleChatSubmit(text) {
    const trimmed = (text || '').trim();

    if (trimmed === '/all') {
      const items = buildAllCards();
      sendBulkResponses(items);
      showToast?.(
        `Added ${items.length} cards across every module to this chat.`
      );
      return;
    }

    if (trimmed === '/new') {
      createSession?.();
      showToast?.('Started a new chat session.');
      return;
    }

    if (trimmed === '/clear') {
      clearActiveSession?.();
      showToast?.('Chat cleared.');
      return;
    }

    if (trimmed === '/export') {
      showToast?.(
        'Chat export will be available as PDF + Markdown in the finished product.'
      );
      return;
    }

    if (trimmed === '/help') {
      showToast?.(
        'Commands: /all, /new, /clear, /export, /brief, /compare, /notify, /report, /summarize.'
      );
      return;
    }

    if (trimmed === '/report') {
      if (onReport) {
        onReport();
      } else {
        showToast?.('Report generation is not wired for this module yet.');
      }
      return;
    }

    const MOCK_COMMAND_MESSAGES = {
      '/brief':
        '/brief would rerun the morning briefing from live data in production.',
      '/compare':
        '/compare would open a peer comparison flow in production.',
      '/notify':
        '/notify would subscribe you to register and target alerts in production.',
      '/summarize':
        '/summarize would boil this conversation into key takeaways in production.',
    };
    if (MOCK_COMMAND_MESSAGES[trimmed]) {
      showToast?.(MOCK_COMMAND_MESSAGES[trimmed]);
      return;
    }

    sendTextQuery(text);
  };
}
