import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function ChatInput({ onSubmit }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about Integrum..."
        aria-label="Ask about Integrum"
        style={{
          flex: 1,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '10px 12px',
          fontSize: '13px',
          color: 'var(--text-primary)',
          outline: 'none',
          letterSpacing: '-0.01em',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--text-tertiary)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      />
      <button
        type="submit"
        aria-label="Send"
        disabled={!value.trim()}
        style={{
          background: value.trim() ? 'var(--surface-dark)' : 'var(--bar-track)',
          color: value.trim() ? 'var(--surface-dark-text)' : 'var(--text-tertiary)',
          border: 'none',
          padding: '10px 12px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: value.trim() ? 'pointer' : 'default',
          transition: 'background 120ms',
        }}
      >
        <ArrowRight size={15} strokeWidth={2} />
      </button>
    </form>
  );
}
