import { Link } from 'react-router-dom';

export default function ComingSoon({ moduleName }) {
  return (
    <div
      className="fade-in-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '32px 24px',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        background: 'var(--bg)',
        marginTop: '24px',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          margin: 0,
          color: 'var(--text-primary)',
        }}
      >
        {moduleName}
      </h1>
      <div
        style={{
          fontSize: '13px',
          color: 'var(--text-tertiary)',
          fontWeight: 500,
        }}
      >
        Coming Soon
      </div>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: 0,
          maxWidth: '480px',
        }}
      >
        This module is being reimagined for the Command Bar experience.
      </p>
      <Link
        to="/"
        style={{
          fontSize: '12px',
          color: 'var(--text-primary)',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          marginTop: '4px',
        }}
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
