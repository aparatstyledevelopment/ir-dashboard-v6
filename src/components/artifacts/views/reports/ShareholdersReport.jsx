import Sparkline from '../../../ui/Sparkline';
import BarChart from '../../../ui/BarChart';
import DonutChart from '../../../ui/DonutChart';
import StackedBar from '../../../ui/StackedBar';
import { formatNumber } from '../../../../utils/formatters';

const OWNER_TREND = [3374, 3389, 3401, 3412, 3424, 3438, 3451, 3460, 3470, 3478, 3489, 3498];
const GEO_BREAKDOWN = [
  { key: 'se', label: 'Sweden', value: 68.4 },
  { key: 'no', label: 'Norway', value: 21.7 },
  { key: 'us', label: 'USA', value: 3.2 },
  { key: 'sa', label: 'Saudi Arabia', value: 2.0 },
  { key: 'other', label: 'Other', value: 4.7 },
];
const TYPE_BREAKDOWN = [
  { key: 'ind', label: 'Individual', value: 32.4 },
  { key: 'fund', label: 'Funds', value: 25.8 },
  { key: 'strat', label: 'Strategic', value: 24.1 },
  { key: 'ins', label: 'Pension / Ins.', value: 11.6 },
  { key: 'bank', label: 'Banks', value: 6.1 },
];
const NET_FLOW = [
  { label: 'Holders who added', value: 5, color: 'var(--positive)' },
  { label: 'Holders who trimmed', value: 4, color: 'var(--negative)' },
];
const TOP_MOVERS = [
  { name: 'Aviva Perfusion AS', change: -21204, note: 'Continued measured trim — 4th consecutive month.' },
  { name: 'Nordea Investment Funds', change: +45000, note: 'Added into the run — first addition this year.' },
  { name: 'SEB Life International', change: +12400, note: 'Mandate top-up; size implies systematic buying.' },
  { name: 'Al Rajhi Capital', change: +8900, note: 'New to the top 5; watch for follow-on.' },
  { name: 'Retail aggregate', change: +20700, note: 'Net retail inflow across the long tail.' },
];

