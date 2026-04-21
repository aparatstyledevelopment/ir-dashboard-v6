import { getInvestor } from '../../../data/investors';
import { flagFor } from '../../../utils/countryFlags';
import {
  formatNumber,
  formatPct,
  formatSignedInt,
  formatSignedPct,
  formatPrice,
  formatDateShort,
} from '../../../utils/formatters';
import Sparkline from '../../ui/Sparkline';
import DataTable from '../../ui/DataTable';
import MetricPill from '../../ui/MetricPill';

function StatBlock({ label, value, sub }) {
  return (
    <div className="cb-stat">
      <div className="cb-stat-label">{label}</div>
      <div className="cb-stat-value">{value}</div>
      {sub && <div className="cb-stat-sub">{sub}</div>}
    </div>
  );
}

function NotFound({ slug }) {
  return (
    <div className="cb-card fade-in-up" style={{ padding: '24px' }}>
      <h1
        style={{
          fontSize: '18px',
          fontWeight: 600,
          margin: 0,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}
      >
        Investor not found
      </h1>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          margin: '8px 0 0',
          lineHeight: 1.6,
        }}
      >
        No profile is available for <code style={{ fontFamily: 'inherit' }}>{slug}</code>.
      </p>
    </div>
  );
}

export default function InvestorDetailView({ slug }) {
  const investor = getInvestor(slug);

  if (!investor) {
    return (
      <div className="cb-screen-inner cb-screen-inner--pane">
        <NotFound slug={slug} />
      </div>
    );
  }

  const isUp = investor.deltaCapital > 0;
  const isDown = investor.deltaCapital < 0;
  const direction = isUp ? 'positive' : isDown ? 'negative' : 'neutral';

  const transactionColumns = [
    {
      header: 'Date',
      align: 'left',
      nowrap: true,
      render: (r) => formatDateShort(r.date),
    },
    {
      header: 'Type',
      key: 'type',
      render: (r) => (
        <span
          style={{
            color:
              r.type === 'Acquisition'
                ? 'var(--positive)'
                : r.type === 'Disposal'
                ? 'var(--negative)'
                : 'var(--text-secondary)',
            fontWeight: 500,
          }}
        >
          {r.type}
        </span>
      ),
    },
    {
      header: 'Shares',
      align: 'right',
      nowrap: true,
      render: (r) => formatSignedInt(r.shares),
    },
    {
      header: 'Price',
      align: 'right',
      nowrap: true,
      render: (r) => formatPrice(r.price, 'SEK'),
    },
  ];

  return (
    <div className="cb-screen-inner cb-screen-inner--pane" style={{ gap: '16px' }}>
      <article className="cb-card fade-in-up">
        <div
          className="cb-card-section"
          style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            {investor.rank && (
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                #{investor.rank}
              </span>
            )}
            <h1
              style={{
                fontSize: '18px',
                fontWeight: 600,
                margin: 0,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              {investor.name}
            </h1>
            {investor.country && (
              <span title={investor.country} style={{ fontSize: '15px', lineHeight: 1 }}>
                {flagFor(investor.country)}
              </span>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              letterSpacing: '-0.01em',
              flexWrap: 'wrap',
            }}
          >
            <span>{investor.role}</span>
            {investor.location && (
              <>
                <span>·</span>
                <span>{investor.location}</span>
              </>
            )}
            {investor.aum && (
              <>
                <span>·</span>
                <span>{investor.aum} AUM</span>
              </>
            )}
            {investor.lastContact && (
              <>
                <span>·</span>
                <span>Last contact {formatDateShort(investor.lastContact)}</span>
              </>
            )}
          </div>
          {investor.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
              {investor.tags.map((t) => (
                <span key={t} className="cb-tag">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className="cb-card-section"
          style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
        >
          <StatBlock
            label="Capital"
            value={formatPct(investor.capitalPct)}
            sub={
              investor.deltaCapital
                ? `${formatSignedPct(investor.deltaCapital)} 30d`
                : 'unchanged 30d'
            }
          />
          <StatBlock label="Votes" value={formatPct(investor.votesPct)} />
          <StatBlock
            label="Shares"
            value={formatNumber(investor.shares || 0)}
            sub={`of ${formatNumber(30677919)}`}
          />
          <StatBlock
            label="Market Value"
            value={`${formatNumber(Math.round((investor.marketValueSEK || 0) / 1_000_000))}M`}
            sub="SEK"
          />
        </div>

        <div className="cb-card-section">
          <h2 className="cb-card-title">12-Month Capital % Trend</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '10px',
                flex: 1,
                minWidth: 0,
              }}
            >
              <Sparkline
                data={investor.history}
                width="100%"
                viewWidth={640}
                height={64}
                strokeWidth={1.75}
                color={
                  direction === 'positive'
                    ? 'var(--positive)'
                    : direction === 'negative'
                    ? 'var(--negative)'
                    : 'var(--text-primary)'
                }
                fill
              />
              <div
                className="tabular"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  marginTop: '6px',
                  letterSpacing: '-0.01em',
                }}
              >
                <span>12mo ago: {formatPct(investor.history[0])}</span>
                <span>now: {formatPct(investor.history[investor.history.length - 1])}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cb-card-section">
          <h2 className="cb-card-title">Recent Transactions</h2>
          {investor.transactions.length === 0 ? (
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              No reported transactions in the past 90 days.
            </p>
          ) : (
            <DataTable columns={transactionColumns} rows={investor.transactions} />
          )}
        </div>

        <div className="cb-card-section">
          <h2 className="cb-card-title">About</h2>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {investor.bio}
          </p>
        </div>

        {investor.notes && (
          <div className="cb-card-section">
            <h2 className="cb-card-title">IR Notes</h2>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              {investor.notes}
            </p>
          </div>
        )}
      </article>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <MetricPill label="Type" value={investor.type || '—'} />
        {investor.country && <MetricPill label="Country" value={investor.country} />}
        {investor.aum && <MetricPill label="AUM" value={investor.aum} />}
      </div>
    </div>
  );
}
