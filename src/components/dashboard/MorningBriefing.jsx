import MetricPill from '../ui/MetricPill';
import { dayName } from '../../utils/formatters';

export default function MorningBriefing() {
  const day = dayName(new Date());

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
          padding: '16px 18px 14px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h2
          style={{
            fontSize: '15px',
            fontWeight: 600,
            margin: 0,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          {day} Morning Briefing
        </h2>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            marginTop: '3px',
            letterSpacing: '-0.01em',
          }}
        >
          Generated 15 minutes ago
        </div>
      </header>

      <div
        style={{
          padding: '16px 18px',
          fontSize: '13px',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
          letterSpacing: '-0.01em',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
        className="tabular"
      >
        <p style={{ margin: 0 }}>
          INTEG B opened at 15.38 SEK and is currently trading at 16.16 SEK, up 5.07% on the
          session. The stock has been range-bound between 14.80 and 16.50 over the past four
          weeks. Average daily turnover stands at approximately €18,400 across all venues, with
          Nasdaq First North accounting for 86% of volume. No block trades have been recorded in
          the past five trading days.
        </p>
        <p style={{ margin: 0 }}>
          On the ownership front, your shareholder base stands at 3,498 identified owners, up
          124 year-over-year. Free float is 69.94%, down 2.1pp from last year. Foreign ownership
          sits at 20.08%, declining 1.3pp YoY. The most notable recent move: Aviva Perfusion AS
          reduced their position by 21,204 shares and now holds 21.13% of capital. On the buy
          side, Nordea Investment Funds added 45,000 shares, bringing their stake to 3.45%.
          Invesco Ltd also increased by 32,100 shares from across the Atlantic.
        </p>
        <p style={{ margin: 0 }}>
          Short interest is currently at 2.1% of capital. No new PDMR transactions have been
          reported in the past 14 days. Insider ownership remains concentrated — Richard
          Brännemark holds 23.19% of capital and 28.4% of votes as the largest single holder.
        </p>
        <p style={{ margin: 0 }}>
          Looking ahead: the Q1 2026 earnings report is expected within the next three weeks.
          The quiet period is likely approaching. No AGM or capital markets day has been
          announced for this quarter.
        </p>
      </div>

      <footer
        style={{
          padding: '12px 18px 14px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        <MetricPill label="Free Float" value="69.94%" />
        <MetricPill label="Owners" value="3,498" />
        <MetricPill label="Foreign" value="20.08%" />
        <MetricPill label="Short" value="2.1%" />
      </footer>
    </article>
  );
}