export default function ShareholdersReport() {
  return (
    <article className="cb-report">
      <header className="cb-report-head">
        <div className="cb-report-kicker">Shareholder register deep dive · 12 min ago</div>
        <h1 className="cb-report-title">Who owns EXMPL — and who just changed their mind</h1>
        <p className="cb-report-lede">
          The register tells a clearer story than the price. Owner count is
          up, the long tail is growing faster than the top of the book, and
          net flow is quietly positive. Concentration remains the single
          story to manage — the top two still sum to 44.32% of capital —
          but every other part of the register is moving in the right
          direction.
        </p>
        <div className="cb-report-stats">
          <div className="cb-report-stat">
            <div className="cb-report-stat-value">3,498</div>
            <div className="cb-report-stat-label">Identified owners</div>
          </div>
          <div className="cb-report-stat">
            <div className="cb-report-stat-value">54.2%</div>
            <div className="cb-report-stat-label">Top 25 control</div>
          </div>
          <div className="cb-report-stat">
            <div className="cb-report-stat-value">69.94%</div>
            <div className="cb-report-stat-label">Free float</div>
          </div>
          <div className="cb-report-stat">
            <div className="cb-report-stat-value cb-pos">+33</div>
            <div className="cb-report-stat-label">New holders, 6 weeks</div>
          </div>
        </div>
      </header>

      <section className="cb-report-section">
        <h2>1. Register shape, twelve months in</h2>
        <p>
          The register has grown from 3,374 to <strong>3,498</strong> owners
          over the past twelve months — a 3.7% YoY increase. Just as useful
          as the level is the shape: the line is essentially linear, with
          no single month carrying the growth. That's the signature of
          broadening interest, not a one-off retail spike.
        </p>
        <figure className="cb-report-chart">
          <div className="cb-briefing-chart-title">Identified owners, 12 months</div>
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
            Steady-state growth rather than a catalyst-driven move. Good
            quality of accretion.
          </figcaption>
        </figure>
      </section>

      <section className="cb-report-section">
        <h2>2. Geography — still a Swedish book</h2>
        <p>
          Sweden accounts for <strong>68.4%</strong> of capital, with Norway
          a distant second at 21.7% — almost entirely driven by Aviva
          Perfusion's holding. The foreign share sits at 20.08%, which is
          below where IR has historically targeted the number (25%) but
          above a floor that would raise international-visibility concerns.
        </p>
        <figure className="cb-report-chart">
          <div className="cb-briefing-chart-title">Capital by investor country</div>
          <DonutChart
            data={GEO_BREAKDOWN}
            size={160}
            centerValue="5"
            centerLabel="countries"
          />
        </figure>
        <p>
          The 1.3pp foreign-share dip over the last quarter is worth a
          footnote but not a worry — it reflects Aviva's measured trim
          rather than international outflow.
        </p>
      </section>

      <section className="cb-report-section">
        <h2>3. By investor type — mixed, in a good way</h2>
        <p>
          No single investor category dominates. Individuals (32.4%),
          funds (25.8%), and strategic holders (24.1%) each account for
          about a quarter of capital, with pension/insurance and banks
          rounding out the remainder.
        </p>
        <figure className="cb-report-chart">
          <div className="cb-briefing-chart-title">Ownership split by category</div>
          <StackedBar data={TYPE_BREAKDOWN} />
        </figure>
        <p>
          For an AB listed on Nasdaq First North, this is a healthy
          composition. Fund and pension channels together sit at 37.4%,
          which is well above the First North median and creates a useful
          institutional cushion under any drawdown.
        </p>
      </section>

      <section className="cb-report-section">
        <h2>4. Thirty-day net flow</h2>
        <p>
          In the last thirty days, <strong>five holders</strong> increased
          their position by a combined +115,800 shares, while four reduced
          by 51,004 shares. Net: <strong>+64,796 shares</strong>, or about
          <strong> 0.21%</strong> of shares outstanding — a clear positive
          in a month without any particular catalyst.
        </p>
        <figure className="cb-report-chart">
          <div className="cb-briefing-chart-title">Holders that moved (30 days)</div>
          <BarChart
            data={NET_FLOW}
            baseline="zero"
            valueFormatter={(v) => `${formatNumber(v)} holders`}
          />
        </figure>
        <div className="cb-report-table-wrap">
          <table className="cb-report-table">
            <thead>
              <tr>
                <th>Holder</th>
                <th>Δ shares</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {TOP_MOVERS.map((m) => (
                <tr key={m.name}>
                  <td>{m.name}</td>
                  <td className={m.change >= 0 ? 'cb-pos' : 'cb-neg'}>
                    {m.change >= 0 ? '+' : '−'}
                    {formatNumber(Math.abs(m.change))}
                  </td>
                  <td>{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="cb-report-section">
        <h2>5. Concentration, again</h2>
        <p>
          The single finding that recurs in every view of this register:
          <strong> Brännemark + Aviva = 44.32%</strong> of capital. The
          next holder, Nordea Investment Funds, is 3.45%. From a risk
          perspective, that gap is the story. Neither of the top two has
          signalled an exit — Aviva's trim is measured, Brännemark is
          passive — but any plan that assumes the register is broadly
          diversified would be mis-reading the book.
        </p>
        <blockquote className="cb-report-callout">
          <strong>Planning rule of thumb:</strong> model a 1pp move at the
          top of the book as equivalent to the combined flow of everyone
          outside the top 25. The numbers make it almost true.
        </blockquote>
      </section>

      <section className="cb-report-section">
        <h2>6. Lock-ups and what to watch next</h2>
        <p>
          <strong>4.34M</strong> shares are currently under lock-up
          agreements — 14.15% of shares outstanding. The next expiry falls
          on <strong>June 30, 2026</strong>, which sits inside the current
          quiet period and should be actively messaged ahead of any
          potential overhang.
        </p>
        <ul className="cb-report-list">
          <li>June 30: 1.8M-share expiry — the one to pre-empt with commentary.</li>
          <li>Aug 15: 0.9M-share expiry — size is manageable at typical daily turnover.</li>
          <li>Dec 1: residual 1.64M-share cliff — track insider posture through the summer.</li>
        </ul>
      </section>

      <footer className="cb-report-footer">
        <div>Prepared by Command Bar · Shareholders module · EXMPL</div>
        <div>Register pulled from the most recent Euroclear sync. Mock data.</div>
      </footer>
    </article>
  );
}
