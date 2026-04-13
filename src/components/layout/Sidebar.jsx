import { Link, useLocation } from 'react-router-dom';
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
  Plus,
  MessageSquare,
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

const PATH_MODULE_OVERRIDES = {
  '/crm': 'crm',
};

function getModuleFromPath(pathname) {
  if (pathname === '/') return 'dashboard';
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'dashboard';
  const first = `/${segments[0]}`;
  if (PATH_MODULE_OVERRIDES[first]) return PATH_MODULE_OVERRIDES[first];
  return segments[0];
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

export default function Sidebar({ conversations }) {
  const location = useLocation();
  const contextModule =
    location.state?.contextModule || getModuleFromPath(location.pathname);

  // Read session list for the active module directly from slots. We do
  // this without useModuleConversation() because the Sidebar lives outside
  // the routed <Outlet> and therefore can't use outlet context.
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

  const handleNewChat = () => {
    if (!conversations) return;
    // Importing nextSessionId logic here would circular-import the hook,
    // so we inline a fresh session creation matching the hook's shape.
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
  };

  const handleSwitchSession = (id) => {
    if (!conversations) return;
    conversations.updateSlot(contextModule, (c) =>
      c.sessions[id] ? { ...c, activeSessionId: id } : c
    );
  };

  const isModuleWithConversation =
    contextModule === 'dashboard' ||
    contextModule === 'shareholders' ||
    contextModule === 'targeting';

  const MODULE_LABEL = {
    dashboard: 'Dashboard',
    shareholders: 'Shareholders',
    targeting: 'Targeting',
  };
  const moduleLabel = MODULE_LABEL[contextModule] || '';
  // Hide the default empty "New chat" placeholder from the visible list.
  const populated = sessionList.filter(
    (s) => s.messageCount > 0 || s.title !== 'New chat'
  );

  return (
    <aside className="cb-sidebar">
      <div className="cb-sidebar-header">
        <div className="cb-sidebar-brand">
          <span className="cb-sidebar-brand-full">Command Bar</span>
          <span className="cb-sidebar-brand-short">CB</span>
        </div>
        <div className="cb-sidebar-monitor">Monitor</div>
      </div>

      <nav className="cb-sidebar-nav">
        {MODULES.map((m) => {
          const Icon = ICON_MAP[m.icon] || LayoutDashboard;
          const to = m.id === 'dashboard' ? '/' : `/${m.id}`;
          const isActive = contextModule === m.id;
          return (
            <Link
              key={m.id}
              to={to}
              title={m.label}
              className={'cb-sidebar-link' + (isActive ? ' is-active' : '')}
            >
              <Icon size={15} strokeWidth={1.75} />
              <span className="cb-sidebar-label">{m.label}</span>
              {!m.active && <span className="cb-soon-badge">Soon</span>}
            </Link>
          );
        })}
      </nav>

      {isModuleWithConversation && (
        <div className="cb-sidebar-chats">
          <div className="cb-sidebar-chats-header">
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
                style={{ color: 'var(--text-tertiary)', margin: '0 auto 6px' }}
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
            <div className="cb-sidebar-chat-list">
              {populated.slice(0, 6).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={
                    'cb-sidebar-chat-item' + (s.isActive ? ' is-active' : '')
                  }
                  onClick={() => handleSwitchSession(s.id)}
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
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="cb-sidebar-footer">
        <button type="button" className="cb-icon-btn" aria-label="Settings">
          <Settings size={15} strokeWidth={1.75} />
        </button>
        <div className="cb-sidebar-mf">MF</div>
      </div>
    </aside>
  );
}
