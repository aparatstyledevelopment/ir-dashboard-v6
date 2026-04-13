import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
  chatInputSlot,
}) {
  const scrollRef = useRef(null);
  const endRef = useRef(null);
  const overlayRef = useRef(null);
  const prevMessageCount = useRef(messages.length);
  const [showJumpDown, setShowJumpDown] = useState(false);
  const [overlayHeight, setOverlayHeight] = useState(64);
  const SCROLL_THRESHOLD = 120;

  // Scroll to bottom only when a new message arrives or typing starts.
  // First render never auto-scrolls so navigating back preserves position.
  useEffect(() => {
    const isFirstRun = prevMessageCount.current === messages.length && !isTyping;
    if (isFirstRun) {
      prevMessageCount.current = messages.length;
      return;
    }
    if (messages.length > prevMessageCount.current || isTyping) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    prevMessageCount.current = messages.length;
  }, [messages.length, isTyping]);

  // Show / hide the jump-to-bottom FAB.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const handleScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowJumpDown(distanceFromBottom > SCROLL_THRESHOLD);
    };
    handleScroll();
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Track the chat overlay's live height. When attachments appear the
  // pill grows; we use this to set the conversation's bottom padding so
  // the last message always sits exactly at the chat box top edge.
  useLayoutEffect(() => {
    const el = overlayRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) {
        setOverlayHeight(Math.max(48, Math.round(rect.height)));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const jumpToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="conversation-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          // Bottom padding tracks the chat overlay's live height so the
          // last message stops exactly at the chat box top.
          padding: `24px 16px ${overlayHeight}px`,
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
                <UserBubble
                  key={m.id}
                  text={m.text}
                  attachments={m.attachments}
                />
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

      {showJumpDown && (
        <button
          type="button"
          className="cb-jump-bottom"
          onClick={jumpToBottom}
          aria-label="Jump to latest"
          title="Jump to latest"
          style={{ bottom: `${overlayHeight + 14}px` }}
        >
          <ChevronDown size={16} strokeWidth={2} />
        </button>
      )}

      {chatInputSlot && (
        <div className="cb-chat-overlay" ref={overlayRef}>
          <div className="cb-chat-overlay-inner">{chatInputSlot}</div>
        </div>
      )}
    </>
  );
}
