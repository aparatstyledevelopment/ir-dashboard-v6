import { useEffect, useRef } from 'react';
import TypingIndicator from '../ui/TypingIndicator';

function UserBubble({ text, attachments }) {
  return (
    <div
      className="fade-in-up"
      style={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      <div
        style={{
          maxWidth: '80%',
          background: 'var(--bar-track)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '8px 12px',
          fontSize: '12px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}
      >
        {attachments && attachments.length > 0 && (
          <div className="cb-user-attachments">
            {attachments.map((a) => (
              <span key={a.id} className="cb-user-attachment-tag">
                {a.title}
              </span>
            ))}
          </div>
        )}
        {text || (
          <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
            (no question — please respond on the selected cards)
          </span>
        )}
      </div>
    </div>
  );
}

export default function ConversationShell({
  briefing,
  chips,
  messages,
  isTyping,
  renderResponse,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages.length, isTyping]);

  return (
    <div
      className="conversation-scroll"
      style={{
        flex: 1,
        overflowY: 'auto',
        // Bottom padding matches the chat-box overlay height so the last
        // message scrolls right up to the chat box and the area above the
        // chat box is never empty.
        padding: '24px 16px 92px',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {briefing}
        {chips}

        {messages.map((m) => {
          if (m.kind === 'user') {
            return (
              <UserBubble key={m.id} text={m.text} attachments={m.attachments} />
            );
          }
          if (m.kind === 'response') {
            return <div key={m.id}>{renderResponse(m)}</div>;
          }
          return null;
        })}

        {isTyping && <TypingIndicator />}

        <div ref={endRef} />
      </div>
    </div>
  );
}
