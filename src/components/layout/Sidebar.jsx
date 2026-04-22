import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  LayoutDashboard,
  Users,
  Target,
  TrendingUp,
  BarChart3,
  UserCheck,
  ArrowDownUp,
  Building2,
  Mail,
  Calculator,
  FileText,
  Settings,
  MessageSquare,
  X,
  LayoutGrid,
  ChevronRight,
} from 'lucide-react';
import { MODULES } from '../../data/modules';
import { QUICK_ACTIONS } from '../../data/quickActions';

const ICON_MAP = {
  LayoutDashboard,
  Users,
  Target,
  TrendingUp,
  BarChart3,
  UserCheck,
  ArrowDownUp,
  Building2,
  Mail,
  Calculator,
  FileText,
};

const MODULE_LABEL = {
  dashboard: 'Dashboard',
  shareholders: 'Shareholders',
  targeting: 'Targeting',
};

const SIDEBAR_MIN = 180;
const SIDEBAR_MAX = 360;
const SIDEBAR_DEFAULT = 208;

function formatRelative(ts) {
  const delta = Date.now() - ts;
  const m = Math.floor(delta / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function QuickActionsDialog({ moduleId, anchorRect, onItemClick, onClose }) {
  const ref = useRef(null);
  const config = QUICK_ACTIONS[moduleId];

  useEffect(() => {
    const onClickOut = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      // Ignore clicks on any QA trigger button — their own onClick handler
      // is responsible for toggling the dialog, so closing here too would
      // immediately reopen the dialog via the trigger's onClick.
      if (e.target.closest?.('.cb-sidebar-qa-trigger')) return;
      onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    // Defer by one tick so the triggering click doesn't immediately close it.
    const t = setTimeout(() => {
      document.addEventListener('mousedown', onClickOut);
    }, 0);
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onClickOut);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!config || !anchorRect) return null;

  // The dialog is portaled to body, which carries the interface-size
  // `zoom` factor. getBoundingClientRect returns coordinates in the
  // zoomed (rendered) viewport space, but CSS `left`/`top` applied to
  // an element inside a zoomed container are multiplied by the zoom.
  // Divide the anchor rect and window dimensions by the zoom factor so
  // the dialog lands where we actually want it.
  const zoom =
    parseFloat(getComputedStyle(document.body).zoom) || 1;
  const anchorLeft = anchorRect.left / zoom;
  const anchorRight = anchorRect.right / zoom;
  const anchorTop = anchorRect.top / zoom;
  const DIALOG_W = 240;
  const GAP = 20;
  const vw = window.innerWidth / zoom;
  const vh = window.innerHeight / zoom;
  let left = anchorRight + GAP;
  if (left + DIALOG_W > vw - 8) {
    // Fall back to opening to the left of the sidebar if there's not room.
    left = Math.max(8, anchorLeft - DIALOG_W - GAP);
  }
  let top = anchorTop - 4;
  // Dialog height is variable; clamp to viewport.
  const estHeight = 60 + config.items.length * 48;
  if (top + estHeight > vh - 8) {
    top = Math.max(8, vh - 8 - estHeight);
  }

  return createPortal(
    <div
      ref={ref}
      className="cb-sidebar-qa-dialog"
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      <div className="cb-sidebar-qa-dialog-head">{config.title}</div>
      {config.items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            className="cb-sidebar-qa-dialog-item"
            onClick={() => {
              onItemClick?.(item.screen);
              onClose();
            }}
          >
            {Icon && <Icon size={13} strokeWidth={1.75} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="cb-sidebar-qa-dialog-label">{item.label}</span>
              <span className="cb-sidebar-qa-dialog-sub">{item.sub}</span>
            </span>
            <ChevronRight size={11} strokeWidth={1.75} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          </button>
        );
      })}
    </div>,
    document.body
  );
}

