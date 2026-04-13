// Small dispatcher for slash commands shared by every module page.
// Each module passes its L1 response-types plus a set of actions from
// useModuleConversation; this returns a handler that inspects the user's
// typed text and either triggers a command or falls through to the
// normal text query.

export function createChatSubmitHandler({
  l1Types,
  moduleName,
  sendTextQuery,
  sendBulkResponses,
  clearActiveSession,
  createSession,
  showToast,
}) {
  return function handleChatSubmit(text) {
    const trimmed = (text || '').trim();

    if (trimmed === '/all') {
      sendBulkResponses(
        (l1Types || []).map((responseType) => ({ responseType }))
      );
      showToast?.(`Added ${l1Types.length} ${moduleName.toLowerCase()} cards to the chat.`);
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

    // Mock-only commands — acknowledge via toast without side effects.
    const MOCK_COMMAND_MESSAGES = {
      '/brief':
        '/brief would rerun the morning briefing from live data in production.',
      '/compare':
        '/compare would open a peer comparison flow in production.',
      '/notify':
        '/notify would subscribe you to register and target alerts in production.',
      '/report':
        '/report would draft a board-ready one-pager from this session in production.',
      '/summarize':
        '/summarize would boil this conversation into key takeaways in production.',
    };
    if (MOCK_COMMAND_MESSAGES[trimmed]) {
      showToast?.(MOCK_COMMAND_MESSAGES[trimmed]);
      return;
    }

    // Fall through to normal text query.
    sendTextQuery(text);
  };
}
