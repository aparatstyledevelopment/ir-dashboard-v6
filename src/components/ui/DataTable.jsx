import { useEffect, useRef, useState } from 'react';

// `getScrollParent` — walks up the DOM to find the nearest ancestor with
// a scrolling box. Used both to attach the scroll listener and to
// compute where the faux-sticky header should pin to.
function getScrollParent(el) {
  let p = el?.parentElement;
  while (p) {
    const cs = getComputedStyle(p);
    const ov = `${cs.overflow}${cs.overflowX}${cs.overflowY}`;
    if (/(auto|scroll)/.test(ov)) return p;
    p = p.parentElement;
  }
  return null;
}

export default function DataTable({ columns, rows }) {
  const wrapRef = useRef(null);
  const tableRef = useRef(null);
  const theadRef = useRef(null);
  // Column widths are read off the real <th> cells so the floating
  // header can mirror the actual table layout.
  const [colWidths, setColWidths] = useState([]);
  // When truthy, render the floating fixed-position header clone.
  const [stickyRect, setStickyRect] = useState(null);

  // Track the real thead's column widths so the clone can match them.
  useEffect(() => {
    const thead = theadRef.current;
    if (!thead || typeof ResizeObserver === 'undefined') return undefined;
    const measure = () => {
      const cells = thead.querySelectorAll('th');
      setColWidths(
        Array.from(cells).map((c) => c.getBoundingClientRect().width)
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(thead);
    return () => ro.disconnect();
  }, []);

  // The actual "stick" logic. CSS `position: sticky` is quirky inside
  // tables (Chromium ignores it when the border model is collapsed
  // and can anchor to the wrong ancestor when CSS zoom is in play).
  // Rather than fight those quirks we render a separate <div> clone
  // of the header and position it with `position: fixed` at the top
  // of the scroll container whenever the real thead has scrolled
  // above that line.
  useEffect(() => {
    const table = tableRef.current;
    const thead = theadRef.current;
    if (!table || !thead) return undefined;
    const scrollParent = getScrollParent(table);
    if (!scrollParent) return undefined;

    const update = () => {
      const theadRect = thead.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();
      const spRect = scrollParent.getBoundingClientRect();
      const headerH = theadRect.height;
      // Show the clone when: real thead has scrolled above the scroll
      // container's top, AND the table's bottom is still below that
      // line (so there are rows to read under the sticky header).
      if (theadRect.top < spRect.top && tableRect.bottom > spRect.top + headerH) {
        setStickyRect({
          top: spRect.top,
          left: tableRect.left,
          width: tableRect.width,
        });
      } else {
        setStickyRect(null);
      }
    };

    update();
    scrollParent.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      scrollParent.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, []);

  const lastIdx = columns.length - 1;
  const stuck = !!stickyRect;

  const headerCellStyle = (col, i) => ({
    textAlign: col.align || 'left',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    fontSize: '11px',
    padding:
      i === 0
        ? '8px 10px 8px 16px'
        : i === lastIdx
        ? '8px 16px 8px 10px'
        : '8px 10px',
    background: 'var(--bg)',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    letterSpacing: '-0.01em',
  });

  return (
    <div ref={wrapRef} className="cb-table-wrap">
      {stuck && (
        <div
          className="cb-sticky-thead is-stuck"
          style={{
            position: 'fixed',
            top: `${stickyRect.top}px`,
            left: `${stickyRect.left}px`,
            width: `${stickyRect.width}px`,
            display: 'flex',
            zIndex: 10,
            background: 'var(--bg)',
            // All-around border + subtle shadow in stuck state. Only
            // top and bottom lines span edge-to-edge because the
            // wrapper runs flush with the card walls.
            boxShadow:
              'inset 0 1px 0 var(--border), inset 0 -1px 0 var(--border), 0 2px 6px rgba(0, 0, 0, 0.04)',
            pointerEvents: 'none',
          }}
        >
          {columns.map((col, i) => (
            <div
              key={i}
              style={{
                ...headerCellStyle(col, i),
                width: colWidths[i] ? `${colWidths[i]}px` : undefined,
                flexShrink: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {col.header}
            </div>
          ))}
        </div>
      )}
      <table
        ref={tableRef}
        className="cb-table tabular"
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          fontSize: '12px',
          letterSpacing: '-0.01em',
          tableLayout: 'auto',
        }}
      >
        <colgroup>
          {columns.map((col, i) => (
            <col key={i} style={col.width ? { width: col.width } : undefined} />
          ))}
        </colgroup>
        <thead ref={theadRef}>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={
                  'cb-th' +
                  (i === 0 ? ' is-first' : '') +
                  (i === lastIdx ? ' is-last' : '')
                }
                style={{
                  ...headerCellStyle(col, i),
                  width: col.width,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {columns.map((col, ci) => (
                <td
                  key={ci}
                  style={{
                    textAlign: col.align || 'left',
                    padding:
                      ci === 0
                        ? '9px 10px 9px 16px'
                        : ci === lastIdx
                        ? '9px 16px 9px 10px'
                        : '9px 10px',
                    borderBottom:
                      ri === rows.length - 1 ? 'none' : '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontWeight: col.weight || 400,
                    whiteSpace: col.nowrap ? 'nowrap' : 'normal',
                  }}
                >
                  {col.render ? col.render(row, ri) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
