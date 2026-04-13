import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import MetricPill from '../ui/MetricPill';

// Shared briefing card shell: collapsed (teaser) view is the default,
// with an expand toggle. Each module passes its own teaser line and full
// content via props.
export default function BriefingCard({
  title,
  subtitle,
  teaser,
  children,
  pills = [],
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className="fade-in-up"
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
      }}
    >
      <header
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              fontSize: '15px',
              fontWeight: 600,
              margin: 0,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-tertiary)',
                marginTop: '3px',
                letterSpacing: '-0.01em',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="cb-icon-btn"
          aria-label={expanded ? 'Collapse briefing' : 'Expand briefing'}
          title={expanded ? 'Collapse' : 'Show full briefing'}
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '999px',
            padding: '5px 10px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            letterSpacing: '-0.01em',
            flexShrink: 0,
          }}
        >
          {expanded ? (
            <>
              <ChevronUp size={12} strokeWidth={1.75} />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown size={12} strokeWidth={1.75} />
              Full briefing
            </>
          )}
        </button>
      </header>

      {!expanded && teaser && (
        <div
          className="tabular"
          style={{
            padding: '14px 18px',
            fontSize: '13px',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            letterSpacing: '-0.01em',
          }}
        >
          {teaser}
        </div>
      )}

      {expanded && (
        <div
          className="tabular"
          style={{
            padding: '16px 18px',
            fontSize: '13px',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            letterSpacing: '-0.01em',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {children}
        </div>
      )}

      {pills.length > 0 && (
        <footer
          style={{
            padding: '12px 18px 14px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
          }}
        >
          {pills.map((p, i) => (
            <MetricPill key={i} label={p.label} value={p.value} />
          ))}
        </footer>
      )}
    </article>
  );
}
