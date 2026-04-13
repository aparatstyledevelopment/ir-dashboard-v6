import { NavLink } from 'react-router-dom';
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

export default function Sidebar() {
  return (
    <aside
      className="hidden sm:flex flex-col h-full w-14 lg:w-[200px] flex-shrink-0"
      style={{
        background: 'var(--bg)',
        borderRight: '1px solid var(--border)',
      }}
    >
      <div
        className="px-0 lg:px-4 text-center lg:text-left"
        style={{
          padding: '20px 0',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}
        >
          <span className="hidden lg:inline">Command Bar</span>
          <span className="inline lg:hidden">CB</span>
        </div>
        <div
          className="hidden lg:block"
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

      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {MODULES.map((m) => {
          const Icon = ICON_MAP[m.icon] || LayoutDashboard;
          const to = m.id === 'dashboard' ? '/' : `/${m.id}`;
          return (
            <NavLink
              key={m.id}
              to={to}
              end={m.id === 'dashboard'}
              className="sidebar-link"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 0 9px 0',
                paddingLeft: 'var(--sidebar-link-padding-left, 0)',
                borderLeft: isActive
                  ? '2px solid var(--text-primary)'
                  : '2px solid transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '-0.01em',
                textDecoration: 'none',
                justifyContent: 'flex-start',
              })}
              title={m.label}
            >
              <span
                className="flex items-center justify-center lg:justify-start w-full lg:w-auto"
                style={{ gap: '10px', paddingLeft: '0' }}
              >
                <Icon size={15} strokeWidth={1.75} />
                <span className="hidden lg:inline">{m.label}</span>
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div
        style={{
          padding: '12px 0',
          borderTop: '1px solid var(--border)',
        }}
        className="flex items-center justify-center lg:justify-between lg:px-4 gap-2"
      >
        <button
          type="button"
          aria-label="Settings"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Settings size={15} strokeWidth={1.75} />
        </button>
        <div
          className="hidden lg:flex"
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          MF
        </div>
      </div>
    </aside>
  );
}
