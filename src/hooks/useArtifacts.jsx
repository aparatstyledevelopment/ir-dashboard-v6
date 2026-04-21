// Artifacts pane state.
//
// State shape:
//   {
//     paneVisible: boolean,       // whether the pane is showing at all
//     item: { type, payload } | null,  // null = show quick actions (default)
//     width: number,              // pixels; user-adjustable via drag handle
//     quickActions: [],           // set by the active module page
//     quickActionsTitle: string,
//     quickActionsSub: string,
//   }

import { createContext, useCallback, useContext, useState } from 'react';

const DEFAULT_WIDTH = 520;
const MIN_WIDTH = 340;

const ArtifactsContext = createContext(null);

export function useArtifacts() {
  const [state, setState] = useState({
    paneVisible: true,
    item: null,
    width: DEFAULT_WIDTH,
    quickActions: [],
    quickActionsTitle: 'Quick actions',
    quickActionsSub: 'Jump to a key view',
  });

  const openArtifact = useCallback((item) => {
    setState((prev) => ({ ...prev, paneVisible: true, item }));
  }, []);

  const closeArtifact = useCallback(() => {
    // Closing an artifact goes back to quick actions (item = null).
    // If already on quick actions, collapse the pane entirely.
    setState((prev) => {
      if (prev.item) return { ...prev, item: null };
      return { ...prev, paneVisible: false };
    });
  }, []);

  const togglePane = useCallback(() => {
    setState((prev) => ({ ...prev, paneVisible: !prev.paneVisible }));
  }, []);

  const setWidth = useCallback((w) => {
    setState((prev) => ({
      ...prev,
      width: Math.max(MIN_WIDTH, Math.round(w)),
    }));
  }, []);

  const setQuickActions = useCallback((actions, title, sub) => {
    setState((prev) => ({
      ...prev,
      quickActions: actions || [],
      quickActionsTitle: title || 'Quick actions',
      quickActionsSub: sub || 'Jump to a key view',
    }));
  }, []);

  return {
    state,
    openArtifact,
    closeArtifact,
    togglePane,
    setWidth,
    setQuickActions,
  };
}

export function ArtifactsProvider({ value, children }) {
  return (
    <ArtifactsContext.Provider value={value}>
      {children}
    </ArtifactsContext.Provider>
  );
}

export function useArtifactsContext() {
  const ctx = useContext(ArtifactsContext);
  if (!ctx) {
    throw new Error(
      'useArtifactsContext: must be used inside <ArtifactsProvider>.'
    );
  }
  return ctx;
}
