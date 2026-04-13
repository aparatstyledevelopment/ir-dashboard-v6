import { useOutletContext } from 'react-router-dom';
import { useConversation } from '../hooks/useConversation';
import ConversationArea from '../components/dashboard/ConversationArea';
import ChatInput from '../components/dashboard/ChatInput';

export default function DashboardPage() {
  const { showToast } = useOutletContext();
  const {
    messages,
    isTyping,
    sendChipQuery,
    sendTextQuery,
    isChipSpent,
  } = useConversation();

  const handleChipSelect = (chip) => {
    sendChipQuery(chip.id, chip.responseType, chip.label);
  };

  const handleFollowUp = (label) => {
    // Follow-up chips inside response cards behave like generic queries.
    sendTextQuery(label);
  };

  const handleSourceOpen = (moduleName) => {
    showToast(
      `In the full platform, this opens the ${moduleName} data view. Coming soon.`
    );
  };

  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        background: 'var(--bg)',
      }}
    >
      <ConversationArea
        messages={messages}
        isTyping={isTyping}
        onChipSelect={handleChipSelect}
        isChipSpent={isChipSpent}
        onFollowUp={handleFollowUp}
        onSourceOpen={handleSourceOpen}
      />
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          margin: '0 auto',
          flexShrink: 0,
        }}
      >
        <ChatInput onSubmit={sendTextQuery} />
      </div>
    </main>
  );
}
