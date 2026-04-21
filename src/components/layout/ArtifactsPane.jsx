import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import ArtifactView from '../artifacts/ArtifactView';

// The right-side artifacts pane. Flex-layout child on desktop (takes up
// `width` pixels, shrinking the chat column); full-screen overlay on
// mobile (<768px).
//
// Props:
//   artifacts: { state, openArtifact, closeArtifact, setWidth }
export default function ArtifactsPane({ artifacts }) {
  const { state, closeArtifact, setWidth } = artifacts;
  const { open, item, width } = state;
  const paneRef = useRef(null);
  const dragStartRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeArtifact();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeArtifact]);

  // Drag handle resizing. We watch for mousemove on the window so the
  // cursor staying inside the handle isn't required once a drag starts.
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

  if (!open || !item) return null;

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
      aria-label="Artifact panel"
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
        className="cb-icon-btn cb-artifacts-close"
        onClick={closeArtifact}
        aria-label="Close panel"
        title="Close"
      >
        <X size={16} strokeWidth={1.75} />
      </button>

      <div className="cb-artifacts-body">
        <ArtifactView item={item} />
      </div>
    </aside>
  );
}
