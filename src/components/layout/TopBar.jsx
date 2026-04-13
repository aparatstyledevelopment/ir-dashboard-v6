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
        gap: '14px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
        }}
      >
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
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {COMPANY.ticker}
          </span>
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

      <div
        className="cb-topbar-search"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1,
          maxWidth: '420px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '999px',
          padding: '6px 14px',
        }}
      >
        <Search
          size={14}
          strokeWidth={1.75}
          style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
        />
        <input
          type="text"
          placeholder="Search owners, contacts, reports…"
          aria-label="Search the platform"
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '12px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            minWidth: 0,
          }}
        />
      </div>
    </header>
  );
}
