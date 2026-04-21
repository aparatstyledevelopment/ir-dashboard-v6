import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  X,
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

const MODULE_TAG = {
  dashboard: 'D',
  shareholders: 'S',
  targeting: 'T',
};

const MODULE_ROUTE = {
  dashboard: '/',
  shareholders: '/shareholders',
  targeting: '/targeting',
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
  const navigate = useNavigate();
  const contextModule =
    location.state?.contextModule || getModuleFromPath(location.pathname);

  // Global list across all modules, ordered by recency.
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
  // Hide blank placeholders if any slipped in.
  const populated = globalList.filter(
    (s) => s.messageCount > 0 || s.title !== 'New chat'
  );

  const isModuleWithConversation =
    contextModule === 'dashboard' ||
    contextModule === 'shareholders' ||
    contextModule === 'targeting';

  const handleNewChat = () => {
    if (!conversations) return;
    // Put the current module back into staging — shows the collapsed
    // briefing. A real session is only minted on the first interaction.
    conversations.goToStaging(contextModule);
  };

  const handleSwitchSession = (s) => {
    if (!conversations) return;
    conversations.switchSession(s.id);
    // If the chat belongs to a different module, route there.
    const target = MODULE_ROUTE[s.moduleId];
    const here = MODULE_ROUTE[contextModule];
    if (target && target !== here) {
      navigate(target);
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
            <span>Recent chats</span>
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
              <div>No recent chats yet.</div>
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
                  <span
                    className={`cb-sidebar-chat-tag cb-sidebar-chat-tag--${s.moduleId}`}
                    aria-hidden
                  >
                    {MODULE_TAG[s.moduleId] || '·'}
                  </span>
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
                    <X size={10} strokeWidth={2.2} />
                  </button>
                </div>
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
