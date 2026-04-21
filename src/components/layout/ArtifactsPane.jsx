import { useEffect, useRef, useState } from 'react';
import { X, ChevronRight, PanelRightClose, PanelRightOpen } from 'lucide-react';
import ArtifactView from '../artifacts/ArtifactView';

function QuickActionList({ actions, title, subtitle }) {
  return (
    <div className="cb-artifacts-qa">
      <div className="cb-qa-header">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="cb-qa-list">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              type="button"
              className="cb-qa-item"
              onClick={a.onClick}
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
    </div>
  );
}

export default function ArtifactsPane({ artifacts }) {
  const { state, closeArtifact, setWidth, togglePane } = artifacts;
  const { paneVisible, item, width, quickActions, quickActionsTitle, quickActionsSub } = state;
  const paneRef = useRef(null);
  const dragStartRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (!item) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeArtifact();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, closeArtifact]);

  // Mobile: push a history entry when an artifact opens so the browser
  // back button closes the pane instead of navigating away.
  useEffect(() => {
    if (!isMobile || !item) return undefined;
    window.history.pushState({ artifact: true }, '');
    const onPopState = () => {
      closeArtifact();
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [isMobile, item, closeArtifact]);

  useEffect(() => {
    if (!dragging) return undefined;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      if (clientX == null) return;
      const vw = window.innerWidth;
      const maxWidth = Math.max(360, Math.floor(vw * 0.7));
      const nextWidth = Math.min(maxWidth, Math.max(340, vw - clientX));
      setWidth(nextWidth);
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [dragging, setWidth]);

  // Desktop: always render, visibility controlled by paneVisible.
  // Mobile: only render when an actual artifact item is open.
  if (isMobile && !item) return null;
  if (!isMobile && !paneVisible) {
    // Show a small re-open tab on the right edge.
    return (
      <button
        type="button"
        className="cb-artifacts-toggle"
        onClick={togglePane}
        aria-label="Open side panel"
        title="Open panel"
      >
        <PanelRightClose size={16} strokeWidth={1.5} />
      </button>
    );
  }

  const showingQuickActions = !item && quickActions.length > 0;

  return (
    <aside
      ref={paneRef}
      className={
        'cb-artifacts' +
        (isMobile ? ' cb-artifacts--mobile' : '') +
        (dragging ? ' is-dragging' : '')
      }
      style={isMobile ? undefined : { width: `${width}px` }}
      role="complementary"
      aria-label="Side panel"
    >
      {!isMobile && (
        <button
          type="button"
          className="cb-artifacts-resizer"
          onMouseDown={(e) => {
            e.preventDefault();
            dragStartRef.current = e.clientX;
            setDragging(true);
          }}
          onTouchStart={(e) => {
            dragStartRef.current = e.touches[0].clientX;
            setDragging(true);
          }}
          aria-label="Resize panel"
          title="Drag to resize"
        />
      )}

      <button
        type="button"
        className="cb-icon-btn cb-artifacts-close"
        onClick={item ? closeArtifact : togglePane}
        aria-label={item ? 'Back to quick actions' : 'Collapse panel'}
        title={item ? 'Back' : 'Collapse'}
      >
        {item ? (
          <X size={16} strokeWidth={1.75} />
        ) : (
          <PanelRightOpen size={16} strokeWidth={1.5} />
        )}
      </button>

      <div className="cb-artifacts-body">
        {item ? (
          <ArtifactView item={item} />
        ) : showingQuickActions ? (
          <QuickActionList
            actions={quickActions}
            title={quickActionsTitle}
            subtitle={quickActionsSub}
          />
        ) : (
          <div className="cb-artifacts-qa">
            <div className="cb-qa-header">
              <h3>Side panel</h3>
              <p>Quick actions and data views will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
