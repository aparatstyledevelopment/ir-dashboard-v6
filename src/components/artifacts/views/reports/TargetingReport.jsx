import DonutChart from '../../../ui/DonutChart';
import BarChart from '../../../ui/BarChart';
import StackedBar from '../../../ui/StackedBar';
import ProgressRing from '../../../ui/ProgressRing';
import { TARGETS_SUMMARY } from '../../../../data/targets';

const PRIORITY_SPLIT = [
  { key: 'hot', label: 'Hot', value: TARGETS_SUMMARY.hot },
  { key: 'warm', label: 'Warm', value: TARGETS_SUMMARY.warm },
  { key: 'cold', label: 'Cold', value: TARGETS_SUMMARY.cold },
];
const TOP_SCORES = [
  { label: 'Polar Capital', value: 92, color: 'var(--chart-1)' },
  { label: 'Allianz GI', value: 88, color: 'var(--chart-2)' },
  { label: 'Fidelity International', value: 86, color: 'var(--chart-3)' },
  { label: 'Columbia Threadneedle', value: 84, color: 'var(--chart-4)' },
  { label: 'Impax Asset Management', value: 82, color: 'var(--chart-5)' },
];
const OUTREACH_STATUS = [
  { key: 'met', label: 'Met this quarter', value: 3 },
  { key: 'warm', label: 'Warm intro avail.', value: 4 },
  { key: 'never', label: 'Never contacted', value: 5 },
  { key: 'cold', label: 'No pathway yet', value: 3 },
];

const PRIORITY_NOTES = [
  {
    name: 'Polar Capital — UK Healthcare',
    score: 92,
    rationale:
      'Already holds three of our five closest peers. Mandate fit is almost mechanical — the question is access, not appetite.',
  },
  {
    name: 'Allianz GI — Small-Cap Europe',
    score: 88,
    rationale:
      'Track record of building positions over three to four quarters. Right size, right horizon; needs a warm intro.',
  },
  {
    name: 'Fidelity Intl — Nordic Equities',
    score: 86,
    rationale:
      'Held INTEG B in 2022, exited on portfolio manager change. New PM joined Q4; worth a re-engagement.',
  },
];

