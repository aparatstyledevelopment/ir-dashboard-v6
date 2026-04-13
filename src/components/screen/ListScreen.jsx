import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import DataTable from '../ui/DataTable';

export default function ListScreen({
  title,
  subtitle,
  backTo = '/',
  backLabel = 'Back to Dashboard',
  searchPlaceholder = 'Search…',
  searchFields = [],
  columns,
  rows,
  emptyMessage = 'No matches',
  toolbarExtras,
  children,
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    if (!searchFields.length) return rows;
    return rows.filter((row) =>
      searchFields.some((f) => {
        const v = row[f];
        return v != null && String(v).toLowerCase().includes(q);
      })
    );
  }, [query, rows, searchFields]);

  return (
    <main className="cb-screen">
      <div className="cb-screen-scroll">
        <div className="cb-screen-inner">
          <Link to={backTo} className="cb-screen-back">
            <ArrowLeft size={12} strokeWidth={2} />
            {backLabel}
          </Link>

          <header className="cb-screen-header">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </header>

          <div className="cb-screen-toolbar">
            {searchFields.length > 0 && (
              <div className="cb-screen-search">
                <Search size={13} strokeWidth={1.75} style={{ color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                />
              </div>
            )}
            <span className="cb-screen-meta">
              {filtered.length} of {rows.length}
            </span>
            {toolbarExtras}
          </div>

          {children}

          {columns && filtered.length > 0 ? (
            <div style={{ marginTop: '2px' }}>
              <DataTable columns={columns} rows={filtered} />
            </div>
          ) : columns ? (
            <div className="cb-screen-empty">{emptyMessage}</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
