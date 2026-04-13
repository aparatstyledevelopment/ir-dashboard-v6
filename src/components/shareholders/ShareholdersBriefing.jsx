import BriefingCard from '../shared/BriefingCard';

export default function ShareholdersBriefing() {
  const teaser = (
    <p style={{ margin: 0 }}>
      <span className="cb-num">3,498</span> identified holders · Top 25 control{' '}
      <span className="cb-num">54.2%</span> · Founder + Aviva ={' '}
      <span className="cb-num">44.32%</span> · Foreign{' '}
      <span className="cb-num">20.08%</span> · Locked-up{' '}
      <span className="cb-num">14.15%</span> ·{' '}
      <span className="cb-pos">+38 new holders</span> in the past 30 days.
    </p>
  );

  return (
    <BriefingCard
      title="Shareholders Briefing"
      subtitle="Snapshot from the most recent register sync · 12 minutes ago"
      teaser={teaser}
      pills={[
        { label: 'Owners', value: '3,498' },
        { label: 'Top 25', value: '54.2%' },
        { label: 'Founder', value: '23.19%' },
        { label: 'Foreign', value: '20.08%' },
        { label: 'Locked', value: '14.15%' },
      ]}
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
          <span className="cb-num">28.40%</span> of votes as the largest single
          holder. <span className="cb-strong">Aviva Perfusion AS</span>, a
          Norwegian strategic, holds another{' '}
          <span className="cb-num">21.13%</span> of capital. Together these two
          control <span className="cb-num">44.32%</span> of capital and{' '}
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
          institutions hold <span className="cb-num">3.16%</span>, Saudi Arabia{' '}
          <span className="cb-num">1.98%</span>, Denmark{' '}
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
          locked up across <span className="cb-num">3</span> active agreements.
          The next major release is the founder block of{' '}
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
    </BriefingCard>
  );
}
