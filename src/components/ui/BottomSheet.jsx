import { useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import useHistoryBack from '../../hooks/useHistoryBack';

export default function BottomSheet({ open, onClose, children }) {
  const sheetRef = useRef(null);
  const startY = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);

  // Native back button closes the sheet instead of leaving the app.
  useHistoryBack(open, onClose);

  const handleTouchStart = useCallback((e) => {
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (startY.current == null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      setDragOffset(dy);
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (dragOffset > 80) {
      onClose?.();
    }
    setDragOffset(0);
    startY.current = null;
  }, [dragOffset, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 220,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
        }}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className="cb-bottom-sheet"
        style={{
          transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
          transition: dragOffset > 0 ? 'none' : 'transform 200ms ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="cb-bottom-sheet-handle" />
        {children}
        <div className="cb-bottom-sheet-safe" />
      </div>
    </div>,
    document.body
  );
}
