import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ChatInput({ onSubmit }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
  };

  const hasValue = Boolean(value.trim());

  return (
    <form className="cb-chat-form" onSubmit={handleSubmit}>
      <div className={'cb-chat-input-wrap' + (focused ? ' is-focused' : '')}>
        <Sparkles className="cb-chat-spark" size={15} strokeWidth={1.75} />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask anything about Integrum..."
          aria-label="Ask anything about Integrum"
          className="cb-chat-input"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!hasValue}
          className={'cb-chat-send' + (hasValue ? ' is-active' : '')}
        >
          <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </form>
  );
}