export default function TargetingReport() {
  return (
    <article className="cb-report">
      <header className="cb-report-head">
        <div className="cb-report-kicker">Targeting pipeline · 8 min ago</div>
        <h1 className="cb-report-title">The case for who to call next</h1>
        <p className="cb-report-lede">
          The targeting model has{' '}
          <strong>{TARGETS_SUMMARY.total}</strong> candidate investors in
          pipeline, scored against fit, liquidity, peer overlap, and
          mandate fit. Thirty percent sit in the Hot bucket. Two wins
          landed in Q1. The biggest unlock in the next quarter isn't
          scoring more funds — it's converting the warm intros we
          already have.
        </p>
        <div className="cb-report-stats">
          <div className="cb-report-stat">
            <div className="cb-report-stat-value">{TARGETS_SUMMARY.total}</div>
            <div className="cb-report-stat-label">Candidate targets</div>
          </div>
          <div className="cb-report-stat">
            <div className="cb-report-stat-value cb-pos">{TARGETS_SUMMARY.hot}</div>
            <div className="cb-report-stat-label">Hot priority</div>
          </div>
          <div className="cb-report-stat">
            <div className="cb-report-stat-value">{TARGETS_SUMMARY.avgScore}</div>
            <div className="cb-report-stat-label">Avg fit score</div>
          </div>
          <div className="cb-report-stat">
            <div className="cb-report-stat-value cb-pos">+2</div>
            <div className="cb-report-stat-label">Q1 wins</div>
          </div>
        </div>
      </header>

      <section className="cb-report-section">
        <h2>1. The shape of the pipeline</h2>
        <p>
          Of the {TARGETS_SUMMARY.total} names, <strong>{TARGETS_SUMMARY.hot}</strong>{' '}
          are Hot (actionable this quarter), {TARGETS_SUMMARY.warm} Warm (next
          quarter), and {TARGETS_SUMMARY.cold} Cold (background watch). The
          distribution is intentionally top-heavy — the AI is asked to be
          opinionated, and it is.
        </p>
        <figure className="cb-report-chart">
          <div className="cb-briefing-chart-title">Priority split</div>
          <DonutChart
            data={PRIORITY_SPLIT}
            size={160}
            centerValue={String(TARGETS_SUMMARY.total)}
            centerLabel="targets"
          />
        </figure>
        <p>
          For a First North name of this size, a 15-target Hot queue is
          roughly the limit of what a two-person IR team can credibly work
          in a quarter. Ranking discipline matters more than volume from
          here on.
        </p>
      </section>

      <section className="cb-report-section">
        <h2>2. Who scores highest — and why</h2>
        <p>
          The top five prospects by fit score are concentrated in UK and
          Continental European small-cap healthcare and sustainability
          mandates. None of them currently hold the name. All five already
          hold at least two of our five closest peers.
        </p>
        <figure className="cb-report-chart">
          <div className="cb-briefing-chart-title">Top AI fit scores</div>
          <BarChart
            data={TOP_SCORES}
            valueFormatter={(v) => `${v}/100`}
          />
        </figure>
        <div className="cb-report-table-wrap">
          <table className="cb-report-table">
            <thead>
              <tr>
                <th>Prospect</th>
                <th>Score</th>
                <th>Why now</th>
              </tr>
            </thead>
            <tbody>
              {PRIORITY_NOTES.map((p) => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>{p.score}/100</td>
                  <td>{p.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="cb-report-section">
        <h2>3. The real constraint — access</h2>
        <p>
          Five of the fifteen Hot targets have <strong>no pathway</strong>{' '}
          identified yet: no sell-side warm intro, no peer-register
          anchor, no existing relationship from senior management. That's
          where the quarter's effort should go — not discovering new
          names, but opening doors to the ones already scored.
        </p>
        <figure className="cb-report-chart">
          <div className="cb-briefing-chart-title">Hot-target outreach status</div>
          <StackedBar data={OUTREACH_STATUS} />
        </figure>
        <blockquote className="cb-report-callout">
          <strong>The 80/20 of the quarter:</strong> four warm intros
          already exist. Convert two of them, and the quarter's targeting
          KPI is met before any cold outreach is attempted.
        </blockquote>
      </section>

      <section className="cb-report-section">
        <h2>4. Fit score calibration</h2>
        <p>
          Across the full pipeline, the average fit score is{' '}
          <strong>{TARGETS_SUMMARY.avgScore}/100</strong>. That's a high
          number — healthier than any comparable First North micro-cap
          screened with the same methodology — but it also reflects the
          narrow niche the name plays in.
        </p>
        <figure className="cb-report-chart" style={{ alignItems: 'center' }}>
          <div className="cb-briefing-chart-title" style={{ alignSelf: 'flex-start' }}>
            Average fit score
          </div>
          <ProgressRing
            value={TARGETS_SUMMARY.avgScore}
            max={100}
            size={160}
            label={`${TARGETS_SUMMARY.avgScore}/100`}
          />
        </figure>
      </section>

      <section className="cb-report-section">
        <h2>5. Q1 wins and what they teach us</h2>
        <p>
          Two institutional holders came in during Q1 —{' '}
          <strong>Aberdeen</strong> at 0.52% of capital, and{' '}
          <strong>Goldman Sachs AM</strong> at 0.24%. Both were sourced via
          warm intros generated by the model's peer-register analysis,
          neither via direct cold outreach. That's the second data point
          of the same pattern: warm intros convert, cold outreach rarely
          does at this scale.
        </p>
      </section>

      <section className="cb-report-section">
        <h2>6. The next 90 days</h2>
        <p>
          Nineteen roadshow slots are booked; nine are open across London
          and Stockholm. The pragmatic plan is to fill those nine slots
          with the top five Hot targets first, use Q1-winner warm intros
          as a reference, and leave cold-outreach experimentation to the
          tail end of the quarter when the priority queue is cleared.
        </p>
        <ul className="cb-report-list">
          <li>Convert 2 of 4 existing warm intros (Polar, Allianz GI first).</li>
          <li>Re-engage Fidelity Intl via the new PM route.</li>
          <li>Fill 7 of 9 open roadshow slots with Hot-bucket names.</li>
          <li>Run the cold-outreach experiment only on the 3 "no pathway yet" names with best mandate match.</li>
        </ul>
      </section>

      <footer className="cb-report-footer">
        <div>Prepared by Command Bar · Targeting module · INTEG B</div>
        <div>Peer-register and filings sync current to 8 minutes ago. Mock data.</div>
      </footer>
    </article>
  );
}
