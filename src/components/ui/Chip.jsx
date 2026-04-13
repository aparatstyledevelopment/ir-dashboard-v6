import { Sparkles } from 'lucide-react';

export default function Chip({
  children,
  onClick,
  spent = false,
  mock = false,
  variant = 'default',
  ariaLabel,
  title,
}) {
  const isExpand = variant === 'expand';
  const className =
    'cb-chip' +
    (spent ? ' is-spent' : '') +
    (mock ? ' is-mock' : '') +
    (isExpand ? ' is-expand is-icon-only' : '');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={spent}
      className={className}
      aria-label={ariaLabel}
      title={title}
    >
      {isExpand ? (
        <Sparkles className="cb-spark" size={11} strokeWidth={1.75} />
      ) : (
        children
      )}
    </button>
  );
}
