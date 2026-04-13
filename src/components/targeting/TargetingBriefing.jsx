import BriefingCard from '../shared/BriefingCard';
import { TARGETS_SUMMARY } from '../../data/targets';

export default function TargetingBriefing() {
  const teaser = (
    <p style={{ margin: 0 }}>
      <span className="cb-num">{TARGETS_SUMMARY.total}</span> candidate targets
      · <span className="cb-pos">{TARGETS_SUMMARY.hot} Hot</span> /{' '}
      <span className="cb-num">{TARGETS_SUMMARY.warm} Warm</span> /{' '}
      <span style={{ color: 'var(--text-tertiary)' }}>
        {TARGETS_SUMMARY.cold} Cold
      </span>{' '}
      · Avg score <span className="cb-num">{TARGETS_SUMMARY.avgScore}/100</span>{' '}
      · <span className="cb-num">47</span> peer-holder gaps (
      <span className="cb-num">18</span> multi-peer) ·{' '}
      <span className="cb-pos">+2 wins</span> in Q1 ·{' '}
      <span className="cb-num">9</span> open roadshow slots.
    </p>
  );

  return (
    <BriefingCard
      title="Targeting Briefing"
      subtitle="Refreshed from the latest peer-register and filings sync · 8 minutes ago"
      teaser={teaser}
      pills={[
        { label: 'Targets', value: String(TARGETS_SUMMARY.total) },
        { label: 'Hot', value: String(TARGETS_SUMMARY.hot) },
        { label: 'Warm', value: String(TARGETS_SUMMARY.warm) },
        { label: 'Avg score', value: `${TARGETS_SUMMARY.avgScore}/100` },
        { label: 'Peer gaps', value: '47' },
      ]}
    >
      <section>
        <h3 className="cb-section-head">Pipeline Snapshot</h3>
        <p style={{ margin: 0 }}>
          The AI targeting engine has identified{' '}
          <span className="cb-num">{TARGETS_SUMMARY.total}</span> candidate
          investors not currently holding INTEG B.{' '}
          <span className="cb-pos">{TARGETS_SUMMARY.hot} hot</span>,{' '}
          <span className="cb-num">{TARGETS_SUMMARY.warm} warm</span>, and{' '}
          <span style={{ color: 'var(--text-tertiary)' }}>
            {TARGETS_SUMMARY.cold} cold
          </span>
          . Average AI fit score is{' '}
          <span className="cb-num">{TARGETS_SUMMARY.avgScore}/100</span>.
        </p>
      </section>

      <section>
        <h3 className="cb-section-head">Top Opportunities</h3>
        <p style={{ margin: 0 }}>
          The highest-scoring target this week is{' '}
          <span className="cb-strong">Polar Capital Healthcare</span>{' '}
          (<span className="cb-num">92/100</span>) — a UK healthcare-dedicated
          strategy that already holds 3 of our 5 closest peers.{' '}
          <span className="cb-strong">Allianz GI European Equity</span>{' '}
          (<span className="cb-num">88</span>) and{' '}
          <span className="cb-strong">Fidelity International Small Cap</span>{' '}
          (<span className="cb-num">86</span>) round out the top 3.
        </p>
      </section>

      <section>
        <h3 className="cb-section-head">Peer Gaps</h3>
        <p style={{ margin: 0 }}>
          Our closest peers (BONESUPPORT, Medistim, OssDsign) have{' '}
          <span className="cb-num">47</span> combined institutional holders
          that are NOT on our register. <span className="cb-num">18</span> of
          them hold 2 or more of our peers simultaneously — these are the
          prime targets for a "peer gap" outreach campaign.
        </p>
      </section>

      <section>
        <h3 className="cb-section-head">Recent Wins</h3>
        <p style={{ margin: 0 }}>
          <span className="cb-pos">+2</span> new institutional holders entered
          the register in Q1:{' '}
          <span className="cb-strong">Aberdeen Standard Investments</span>{' '}
          (<span className="cb-num">0.52%</span>) and{' '}
          <span className="cb-strong">Goldman Sachs AM</span>{' '}
          (<span className="cb-num">0.24%</span>). Both were on the
          prioritized target list in the previous quarter.
        </p>
      </section>

      <section>
        <h3 className="cb-section-head">Roadshow Capacity</h3>
        <p style={{ margin: 0 }}>
          The spring roadshow has <span className="cb-num">19</span> slots
          booked across Stockholm, Copenhagen, and London. There are{' '}
          <span className="cb-num">6</span> open slots in London and{' '}
          <span className="cb-num">3</span> in Stockholm that could be filled
          from the hot target list.
        </p>
      </section>
    </BriefingCard>
  );
}
