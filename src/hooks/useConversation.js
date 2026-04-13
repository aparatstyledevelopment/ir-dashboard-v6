import { useCallback, useState } from 'react';

let idCounter = 0;
const nextId = () => `m-${++idCounter}-${Date.now()}`;

export function useConversation() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [spentChips, setSpentChips] = useState(new Set());

  const append = useCallback((msg) => {
    setMessages((prev) => [...prev, { id: nextId(), ...msg }]);
  }, []);

  const sendChipQuery = useCallback((chipId, responseType, label) => {
    setSpentChips((prev) => {
      const next = new Set(prev);
      next.add(chipId);
      return next;
    });
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nextId(), kind: 'response', responseType, label },
      ]);
    }, 800);
  }, []);

  const sendCatalogQuery = useCallback((catalogId, label) => {
    setSpentChips((prev) => {
      const next = new Set(prev);
      next.add(catalogId);
      return next;
    });
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          kind: 'response',
          responseType: 'catalog',
          catalogId,
          label,
        },
      ]);
    }, 800);
  }, []);

  const sendTextQuery = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: nextId(), kind: 'user', text: trimmed }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nextId(), kind: 'response', responseType: 'generic', query: trimmed },
      ]);
    }, 800);
  }, []);

  const isChipSpent = useCallback((chipId) => spentChips.has(chipId), [spentChips]);

  return {
    messages,
    isTyping,
    sendChipQuery,
    sendCatalogQuery,
    sendTextQuery,
    isChipSpent,
    append,
  };
}
