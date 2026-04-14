// Given a conversation message, resolve its shareContent ({title, text, csv}).
// Used by the /report command to build a multi-card PDF from currently
// attached cards.

import { SHARE_MAP } from '../data/shareContentMap';
import { getCatalogEntry } from '../data/responseCatalog';
import { shareContentFromCatalogEntry } from './shareContent';

export function resolveShareFromMessage(message) {
  if (!message) return null;
  if (message.kind !== 'response') return null;
  if (message.responseType === 'generic') {
    return {
      title: message.query ? `Query: ${message.query}` : 'Custom query',
      text:
        `Query: ${message.query || '(empty)'}\n\n` +
        'In the full Command Bar experience, the AI would synthesize a cross-card response here.',
      csv: null,
    };
  }
  if (message.responseType === 'catalog') {
    return shareContentFromCatalogEntry(getCatalogEntry(message.catalogId));
  }
  return SHARE_MAP[message.responseType] || null;
}

// Build a shareContent array from an attachment list and the current
// messages in a session. Preserves the order attachments were added in.
export function resolveAttachedShares(attachments, messages) {
  if (!attachments || attachments.length === 0) return [];
  return attachments
    .map((ref) => {
      const msg = messages.find((m) => m.id === ref.id);
      if (!msg) return null;
      return resolveShareFromMessage(msg);
    })
    .filter(Boolean);
}
