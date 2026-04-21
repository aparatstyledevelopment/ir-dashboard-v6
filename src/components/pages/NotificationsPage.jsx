import { ArrowLeft, TrendingUp, Users, FileText, Bell, AlertTriangle } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, icon: Users, title: 'Nordea increased position', body: 'Nordea Investment Funds acquired 45,000 shares (+0.15% capital). Register updated.', time: '2h ago', unread: true },
  { id: 2, icon: TrendingUp, title: 'INTEG B crossed SEK 16.00', body: 'Share price hit 16.05 SEK — highest in 3 months. Volume 42% above average.', time: '4h ago', unread: true },
  { id: 3, icon: AlertTriangle, title: 'Aviva continued selling', body: 'Aviva Perfusion AS disposed 13,004 shares. Total reduction this quarter: −29,204 shares.', time: '1d ago', unread: false },
  { id: 4, icon: FileText, title: 'Q1 report reminder', body: 'Q1 2026 earnings call is in 17 days (May 8). Draft press release due in 10 days.', time: '2d ago', unread: false },
  { id: 5, icon: Bell, title: 'Roadshow slot confirmed', body: '1-on-1 with Polar Capital Healthcare confirmed for May 20 in London.', time: '3d ago', unread: false },
  { id: 6, icon: Users, title: 'New holder detected', body: 'Goldman Sachs AM appeared on the register with 3,200 shares (0.01% capital).', time: '5d ago', unread: false },
  { id: 7, icon: TrendingUp, title: 'Short interest dropped', body: 'Short interest decreased from 2.3% to 2.1%. Marshall Wace remains the only disclosed short.', time: '1w ago', unread: false },
];

export default function NotificationsPage({ onBack }) {
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
          Notifications
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '0 0 20px' }}>
          {NOTIFICATIONS.filter(n => n.unread).length} unread
        </p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {NOTIFICATIONS.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '14px 0',
                  borderBottom: '1px solid var(--border)',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: n.unread ? 'var(--surface-dark)' : 'var(--bar-track)',
                  color: n.unread ? 'var(--surface-dark-text)' : 'var(--text-tertiary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '1px',
                }}>
                  <Icon size={13} strokeWidth={1.75} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '12.5px',
                    fontWeight: n.unread ? 600 : 400,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                  }}>
                    {n.title}
                  </div>
                  <div style={{
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginTop: '3px',
                    letterSpacing: '-0.01em',
                  }}>
                    {n.body}
                  </div>
                </div>
                <span style={{
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  flexShrink: 0,
                  marginTop: '2px',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {n.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
