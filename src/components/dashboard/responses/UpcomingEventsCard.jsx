import ResponseCard from './ResponseCard';
import { UPCOMING_EVENTS } from '../../../data/upcomingEvents';
import { formatDateShort } from '../../../utils/formatters';

export default function UpcomingEventsCard({ onFollowUp, onSourceOpen }) {
  return (
    <ResponseCard
      title="Upcoming IR Calendar"
      followUps={[
        'Add to my calendar',
        'Who attended last earnings call?',
        'Roadshow schedule',
      ]}
      sourceModule="CRM → Events"
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
    >
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: '0 0 14px',
          letterSpacing: '-0.01em',
        }}
      >
        You have 3 upcoming events in the next 30 days. The Q1 2026 earnings call is expected
        around May 8. One investor meeting is scheduled — a 1-on-1 with Nordea Asset Management
        in Stockholm on April 22. The Annual General Meeting is confirmed for May 15 at
        Gothenburg Conference Centre.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {UPCOMING_EVENTS.map((ev, i) => (
          <div
            key={i}
            className="tabular"
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '14px',
              padding: '10px 0',
              borderBottom:
                i === UPCOMING_EVENTS.length - 1 ? 'none' : '1px solid var(--border)',
              fontSize: '12px',
              letterSpacing: '-0.01em',
            }}
          >
            <span
              style={{
                width: '54px',
                flexShrink: 0,
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              {formatDateShort(ev.date)}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
              {ev.type} · {ev.description} · {ev.location}
            </span>
          </div>
        ))}
      </div>
    </ResponseCard>
  );
}
