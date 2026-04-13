import { useState } from 'react';
import { ChevronRight, LayoutGrid } from 'lucide-react';

function QuickActionList({ actions, onItemClick }) {
  return (
    <div className="cb-qa-list">
      {actions.map((a) => {
        const Icon = a.icon;
        return (
          <button
            key={a.id}
            type="button"
            className="cb-qa-item"
            onClick={() => {
              a.onClick?.();
              onItemClick?.();
            }}
          >
            {Icon && (
              <span className="cb-qa-icon">
                <Icon size={14} strokeWidth={1.75} />
              </span>
            )}
            <span className="cb-qa-body">
              <span className="cb-qa-label">{a.label}</span>
              {a.sub && <span className="cb-qa-sub">{a.sub}</span>}
            </span>
            <span className="cb-qa-arrow">
              <ChevronRight size={12} strokeWidth={1.75} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function QuickActionsPanel({
  title = 'Quick actions',
  subtitle = 'Jump straight to a key view',
  actions = [],
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  if (actions.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop: persistent left-rail panel */}
      <aside className="cb-quickactions">
        <div className="cb-qa-header">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <QuickActionList actions={actions} />
      </aside>

      {/* Mobile: floating button + bottom sheet */}
      <button
        type="button"
        className="cb-qa-fab"
        aria-label="Open quick actions"
        onClick={() => setSheetOpen(true)}
      >
        <LayoutGrid size={18} strokeWidth={1.75} />
      </button>

      {sheetOpen && (
        <div
          className="cb-qa-sheet-overlay"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="cb-qa-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Quick actions"
          >
            <div className="cb-qa-sheet-handle" />
            <div className="cb-qa-header">
              <h3>{title}</h3>
              <p>{subtitle}</p>
            </div>
            <QuickActionList
              actions={actions}
              onItemClick={() => setSheetOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
