// Client-side "PDF" generator via window.print().
// We don't use a PDF library — instead we write a print-styled HTML
// document into a hidden off-screen iframe and call
// iframe.contentWindow.print(). The browser's native print-to-PDF
// produces a clean vector PDF the user can save anywhere.
//
// Why iframe vs window.open?
// - window.open('') with `noopener` returns null, so document.write
//   never happens.
// - Without `noopener`, the opened window navigates to about:blank
//   which in dark-mode OS renders as a black page before the content
//   is written, producing a flash of black.
// - Popup blockers are frequently triggered for window.open('').
// A hidden iframe sidesteps all three.

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
  html, body {
    background: #ffffff !important;
    color: #111111 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color-scheme: light;
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      sans-serif;
    line-height: 1.55;
    letter-spacing: -0.01em;
    margin: 0;
    padding: 0;
    font-size: 12px;
  }
  .doc {
    max-width: 720px;
    margin: 0 auto;
    background: #ffffff;
    color: #111111;
  }
  h1.doc-title {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin: 0 0 4px;
    color: #111111;
  }
  .doc-subtitle {
    font-size: 11px;
    color: #888888;
    margin: 0 0 24px;
  }
  section.card {
    page-break-inside: avoid;
    border-top: 1px solid #e5e5e5;
    padding: 18px 0 12px;
  }
  section.card:first-of-type {
    border-top: none;
    padding-top: 6px;
  }
  section.card h2 {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin: 0 0 6px;
    color: #111111;
  }
  section.card .source {
    font-size: 10px;
    color: #888888;
    margin: 0 0 10px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  section.card p {
    font-size: 12px;
    color: #333333;
    margin: 6px 0 10px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 10.5px;
    margin: 6px 0 4px;
    font-variant-numeric: tabular-nums;
    color: #111111;
  }
  th,
  td {
    padding: 6px 8px;
    text-align: left;
    border-bottom: 1px solid #e5e5e5;
    vertical-align: top;
    color: #111111;
    background: #ffffff;
  }
  th {
    font-weight: 600;
    color: #666666;
    font-size: 9.5px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    border-bottom-color: #111111;
  }
  .doc-footer {
    margin-top: 32px;
    padding-top: 12px;
    border-top: 1px solid #e5e5e5;
    font-size: 10px;
    color: #888888;
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

function buildHtmlDocument(bodyHtml, title) {
  return `<!DOCTYPE html>
<html lang="en" style="background:#fff;color:#111;color-scheme:light"><head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="color-scheme" content="light" />
  <style>${PRINT_STYLES}</style>
</head><body style="background:#fff;color:#111">
<div class="doc">
  ${bodyHtml}
</div>
</body></html>`;
}

// Render a print-ready document in a hidden iframe and trigger
// iframe.contentWindow.print(). Returns true on success.
function renderAndPrint(bodyHtml, title) {
  if (typeof document === 'undefined') return false;
  try {
    // Clean up any previous PDF iframe.
    const prior = document.getElementById('cb-pdf-iframe');
    if (prior && prior.parentNode) prior.parentNode.removeChild(prior);

    const iframe = document.createElement('iframe');
    iframe.id = 'cb-pdf-iframe';
    // Give the iframe real dimensions (A4) so the browser actually
    // lays out the content, but position it off-screen.
    iframe.style.position = 'fixed';
    iframe.style.right = '-10000px';
    iframe.style.top = '0';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    iframe.style.border = 'none';
    iframe.style.background = '#ffffff';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.setAttribute('title', title);

    document.body.appendChild(iframe);

    const html = buildHtmlDocument(bodyHtml, title);
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      iframe.remove();
      return false;
    }
    doc.open();
    doc.write(html);
    doc.close();

    const triggerPrint = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        // Swallow — the caller already showed a toast.
        // eslint-disable-next-line no-console
        console.error('Command Bar: PDF print failed', err);
      }
      // Remove iframe a few seconds after print dialog closes. There's
      // no reliable cross-browser event for that, so use a generous
      // timeout.
      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 4000);
    };

    // Wait for the iframe's document to finish loading (fonts, images),
    // then trigger print. Fallback to a timed trigger.
    let triggered = false;
    const fire = () => {
      if (triggered) return;
      triggered = true;
      triggerPrint();
    };
    if (doc.readyState === 'complete') {
      setTimeout(fire, 150);
    } else {
      iframe.addEventListener('load', () => setTimeout(fire, 150));
      // Safety net in case the load event never fires (e.g. srcdoc
      // quirks on some browsers).
      setTimeout(fire, 1200);
    }

    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Command Bar: openPrintWindow threw', err);
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
    <p class="doc-subtitle">Integrum AB · INTEG B · Exported ${escapeHtml(now)}</p>
    ${cardHtml(share)}
    <div class="doc-footer">
      Generated from Command Bar (Monitor) · Integrum AB (INTEG B) ·
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
    <p class="doc-subtitle">Integrum AB · INTEG B · ${shares.length} cards · ${escapeHtml(
    now
  )}</p>
    ${sections}
    <div class="doc-footer">
      Generated from Command Bar (Monitor) · Integrum AB (INTEG B) ·
      Nasdaq First North Stockholm
    </div>
  `;
  return renderAndPrint(body, reportTitle);
}
