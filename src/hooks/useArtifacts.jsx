// Artifacts pane state with navigation stack.
//
// State shape:
//   {
//     stack: [{ type, payload }, ...],   // navigation stack, last = current
//     width: number,
//   }

import { createContext, useCallback, useContext, useState } from 'react';

const DEFAULT_WIDTH = 520;
const MIN_WIDTH = 340;

const ArtifactsContext = createContext(null);

export function useArtifacts() {
  const [state, setState] = useState({
    stack: [],
    width: DEFAULT_WIDTH,
  });

  const item = state.stack.length > 0 ? state.stack[state.stack.length - 1] : null;

  const openArtifact = useCallback((newItem) => {
    setState((prev) => ({
      ...prev,
      stack: [...prev.stack, newItem],
    }));
  }, []);

  const closeArtifact = useCallback(() => {
    setState((prev) => {
      if (prev.stack.length > 1) {
        return { ...prev, stack: prev.stack.slice(0, -1) };
      }
      return { ...prev, stack: [] };
    });
  }, []);

  const closeAll = useCallback(() => {
    setState((prev) => ({ ...prev, stack: [] }));
  }, []);

  const setWidth = useCallback((w) => {
    setState((prev) => ({
      ...prev,
      width: Math.max(MIN_WIDTH, Math.round(w)),
    }));
  }, []);

  return {
    state: { ...state, item },
    openArtifact,
    closeArtifact,
    closeAll,
    setWidth,
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