export default function Sidebar({
  conversations,
  activeModule,
  onSwitchModule,
  onOpenSettings,
  onOpenProfile,
  onOpenQuickAction,
}) {
  const [qaDialog, setQaDialog] = useState(null); // { moduleId, rect }
  const triggerRefs = useRef({});
  const [width, setWidth] = useState(() => {
    try {
      const raw = localStorage.getItem('cb-sidebar-w');
      const n = raw ? parseInt(raw, 10) : NaN;
      if (Number.isFinite(n) && n >= SIDEBAR_MIN && n <= SIDEBAR_MAX) return n;
    } catch {}
    return SIDEBAR_DEFAULT;
  });
  const [dragging, setDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (!dragging) return undefined;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      if (clientX == null) return;
      const next = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, Math.round(clientX)));
      setWidth(next);
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
  }, [dragging]);

  useEffect(() => {
    try { localStorage.setItem('cb-sidebar-w', String(width)); } catch {}
  }, [width]);

  // Close the QA dialog if the user resizes the window so the anchor
  // position doesn't become stale.
  useEffect(() => {
    if (!qaDialog) return undefined;
    const onResize = () => setQaDialog(null);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [qaDialog]);

  const openQa = (moduleId) => {
    const el = triggerRefs.current[moduleId];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setQaDialog({ moduleId, rect: { top: rect.top, right: rect.right, left: rect.left, bottom: rect.bottom } });
  };

  const state = conversations?.state;
  // The left-border "active" indicator is shown on at most ONE row at a
  // time across the whole sidebar: either a nav tab OR a recent chat,
  // never both. A chat row is active only when it's the active session
  // for the CURRENT module. When the current module is in staging
  // (no active session), the nav tab takes the indicator instead.
  const activeSessionId = state?.activeByModule?.[activeModule] || null;
  const globalList = state
    ? state.sessionOrder
        .map((id) => state.sessions[id])
        .filter(Boolean)
        .map((s) => ({
          id: s.id,
          title: s.title,
          moduleId: s.moduleId,
          createdAt: s.createdAt,
          messageCount: s.messages.length,
          isActive: s.moduleId === activeModule && activeSessionId === s.id,
        }))
    : [];
  const populated = globalList.filter(
    (s) => s.messageCount > 0 || s.title !== 'New chat'
  );

  const handleSwitchSession = (s) => {
    if (!conversations) return;
    conversations.switchSession(s.id);
    if (s.moduleId !== activeModule) {
      onSwitchModule?.(s.moduleId);
      setTimeout(() => conversations.switchSession(s.id), 0);
    }
  };

  const handleArchiveSession = (id, e) => {
    e?.stopPropagation();
    if (!conversations) return;
    conversations.deleteSession(id);
  };

  return (
    <aside
      className={'cb-sidebar' + (dragging ? ' is-dragging' : '')}
      style={isDesktop ? { width: `${width}px` } : undefined}
    >
      <div className="cb-sidebar-header">
        <div className="cb-sidebar-brand">
          <span className="cb-sidebar-brand-full">Command Bar</span>
          <span className="cb-sidebar-brand-short">CB</span>
        </div>
        <div className="cb-sidebar-monitor">Monitor</div>
      </div>

      <div className="cb-sidebar-scroll">
        <nav className="cb-sidebar-nav">
          {MODULES.map((m) => {
            const Icon = ICON_MAP[m.icon] || LayoutDashboard;
            // Nav tab only takes the active indicator when its module is
            // the current one AND that module is in staging (no active
            // chat). Once a chat is active, the chat row owns the border.
            const isActive =
              activeModule === m.id && !activeSessionId;
            const hasQuickActions = Boolean(QUICK_ACTIONS[m.id]);
            return (
              <div key={m.id} className="cb-sidebar-link-row">
                <button
                  type="button"
                  title={m.label}
                  className={'cb-sidebar-link' + (isActive ? ' is-active' : '')}
                  onClick={() => onSwitchModule?.(m.id)}
                >
                  <Icon size={15} strokeWidth={1.75} />
                  <span className="cb-sidebar-label">{m.label}</span>
                  {!m.active && <span className="cb-soon-badge">Soon</span>}
                </button>
                {hasQuickActions && (
                  <button
                    ref={(el) => { triggerRefs.current[m.id] = el; }}
                    type="button"
                    className="cb-sidebar-qa-trigger"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (qaDialog?.moduleId === m.id) setQaDialog(null);
                      else openQa(m.id);
                    }}
                    aria-label={`Quick actions for ${m.label}`}
                    title="Quick actions"
                  >
                    <LayoutGrid size={11} strokeWidth={1.75} />
                  </button>
                )}
              </div>
            );
          })}
        </nav>

        <div className="cb-sidebar-chats">
          <div className="cb-sidebar-chats-header">
            <span>Recent chats</span>
          </div>
          {populated.length === 0 ? (
            <div className="cb-sidebar-chats-empty">
              No recent chats yet. Ask something to start.
            </div>
          ) : (
            <div className="cb-sidebar-chat-list">
              {populated.slice(0, 10).map((s) => (
                <div
                  key={s.id}
                  className={
                    'cb-sidebar-chat-item' + (s.isActive ? ' is-active' : '')
                  }
                  onClick={() => handleSwitchSession(s)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSwitchSession(s);
                    }
                  }}
                  title={`${s.title} · ${s.moduleId}`}
                >
                  <MessageSquare
                    size={11}
                    strokeWidth={1.75}
                    className="cb-sidebar-chat-icon"
                  />
                  <div className="cb-sidebar-chat-body">
                    <span className="cb-sidebar-chat-title">{s.title}</span>
                    <span className="cb-sidebar-chat-cat">
                      {MODULE_LABEL[s.moduleId] || s.moduleId}
                    </span>
                  </div>
                  <span className="cb-sidebar-chat-time">
                    {formatRelative(s.createdAt)}
                  </span>
                  <button
                    type="button"
                    className="cb-sidebar-chat-archive"
                    onClick={(e) => handleArchiveSession(s.id, e)}
                    aria-label={`Archive ${s.title}`}
                    title="Archive"
                  >
                    <X size={10} strokeWidth={2.2} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="cb-sidebar-footer">
        <button
          type="button"
          className="cb-icon-btn"
          aria-label="Settings"
          title="Settings"
          onClick={onOpenSettings}
        >
          <Settings size={15} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          className="cb-sidebar-mf"
          aria-label="Profile"
          title="Profile"
          onClick={onOpenProfile}
          style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
        >
          MF
        </button>
      </div>

      {isDesktop && (
        <button
          type="button"
          className="cb-sidebar-resizer"
          onMouseDown={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onTouchStart={() => setDragging(true)}
          aria-label="Resize sidebar"
          title="Drag to resize"
        />
      )}

      {qaDialog && (
        <QuickActionsDialog
          moduleId={qaDialog.moduleId}
          anchorRect={qaDialog.rect}
          onItemClick={onOpenQuickAction}
          onClose={() => setQaDialog(null)}
        />
      )}
    </aside>
  );
}
