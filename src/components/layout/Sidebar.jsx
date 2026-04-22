import { useState, useRef, useEffect } from 'react';
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

function QuickActionsDialog({ moduleId, onItemClick, onClose }) {
  const ref = useRef(null);
  const config = QUICK_ACTIONS[moduleId];

  useEffect(() => {
    const onClickOut = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onClickOut);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOut);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!config) return null;

  return (
    <div ref={ref} className="cb-sidebar-qa-dialog">
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
    </div>
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
  const [qaDialog, setQaDialog] = useState(null);

  const state = conversations?.state;
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
          isActive: state.activeByModule[s.moduleId] === s.id,
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
    <aside className="cb-sidebar">
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
            const isActive = activeModule === m.id;
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
                    type="button"
                    className="cb-sidebar-qa-trigger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQaDialog((prev) => (prev === m.id ? null : m.id));
                    }}
                    aria-label={`Quick actions for ${m.label}`}
                    title="Quick actions"
                  >
                    <LayoutGrid size={11} strokeWidth={1.75} />
                  </button>
                )}
                {qaDialog === m.id && (
                  <QuickActionsDialog
                    moduleId={m.id}
                    onItemClick={onOpenQuickAction}
                    onClose={() => setQaDialog(null)}
                  />
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
                  <div style={{ flex: 1, minWidth: 0 }}>
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
    </aside>
  );
}
