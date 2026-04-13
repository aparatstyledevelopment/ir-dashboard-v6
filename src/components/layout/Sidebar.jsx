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
          return (
            <NavLink
              key={m.id}
              to={to}
              end={m.id === 'dashboard'}
              title={m.label}
              className={({ isActive }) =>
                'cb-sidebar-link' + (isActive ? ' is-active' : '')
              }
            >
              <Icon size={15} strokeWidth={1.75} />
              <span className="cb-sidebar-label">{m.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="cb-sidebar-footer">
        <button type="button" className="cb-icon-btn" aria-label="Settings">
          <Settings size={15} strokeWidth={1.75} />
        </button>
        <div className="cb-sidebar-mf">MF</div>
      </div>
    </aside>
  );
}
