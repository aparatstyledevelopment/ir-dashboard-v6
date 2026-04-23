import { useState } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';

const SLASH_COMMANDS = [
  {
    cmd: '/all',
    label: 'Show all cards',
    hint: 'Append every major card from this tab.',
  },
  {
    cmd: '/new',
    label: 'Start a new chat',
    hint: 'Fresh conversation in this tab.',
  },
  {
    cmd: '/clear',
    label: 'Clear this chat',
    hint: 'Remove messages from the active session.',
  },
  {
    cmd: '/export',
    label: 'Export chat',
    hint: 'Download the full session (mocked).',
  },
  {
    cmd: '/help',
    label: 'Help',
    hint: 'List everything the command bar can do.',
  },
  {
    cmd: '/brief',
    label: 'Re-run morning brief',
    hint: 'Regenerate today\u2019s briefing from latest data.',
    mock: true,
  },
  {
    cmd: '/compare',
    label: 'Compare with peers',
    hint: 'Set up a side-by-side comparison flow.',
    mock: true,
  },
  {
    cmd: '/notify',
    label: 'Set an alert',
    hint: 'Watch this register / target for changes.',
    mock: true,
  },
  {
    cmd: '/report',
    label: 'Generate PDF report',
    hint: 'Builds a PDF from currently attached cards.',
  },
  {
    cmd: '/summarize',
    label: 'Summarize chat so far',
    hint: 'Ask the model to boil this thread into bullets.',
    mock: true,
  },
];

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
  const slashMatches =
    focused && value.startsWith('/')
      ? SLASH_COMMANDS.filter((s) =>
          s.cmd.toLowerCase().startsWith(value.toLowerCase())
        )
      : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(value);
    setValue('');
  };

  const handleSlashClick = (cmd) => {
    onSubmit(cmd);
    setValue('');
  };

  return (
    <form className="cb-chat-form" onSubmit={handleSubmit}>
      {slashMatches.length > 0 && (
        <div className="cb-slash-menu">
          {slashMatches.map((s) => (
            <button
              type="button"
              key={s.cmd}
              className="cb-slash-item"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSlashClick(s.cmd);
              }}
            >
              <span className="cb-slash-cmd">{s.cmd}</span>
              <span className="cb-slash-label">{s.label}</span>
              <span className="cb-slash-hint">{s.hint}</span>
            </button>
          ))}
        </div>
      )}
      <div className={'cb-chat-input-wrap' + (focused ? ' is-focused' : '')}>
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
        <div className="cb-chat-input-row">
          <Sparkles className="cb-chat-spark" size={15} strokeWidth={1.75} />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={
              hasAttachments
                ? 'Ask about the selected cards…'
                : 'Ask anything about Example.com…'
            }
            aria-label="Ask anything about Example.com"
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
      </div>
    </form>
  );
}
