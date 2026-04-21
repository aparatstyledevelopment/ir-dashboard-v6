import {
  X,
  MessageSquare,
  Trash2,
  Settings,
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
} from 'lucide-react';
import { MODULES } from '../../data/modules';

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

const MODULE_TAG = {
  dashboard: 'D',
  shareholders: 'S',
  targeting: 'T',
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

export default function MobileDrawer({
  open,
  onClose,
  conversations,
  activeModule,
  onSwitchModule,
  onOpenSettings,
  onOpenProfile,
}) {
  const isModuleWithConversation =
    activeModule === 'dashboard' ||
    activeModule === 'shareholders' ||
    activeModule === 'targeting';

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

  const handleNewChat = () => {
    if (!conversations) return;
    conversations.goToStaging(activeModule);
    onClose?.();
  };

  const handleSwitchSession = (s) => {
    if (!conversations) return;
    conversations.switchSession(s.id);
    if (s.moduleId !== activeModule) {
      onSwitchModule?.(s.moduleId);
      setTimeout(() => conversations.switchSession(s.id), 0);
    }
    onClose?.();
  };

  const handleArchiveSession = (id, e) => {
    e?.stopPropagation();
    if (!conversations) return;
    conversations.deleteSession(id);
  };

  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
        }}
      />
      <aside
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '268px',
          background: 'var(--bg)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Command Bar
            </div>
            <div
              style={{
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                marginTop: '2px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Monitor
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              padding: 0,
              display: 'flex',
            }}
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <nav style={{ padding: '8px 0', flexShrink: 0, overflowY: 'auto' }}>
          {MODULES.map((m) => {
            const Icon = ICON_MAP[m.icon] || LayoutDashboard;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onSwitchModule?.(m.id);
                  onClose?.();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  width: '100%',
                  background: 'transparent',
                  borderLeft: isActive
                    ? '2px solid var(--text-primary)'
                    : '2px solid transparent',
                  borderTop: 'none',
                  borderRight: 'none',
                  borderBottom: 'none',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '-0.01em',
                  textDecoration: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} strokeWidth={1.75} />
                <span style={{ flex: 1 }}>{m.label}</span>
                {!m.active && (
                  <span
                    style={{
                      fontSize: '8px',
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--border)',
                    }}
                  >
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {isModuleWithConversation && (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              padding: '14px 0 6px',
            }}
          >
            <div
              style={{
                padding: '0 18px 10px',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}
            >
              Recent chats
            </div>
            {populated.length === 0 ? (
              <div className="cb-sidebar-chats-empty">
                No recent chats yet. Ask something to start.
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {populated.slice(0, 20).map((s) => (
                  <div
                    key={s.id}
                    className={
                      'cb-sidebar-chat-item' +
                      (s.isActive ? ' is-active' : '')
                    }
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSwitchSession(s)}
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
                    <span className="cb-sidebar-chat-title">{s.title}</span>
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
                      <Trash2 size={10} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            className="cb-icon-btn"
            aria-label="Settings"
            title="Settings"
            onClick={() => {
              onOpenSettings?.();
              onClose?.();
            }}
          >
            <Settings size={15} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenProfile?.();
              onClose?.();
            }}
            aria-label="Profile"
            title="Profile"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--surface-dark)',
              color: 'var(--surface-dark-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            MF
          </button>
        </div>
      </aside>
    </div>
  );
}
