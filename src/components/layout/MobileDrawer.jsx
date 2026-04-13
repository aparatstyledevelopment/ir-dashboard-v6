import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
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

export default function MobileDrawer({ open, onClose }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
      }}
    >
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
          width: '240px',
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
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
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
                  borderLeft: isActive ? '2px solid var(--text-primary)' : '2px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '-0.01em',
                  textDecoration: 'none',
                })}
              >
                <Icon size={16} strokeWidth={1.75} />
                <span>{m.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
