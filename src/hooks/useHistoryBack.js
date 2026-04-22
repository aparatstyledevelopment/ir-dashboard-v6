import { useEffect, useRef } from 'react';

// Push a browser history entry when `active` is true. When the user
// presses the native back button (popstate), call `onClose` instead of
// navigating away. Cleans up on unmount.
export default function useHistoryBack(active, onClose) {
  const pushed = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) {
      pushed.current = false;
      return undefined;
    }

    // Small delay so the current event loop completes before we push.
    const timer = setTimeout(() => {
      window.history.pushState({ modal: true }, '');
      pushed.current = true;
    }, 0);

    const onPopState = () => {
      if (pushed.current) {
        pushed.current = false;
        onCloseRef.current?.();
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', onPopState);
      // If we pushed but the component unmounted without a popstate
      // (e.g. parent closed it programmatically), go back to clean up
      // the extra history entry.
      if (pushed.current) {
        pushed.current = false;
        window.history.back();
      }
    };
  }, [active]);
}
