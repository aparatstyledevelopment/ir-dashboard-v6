// Client-side "PDF" generator via window.print().
//
// Approach: inject a hidden print-only container into the current
// document, switch to it via @media print CSS that hides the rest of
// the page, and call window.print() on the host window. The browser's
// native print-to-PDF then renders just the print container.
//
// Why this and not iframe / window.open?
// - window.open('') returns null with `noopener` and shows about:blank
//   (which on dark-mode OS renders black before the write happens).
// - iframe.contentWindow.print() is unreliable across browsers — some
//   silently print the parent window, others skip offscreen iframes.
// - Inline-with-@media-print is the canonical approach and works
//   everywhere consistently.

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function csvToRows(csv) {
  if (!csv) return [];
  const lines = [];
  let row = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (inQ) {
      if (c === '"') {
        if (csv[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          inQ = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQ = true;
    } else if (c === ',') {
      row.push(cur);
      cur = '';
    } else if (c === '\n') {
      row.push(cur);
      lines.push(row);
      row = [];
      cur = '';
    } else if (c === '\r') {
      // ignore
    } else {
      cur += c;
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    lines.push(row);
  }
  return lines;
}

function csvToHtmlTable(csv) {
  const rows = csvToRows(csv);
  if (rows.length === 0) return '';
  const [head, ...body] = rows;
  const headHtml = head.map((c) => `<th>${escapeHtml(c)}</th>`).join('');
  const bodyHtml = body
    .map(
      (r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`
    )
    .join('');
  return `<table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
}

const PRINT_STYLES = `
  @page {
    size: A4;
    margin: 22mm 18mm;
  }

  @media print {
    /* Hide everything in the host app while printing. */
    html, body {
      background: #ffffff !important;
      color: #111111 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-scheme: light !important;
    }
    body > *:not(#cb-print-root) {
      display: none !important;
    }
    #cb-print-root {
      display: block !important;
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      right: 0 !important;
      width: 100% !important;
      max-width: none !important;
      background: #ffffff !important;
      color: #111111 !important;
      z-index: 999999 !important;
      box-sizing: border-box;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 12px;
      line-height: 1.55;
      letter-spacing: -0.01em;
    }
    #cb-print-root * {
      box-sizing: border-box;
      visibility: visible !important;
    }
    #cb-print-root .cb-print-doc {
      max-width: 720px;
      margin: 0 auto;
      background: #ffffff;
      color: #111111;
    }
    #cb-print-root h1.doc-title {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin: 0 0 4px;
      color: #111111;
    }
    #cb-print-root .doc-subtitle {
      font-size: 11px;
      color: #888888;
      margin: 0 0 24px;
    }
    #cb-print-root section.card {
      page-break-inside: avoid;
      border-top: 1px solid #e5e5e5;
      padding: 18px 0 12px;
    }
    #cb-print-root section.card:first-of-type {
      border-top: none;
      padding-top: 6px;
    }
    #cb-print-root section.card h2 {
      font-size: 15px;
      font-weight: 600;
      letter-spacing: -0.01em;
      margin: 0 0 6px;
      color: #111111;
    }
    #cb-print-root section.card .source {
      font-size: 10px;
      color: #888888;
      margin: 0 0 10px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    #cb-print-root section.card p {
      font-size: 12px;
      color: #333333;
      margin: 6px 0 10px;
    }
    #cb-print-root table {
      border-collapse: collapse;
      width: 100%;
      font-size: 10.5px;
      margin: 6px 0 4px;
      font-variant-numeric: tabular-nums;
      color: #111111;
    }
    #cb-print-root th,
    #cb-print-root td {
      padding: 6px 8px;
      text-align: left;
      border-bottom: 1px solid #e5e5e5;
      vertical-align: top;
      color: #111111;
      background: #ffffff;
    }
    #cb-print-root th {
      font-weight: 600;
      color: #666666;
      font-size: 9.5px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      border-bottom-color: #111111;
    }
    #cb-print-root .doc-footer {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid #e5e5e5;
      font-size: 10px;
      color: #888888;
    }
  }

  /* On-screen: keep the print root hidden so it doesn't interfere
   * with the live UI while it's mounted. */
  @media screen {
    #cb-print-root {
      position: fixed !important;
      left: -10000px !important;
      top: 0 !important;
      width: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  }
`;

function cardHtml(share, index = null) {
  if (!share) return '';
  const title = escapeHtml(share.title || 'Card');
  const text = share.text || '';
  const source = share.source || null;
  let paragraphs = text.split(/\n\s*\n/);
  if (paragraphs[0] && paragraphs[0].trim() === share.title) {
    paragraphs = paragraphs.slice(1);
  }
  const paraHtml = paragraphs
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
  const table = share.csv ? csvToHtmlTable(share.csv) : '';
  const indexBadge = index != null ? `${index + 1}. ` : '';
  return `
    <section class="card">
      <h2>${indexBadge}${title}</h2>
      ${source ? `<div class="source">${escapeHtml(source)}</div>` : ''}
      ${paraHtml}
      ${table}
    </section>
  `;
}

function ensurePrintStylesheet() {
  if (document.getElementById('cb-print-stylesheet')) return;
  const style = document.createElement('style');
  style.id = 'cb-print-stylesheet';
  style.textContent = PRINT_STYLES;
  document.head.appendChild(style);
}

function renderAndPrint(bodyHtml, title) {
  if (typeof document === 'undefined') return false;
  try {
    ensurePrintStylesheet();

    // Remove any prior print root.
    const prior = document.getElementById('cb-print-root');
    if (prior && prior.parentNode) prior.parentNode.removeChild(prior);

    // Build the print container right inside <body>.
    const root = document.createElement('div');
    root.id = 'cb-print-root';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = `<div class="cb-print-doc">${bodyHtml}</div>`;
    document.body.appendChild(root);

    // Set the document title so browsers default the PDF filename to it.
    const originalTitle = document.title;
    document.title = title || originalTitle;

    // Give the layout one tick to flush, then call print on the host
    // window. The @media print CSS hides everything except #cb-print-root.
    setTimeout(() => {
      try {
        window.focus();
        window.print();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Command Bar: window.print() failed', err);
      }
      // Restore title and remove the print root once the dialog closes.
      // There's no reliable cross-browser "print closed" event, so we
      // listen for `afterprint` and fall back to a timer.
      const cleanup = () => {
        document.title = originalTitle;
        if (root.parentNode) root.parentNode.removeChild(root);
        window.removeEventListener('afterprint', cleanup);
      };
      window.addEventListener('afterprint', cleanup);
      setTimeout(cleanup, 8000);
    }, 50);

    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Command Bar: renderAndPrint threw', err);
    return false;
  }
}

// Export a single card as a PDF (via browser print).
export function openCardPdf(share) {
  if (!share) return false;
  const now = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const body = `
    <h1 class="doc-title">${escapeHtml(share.title || 'Card export')}</h1>
    <p class="doc-subtitle">Example.com Inc. · EXMPL · Exported ${escapeHtml(now)}</p>
    ${cardHtml(share)}
    <div class="doc-footer">
      Generated from Command Bar (Monitor) · Example.com Inc. (EXMPL) ·
      Nasdaq First North Stockholm
    </div>
  `;
  return renderAndPrint(body, share.title || 'Card export');
}

// Export a multi-card report as a single PDF (via browser print).
export function openReportPdf(shares, reportTitle = 'IR Report') {
  if (!shares || shares.length === 0) return false;
  const now = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const sections = shares.map((s, i) => cardHtml(s, i)).join('');
  const body = `
    <h1 class="doc-title">${escapeHtml(reportTitle)}</h1>
    <p class="doc-subtitle">Example.com Inc. · EXMPL · ${shares.length} cards · ${escapeHtml(
    now
  )}</p>
    ${sections}
    <div class="doc-footer">
      Generated from Command Bar (Monitor) · Example.com Inc. (EXMPL) ·
      Nasdaq First North Stockholm
    </div>
  `;
  return renderAndPrint(body, reportTitle);
}
