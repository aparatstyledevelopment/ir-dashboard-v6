export default function DataTable({ columns, rows }) {
  return (
    <div className="w-full overflow-x-auto">
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
