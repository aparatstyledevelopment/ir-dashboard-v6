import { ArrowLeft } from 'lucide-react';

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{label}</span>
      <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

export default function ProfilePage({ onBack }) {
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'var(--surface-dark)', color: 'var(--surface-dark-text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: 600, flexShrink: 0,
          }}>
            MF
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em', margin: 0, color: 'var(--text-primary)' }}>
              Marcus Forsberg
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
              Head of Investor Relations
            </p>
          </div>
        </div>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', margin: '0 0 8px' }}>
            Account
          </h2>
          <InfoRow label="Email" value="marcus.forsberg@integrum.se" />
          <InfoRow label="Organization" value="Integrum AB" />
          <InfoRow label="Role" value="Admin" />
          <InfoRow label="Last login" value="Today, 08:42" />
        </section>

        <section>
          <h2 style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', margin: '0 0 8px' }}>
            Subscription
          </h2>
          <InfoRow label="Plan" value="Enterprise" />
          <InfoRow label="Modules" value="13 (3 active)" />
          <InfoRow label="Renewal" value="2027-01-15" />
        </section>
      </div>
    </main>
  );
}
