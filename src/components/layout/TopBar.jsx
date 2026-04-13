import { Menu, Search } from 'lucide-react';
import { COMPANY } from '../../data/company';

export default function TopBar({ onOpenDrawer }) {
  const isUp = COMPANY.change >= 0;
  const arrow = isUp ? '▲' : '▼';

  return (
    <header
      style={{
        height: '52px',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open menu"
          className="cb-mobile-only cb-icon-btn"
          style={{ color: 'var(--text-primary)' }}
        >
          <Menu size={18} strokeWidth={1.75} />
        </button>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
            fontSize: '12px',
            letterSpacing: '-0.01em',
          }}
          className="tabular"
        >
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{COMPANY.ticker}</span>
          <span style={{ color: 'var(--text-tertiary)' }}>·</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            {COMPANY.price.toFixed(2)} {COMPANY.currency}
          </span>
          <span
            style={{
              fontWeight: 500,
              color: isUp ? 'var(--positive)' : 'var(--negative)',
              fontSize: '11px',
            }}
          >
            {arrow} {Math.abs(COMPANY.change).toFixed(2)}%
          </span>
          <span
            className="cb-tablet-up"
            style={{
              color: 'var(--text-tertiary)',
              fontSize: '11px',
            }}
          >
            · {COMPANY.exchange}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button type="button" aria-label="Search" className="cb-icon-btn">
          <Search size={16} strokeWidth={1.75} />
        </button>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          MF
        </div>
      </div>
    </header>
  );
}
