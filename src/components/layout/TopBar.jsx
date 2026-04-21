import { useEffect, useRef, useState } from 'react';
import { Menu, Search, Bell, X } from 'lucide-react';
import { COMPANY } from '../../data/company';

function MobileSearchOverlay({ open, onClose, onSearch }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = inputRef.current?.value?.trim();
    if (q) {
      onSearch?.(q);
      onClose();
    }
  };

  return (
    <div className="cb-mobile-search-overlay">
      <form onSubmit={handleSubmit} className="cb-mobile-search-bar">
        <Search size={16} strokeWidth={1.75} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search owners, contacts, reports…"
          className="cb-mobile-search-input"
        />
        <button
          type="button"
          onClick={onClose}
          className="cb-icon-btn"
          aria-label="Close search"
          style={{ color: 'var(--text-secondary)' }}
        >
          <X size={18} strokeWidth={1.75} />
        </button>
      </form>
    </div>
  );
}

export default function TopBar({ onOpenDrawer, onOpenNotifications, onSearch }) {
  const [query, setQuery] = useState('');
  const [mobileSearch, setMobileSearch] = useState(false);
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
    <>
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
            onClick={() => setMobileSearch(true)}
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

      <MobileSearchOverlay
        open={mobileSearch}
        onClose={() => setMobileSearch(false)}
        onSearch={onSearch}
      />
    </>
  );
}
