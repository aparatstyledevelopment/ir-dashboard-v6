import { useState } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';

export default function ChatInput({
  onSubmit,
  attachments = [],
  onRemoveAttachment,
}) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const hasValue = Boolean(value.trim());
  const hasAttachments = attachments && attachments.length > 0;
  const canSubmit = hasValue || hasAttachments;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(value);
    setValue('');
  };

  return (
    <form className="cb-chat-form" onSubmit={handleSubmit}>
      <div className={'cb-chat-input-wrap' + (focused ? ' is-focused' : '')}>
        <Sparkles className="cb-chat-spark" size={15} strokeWidth={1.75} />
        {hasAttachments && (
          <div className="cb-chat-attachments">
            {attachments.map((a) => (
              <span key={a.id} className="cb-chat-attachment">
                <span className="cb-chat-attachment-label">{a.title}</span>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment?.(a.id)}
                  aria-label={`Remove ${a.title}`}
                >
                  <X size={10} strokeWidth={2.4} />
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={
            hasAttachments
              ? 'Ask about the selected cards…'
              : 'Ask anything about Integrum…'
          }
          aria-label="Ask anything about Integrum"
          className="cb-chat-input"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!canSubmit}
          className={'cb-chat-send' + (canSubmit ? ' is-active' : '')}
        >
          <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </form>
  );
}
