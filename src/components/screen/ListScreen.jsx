import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import DataTable from '../ui/DataTable';

// Reusable list screen shell.
//
// Modes:
//   default         → full-page route, wraps content in <main> + back link
//   inArtifact      → skips <main> wrapper + back link; intended for the
//                     artifacts pane on the right side.
export default function ListScreen({
  title,
  subtitle,
  backTo: backToProp,
  backLabel: backLabelProp,
  searchPlaceholder = 'Search…',
  searchFields = [],
  columns,
  rows,
  emptyMessage = 'No matches',
  toolbarExtras,
  children,
  inArtifact = false,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const backLabel =
    backLabelProp || location.state?.backLabel || 'Back to Dashboard';

  const handleBack = () => {
    if (location.state?.backTo) {
      navigate(location.state.backTo);
    } else if (backToProp) {
      navigate(backToProp);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

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

  const body = (
    <div className={inArtifact ? 'cb-screen-inner cb-screen-inner--pane' : 'cb-screen-inner'}>
      {!inArtifact && (
        <button
          type="button"
          onClick={handleBack}
          className="cb-screen-back"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={12} strokeWidth={2} />
          {backLabel}
        </button>
      )}

      <header className="cb-screen-header">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </header>

      <div className="cb-screen-toolbar">
        {searchFields.length > 0 && (
          <div className="cb-screen-search">
            <Search
              size={13}
              strokeWidth={1.75}
              style={{ color: 'var(--text-tertiary)' }}
            />
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
  );

  if (inArtifact) {
    return body;
  }

  return (
    <main className="cb-screen">
      <div className="cb-screen-scroll">{body}</div>
    </main>
  );
}
