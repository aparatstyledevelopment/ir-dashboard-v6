import { ArrowLeft, User, Bell as BellIcon, Shield, Globe, Palette } from 'lucide-react';

function SettingRow({ icon: Icon, label, value, sub }) {
  return (
    <div className="cb-settings-row">
      <div className="cb-settings-row-icon">
        <Icon size={15} strokeWidth={1.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        {sub && <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{sub}</div>}
      </div>
      {value && (
        <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', flexShrink: 0 }}>{value}</span>
      )}
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
          <h2 className="cb-settings-section-title">General</h2>
          <SettingRow icon={Globe} label="Language" value="English" sub="Display language for the interface" />
          <SettingRow icon={Palette} label="Theme" value="Light" sub="Appearance mode" />
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
