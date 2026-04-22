import BriefingCard from '../shared/BriefingCard';
import DonutChart from '../ui/DonutChart';
import BarChart from '../ui/BarChart';
import Sparkline from '../ui/Sparkline';
import { dayName, formatPct } from '../../utils/formatters';

const PRICE_HISTORY = [14.80, 15.10, 14.95, 15.30, 15.55, 15.38, 15.60, 15.85, 15.70, 16.05, 16.16];

const OWNER_TREND = [3374, 3389, 3401, 3412, 3424, 3438, 3451, 3460, 3470, 3478, 3489, 3498];

const TOP_5_HOLDERS = [
  { label: 'R. Brännemark', value: 23.19 },
  { label: 'Aviva Perfusion', value: 21.13 },
  { label: 'Nordea Funds', value: 3.45 },
  { label: 'SEB Life', value: 2.87 },
  { label: 'Al Rajhi', value: 1.98 },
];

const OWNER_TYPE = [
  { key: 'ind', label: 'Individual', value: 32.4 },
  { key: 'fund', label: 'Funds', value: 25.8 },
  { key: 'strat', label: 'Strategic', value: 24.1 },
  { key: 'ins', label: 'Pension/Ins.', value: 11.6 },
  { key: 'bank', label: 'Banks', value: 6.1 },
];

const GEO_SPLIT = [
  { key: 'se', label: 'Sweden', value: 68.4 },
  { key: 'no', label: 'Norway', value: 21.7 },
  { key: 'us', label: 'USA', value: 3.2 },
  { key: 'other', label: 'Other', value: 6.7 },
];

const SHORT_TREND = [
  { label: '6mo ago', value: 3.2 },
  { label: '3mo ago', value: 2.8 },
  { label: '1mo ago', value: 2.3 },
  { label: 'Now', value: 2.1 },
];

export default function MorningBriefing() {
  const day = dayName(new Date());

  const teaser = (
    <p style={{ margin: 0 }}>
      <span className="cb-strong">INTEG B</span>{' '}
      <span className="cb-pos">▲ 5.07%</span> at{' '}
      <span className="cb-num">16.16 SEK</span>. Owners:{' '}
      <span className="cb-num">3,498</span>{' '}
      <span className="cb-pos">(+124 YoY)</span>. Foreign{' '}
      <span className="cb-num">20.08%</span>{' '}
      <span className="cb-neg">(−1.3pp)</span>. Short{' '}
      <span className="cb-num">2.1%</span>. Q1 2026 earnings expected in{' '}
      <span className="cb-strong">~3 weeks</span>.
    </p>
  );

  return (
    <BriefingCard
      title={`${day} Morning Briefing`}
      subtitle="Generated 15 minutes ago"
      teaser={teaser}
      pills={[
        { label: 'Free Float', value: '69.94%' },
        { label: 'Owners', value: '3,498' },
        { label: 'Foreign', value: '20.08%' },
        { label: 'Short', value: '2.1%' },
      ]}
    >
      <section>
        <h3 className="cb-section-head">Stock &amp; Trading</h3>
        <p style={{ margin: 0 }}>
          <span className="cb-strong">INTEG B</span> opened at{' '}
          <span className="cb-num">15.38 SEK</span> and is currently trading at{' '}
          <span className="cb-num">16.16 SEK</span>,{' '}
          <span className="cb-pos">▲ 5.07%</span> on the session. Average daily
          turnover is <span className="cb-num">€18,400</span> with{' '}
          <span className="cb-strong">Nasdaq First North</span> accounting for{' '}
          <span className="cb-num">86%</span> of volume.
        </p>
      </section>
      <section>
        <h3 className="cb-section-head">Ownership</h3>
        <p style={{ margin: 0 }}>
          <span className="cb-num">3,498</span> identified owners.{' '}
          <span className="cb-strong">Aviva Perfusion AS</span> reduced by{' '}
          <span className="cb-neg">−21,204 shares</span>.{' '}
          <span className="cb-strong">Nordea</span> added{' '}
          <span className="cb-pos">+45,000 shares</span>.
        </p>
      </section>
      <section>
        <h3 className="cb-section-head">Insider &amp; Short</h3>
        <p style={{ margin: 0 }}>
          Short interest <span className="cb-num">2.1%</span>,{' '}
          <span className="cb-pos">down from 2.8%</span> three months ago.
          Insider ownership <span className="cb-num">23.95%</span> of capital.
        </p>
      </section>
      <section>
        <h3 className="cb-section-head">Looking Ahead</h3>
        <p style={{ margin: 0 }}>
          <span className="cb-strong">Q1 2026 earnings</span> expected within
          three weeks. Quiet period approaching.
        </p>
      </section>

      <section>
        <h3 className="cb-section-head">Charts</h3>
        <div className="cb-briefing-charts">
          <div className="cb-briefing-chart">
            <div className="cb-briefing-chart-title">Price (30d)</div>
            <p className="cb-briefing-chart-desc">
              Daily closing prices over the last 30 trading days. A steady
              climb here usually tracks positive momentum and broadening demand.
            </p>
            <Sparkline
              data={PRICE_HISTORY}
              width="100%"
              viewWidth={400}
              height={60}
              strokeWidth={1.5}
              color="var(--text-primary)"
              fill
            />
          </div>
          <div className="cb-briefing-chart">
            <div className="cb-briefing-chart-title">Top 5 holders</div>
            <p className="cb-briefing-chart-desc">
              The five largest owners by share of capital. Concentration risk
              becomes the story when the top two together exceed 40%.
            </p>
            <BarChart data={TOP_5_HOLDERS} valueFormatter={(v) => formatPct(v, 2)} />
          </div>
          <div className="cb-briefing-chart">
            <div className="cb-briefing-chart-title">Ownership by type</div>
            <p className="cb-briefing-chart-desc">
              Split of the register by investor category — individuals, funds,
              strategic, pension/insurance, banks. A balanced mix is typically
              healthier than single-type dominance.
            </p>
            <DonutChart
              data={OWNER_TYPE}
              size={120}
              centerValue="5"
              centerLabel="types"
            />
          </div>
          <div className="cb-briefing-chart">
            <div className="cb-briefing-chart-title">Geography</div>
            <p className="cb-briefing-chart-desc">
              Share of capital held by investor country. Heavy domestic
              concentration caps international interest but shields against
              foreign outflows.
            </p>
            <DonutChart
              data={GEO_SPLIT}
              size={120}
              centerValue="68%"
              centerLabel="Sweden"
            />
          </div>
          <div className="cb-briefing-chart">
            <div className="cb-briefing-chart-title">Owner count (12mo)</div>
            <p className="cb-briefing-chart-desc">
              Total identified owners over the past twelve months. Steady
              growth usually reflects broadening retail interest rather than
              one-off institutional moves.
            </p>
            <Sparkline
              data={OWNER_TREND}
              width="100%"
              viewWidth={400}
              height={60}
              strokeWidth={1.5}
              color="var(--positive)"
              fill
            />
          </div>
          <div className="cb-briefing-chart">
            <div className="cb-briefing-chart-title">Short interest trend</div>
            <p className="cb-briefing-chart-desc">
              Short position as a percentage of free float, sampled quarterly.
              A declining ratio is a constructive signal for sentiment.
            </p>
            <BarChart data={SHORT_TREND} valueFormatter={(v) => formatPct(v, 1)} />
          </div>
        </div>
      </section>
    </BriefingCard>
  );
}
