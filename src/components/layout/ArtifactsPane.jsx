import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import ArtifactView from '../artifacts/ArtifactView';
import useHistoryBack from '../../hooks/useHistoryBack';

export default function ArtifactsPane({ artifacts }) {
  const { state, closeArtifact, setWidth } = artifacts;
  const { item, stack, width } = state;
  const paneRef = useRef(null);
  const bodyRef = useRef(null);
  const dragStartRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [bodyScrolled, setBodyScrolled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (!item) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeArtifact();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, closeArtifact]);

  useHistoryBack(isMobile && !!item, closeArtifact);

  useEffect(() => {
    if (!dragging) return undefined;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      if (clientX == null) return;
      const vw = window.innerWidth;
      const maxWidth = Math.max(360, Math.floor(vw * 0.7));
      const nextWidth = Math.min(maxWidth, Math.max(340, vw - clientX));
      setWidth(nextWidth);
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [dragging, setWidth]);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return undefined;
    const onScroll = () => setBodyScrolled(el.scrollTop > 2);
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  });

  // Only render when an artifact item is open.
  if (!item) return null;

  const hasBackStack = stack.length > 1;

  return (
    <aside
      ref={paneRef}
      className={
        'cb-artifacts' +
        (isMobile ? ' cb-artifacts--mobile' : '') +
        (dragging ? ' is-dragging' : '')
      }
      style={isMobile ? undefined : { width: `${width}px` }}
      role="complementary"
      aria-label="Side panel"
    >
      {!isMobile && (
        <button
          type="button"
          className="cb-artifacts-resizer"
          onMouseDown={(e) => {
            e.preventDefault();
            dragStartRef.current = e.clientX;
            setDragging(true);
          }}
          onTouchStart={(e) => {
            dragStartRef.current = e.touches[0].clientX;
            setDragging(true);
          }}
          aria-label="Resize panel"
          title="Drag to resize"
        />
      )}

      <button
        type="button"
        className={
          'cb-icon-btn cb-artifacts-close' +
          (bodyScrolled ? ' is-scrolled' : '')
        }
        onClick={closeArtifact}
        aria-label={hasBackStack ? 'Back' : 'Close'}
        title={hasBackStack ? 'Back' : 'Close'}
      >
        {hasBackStack ? (
          <ChevronLeft size={18} strokeWidth={1.75} />
        ) : (
          <X size={16} strokeWidth={1.75} />
        )}
      </button>

      <div className="cb-artifacts-body" ref={bodyRef}>
        <ArtifactView item={item} />
      </div>
    </aside>
  );
}
