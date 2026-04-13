import MetricPill from '../ui/MetricPill';

export default function ShareholdersBriefing() {
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
          Shareholders Briefing
        </h2>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            marginTop: '3px',
            letterSpacing: '-0.01em',
          }}
        >
          Snapshot from the most recent register sync · 12 minutes ago
        </div>
      </header>

      <div
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
        className="tabular"
      >
        <section>
          <h3 className="cb-section-head">Composition</h3>
          <p style={{ margin: 0 }}>
            You have <span className="cb-num">3,498</span> identified owners
            across <span className="cb-num">30,677,919</span> outstanding shares
            (<span className="cb-num">440,000</span> A-shares,{' '}
            <span className="cb-num">29,937,919</span> B-shares). The top{' '}
            <span className="cb-num">25</span> control{' '}
            <span className="cb-num">54.2%</span> of capital. Free float is{' '}
            <span className="cb-num">69.94%</span>.
          </p>
        </section>

        <section>
          <h3 className="cb-section-head">Founder &amp; Strategic Block</h3>
          <p style={{ margin: 0 }}>
            <span className="cb-strong">Richard Brännemark</span> holds{' '}
            <span className="cb-num">23.19%</span> of capital and{' '}
            <span className="cb-num">28.40%</span> of votes as the largest
            single holder.{' '}
            <span className="cb-strong">Aviva Perfusion AS</span>, a Norwegian
            strategic, holds another <span className="cb-num">21.13%</span> of
            capital. Together these two control{' '}
            <span className="cb-num">44.32%</span> of capital and{' '}
            <span className="cb-num">47.10%</span> of votes.
          </p>
        </section>

        <section>
          <h3 className="cb-section-head">Net Flow</h3>
          <p style={{ margin: 0 }}>
            Over the past 30 days, <span className="cb-num">12</span> holders
            increased positions by{' '}
            <span className="cb-pos">+116k shares</span> and{' '}
            <span className="cb-num">8</span> reduced by{' '}
            <span className="cb-neg">−51k</span>. Net effect:{' '}
            <span className="cb-pos">+65k shares</span> into active hands. Owner
            count rose from <span className="cb-num">3,460</span> to{' '}
            <span className="cb-num">3,498</span>{' '}
            <span className="cb-pos">(+38 in 30d)</span>.
          </p>
        </section>

        <section>
          <h3 className="cb-section-head">Geography</h3>
          <p style={{ margin: 0 }}>
            <span className="cb-strong">Sweden</span> remains dominant at{' '}
            <span className="cb-num">68.4%</span> of capital.{' '}
            <span className="cb-strong">Norway</span> represents{' '}
            <span className="cb-num">21.7%</span> (almost entirely Aviva). US
            institutions hold <span className="cb-num">3.16%</span>, Saudi
            Arabia <span className="cb-num">1.98%</span>, Denmark{' '}
            <span className="cb-num">1.52%</span>, UK{' '}
            <span className="cb-num">1.21%</span>, others{' '}
            <span className="cb-num">2.0%</span>.
          </p>
        </section>

        <section>
          <h3 className="cb-section-head">Lock-ups</h3>
          <p style={{ margin: 0 }}>
            <span className="cb-num">4.34M</span> shares (
            <span className="cb-num">14.15%</span> of capital) are currently
            locked up across <span className="cb-num">3</span> active
            agreements. The next major release is the founder block of{' '}
            <span className="cb-num">4.20M</span> shares on{' '}
            <span className="cb-strong">June 30, 2026</span>.
          </p>
        </section>

        <section>
          <h3 className="cb-section-head">Looking Ahead</h3>
          <p style={{ margin: 0 }}>
            The <span className="cb-strong">Q1 2026 earnings report</span> is
            expected in early May. The quiet period is approaching, which may
            temporarily reduce buy-side activity in the register.
          </p>
        </section>
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
        <MetricPill label="Owners" value="3,498" />
        <MetricPill label="Top 25" value="54.2%" />
        <MetricPill label="Founder" value="23.19%" />
        <MetricPill label="Foreign" value="20.08%" />
        <MetricPill label="Locked" value="14.15%" />
      </footer>
    </article>
  );
}
