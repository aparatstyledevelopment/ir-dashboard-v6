export default function DataTable({ columns, rows, maxHeight = 'calc(60vh / var(--cb-zoom, 1))' }) {
  return (
    // The table gets its OWN y-scroll box (not just overflow-x) so that
    // sticky <th> cells have a proper scroll ancestor. Previously the
    // wrapper had only `overflow-x: auto`; the spec forced overflow-y
    // to `auto` as well, which meant sticky tried to anchor to a box
    // that never actually y-scrolled — so the header either stayed put
    // with the rows or bubbled up to the conversation scroll and ended
    // up behind the top bar. A capped max-height here keeps long
    // tables self-contained so the column header slides against the
    // visible top of the table as the user scrolls the rows.
    <div
      className="w-full"
      style={{
        overflow: 'auto',
        maxHeight,
        position: 'relative',
      }}
    >
      <table
        className="w-full tabular"
        style={{
          borderCollapse: 'collapse',
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
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{
                  textAlign: col.align || 'left',
                  fontWeight: 500,
                  color: 'var(--text-tertiary)',
                  fontSize: '11px',
                  padding: '8px 10px',
                  // Keep column names visible while the user scrolls
                  // through a long table. Sticks to the top of the
                  // nearest scrolling ancestor (conversation body,
                  // artifacts pane body, source-data inner, …). A
                  // solid background + box-shadow divider stops rows
                  // from bleeding through under the header.
                  position: 'sticky',
                  top: 0,
                  zIndex: 2,
                  background: 'var(--bg)',
                  boxShadow: 'inset 0 -1px 0 var(--border)',
                  whiteSpace: 'nowrap',
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
                    padding: '9px 10px',
                    borderBottom: ri === rows.length - 1 ? 'none' : '1px solid var(--border)',
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
