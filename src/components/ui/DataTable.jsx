import { useEffect, useRef, useState } from 'react';

// `getScrollParent` — walks up the DOM to find the nearest ancestor with
// a scrolling box. Sticky headers anchor to this element, so it's also
// the element we listen to for the "stuck" state transition.
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
  const theadRef = useRef(null);
  const sentinelRef = useRef(null);
  const [stuck, setStuck] = useState(false);

  // Detect when the thead has floated up to the top of its scroll
  // ancestor so we can toggle a `.is-stuck` class and apply the
  // full-border + subtle-shadow treatment only in that state.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;
    const root = getScrollParent(sentinel);
    if (!root) return undefined;
    const check = () => {
      const rRect = root.getBoundingClientRect();
      const sRect = sentinel.getBoundingClientRect();
      setStuck(sRect.top <= rRect.top);
    };
    check();
    root.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      root.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  const lastIdx = columns.length - 1;

  return (
    // The wrapper uses negative horizontal margins so the table (and
    // therefore the thead divider) extends to the card's edges instead
    // of stopping at the card's own 16 px padding. On mobile it also
    // flips into a horizontal-scroll container (thumb hidden) so wide
    // tables pan side-to-side without dragging the whole conversation.
    <div className={'cb-table-wrap' + (stuck ? ' is-stuck' : '')}>
      <div ref={sentinelRef} className="cb-table-sentinel" />
      <table className="cb-table tabular">
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
                  textAlign: col.align || 'left',
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
                  className={
                    'cb-td' +
                    (ci === 0 ? ' is-first' : '') +
                    (ci === lastIdx ? ' is-last' : '') +
                    (ri === rows.length - 1 ? ' is-lastrow' : '')
                  }
                  style={{
                    textAlign: col.align || 'left',
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
