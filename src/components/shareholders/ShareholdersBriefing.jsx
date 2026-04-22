import BriefingCard from '../shared/BriefingCard';
import DonutChart from '../ui/DonutChart';
import BarChart from '../ui/BarChart';
import Sparkline from '../ui/Sparkline';
import StackedBar from '../ui/StackedBar';
import { formatNumber } from '../../utils/formatters';

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
  { key: 'ins', label: 'Pension/Ins.', value: 11.6 },
  { key: 'bank', label: 'Banks', value: 6.1 },
];

const NET_FLOW = [
  // Net flow is inherently directional: buyers = positive, sellers =
  // negative. The chart reads faster when those bars inherit the app's
  // reserved green/red semantics.
  { label: 'Buyers (+)', value: 5, color: 'var(--positive)' },
  { label: 'Sellers (−)', value: 4, color: 'var(--negative)' },
];

export default function ShareholdersBriefing() {
  const teaser = (
    <p style={{ margin: 0 }}>
      <span className="cb-num">3,498</span> identified holders · Top 25 control{' '}
      <span className="cb-num">54.2%</span> · Founder + Aviva ={' '}
      <span className="cb-num">44.32%</span> · Foreign{' '}
      <span className="cb-num">20.08%</span> · Locked-up{' '}
      <span className="cb-num">14.15%</span> ·{' '}
      <span className="cb-pos">+33 new holders</span> in the past 6 weeks.
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
          <span className="cb-num">3,498</span> identified owners across{' '}
          <span className="cb-num">30,677,919</span> shares. Top 25 control{' '}
          <span className="cb-num">54.2%</span>. Free float{' '}
          <span className="cb-num">69.94%</span>.
        </p>
      </section>
      <section>
        <h3 className="cb-section-head">Key Holders</h3>
        <p style={{ margin: 0 }}>
          <span className="cb-strong">Brännemark</span>{' '}
          <span className="cb-num">23.19%</span> capital ·{' '}
          <span className="cb-strong">Aviva</span>{' '}
          <span className="cb-num">21.13%</span> · Together{' '}
          <span className="cb-num">44.32%</span> of capital.
        </p>
      </section>
      <section>
        <h3 className="cb-section-head">Net Flow</h3>
        <p style={{ margin: 0 }}>
          5 holders increased by <span className="cb-pos">+115,800 shares</span>,
          4 reduced by <span className="cb-neg">−51,004</span>. Net:{' '}
          <span className="cb-pos">+64,796 shares</span>.
        </p>
      </section>
      <section>
        <h3 className="cb-section-head">Lock-ups</h3>
        <p style={{ margin: 0 }}>
          <span className="cb-num">4.34M</span> shares locked (
          <span className="cb-num">14.15%</span>). Next expiry:{' '}
          <span className="cb-strong">June 30, 2026</span>.
        </p>
      </section>

      <section>
        <h3 className="cb-section-head">Charts</h3>
        <div className="cb-briefing-charts">
          <div className="cb-briefing-chart">
            <div className="cb-briefing-chart-title">Owner count (12mo)</div>
            <p className="cb-briefing-chart-desc">
              Identified owners tracked month by month across the past year.
              Sustained growth points to continued new-investor interest.
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
            <div className="cb-briefing-chart-title">Geography</div>
            <p className="cb-briefing-chart-desc">
              Capital held by country of the registered owner. Sweden dominates
              at 68%; the foreign share ticked down 1.3pp recently.
            </p>
            <DonutChart
              data={GEO_BREAKDOWN}
              size={120}
              centerValue="5"
              centerLabel="countries"
            />
          </div>
          <div className="cb-briefing-chart">
            <div className="cb-briefing-chart-title">By investor type</div>
            <p className="cb-briefing-chart-desc">
              Breakdown of the register by investor category as a share of
              total capital — who actually owns the company.
            </p>
            <StackedBar data={TYPE_BREAKDOWN} />
          </div>
          <div className="cb-briefing-chart">
            <div className="cb-briefing-chart-title">30d net flow</div>
            <p className="cb-briefing-chart-desc">
              Number of holders who increased vs. reduced their position in
              the last 30 days. Net buyers currently outnumber sellers.
            </p>
            <BarChart
              data={NET_FLOW}
              baseline="zero"
              valueFormatter={(v) => `${formatNumber(v)} holders`}
            />
          </div>
        </div>
      </section>
    </BriefingCard>
  );
}
