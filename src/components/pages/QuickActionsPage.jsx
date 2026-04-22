import { ArrowLeft, ChevronRight } from 'lucide-react';
import { QUICK_ACTIONS } from '../../data/quickActions';

function QuickActionItem({ icon: Icon, label, sub, onClick }) {
  return (
    <button type="button" className="cb-qa-item" onClick={onClick}>
      <div className="cb-qa-icon">
        <Icon size={15} strokeWidth={1.5} />
      </div>
      <div className="cb-qa-body">
        <div className="cb-qa-label">{label}</div>
        {sub && <div className="cb-qa-sub">{sub}</div>}
      </div>
      <ChevronRight size={14} strokeWidth={1.5} className="cb-qa-arrow" />
    </button>
  );
}

export default function QuickActionsPage({ activeModule, onBack, onItemClick }) {
  const config = QUICK_ACTIONS[activeModule] || QUICK_ACTIONS.dashboard;

  return (
    <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '24px 20px 48px' }}>
        <button
          type="button"
          onClick={onBack}
          className="cb-screen-back"
          style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', marginBottom: '20px' }}
        >
          <ArrowLeft size={12} strokeWidth={2} />
          Back
        </button>

        <h1 style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px', color: 'var(--text-primary)' }}>
          {config.title}
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 24px' }}>
          {config.subtitle}
        </p>

        {config.items.map((item) => (
          <QuickActionItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            sub={item.sub}
            onClick={() => onItemClick(item.screen)}
          />
        ))}
      </div>
    </main>
  );
}
