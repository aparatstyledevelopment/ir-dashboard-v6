import { Menu, Search, Bell } from 'lucide-react';
import { COMPANY } from '../../data/company';

export default function TopBar({ onOpenDrawer }) {
  const isUp = COMPANY.change >= 0;
  const arrow = isUp ? '▲' : '▼';

  return (
    <header className="cb-topbar">
      <div className="cb-topbar-left">
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open menu"
          className="cb-mobile-only cb-icon-btn"
          style={{ color: 'var(--text-primary)' }}
        >
          <Menu size={18} strokeWidth={1.75} />
        </button>
        <div className="cb-topbar-ticker tabular">
          <span className="cb-topbar-ticker-name">{COMPANY.ticker}</span>
          <span className="cb-topbar-ticker-sep">·</span>
          <span className="cb-topbar-ticker-price">
            {COMPANY.price.toFixed(2)} {COMPANY.currency}
          </span>
          <span
            className="cb-topbar-ticker-change"
            style={{
              color: isUp ? 'var(--positive)' : 'var(--negative)',
            }}
          >
            {arrow} {Math.abs(COMPANY.change).toFixed(2)}%
          </span>
          <span className="cb-topbar-ticker-exchange">· {COMPANY.exchange}</span>
        </div>
      </div>

      <div className="cb-topbar-right">
        <button
          type="button"
          className="cb-topbar-search-btn"
          aria-label="Search"
          title="Search"
        >
          <Search size={15} strokeWidth={1.75} />
        </button>
        <div className="cb-topbar-search">
          <Search
            size={14}
            strokeWidth={1.75}
            style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
          />
          <input
            type="text"
            placeholder="Search owners, contacts, reports…"
            aria-label="Search the platform"
          />
        </div>
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="cb-topbar-notif"
        >
          <Bell size={16} strokeWidth={1.75} />
          <span className="cb-topbar-notif-dot" />
        </button>
      </div>
    </header>
  );
}
