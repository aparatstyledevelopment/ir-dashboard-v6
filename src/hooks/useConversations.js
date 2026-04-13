// Conversation state for ALL modules, hoisted to the root layout so it
// survives navigation between sibling routes (e.g. Dashboard → Investor
// detail → back to Dashboard).
//
// useConversations() lives in <RootLayout> and is exposed via outlet
// context. Each module page calls useModuleConversation('dashboard') /
// 'shareholders' / etc. and gets back a slot-bound API.
//
// Each slot tracks: messages, isTyping, spentChips, attachments
// (cards the user has added to their next chat-input message).

import { useCallback, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

let idCounter = 0;
const nextId = () => `m-${++idCounter}-${Date.now()}`;

function emptySlot() {
  return {
    messages: [],
    isTyping: false,
    spentChips: new Set(),
    attachments: [],
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

  const sendChipQuery = useCallback(
    (chipId, responseType, label) => {
      updateSlot(moduleId, (c) => ({
        ...c,
        spentChips: new Set([...c.spentChips, chipId]),
        isTyping: true,
      }));
      setTimeout(() => {
        updateSlot(moduleId, (c) => ({
          ...c,
          isTyping: false,
          messages: [
            ...c.messages,
            { id: nextId(), kind: 'response', responseType, label },
          ],
        }));
      }, 800);
    },
    [moduleId, updateSlot]
  );

  const sendCatalogQuery = useCallback(
    (catalogId, label) => {
      updateSlot(moduleId, (c) => ({
        ...c,
        spentChips: new Set([...c.spentChips, catalogId]),
        isTyping: true,
      }));
      setTimeout(() => {
        updateSlot(moduleId, (c) => ({
          ...c,
          isTyping: false,
          messages: [
            ...c.messages,
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
    [moduleId, updateSlot]
  );

  const sendTextQuery = useCallback(
    (text) => {
      const trimmed = (text || '').trim();
      // Read the latest attachments at submit time via functional update.
      updateSlot(moduleId, (c) => {
        const attached = c.attachments || [];
        if (!trimmed && attached.length === 0) return c;
        return {
          ...c,
          messages: [
            ...c.messages,
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
        updateSlot(moduleId, (c) => {
          // The most recent user message holds the attachments we want to echo back.
          const lastUser = [...c.messages]
            .reverse()
            .find((m) => m.kind === 'user');
          const attached = lastUser?.attachments || [];
          return {
            ...c,
            isTyping: false,
            messages: [
              ...c.messages,
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
    [moduleId, updateSlot]
  );

  const attachCard = useCallback(
    (ref) => {
      updateSlot(moduleId, (c) => {
        if (c.attachments.find((a) => a.id === ref.id)) return c;
        return { ...c, attachments: [...c.attachments, ref] };
      });
    },
    [moduleId, updateSlot]
  );

  const removeAttachment = useCallback(
    (refId) => {
      updateSlot(moduleId, (c) => ({
        ...c,
        attachments: c.attachments.filter((a) => a.id !== refId),
      }));
    },
    [moduleId, updateSlot]
  );

  const isAttached = useCallback(
    (refId) => slot.attachments.some((a) => a.id === refId),
    [slot.attachments]
  );

  const isChipSpent = useCallback(
    (chipId) => slot.spentChips.has(chipId),
    [slot.spentChips]
  );

  return {
    messages: slot.messages,
    isTyping: slot.isTyping,
    attachments: slot.attachments,
    sendChipQuery,
    sendCatalogQuery,
    sendTextQuery,
    isChipSpent,
    attachCard,
    removeAttachment,
    isAttached,
  };
}
