import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Share2, ClipboardCopy, FileDown, FileText } from 'lucide-react';
import { downloadCsv, slugifyForFile } from '../../utils/csv';

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
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

function useIsMobile() {
  const [mobile, setMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 639px)').matches;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(max-width: 639px)');
    const update = (e) => setMobile(e.matches);
    // Safari < 14 uses addListener
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);
  return mobile;
}

function MenuItems({ shareContent, onCopy, onDownloadCsv, onDownloadPdf }) {
  const hasCsv = Boolean(shareContent.csv);
  return (
    <>
      <button
        type="button"
        className="cb-share-item"
        role="menuitem"
        onClick={onCopy}
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
        onClick={onDownloadCsv}
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
        onClick={onDownloadPdf}
      >
        <FileText size={14} strokeWidth={1.75} />
        <div>
          <div className="cb-share-item-label">Download PDF</div>
          <div className="cb-share-item-sub">Board-ready report</div>
        </div>
      </button>
    </>
  );
}

export default function ShareMenu({ shareContent, onShowToast }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const isMobile = useIsMobile();

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

  // --- Mobile: portal a bottom sheet to document.body so it escapes
  //     any transformed ancestor (e.g. .fade-in-up cards). ---
  const mobileSheet =
    open && isMobile
      ? createPortal(
          <div
            ref={containerRef}
            className="cb-share-portal"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="cb-share-backdrop"
              onClick={() => setOpen(false)}
            />
            <div
              className="cb-share-menu"
              role="menu"
              aria-label="Share options"
            >
              <div className="cb-share-sheet-handle" />
              <MenuItems
                shareContent={shareContent}
                onCopy={handleCopy}
                onDownloadCsv={handleDownloadCsv}
                onDownloadPdf={handleDownloadPdf}
              />
            </div>
          </div>,
          document.body
        )
      : null;

  // --- Desktop: absolute dropdown anchored next to the share button. ---
  const desktopMenu =
    open && !isMobile ? (
      <div
        className="cb-share-menu"
        role="menu"
        aria-label="Share options"
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItems
          shareContent={shareContent}
          onCopy={handleCopy}
          onDownloadCsv={handleDownloadCsv}
          onDownloadPdf={handleDownloadPdf}
        />
      </div>
    ) : null;

  return (
    <div className="cb-share" ref={isMobile ? null : containerRef}>
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

      {desktopMenu}
      {mobileSheet}
    </div>
  );
}
