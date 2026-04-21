import { Database } from 'lucide-react';

// A pill-style "View source data" button shown at the bottom of every
// response card. Clicking it opens the Artifacts pane with the query +
// full data table that produced the card.
export default function SourceDataLink({ module, onOpen }) {
  return (
    <button
      type="button"
      className="cb-source-btn"
      onClick={() => onOpen && onOpen(module)}
      title={
        module
          ? `View the query and raw data from ${module}`
          : 'View source data'
      }
    >
      <Database size={12} strokeWidth={1.75} />
      <span>View source data</span>
    </button>
  );
}
