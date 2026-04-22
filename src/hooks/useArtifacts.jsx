// Artifacts pane state with navigation stack for nested artifacts.
//
// State shape:
//   {
//     paneVisible: boolean,
//     stack: [{ type, payload }, ...],   // navigation stack, last = current
//     width: number,
//     quickActions: [],
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
    stack: [],
    width: DEFAULT_WIDTH,
    quickActions: [],
    quickActionsTitle: 'Quick actions',
    quickActionsSub: 'Jump to a key view',
  });

  // Current item is the top of the stack (or null = quick actions).
  const item = state.stack.length > 0 ? state.stack[state.stack.length - 1] : null;

  const openArtifact = useCallback((newItem) => {
    setState((prev) => ({
      ...prev,
      paneVisible: true,
      stack: [...prev.stack, newItem],
    }));
  }, []);

  const closeArtifact = useCallback(() => {
    setState((prev) => {
      if (prev.stack.length > 1) {
        // Pop one level — go back to previous artifact.
        return { ...prev, stack: prev.stack.slice(0, -1) };
      }
      if (prev.stack.length === 1) {
        // Last artifact — clear stack, show quick actions.
        return { ...prev, stack: [] };
      }
      // Already on quick actions — collapse the pane.
      return { ...prev, paneVisible: false };
    });
  }, []);

  const closeAll = useCallback(() => {
    setState((prev) => ({ ...prev, stack: [] }));
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
    state: { ...state, item },
    openArtifact,
    closeArtifact,
    closeAll,
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
