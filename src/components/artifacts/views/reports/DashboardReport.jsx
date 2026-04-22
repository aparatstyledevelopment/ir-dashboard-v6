import Sparkline from '../../../ui/Sparkline';
import BarChart from '../../../ui/BarChart';
import DonutChart from '../../../ui/DonutChart';
import { formatPct } from '../../../../utils/formatters';

const PRICE_HISTORY = [14.80, 15.10, 14.95, 15.30, 15.55, 15.38, 15.60, 15.85, 15.70, 16.05, 16.16];
const OWNER_TREND = [3374, 3389, 3401, 3412, 3424, 3438, 3451, 3460, 3470, 3478, 3489, 3498];
const TOP_5_HOLDERS = [
  { label: 'Richard Brännemark', value: 23.19, color: 'var(--chart-1)' },
  { label: 'Aviva Perfusion AS', value: 21.13, color: 'var(--chart-2)' },
  { label: 'Nordea Funds', value: 3.45, color: 'var(--chart-3)' },
  { label: 'SEB Life', value: 2.87, color: 'var(--chart-4)' },
  { label: 'Al Rajhi Capital', value: 1.98, color: 'var(--chart-5)' },
];
const OWNER_TYPE = [
  { key: 'ind', label: 'Individual', value: 32.4 },
  { key: 'fund', label: 'Funds', value: 25.8 },
  { key: 'strat', label: 'Strategic', value: 24.1 },
  { key: 'ins', label: 'Pension / Insurance', value: 11.6 },
  { key: 'bank', label: 'Banks', value: 6.1 },
];
const SHORT_TREND = [
  { label: '6 months ago', value: 3.2, color: 'var(--chart-5)' },
  { label: '3 months ago', value: 2.8, color: 'var(--chart-3)' },
  { label: '1 month ago', value: 2.3, color: 'var(--chart-1)' },
  { label: 'Today', value: 2.1, color: 'var(--positive)' },
];

