import { useEffect, useRef } from 'react';
import MorningBriefing from './MorningBriefing';
import SmartChips from './SmartChips';
import TypingIndicator from '../ui/TypingIndicator';
import OwnershipChangesCard from './responses/OwnershipChangesCard';
import TopHoldersCard from './responses/TopHoldersCard';
import LiquidityComparisonCard from './responses/LiquidityComparisonCard';
import InsiderActivityCard from './responses/InsiderActivityCard';
import ShortInterestCard from './responses/ShortInterestCard';
import UpcomingEventsCard from './responses/UpcomingEventsCard';
import GenericResponseCard from './responses/GenericResponseCard';

function UserBubble({ text }) {
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
        {text}
      </div>
    </div>
  );
}

function ResponseRenderer({ message, onFollowUp, onSourceOpen }) {
  const props = { onFollowUp, onSourceOpen };
  switch (message.responseType) {
    case 'ownership':
      return <OwnershipChangesCard {...props} />;
    case 'topHolders':
      return <TopHoldersCard {...props} />;
    case 'liquidity':
      return <LiquidityComparisonCard {...props} />;
    case 'insider':
      return <InsiderActivityCard {...props} />;
    case 'short':
      return <ShortInterestCard {...props} />;
    case 'events':
      return <UpcomingEventsCard {...props} />;
    case 'generic':
      return <GenericResponseCard query={message.query} {...props} />;
    default:
      return null;
  }
}

export default function ConversationArea({
  messages,
  isTyping,
  onChipSelect,
  isChipSpent,
  onFollowUp,
  onSourceOpen,
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
        padding: '24px 16px 32px',
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
        <MorningBriefing />
        <SmartChips onSelect={onChipSelect} isChipSpent={isChipSpent} />

        {messages.map((m) => {
          if (m.kind === 'user') {
            return <UserBubble key={m.id} text={m.text} />;
          }
          if (m.kind === 'response') {
            return (
              <div key={m.id}>
                <ResponseRenderer
                  message={m}
                  onFollowUp={onFollowUp}
                  onSourceOpen={onSourceOpen}
                />
              </div>
            );
          }
          return null;
        })}

        {isTyping && <TypingIndicator />}

        <div ref={endRef} />
      </div>
    </div>
  );
}
