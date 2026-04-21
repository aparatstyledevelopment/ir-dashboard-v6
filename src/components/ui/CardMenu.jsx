import { useEffect, useRef, useState } from 'react';
import {
  MoreVertical,
  ClipboardCopy,
  FileDown,
  FileText,
  Plus,
  Check,
} from 'lucide-react';
import { downloadCsv, slugifyForFile } from '../../utils/csv';
import { openCardPdf } from '../../utils/pdf';
import BottomSheet from './BottomSheet';

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
  } catch {
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
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);
  return mobile;
}

function MenuItems({
  shareContent,
  onCopy,
  onDownloadCsv,
  onDownloadPdf,
  onAttach,
  isAttached,
}) {
  const hasCsv = Boolean(shareContent?.csv);
  return (
    <>
      {onAttach && (
        <button
          type="button"
          className="cb-share-item"
          role="menuitem"
          onClick={onAttach}
        >
          {isAttached ? (
            <Check size={14} strokeWidth={1.75} />
          ) : (
            <Plus size={14} strokeWidth={1.75} />
          )}
          <div>
            <div className="cb-share-item-label">
              {isAttached ? 'Added to chat' : 'Add to chat'}
            </div>
            <div className="cb-share-item-sub">
              {isAttached
                ? 'Card is attached — tap to remove'
                : 'Attach this card to the next message'}
            </div>
          </div>
        </button>
      )}
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
          <div className="cb-share-item-sub">Opens print dialog · save as PDF</div>
        </div>
      </button>
    </>
  );
}

export default function CardMenu({
  shareContent,
  onShowToast,
  onAttach,
  isAttached,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
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

  if (!shareContent && !onAttach) return null;

  const handleCopy = async () => {
    setOpen(false);
    const text = shareContent?.text || '';
    if (!text) {
      onShowToast?.('Nothing to copy on this card.');
      return;
    }
    const ok = await copyToClipboard(text);
    onShowToast?.(ok ? 'Card text copied to clipboard.' : 'Could not copy.');
  };

  const handleDownloadCsv = () => {
    setOpen(false);
    if (!shareContent?.csv) {
      onShowToast?.('This card has no tabular data to export.');
      return;
    }
    const name = `${slugifyForFile(shareContent.title || 'card')}.csv`;
    downloadCsv(name, shareContent.csv);
    onShowToast?.(`Downloaded ${name}`);
  };

  const handleDownloadPdf = () => {
    setOpen(false);
    const ok = openCardPdf(shareContent);
    if (!ok) {
      onShowToast?.('Could not open print window — check pop-up blocker.');
      return;
    }
    onShowToast?.('Opening print dialog. Choose "Save as PDF" to download.');
  };

  const handleAttach = () => {
    setOpen(false);
    onAttach?.();
  };

  const mobileSheet = isMobile ? (
    <BottomSheet open={open} onClose={() => setOpen(false)}>
      <div className="cb-share-menu" role="menu" aria-label="Card options">
        <MenuItems
          shareContent={shareContent}
          onCopy={handleCopy}
          onDownloadCsv={handleDownloadCsv}
          onDownloadPdf={handleDownloadPdf}
          onAttach={onAttach ? handleAttach : undefined}
          isAttached={isAttached}
        />
      </div>
    </BottomSheet>
  ) : null;

  const desktopMenu =
    open && !isMobile ? (
      <div
        className="cb-share-menu"
        role="menu"
        aria-label="Card options"
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItems
          shareContent={shareContent}
          onCopy={handleCopy}
          onDownloadCsv={handleDownloadCsv}
          onDownloadPdf={handleDownloadPdf}
          onAttach={onAttach ? handleAttach : undefined}
          isAttached={isAttached}
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
        aria-label="Card options"
        title="Options"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical size={14} strokeWidth={2} />
      </button>
      {desktopMenu}
      {mobileSheet}
    </div>
  );
}
