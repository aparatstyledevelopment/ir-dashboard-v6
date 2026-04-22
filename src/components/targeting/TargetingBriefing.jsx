import BriefingCard from '../shared/BriefingCard';
import DonutChart from '../ui/DonutChart';
import BarChart from '../ui/BarChart';
import ProgressRing from '../ui/ProgressRing';
import StackedBar from '../ui/StackedBar';
import { TARGETS_SUMMARY } from '../../data/targets';

const PRIORITY_SPLIT = [
  { key: 'hot', label: 'Hot', value: TARGETS_SUMMARY.hot },
  { key: 'warm', label: 'Warm', value: TARGETS_SUMMARY.warm },
  { key: 'cold', label: 'Cold', value: TARGETS_SUMMARY.cold },
];

const TOP_SCORES = [
  { label: 'Polar Capital', value: 92 },
  { label: 'Allianz GI', value: 88 },
  { label: 'Fidelity Intl', value: 86 },
  { label: 'Columbia Thr.', value: 84 },
  { label: 'Impax AM', value: 82 },
];

const OUTREACH_STATUS = [
  { key: 'met', label: 'Met this quarter', value: 3 },
  { key: 'warm', label: 'Warm intro avail.', value: 4 },
  { key: 'never', label: 'Never contacted', value: 5 },
  { key: 'cold', label: 'No pathway yet', value: 3 },
];

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
      · <span className="cb-pos">+2 wins</span> in Q1 ·{' '}
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
      ]}
    >
      <section>
        <h3 className="cb-section-head">Pipeline</h3>
        <p style={{ margin: 0 }}>
          <span className="cb-num">{TARGETS_SUMMARY.total}</span> candidates.{' '}
          <span className="cb-pos">{TARGETS_SUMMARY.hot} hot</span>,{' '}
          <span className="cb-num">{TARGETS_SUMMARY.warm} warm</span>,{' '}
          <span style={{ color: 'var(--text-tertiary)' }}>{TARGETS_SUMMARY.cold} cold</span>.
          Avg score <span className="cb-num">{TARGETS_SUMMARY.avgScore}/100</span>.
        </p>
      </section>
      <section>
        <h3 className="cb-section-head">Top Targets</h3>
        <p style={{ margin: 0 }}>
          <span className="cb-strong">Polar Capital</span> (92),{' '}
          <span className="cb-strong">Allianz GI</span> (88),{' '}
          <span className="cb-strong">Fidelity Intl</span> (86).
        </p>
      </section>
      <section>
        <h3 className="cb-section-head">Recent Wins</h3>
        <p style={{ margin: 0 }}>
          <span className="cb-pos">+2</span> new institutional holders in Q1:{' '}
          <span className="cb-strong">Aberdeen</span> (0.52%) and{' '}
          <span className="cb-strong">Goldman Sachs AM</span> (0.24%).
        </p>
      </section>
      <section>
        <h3 className="cb-section-head">Roadshow</h3>
        <p style={{ margin: 0 }}>
          19 slots booked · <span className="cb-num">9</span> open across London
          and Stockholm.
        </p>
      </section>

      <section>
        <h3 className="cb-section-head">Charts</h3>
        <div className="cb-briefing-charts">
          <div className="cb-briefing-chart">
            <div className="cb-briefing-chart-title">Priority split</div>
            <DonutChart
              data={PRIORITY_SPLIT}
              size={120}
              centerValue={String(TARGETS_SUMMARY.total)}
              centerLabel="targets"
            />
          </div>
          <div className="cb-briefing-chart">
            <div className="cb-briefing-chart-title">Top AI scores</div>
            <BarChart
              data={TOP_SCORES}
              valueFormatter={(v) => `${v}/100`}
            />
          </div>
          <div
            className="cb-briefing-chart"
            style={{ alignItems: 'center' }}
          >
            <div
              className="cb-briefing-chart-title"
              style={{ alignSelf: 'flex-start' }}
            >
              Avg fit score
            </div>
            <ProgressRing
              value={TARGETS_SUMMARY.avgScore}
              max={100}
              size={120}
              label={`${TARGETS_SUMMARY.avgScore}/100`}
            />
          </div>
          <div className="cb-briefing-chart">
            <div className="cb-briefing-chart-title">Outreach status</div>
            <StackedBar data={OUTREACH_STATUS} />
          </div>
        </div>
      </section>
    </BriefingCard>
  );
}
