import { NavLink, useLocation } from 'react-router-dom';
import {
  X,
  Plus,
  MessageSquare,
  Trash2,
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

const MODULE_LABEL = {
  dashboard: 'Dashboard',
  shareholders: 'Shareholders',
  targeting: 'Targeting',
};

function getModuleFromPath(pathname) {
  if (pathname === '/') return 'dashboard';
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] || 'dashboard';
}

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

export default function MobileDrawer({ open, onClose, conversations }) {
  const location = useLocation();
  const contextModule =
    location.state?.contextModule || getModuleFromPath(location.pathname);
  const moduleLabel = MODULE_LABEL[contextModule] || '';
  const isModuleWithConversation = Boolean(MODULE_LABEL[contextModule]);

  const slot = conversations?.slots?.[contextModule];
  const sessionList = slot
    ? slot.sessionOrder
        .map((id) => slot.sessions[id])
        .filter(Boolean)
        .map((s) => ({
          id: s.id,
          title: s.title,
          createdAt: s.createdAt,
          messageCount: s.messages.length,
          isActive: s.id === slot.activeSessionId,
        }))
    : [];
  const populated = sessionList.filter(
    (s) => s.messageCount > 0 || s.title !== 'New chat'
  );

  const handleNewChat = () => {
    if (!conversations) return;
    const id = `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const fresh = {
      id,
      title: 'New chat',
      createdAt: Date.now(),
      messages: [],
      isTyping: false,
      spentChips: new Set(),
      attachments: [],
    };
    conversations.updateSlot(contextModule, (c) => ({
      ...c,
      activeSessionId: id,
      sessionOrder: [id, ...c.sessionOrder],
      sessions: { ...c.sessions, [id]: fresh },
    }));
    onClose?.();
  };

  const handleSwitchSession = (id) => {
    if (!conversations) return;
    conversations.updateSlot(contextModule, (c) =>
      c.sessions[id] ? { ...c, activeSessionId: id } : c
    );
    onClose?.();
  };

  const handleArchiveSession = (id, e) => {
    e?.stopPropagation();
    if (!conversations) return;
    conversations.updateSlot(contextModule, (c) => {
      if (!c.sessions[id]) return c;
      const nextSessions = { ...c.sessions };
      delete nextSessions[id];
      const nextOrder = c.sessionOrder.filter((sid) => sid !== id);
      if (nextOrder.length === 0) {
        const fresh = {
          id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: 'New chat',
          createdAt: Date.now(),
          messages: [],
          isTyping: false,
          spentChips: new Set(),
          attachments: [],
        };
        return {
          activeSessionId: fresh.id,
          sessionOrder: [fresh.id],
          sessions: { [fresh.id]: fresh },
        };
      }
      const nextActive =
        c.activeSessionId === id ? nextOrder[0] : c.activeSessionId;
      return {
        ...c,
        activeSessionId: nextActive,
        sessionOrder: nextOrder,
        sessions: nextSessions,
      };
    });
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
            const to = m.id === 'dashboard' ? '/' : `/${m.id}`;
            return (
              <NavLink
                key={m.id}
                to={to}
                end={m.id === 'dashboard'}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  borderLeft: isActive
                    ? '2px solid var(--text-primary)'
                    : '2px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '-0.01em',
                  textDecoration: 'none',
                })}
              >
                <Icon size={16} strokeWidth={1.75} />
                <span style={{ flex: 1 }}>{m.label}</span>
                {!m.active && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'var(--text-tertiary)',
                      border: '1px solid var(--border)',
                      padding: '1px 6px',
                      borderRadius: '999px',
                    }}
                  >
                    Soon
                  </span>
                )}
              </NavLink>
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 18px 10px',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}
            >
              <span>Recent {moduleLabel} chats</span>
              <button
                type="button"
                className="cb-sidebar-new-chat"
                onClick={handleNewChat}
                aria-label="Start a new chat"
                title="New chat"
              >
                <Plus size={12} strokeWidth={2} />
              </button>
            </div>
            {populated.length === 0 ? (
              <div className="cb-sidebar-chats-empty">
                <MessageSquare
                  size={16}
                  strokeWidth={1.5}
                  style={{
                    color: 'var(--text-tertiary)',
                    margin: '0 auto 6px',
                  }}
                />
                <div>No recent {moduleLabel.toLowerCase()} chats yet.</div>
                <div
                  style={{
                    color: 'var(--text-tertiary)',
                    marginTop: '2px',
                    fontSize: '10px',
                  }}
                >
                  Ask something to start.
                </div>
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
                    onClick={() => handleSwitchSession(s.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSwitchSession(s.id);
                      }
                    }}
                    title={s.title}
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
      </aside>
    </div>
  );
}
