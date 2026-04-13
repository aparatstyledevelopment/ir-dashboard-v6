import ResponseCard from './ResponseCard';
import { UPCOMING_EVENTS } from '../../../data/upcomingEvents';
import { formatDateShort } from '../../../utils/formatters';
import { buildShareContent } from '../../../utils/shareContent';

const SHARE = buildShareContent({
  title: 'Upcoming IR Calendar',
  narrative:
    'You have 3 upcoming events in the next 30 days. Q1 2026 earnings call expected around May 8. 1-on-1 with Nordea Asset Management in Stockholm on April 22. AGM confirmed for May 15 at Gothenburg Conference Centre.',
  columns: [
    { header: 'Date', key: 'date' },
    { header: 'Type', key: 'type' },
    { header: 'Description', key: 'description' },
    { header: 'Location', key: 'location' },
  ],
  rows: UPCOMING_EVENTS,
});

export default function UpcomingEventsCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  return (
    <ResponseCard
      title="Upcoming IR Calendar"
      followUps={[
        { id: 'l2.events.calendar', label: 'Add to my calendar' },
        { id: 'l2.events.attendees', label: 'Who attended last earnings call?' },
        { id: 'l2.events.roadshow', label: 'Roadshow schedule' },
      ]}
      expansionChips={[
        [
          { id: 'exp.evt.agenda', label: 'Suggest agenda topics for AGM' },
          { id: 'exp.evt.qa', label: 'Predict Q&A questions' },
          { id: 'exp.evt.targets', label: 'Recommend roadshow targets' },
        ],
        [
          { id: 'exp.evt.q1prep', label: 'Auto-draft Q1 prep deck' },
          { id: 'exp.evt.practice', label: 'Generate practice Q&A' },
          { id: 'exp.evt.dayBrief', label: 'Build investor day brief' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for IR events — pre-event briefs ship with production."
      mockToast="In production, this would join your event history with peer briefings to draft prep materials."
      sourceModule="CRM → Events"
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
      onAttach={onAttach}
      isAttached={isAttached}
      shareContent={SHARE}
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
