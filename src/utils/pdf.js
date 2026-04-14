// Client-side "PDF" generator via window.print().
// We don't use a PDF library — instead we open a new window, write a
// print-styled HTML document into it, and call window.print(). The
// browser's native print-to-PDF produces a clean vector PDF the user
// can save anywhere.
//
// This approach keeps the bundle small (no jsPDF) and yields better
// typography than any library render.

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
  // Minimal CSV parser (handles quoted fields + embedded quotes).
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
  * { box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      sans-serif;
    color: #111;
    line-height: 1.55;
    letter-spacing: -0.01em;
    margin: 0;
    padding: 0;
    font-size: 12px;
  }
  .doc {
    max-width: 720px;
    margin: 0 auto;
  }
  h1.doc-title {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin: 0 0 4px;
  }
  .doc-subtitle {
    font-size: 11px;
    color: #888;
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
    color: #111;
  }
  section.card .source {
    font-size: 10px;
    color: #888;
    margin: 0 0 10px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  section.card p {
    font-size: 12px;
    color: #333;
    margin: 6px 0 10px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 10.5px;
    margin: 6px 0 4px;
    font-variant-numeric: tabular-nums;
  }
  th,
  td {
    padding: 6px 8px;
    text-align: left;
    border-bottom: 1px solid #e5e5e5;
    vertical-align: top;
  }
  th {
    font-weight: 600;
    color: #666;
    font-size: 9.5px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    border-bottom-color: #111;
  }
  .doc-footer {
    margin-top: 32px;
    padding-top: 12px;
    border-top: 1px solid #e5e5e5;
    font-size: 10px;
    color: #888;
  }
`;

function cardHtml(share, index = null) {
  if (!share) return '';
  const title = escapeHtml(share.title || 'Card');
  const text = share.text || '';
  const source = share.source || null;
  // Split text into paragraphs on double-newlines; if the text already
  // contains the title as its first line, drop it (we render it as h2).
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

function openPrintWindow(bodyHtml, title) {
  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) {
    return false;
  }
  win.document.open();
  win.document.write(`<!DOCTYPE html>
<html lang="en"><head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
  <style>${PRINT_STYLES}</style>
</head><body>
<div class="doc">
  ${bodyHtml}
</div>
<script>
  window.addEventListener('load', function () {
    setTimeout(function () { window.focus(); window.print(); }, 350);
  });
</script>
</body></html>`);
  win.document.close();
  return true;
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
  return openPrintWindow(body, share.title || 'Card export');
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
  return openPrintWindow(body, reportTitle);
}
