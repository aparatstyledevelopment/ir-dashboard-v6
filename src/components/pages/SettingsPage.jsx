import { useState, useEffect } from 'react';
import { ArrowLeft, User, Bell as BellIcon, Shield, Globe, Palette, Maximize2 } from 'lucide-react';

function SettingRow({ icon: Icon, label, value, sub, children }) {
  return (
    <div className="cb-settings-row">
      <div className="cb-settings-row-icon">
        <Icon size={15} strokeWidth={1.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        {sub && <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{sub}</div>}
      </div>
      {children || (
        value && (
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', flexShrink: 0 }}>{value}</span>
        )
      )}
    </div>
  );
}

const SIZE_OPTIONS = [
  { key: '', label: 'Small' },
  { key: 'cb-size-medium', label: 'Medium' },
  { key: 'cb-size-large', label: 'Large' },
];

function SizePicker() {
  const [active, setActive] = useState(() => {
    if (document.body.classList.contains('cb-size-large')) return 'cb-size-large';
    if (document.body.classList.contains('cb-size-medium')) return 'cb-size-medium';
    return '';
  });

  const apply = (cls) => {
    document.body.classList.remove('cb-size-medium', 'cb-size-large');
    if (cls) document.body.classList.add(cls);
    setActive(cls);
    try { localStorage.setItem('cb-size', cls); } catch {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cb-size');
      if (saved) apply(saved);
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
      {SIZE_OPTIONS.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => apply(o.key)}
          style={{
            padding: '4px 10px',
            borderRadius: '999px',
            border: active === o.key ? '1.5px solid var(--text-primary)' : '1px solid var(--border)',
            background: active === o.key ? 'var(--surface-dark)' : 'var(--bg)',
            color: active === o.key ? 'var(--surface-dark-text)' : 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: active === o.key ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function SettingsPage({ onBack }) {
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
          Settings
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 24px' }}>
          Manage your Command Bar preferences.
        </p>

        <section className="cb-settings-section">
          <h2 className="cb-settings-section-title">Display</h2>
          <SettingRow icon={Maximize2} label="Interface size" sub="Adjusts text and UI element sizes">
            <SizePicker />
          </SettingRow>
          <SettingRow icon={Palette} label="Theme" value="Light" sub="Appearance mode" />
          <SettingRow icon={Globe} label="Language" value="English" sub="Display language" />
        </section>

        <section className="cb-settings-section">
          <h2 className="cb-settings-section-title">Notifications</h2>
          <SettingRow icon={BellIcon} label="Email notifications" value="On" sub="Weekly digest and alerts" />
        </section>

        <section className="cb-settings-section">
          <h2 className="cb-settings-section-title">Security</h2>
          <SettingRow icon={Shield} label="Two-factor authentication" value="Enabled" sub="TOTP via authenticator app" />
          <SettingRow icon={User} label="SSO provider" value="Azure AD" sub="Managed by your organization" />
        </section>

        <section className="cb-settings-section">
          <h2 className="cb-settings-section-title">Data</h2>
          <SettingRow icon={Globe} label="Default currency" value="SEK" sub="For valuation displays" />
          <SettingRow icon={Globe} label="Date format" value="YYYY-MM-DD" sub="ISO 8601" />
        </section>
      </div>
    </main>
  );
}
