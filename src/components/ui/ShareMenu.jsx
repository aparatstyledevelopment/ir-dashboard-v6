import { useEffect, useRef, useState } from 'react';
import { Share2, ClipboardCopy, FileDown, FileText } from 'lucide-react';
import { downloadCsv, slugifyForFile } from '../../utils/csv';

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback using a temporary textarea + execCommand.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (err) {
    return false;
  }
}

export default function ShareMenu({ shareContent, onShowToast }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  if (!shareContent) return null;

  const hasCsv = Boolean(shareContent.csv);

  const handleCopy = async () => {
    setOpen(false);
    const text = shareContent.text || '';
    if (!text) {
      onShowToast?.('Nothing to copy on this card.');
      return;
    }
    const ok = await copyToClipboard(text);
    if (ok) {
      onShowToast?.('Card text copied to clipboard.');
    } else {
      onShowToast?.('Could not copy to clipboard. Try again.');
    }
  };

  const handleDownloadCsv = () => {
    setOpen(false);
    if (!shareContent.csv) {
      onShowToast?.('This card has no tabular data to export.');
      return;
    }
    const name = `${slugifyForFile(shareContent.title || 'card')}.csv`;
    downloadCsv(name, shareContent.csv);
    onShowToast?.(`Downloaded ${name}`);
  };

  const handleDownloadPdf = () => {
    setOpen(false);
    onShowToast?.(
      'PDF export is mocked for this prototype — coming in the finished product.'
    );
  };

  return (
    <div className="cb-share" ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={'cb-share-btn' + (open ? ' is-open' : '')}
        aria-label="Share card"
        title="Share"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Share2 size={12} strokeWidth={2.2} />
      </button>

      {open && (
        <>
          {/* Mobile backdrop */}
          <div
            className="cb-share-backdrop"
            onClick={() => setOpen(false)}
          />
          {/* Menu */}
          <div
            className="cb-share-menu"
            role="menu"
            aria-label="Share options"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cb-share-sheet-handle" />
            <button
              type="button"
              className="cb-share-item"
              role="menuitem"
              onClick={handleCopy}
            >
              <ClipboardCopy size={14} strokeWidth={1.75} />
              <div>
                <div className="cb-share-item-label">Copy text</div>
                <div className="cb-share-item-sub">Narrative + key figures</div>
              </div>
            </button>
            <button
              type="button"
              className="cb-share-item"
              role="menuitem"
              onClick={handleDownloadCsv}
              disabled={!hasCsv}
            >
              <FileDown size={14} strokeWidth={1.75} />
              <div>
                <div className="cb-share-item-label">Download CSV</div>
                <div className="cb-share-item-sub">
                  {hasCsv ? 'Structured data export' : 'No tabular data'}
                </div>
              </div>
            </button>
            <button
              type="button"
              className="cb-share-item"
              role="menuitem"
              onClick={handleDownloadPdf}
            >
              <FileText size={14} strokeWidth={1.75} />
              <div>
                <div className="cb-share-item-label">Download PDF</div>
                <div className="cb-share-item-sub">Board-ready report</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