export default function DashboardReport() {
  return (
    <article className="cb-report">
      <header className="cb-report-head">
        <div className="cb-report-kicker">Weekly IR Briefing · Prepared 15 min ago</div>
        <h1 className="cb-report-title">INTEG B — Where the week lands</h1>
        <p className="cb-report-lede">
          Integrum AB closed the week at <strong>16.16 SEK</strong>, a{' '}
          <span className="cb-pos">5.07%</span> session gain and fresh 3-month
          high. The register keeps adding owners on a steady slope, short
          interest continues its two-year glide path lower, and the next
          earnings print is roughly three weeks out. The picture is cleanly
          constructive — with one concentration risk worth naming.
        </p>
        <div className="cb-report-stats">
          <div className="cb-report-stat">
            <div className="cb-report-stat-value">16.16 SEK</div>
            <div className="cb-report-stat-label">Last close</div>
          </div>
          <div className="cb-report-stat">
            <div className="cb-report-stat-value cb-pos">+5.07%</div>
            <div className="cb-report-stat-label">Session change</div>
          </div>
          <div className="cb-report-stat">
            <div className="cb-report-stat-value">3,498</div>
            <div className="cb-report-stat-label">Identified owners</div>
          </div>
          <div className="cb-report-stat">
            <div className="cb-report-stat-value">2.1%</div>
            <div className="cb-report-stat-label">Short interest</div>
          </div>
        </div>
      </header>

      <section className="cb-report-section">
        <h2>1. Price and momentum</h2>
        <p>
          The 30-day tape is a gently rising series with no obvious gap risk.
          Price opened the session at 15.38 SEK and closed 78 öre higher,
          with Nasdaq First North accounting for 86% of flow — roughly in
          line with the trailing-three-month average. Average daily turnover
          sits at <strong>€18,400</strong>, a number that matters more for
          liquidity framing than for drawing conclusions about demand.
        </p>
        <figure className="cb-report-chart">
          <div className="cb-briefing-chart-title">Price (last 30 days)</div>
          <Sparkline
            data={PRICE_HISTORY}
            width="100%"
            viewWidth={600}
            height={80}
            strokeWidth={1.8}
            color="var(--positive)"
            fill
          />
          <figcaption>
            Sequence of daily closes; no single day drives the run, which
            argues for a cleaner trend than a one-off print.
          </figcaption>
        </figure>
        <p>
          For IR purposes the read-through is mild: momentum is present, but
          not extreme enough to attract performance-chasing behaviour. Keep
          messaging steady — execution commentary wins over narrative in
          this regime.
        </p>
      </section>

      <section className="cb-report-section">
        <h2>2. The register, up and to the right</h2>
        <p>
          Identified owners grew from 3,374 twelve months ago to{' '}
          <strong>3,498 today</strong>. The trajectory has been almost
          perfectly linear — no single week did the heavy lifting, which is
          the healthier signature you'd hope to see. This is classic
          broadening interest rather than a single-catalyst spike.
        </p>
        <figure className="cb-report-chart">
          <div className="cb-briefing-chart-title">Identified owners (12 months)</div>
          <Sparkline
            data={OWNER_TREND}
            width="100%"
            viewWidth={600}
            height={80}
            strokeWidth={1.8}
            color="var(--positive)"
            fill
          />
          <figcaption>
            Rolling monthly count of unique holders. Up 3.7% YoY and still
            grinding higher.
          </figcaption>
        </figure>
      </section>

      <section className="cb-report-section">
        <h2>3. Concentration — read the top of the book carefully</h2>
        <p>
          The top two holders — <strong>Richard Brännemark</strong> (23.19%)
          and <strong>Aviva Perfusion AS</strong> (21.13%) — together command
          44.32% of capital. Everyone else sits below 3.5%. This is the one
          finding in this report that deserves explicit attention: anything
          affecting either owner (a lock-up expiry, a strategic review, a
          portfolio rebalance) is materially larger than the rest of the
          register put together.
        </p>
        <figure className="cb-report-chart">
          <div className="cb-briefing-chart-title">Top 5 holders (% of capital)</div>
          <BarChart
            data={TOP_5_HOLDERS}
            valueFormatter={(v) => formatPct(v, 2)}
          />
          <figcaption>
            The jump from #2 to #3 is an order of magnitude — 21.13% to
            3.45%. Plan narrative assuming that top-2 is a single risk.
          </figcaption>
        </figure>
        <blockquote className="cb-report-callout">
          <strong>Why it matters:</strong> a single 1pp trim from either top
          holder moves the free-float more than every other flow on the
          register combined. Price this into every outreach plan.
        </blockquote>
      </section>

      <section className="cb-report-section">
        <h2>4. Composition and quality of ownership</h2>
        <p>
          By investor type, the book remains healthily mixed — no single
          category above one-third. Individuals at 32.4% are the natural
          consequence of listing on First North; institutional
          participation is rising in relative terms through pension/insurance
          and fund channels.
        </p>
        <figure className="cb-report-chart">
          <div className="cb-briefing-chart-title">Ownership by investor type</div>
          <DonutChart
            data={OWNER_TYPE}
            size={160}
            centerValue="5"
            centerLabel="types"
          />
          <figcaption>
            A balanced composition is typically more durable than a
            fund-heavy register in a small-cap name.
          </figcaption>
        </figure>
      </section>

      <section className="cb-report-section">
        <h2>5. Short interest is quietly collapsing</h2>
        <p>
          Reported short interest is now <strong>2.1%</strong>, down from
          2.8% three months ago and 3.2% six months ago. There is no single
          dramatic moment on the tape; shorts have simply been closing into
          ownership growth. For IR, this is the cleanest signal in the
          briefing — sceptics are quietly leaving.
        </p>
        <figure className="cb-report-chart">
          <div className="cb-briefing-chart-title">Short interest trend (% of float)</div>
          <BarChart
            data={SHORT_TREND}
            valueFormatter={(v) => formatPct(v, 1)}
          />
        </figure>
        <p>
          Paired with the rising owner count, this is the textbook quiet
          re-rating setup: fewer sellers, more buyers, no headlines needed.
        </p>
      </section>

      <section className="cb-report-section">
        <h2>6. What the next three weeks look like</h2>
        <p>
          Q1 2026 earnings land in roughly three weeks, after which the
          quiet period will lift and the normal roadshow cadence can
          resume. Until then, treat this week as a holding pattern —
          keep meetings tight, avoid new commentary that could be
          construed as selective disclosure, and let the register keep
          compounding on its own.
        </p>
        <ul className="cb-report-list">
          <li>Lock-up watch: 4.34M shares (14.15%) remain under agreement; next expiry June 30.</li>
          <li>Insider ownership still 23.95% of capital — no filings this week.</li>
          <li>Foreign share edged down 1.3pp but remains above the 15% floor IR targets.</li>
        </ul>
      </section>

      <footer className="cb-report-footer">
        <div>Prepared by Command Bar · Monitor module · INTEG B</div>
        <div>All figures as of last register sync. Mock data for demo.</div>
      </footer>
    </article>
  );
}
