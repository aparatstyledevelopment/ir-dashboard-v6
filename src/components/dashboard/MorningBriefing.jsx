import BriefingCard from '../shared/BriefingCard';
import { dayName } from '../../utils/formatters';

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
          <span className="cb-pos">▲ 5.07%</span> on the session. The stock has
          been range-bound between <span className="cb-num">14.80</span> and{' '}
          <span className="cb-num">16.50</span> over the past four weeks.
          Average daily turnover is <span className="cb-num">€18,400</span>{' '}
          across all venues, with <span className="cb-strong">Nasdaq First North</span>{' '}
          accounting for <span className="cb-num">86%</span> of volume.{' '}
          <span style={{ color: 'var(--text-tertiary)' }}>
            No block trades in the past 5 trading days.
          </span>
        </p>
      </section>

      <section>
        <h3 className="cb-section-head">Ownership</h3>
        <p style={{ margin: 0 }}>
          Your shareholder base stands at <span className="cb-num">3,498</span>{' '}
          identified owners, <span className="cb-pos">+124 YoY</span>. Free
          float is <span className="cb-num">69.94%</span>{' '}
          <span className="cb-neg">(−2.1pp YoY)</span>. Foreign ownership is{' '}
          <span className="cb-num">20.08%</span>{' '}
          <span className="cb-neg">(−1.3pp YoY)</span>.
        </p>
        <p style={{ margin: '8px 0 0' }}>
          The most notable recent move:{' '}
          <span className="cb-strong">Aviva Perfusion AS</span> reduced their
          position by <span className="cb-neg">−21,204 shares</span> and now
          holds <span className="cb-num">21.13%</span> of capital. On the buy
          side, <span className="cb-strong">Nordea Investment Funds</span>{' '}
          added <span className="cb-pos">+45,000 shares</span> (now{' '}
          <span className="cb-num">3.45%</span>), and{' '}
          <span className="cb-strong">Invesco Ltd</span> increased by{' '}
          <span className="cb-pos">+32,100 shares</span> from across the
          Atlantic.
        </p>
      </section>

      <section>
        <h3 className="cb-section-head">Insider &amp; Short</h3>
        <p style={{ margin: 0 }}>
          Short interest is currently <span className="cb-num">2.1%</span> of
          capital, <span className="cb-pos">down from 2.8% three months ago</span>.
          No new PDMR transactions in the past 14 days. Insider ownership
          remains concentrated — <span className="cb-strong">Richard Brännemark</span>{' '}
          holds <span className="cb-num">23.19%</span> of capital and{' '}
          <span className="cb-num">28.4%</span> of votes as the largest single
          holder.
        </p>
      </section>

      <section>
        <h3 className="cb-section-head">Looking Ahead</h3>
        <p style={{ margin: 0 }}>
          The <span className="cb-strong">Q1 2026 earnings report</span> is
          expected within the next three weeks. The quiet period is
          approaching. No AGM or capital markets day has been announced for
          this quarter.
        </p>
      </section>
    </BriefingCard>
  );
}
