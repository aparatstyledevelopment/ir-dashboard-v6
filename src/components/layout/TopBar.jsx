import { useState } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { COMPANY } from '../../data/company';

export default function TopBar({ onOpenDrawer, onOpenNotifications, onSearch }) {
  const [query, setQuery] = useState('');
  const isUp = COMPANY.change >= 0;
  const arrow = isUp ? '▲' : '▼';

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      onSearch?.(q);
      setQuery('');
    }
  };

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
          onClick={() => {
            const q = prompt('Search owners, contacts, reports…');
            if (q?.trim()) onSearch?.(q.trim());
          }}
        >
          <Search size={15} strokeWidth={1.75} />
        </button>
        <form className="cb-topbar-search" onSubmit={handleSubmit}>
          <Search
            size={14}
            strokeWidth={1.75}
            style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search owners, contacts, reports…"
            aria-label="Search the platform"
          />
        </form>
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="cb-topbar-notif"
          onClick={onOpenNotifications}
        >
          <Bell size={16} strokeWidth={1.75} />
          <span className="cb-topbar-notif-dot" />
        </button>
      </div>
    </header>
  );
}
