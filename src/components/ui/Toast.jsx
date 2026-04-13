import { useEffect } from 'react';

export default function Toast({ message, onDismiss, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onDismiss && onDismiss(), duration);
    return () => clearTimeout(t);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div
      className="toast-in tabular"
      role="status"
      style={{
        position: 'fixed',
        bottom: '88px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--surface-dark)',
        color: 'var(--surface-dark-text)',
        padding: '10px 16px',
        borderRadius: '4px',
        fontSize: '12px',
        letterSpacing: '-0.01em',
        zIndex: 100,
        maxWidth: '90vw',
        textAlign: 'center',
      }}
    >
      {message}
    </div>
  );
}
