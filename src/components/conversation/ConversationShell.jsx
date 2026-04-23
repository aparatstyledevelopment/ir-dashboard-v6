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

  const isEmpty = messages.length === 0 && !isTyping;

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

  useLayoutEffect(() => {
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
  }, []);

  const jumpToBottom = () => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  return (
    <>
      <div
        ref={scrollRef}
        className={
          'conversation-scroll' + (isEmpty ? ' conversation-scroll--empty' : '')
        }
        style={{
          flex: 1,
          overflowY: 'auto',
          // Horizontal + bottom padding only. The top breathing room
          // is pushed onto the inner wrapper as `padding-top` so that
          // sticky `<th>` elements with `top: 0` inside descendant
          // tables land flush with conversation-scroll's top edge
          // (i.e. directly below the TopBar), instead of sticking
          // inside the scroll container's padding-top and appearing
          // below a gap.
          padding: `0 16px ${overlayHeight + 24}px`,
        }}
      >
        <div
          className={isEmpty ? 'cb-empty-center' : undefined}
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            paddingTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: isEmpty ? '18px' : '20px',
            minWidth: 0,
            // No overflow setting here by design. Any non-visible
            // value (hidden, clip) would make this element a sticky
            // positioning container (for hidden, a scroll container;
            // for clip, still a clipping box that some browsers treat
            // as an anchor), which pins sticky <th> elements inside
            // child tables to a non-scrolling box. We need sticky to
            // bubble all the way up to `.conversation-scroll` so the
            // column header stays visible while the user scrolls the
            // whole conversation.
            ...(isEmpty ? { minHeight: '100%' } : {}),
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

          {!isEmpty && <div ref={endRef} />}
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
