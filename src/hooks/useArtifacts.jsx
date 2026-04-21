// Artifacts pane state — a global single-slot right-side pane that shows
// full-screen data views (list screens, investor detail, card evidence)
// without breaking the always-visible chat column.
//
// State shape:
//   {
//     open: boolean,
//     item: { type, payload } | null,
//     width: number  // pixels; user-adjustable via the drag handle
//   }

import { createContext, useCallback, useContext, useState } from 'react';

const DEFAULT_WIDTH = 560;
const MIN_WIDTH = 340;

const ArtifactsContext = createContext(null);

export function useArtifacts() {
  const [state, setState] = useState({
    open: false,
    item: null,
    width: DEFAULT_WIDTH,
  });

  const openArtifact = useCallback((item) => {
    setState((prev) => ({ ...prev, open: true, item }));
  }, []);

  const closeArtifact = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const setWidth = useCallback((w) => {
    setState((prev) => {
      const next = Math.max(MIN_WIDTH, Math.round(w));
      return { ...prev, width: next };
    });
  }, []);

  return { state, openArtifact, closeArtifact, setWidth };
}

export function ArtifactsProvider({ value, children }) {
  return (
    <ArtifactsContext.Provider value={value}>
      {children}
    </ArtifactsContext.Provider>
  );
}

// Any descendant of <ArtifactsProvider> can read + write the artifact
// pane. Works both inside the Outlet and inside the pane itself.
export function useArtifactsContext() {
  const ctx = useContext(ArtifactsContext);
  if (!ctx) {
    throw new Error(
      'useArtifactsContext: must be used inside <ArtifactsProvider>. Did you wrap the app with RootLayout?'
    );
  }
  return ctx;
}
