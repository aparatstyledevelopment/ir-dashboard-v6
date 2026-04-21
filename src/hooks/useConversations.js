// Conversation state for ALL modules, hoisted to the root layout so it
// survives navigation between sibling routes.
//
// Unified (global) store shape:
//   {
//     sessions: {
//       [id]: {
//         id, moduleId, title, createdAt,
//         messages: [], isTyping: false,
//         spentChips: Set, attachments: [],
//       },
//     },
//     sessionOrder: [id, id, ...],            // newest first, GLOBAL across modules
//     activeByModule: {
//       dashboard:    'id' | null,            // null === staging (no session yet)
//       shareholders: 'id' | null,
//       targeting:    'id' | null,
//     },
//   }
//
// A module is in "staging" when its activeByModule entry is null. In that
// state the UI shows the collapsed briefing but no session exists. The
// first write-action (chip, text, catalog, attach) implicitly creates a
// session tagged with that moduleId, adds it to the global sessionOrder,
// then applies the action — committing the stage.

import { useCallback, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

let messageCounter = 0;
let sessionCounter = 0;
const nextMessageId = () => `m-${++messageCounter}-${Date.now()}`;
const nextSessionId = () => `s-${++sessionCounter}-${Date.now()}`;

function makeSession(moduleId, title = 'New chat') {
  return {
    id: nextSessionId(),
    moduleId,
    title,
    createdAt: Date.now(),
    messages: [],
    isTyping: false,
    spentChips: new Set(),
    attachments: [],
  };
}

// Pure helper: ensure the given module has an active session. Returns a
// tuple of [nextState, activeSessionId]. If the module is already out of
// staging, the state is returned unchanged.
function ensureActive(state, moduleId, titleHint) {
  const current = state.activeByModule[moduleId];
  if (current && state.sessions[current]) {
    return [state, current];
  }
  const fresh = makeSession(
    moduleId,
    titleHint ? String(titleHint).slice(0, 42) : 'New chat'
  );
  return [
    {
      ...state,
      sessions: { ...state.sessions, [fresh.id]: fresh },
      sessionOrder: [fresh.id, ...state.sessionOrder],
      activeByModule: { ...state.activeByModule, [moduleId]: fresh.id },
    },
    fresh.id,
  ];
}

// Pure helper: patch a single session in the state tree.
function patchSession(state, sessionId, patch) {
  const s = state.sessions[sessionId];
  if (!s) return state;
  return {
    ...state,
    sessions: {
      ...state.sessions,
      [sessionId]: typeof patch === 'function' ? patch(s) : { ...s, ...patch },
    },
  };
}

export function useConversations() {
  const [state, setState] = useState(() => ({
    sessions: {},
    sessionOrder: [],
    activeByModule: {},
  }));

  // Global writers that don't depend on any specific module ---------------

  const switchSession = useCallback((id) => {
    setState((prev) => {
      const s = prev.sessions[id];
      if (!s) return prev;
      return {
        ...prev,
        activeByModule: { ...prev.activeByModule, [s.moduleId]: id },
      };
    });
  }, []);

  const deleteSession = useCallback((id) => {
    setState((prev) => {
      const s = prev.sessions[id];
      if (!s) return prev;
      const nextSessions = { ...prev.sessions };
      delete nextSessions[id];
      const nextOrder = prev.sessionOrder.filter((sid) => sid !== id);
      const nextActive = { ...prev.activeByModule };
      // If this session was active for its module, drop back to staging.
      if (nextActive[s.moduleId] === id) {
        nextActive[s.moduleId] = null;
      }
      return {
        sessions: nextSessions,
        sessionOrder: nextOrder,
        activeByModule: nextActive,
      };
    });
  }, []);

  // Put a module back into staging (no active session, show briefing).
  const goToStaging = useCallback((moduleId) => {
    setState((prev) => ({
      ...prev,
      activeByModule: { ...prev.activeByModule, [moduleId]: null },
    }));
  }, []);

  return {
    state,
    setState,
    switchSession,
    deleteSession,
    goToStaging,
  };
}

// ---------------------------------------------------------------------------
// Module-scoped API used by page components.

export function useModuleConversation(moduleId) {
  const ctx = useOutletContext();
  const conversations = ctx?.conversations;
  if (!conversations) {
    throw new Error(
      'useModuleConversation: outlet context missing `conversations`. Did you wrap pages in RootLayout?'
    );
  }
  const { state, setState, switchSession, deleteSession, goToStaging } =
    conversations;
  const activeId = state.activeByModule[moduleId] || null;
  const session = activeId ? state.sessions[activeId] : null;

  // ----- Writers -----

  const sendChipQuery = useCallback(
    (chipId, responseType, label) => {
      let committedId;
      setState((prev) => {
        const [next, id] = ensureActive(prev, moduleId, label);
        committedId = id;
        return patchSession(next, id, (s) => ({
          ...s,
          title: s.title === 'New chat' && label ? label : s.title,
          spentChips: new Set([...s.spentChips, chipId]),
          isTyping: true,
          messages: [
            ...s.messages,
            { id: nextMessageId(), kind: 'user', text: label || chipId },
          ],
        }));
      });
      setTimeout(() => {
        setState((prev) =>
          patchSession(prev, committedId, (s) => ({
            ...s,
            isTyping: false,
            messages: [
              ...s.messages,
              { id: nextMessageId(), kind: 'response', responseType, label },
            ],
          }))
        );
      }, 800);
    },
    [moduleId, setState]
  );

  const sendCatalogQuery = useCallback(
    (catalogId, label) => {
      let committedId;
      setState((prev) => {
        const [next, id] = ensureActive(prev, moduleId, label);
        committedId = id;
        return patchSession(next, id, (s) => ({
          ...s,
          title: s.title === 'New chat' && label ? label : s.title,
          spentChips: new Set([...s.spentChips, catalogId]),
          isTyping: true,
          messages: [
            ...s.messages,
            { id: nextMessageId(), kind: 'user', text: label || catalogId },
          ],
        }));
      });
      setTimeout(() => {
        setState((prev) =>
          patchSession(prev, committedId, (s) => ({
            ...s,
            isTyping: false,
            messages: [
              ...s.messages,
              {
                id: nextMessageId(),
                kind: 'response',
                responseType: 'catalog',
                catalogId,
                label,
              },
            ],
          }))
        );
      }, 800);
    },
    [moduleId, setState]
  );

  const sendBulkResponses = useCallback(
    (items) => {
      if (!items || items.length === 0) return;
      setState((prev) => {
        const [next, id] = ensureActive(prev, moduleId, `/all — ${items.length} cards`);
        return patchSession(next, id, (s) => ({
          ...s,
          title:
            s.title === 'New chat' ? `/all — ${items.length} cards` : s.title,
          messages: [
            ...s.messages,
            ...items.map((item) => ({
              id: nextMessageId(),
              kind: 'response',
              ...item,
            })),
          ],
        }));
      });
    },
    [moduleId, setState]
  );

  const sendTextQuery = useCallback(
    (text) => {
      const trimmed = (text || '').trim();
      let committedId;
      let attachedSnapshot = [];
      setState((prev) => {
        // Peek attachments from staged/active session before committing.
        const existing = prev.activeByModule[moduleId]
          ? prev.sessions[prev.activeByModule[moduleId]]
          : null;
        const current = existing?.attachments || [];
        if (!trimmed && current.length === 0) return prev;

        const [next, id] = ensureActive(
          prev,
          moduleId,
          trimmed || `${current.length} cards`
        );
        committedId = id;
        // Re-read attachments after ensuring (it could be a fresh session
        // with zero attachments if we just committed from staging).
        const freshSession = next.sessions[id];
        attachedSnapshot = freshSession.attachments || [];

        return patchSession(next, id, (s) => {
          const nextTitle =
            s.title === 'New chat'
              ? trimmed.slice(0, 42) || `${attachedSnapshot.length} cards`
              : s.title;
          return {
            ...s,
            title: nextTitle,
            messages: [
              ...s.messages,
              {
                id: nextMessageId(),
                kind: 'user',
                text: trimmed,
                attachments: attachedSnapshot.length
                  ? [...attachedSnapshot]
                  : undefined,
              },
            ],
            isTyping: true,
            attachments: [],
          };
        });
      });
      if (!committedId) return;
      setTimeout(() => {
        setState((prev) =>
          patchSession(prev, committedId, (s) => {
            const lastUser = [...s.messages]
              .reverse()
              .find((m) => m.kind === 'user');
            const attached = lastUser?.attachments || [];
            return {
              ...s,
              isTyping: false,
              messages: [
                ...s.messages,
                {
                  id: nextMessageId(),
                  kind: 'response',
                  responseType: 'generic',
                  query: lastUser?.text || '',
                  attachments: attached.length ? [...attached] : undefined,
                },
              ],
            };
          })
        );
      }, 800);
    },
    [moduleId, setState]
  );

  const clearActiveSession = useCallback(() => {
    // Clearing a session resets its contents back to empty.
    setState((prev) => {
      const id = prev.activeByModule[moduleId];
      if (!id) return prev;
      return patchSession(prev, id, (s) => ({
        ...s,
        messages: [],
        attachments: [],
        spentChips: new Set(),
        title: 'New chat',
      }));
    });
  }, [moduleId, setState]);

  const attachCard = useCallback(
    (ref) => {
      // Staging → commit a session, then attach.
      let result = { ok: true, reason: 'attached' };
      setState((prev) => {
        const [next, id] = ensureActive(prev, moduleId);
        const s = next.sessions[id];
        if (s.attachments.find((a) => a.id === ref.id)) {
          result = { ok: true, reason: 'already-attached' };
          return next;
        }
        if (s.attachments.length >= 5) {
          result = { ok: false, reason: 'limit-reached' };
          return next;
        }
        return patchSession(next, id, (ss) => ({
          ...ss,
          attachments: [...ss.attachments, ref],
        }));
      });
      return result;
    },
    [moduleId, setState]
  );

  const removeAttachment = useCallback(
    (refId) => {
      setState((prev) => {
        const id = prev.activeByModule[moduleId];
        if (!id) return prev;
        return patchSession(prev, id, (s) => ({
          ...s,
          attachments: s.attachments.filter((a) => a.id !== refId),
        }));
      });
    },
    [moduleId, setState]
  );

  const isAttached = useCallback(
    (refId) => {
      if (!session) return false;
      return session.attachments.some((a) => a.id === refId);
    },
    [session]
  );

  const isChipSpent = useCallback(
    (chipId) => {
      if (!session) return false;
      return session.spentChips.has(chipId);
    },
    [session]
  );

  // `createSession` is called by the sidebar's "New chat" button — per
  // product spec, this puts the module back into staging rather than
  // eagerly creating an empty session.
  const createSession = useCallback(() => {
    goToStaging(moduleId);
  }, [moduleId, goToStaging]);

  // Session list scoped to this module (used as a fallback in a few
  // places; the sidebar now uses the GLOBAL list).
  const sessionList = useMemo(() => {
    return state.sessionOrder
      .map((id) => state.sessions[id])
      .filter((s) => s && s.moduleId === moduleId)
      .map((s) => ({
        id: s.id,
        title: s.title,
        createdAt: s.createdAt,
        messageCount: s.messages.length,
        isActive: s.id === activeId,
      }));
  }, [state.sessionOrder, state.sessions, activeId, moduleId]);

  return {
    // Active session data (empty fields when in staging)
    messages: session?.messages || [],
    isTyping: session?.isTyping || false,
    attachments: session?.attachments || [],
    isStaging: !session,
    // Writers
    sendChipQuery,
    sendCatalogQuery,
    sendTextQuery,
    sendBulkResponses,
    clearActiveSession,
    isChipSpent,
    attachCard,
    removeAttachment,
    isAttached,
    // Session management
    sessionList,
    activeSessionId: activeId,
    createSession, // → staging
    switchSession,
    deleteSession,
  };
}
