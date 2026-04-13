import { useEffect, useRef } from 'react';

export function useAutoScroll(deps) {
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return endRef;
}
