// Conversation state for ALL modules, hoisted to the root layout so it
// survives navigation between sibling routes. Each module holds an
// ordered list of sessions, plus an active session id. All chip / chat
// actions operate on the active session of the active module.
//
// Slot shape:
//   {
//     activeSessionId: 's-3',
//     sessionOrder: ['s-3', 's-2', 's-1'],           // newest first
//     sessions: {
//       's-3': {
//         id, title, createdAt,
//         messages: [], isTyping: false,
//         spentChips: Set, attachments: [],
//       },
//     },
//   }

import { useCallback, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

let messageCounter = 0;
let sessionCounter = 0;
const nextId = () => `m-${++messageCounter}-${Date.now()}`;
const nextSessionId = () => `s-${++sessionCounter}-${Date.now()}`;

function emptySession(title = 'New chat') {
  return {
    id: nextSessionId(),
    title,
    createdAt: Date.now(),
    messages: [],
    isTyping: false,
    spentChips: new Set(),
    attachments: [],
  };
}

function emptySlot() {
  const s = emptySession();
  return {
    activeSessionId: s.id,
    sessionOrder: [s.id],
    sessions: { [s.id]: s },
  };
}

export function useConversations() {
  const [slots, setSlots] = useState({});

  const updateSlot = useCallback((moduleId, updater) => {
    setSlots((prev) => {
      const current = prev[moduleId] || emptySlot();
      return { ...prev, [moduleId]: updater(current) };
    });
  }, []);

  return { slots, updateSlot };
}

export function useModuleConversation(moduleId) {
  const { conversations } = useOutletContext();
  if (!conversations) {
    throw new Error(
      'useModuleConversation: outlet context missing `conversations`. Did you wrap pages in RootLayout?'
    );
  }
  const { slots, updateSlot } = conversations;
  const slot = slots[moduleId] || emptySlot();
  const session = slot.sessions[slot.activeSessionId] || emptySession();

  // Helper: update the active session of the current slot.
  const updateActiveSession = useCallback(
    (updater) => {
      updateSlot(moduleId, (c) => {
        const cur = c.sessions[c.activeSessionId];
        const next = updater(cur);
        return {
          ...c,
          sessions: { ...c.sessions, [c.activeSessionId]: next },
        };
      });
    },
    [moduleId, updateSlot]
  );

  const sendChipQuery = useCallback(
    (chipId, responseType, label) => {
      updateActiveSession((s) => ({
        ...s,
        title: s.title === 'New chat' && label ? label : s.title,
        spentChips: new Set([...s.spentChips, chipId]),
        isTyping: true,
      }));
      setTimeout(() => {
        updateActiveSession((s) => ({
          ...s,
          isTyping: false,
          messages: [
            ...s.messages,
            { id: nextId(), kind: 'response', responseType, label },
          ],
        }));
      }, 800);
    },
    [updateActiveSession]
  );

  const sendCatalogQuery = useCallback(
    (catalogId, label) => {
      updateActiveSession((s) => ({
        ...s,
        title: s.title === 'New chat' && label ? label : s.title,
        spentChips: new Set([...s.spentChips, catalogId]),
        isTyping: true,
      }));
      setTimeout(() => {
        updateActiveSession((s) => ({
          ...s,
          isTyping: false,
          messages: [
            ...s.messages,
            {
              id: nextId(),
              kind: 'response',
              responseType: 'catalog',
              catalogId,
              label,
            },
          ],
        }));
      }, 800);
    },
    [updateActiveSession]
  );

  const sendTextQuery = useCallback(
    (text) => {
      const trimmed = (text || '').trim();
      updateActiveSession((s) => {
        const attached = s.attachments || [];
        if (!trimmed && attached.length === 0) return s;
        const nextTitle =
          s.title === 'New chat'
            ? trimmed.slice(0, 42) || `${attached.length} cards`
            : s.title;
        return {
          ...s,
          title: nextTitle,
          messages: [
            ...s.messages,
            {
              id: nextId(),
              kind: 'user',
              text: trimmed,
              attachments: attached.length ? [...attached] : undefined,
            },
          ],
          isTyping: true,
          attachments: [],
        };
      });
      setTimeout(() => {
        updateActiveSession((s) => {
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
                id: nextId(),
                kind: 'response',
                responseType: 'generic',
                query: lastUser?.text || '',
                attachments: attached.length ? [...attached] : undefined,
              },
            ],
          };
        });
      }, 800);
    },
    [updateActiveSession]
  );

  const attachCard = useCallback(
    (ref) => {
      const current = session.attachments;
      if (current.find((a) => a.id === ref.id)) {
        return { ok: true, reason: 'already-attached' };
      }
      if (current.length >= 5) {
        return { ok: false, reason: 'limit-reached' };
      }
      updateActiveSession((s) => {
        if (s.attachments.find((a) => a.id === ref.id)) return s;
        if (s.attachments.length >= 5) return s;
        return { ...s, attachments: [...s.attachments, ref] };
      });
      return { ok: true, reason: 'attached' };
    },
    [session.attachments, updateActiveSession]
  );

  const removeAttachment = useCallback(
    (refId) => {
      updateActiveSession((s) => ({
        ...s,
        attachments: s.attachments.filter((a) => a.id !== refId),
      }));
    },
    [updateActiveSession]
  );

  const isAttached = useCallback(
    (refId) => session.attachments.some((a) => a.id === refId),
    [session.attachments]
  );

  const isChipSpent = useCallback(
    (chipId) => session.spentChips.has(chipId),
    [session.spentChips]
  );

  // ----- Session management API -----

  const sessionList = useMemo(
    () =>
      slot.sessionOrder
        .map((id) => slot.sessions[id])
        .filter(Boolean)
        .map((s) => ({
          id: s.id,
          title: s.title,
          createdAt: s.createdAt,
          messageCount: s.messages.length,
          isActive: s.id === slot.activeSessionId,
        })),
    [slot.sessionOrder, slot.sessions, slot.activeSessionId]
  );

  const createSession = useCallback(() => {
    const s = emptySession();
    updateSlot(moduleId, (c) => ({
      ...c,
      activeSessionId: s.id,
      sessionOrder: [s.id, ...c.sessionOrder],
      sessions: { ...c.sessions, [s.id]: s },
    }));
    return s.id;
  }, [moduleId, updateSlot]);

  const switchSession = useCallback(
    (id) => {
      updateSlot(moduleId, (c) =>
        c.sessions[id] ? { ...c, activeSessionId: id } : c
      );
    },
    [moduleId, updateSlot]
  );

  const deleteSession = useCallback(
    (id) => {
      updateSlot(moduleId, (c) => {
        if (!c.sessions[id]) return c;
        const nextSessions = { ...c.sessions };
        delete nextSessions[id];
        const nextOrder = c.sessionOrder.filter((sid) => sid !== id);
        // Ensure at least one session exists.
        if (nextOrder.length === 0) {
          const fresh = emptySession();
          return {
            activeSessionId: fresh.id,
            sessionOrder: [fresh.id],
            sessions: { [fresh.id]: fresh },
          };
        }
        const nextActive =
          c.activeSessionId === id ? nextOrder[0] : c.activeSessionId;
        return {
          ...c,
          activeSessionId: nextActive,
          sessionOrder: nextOrder,
          sessions: nextSessions,
        };
      });
    },
    [moduleId, updateSlot]
  );

  return {
    // Active session data
    messages: session.messages,
    isTyping: session.isTyping,
    attachments: session.attachments,
    // Active session actions
    sendChipQuery,
    sendCatalogQuery,
    sendTextQuery,
    isChipSpent,
    attachCard,
    removeAttachment,
    isAttached,
    // Session management
    sessionList,
    activeSessionId: slot.activeSessionId,
    createSession,
    switchSession,
    deleteSession,
  };
}
