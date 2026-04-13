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
import DynamicResponseCard from './responses/DynamicResponseCard';

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

function ResponseRenderer({ message, sharedProps }) {
  switch (message.responseType) {
    case 'ownership':
      return <OwnershipChangesCard {...sharedProps} />;
    case 'topHolders':
      return <TopHoldersCard {...sharedProps} />;
    case 'liquidity':
      return <LiquidityComparisonCard {...sharedProps} />;
    case 'insider':
      return <InsiderActivityCard {...sharedProps} />;
    case 'short':
      return <ShortInterestCard {...sharedProps} />;
    case 'events':
      return <UpcomingEventsCard {...sharedProps} />;
    case 'generic':
      return <GenericResponseCard query={message.query} {...sharedProps} />;
    case 'catalog':
      return (
        <DynamicResponseCard catalogId={message.catalogId} {...sharedProps} />
      );
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
  onShowToast,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages.length, isTyping]);

  const sharedProps = {
    onFollowUp,
    onSourceOpen,
    onShowToast,
    isChipSpent,
  };

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
        <SmartChips
          onSelect={onChipSelect}
          isChipSpent={isChipSpent}
          onShowToast={onShowToast}
        />

        {messages.map((m) => {
          if (m.kind === 'user') {
            return <UserBubble key={m.id} text={m.text} />;
          }
          if (m.kind === 'response') {
            return (
              <div key={m.id}>
                <ResponseRenderer message={m} sharedProps={sharedProps} />
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
