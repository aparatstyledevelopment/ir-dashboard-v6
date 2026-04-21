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

  // Empty state: no messages AND not currently typing. We center the
  // briefing + chips + chat input vertically (like ChatGPT / Claude home).
  const isEmpty = messages.length === 0 && !isTyping;

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

  // Show / hide the jump-to-bottom FAB (only in conversation mode).
  useLayoutEffect(() => {
    if (isEmpty) {
      setShowJumpDown(false);
      return undefined;
    }
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
  }, [isEmpty]);

  // Track the chat overlay's live height in conversation mode. In empty
  // mode there is no fixed overlay — we set a small sentinel so the FABs
  // still have a sane bottom anchor if they're showing for any reason.
  useLayoutEffect(() => {
    if (isEmpty) {
      document.documentElement.style.setProperty('--cb-overlay-h', '20px');
      return () => {
        document.documentElement.style.removeProperty('--cb-overlay-h');
      };
    }
    const el = overlayRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const setVar = (h) => {
      document.documentElement.style.setProperty('--cb-overlay-h', `${h}px`);
    };
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) {
        const h = Math.max(48, Math.round(rect.height));
        setOverlayHeight(h);
        setVar(h);
      }
    });
    ro.observe(el);
    const initial = Math.max(48, Math.round(el.getBoundingClientRect().height));
    setOverlayHeight(initial);
    setVar(initial);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--cb-overlay-h');
    };
  }, [isEmpty]);

  const jumpToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  // ---------------- Empty / staging layout (vertically centered) ----------

  if (isEmpty) {
    return (
      <div
        className="cb-empty-shell"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '24px 16px',
        }}
      >
        <div className="cb-empty-center">
          <div
            style={{
              width: '100%',
              maxWidth: '720px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {briefing}
            {chips}
            {chatInputSlot && (
              <div className="cb-empty-chat-slot">{chatInputSlot}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Conversation layout (fixed-bottom overlay) ------------

  return (
    <>
      <div
        ref={scrollRef}
        className="conversation-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: `24px 16px ${overlayHeight + 24}px`,
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
        >
          <ChevronDown size={18} strokeWidth={1.75} />
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
