// Tiny SQL-ish syntax highlighter. Not a real parser — just a tokenizer
// good enough for the evidence-view display queries we render.
//
// Tokens in priority order:
//   - line/block comments
//   - single- or double-quoted strings
//   - numbers (ints, decimals)
//   - keywords (SELECT, FROM, WHERE, …)
//   - function-call names (identifier followed by '(')
//   - operators / punctuation
//   - identifiers (everything else that isn't whitespace)

const KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL',
  'AS', 'ON', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL',
  'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL',
  'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'BETWEEN', 'LIKE',
  'ILIKE', 'EXISTS', 'WITH', 'VALUES', 'INSERT', 'INTO', 'UPDATE',
  'SET', 'DELETE', 'CREATE', 'TABLE', 'INDEX', 'VIEW', 'DESC', 'ASC',
  'TRUE', 'FALSE', 'INTERVAL', 'CAST', 'OVER', 'PARTITION',
]);

function tokenize(sql) {
  const out = [];
  let i = 0;
  const n = sql.length;
  while (i < n) {
    const ch = sql[i];

    // Whitespace — preserve as-is in a neutral token.
    if (/\s/.test(ch)) {
      let j = i + 1;
      while (j < n && /\s/.test(sql[j])) j++;
      out.push({ kind: 'ws', text: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Line comment -- to end of line.
    if (ch === '-' && sql[i + 1] === '-') {
      let j = i + 2;
      while (j < n && sql[j] !== '\n') j++;
      out.push({ kind: 'comment', text: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Block comment /* ... */.
    if (ch === '/' && sql[i + 1] === '*') {
      let j = i + 2;
      while (j < n - 1 && !(sql[j] === '*' && sql[j + 1] === '/')) j++;
      j = Math.min(n, j + 2);
      out.push({ kind: 'comment', text: sql.slice(i, j) });
      i = j;
      continue;
    }

    // String literals — single quote, double quote, backtick.
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch;
      let j = i + 1;
      while (j < n) {
        if (sql[j] === '\\') { j += 2; continue; }
        if (sql[j] === quote) { j++; break; }
        j++;
      }
      out.push({ kind: 'string', text: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Number.
    if (/[0-9]/.test(ch)) {
      let j = i + 1;
      while (j < n && /[0-9.]/.test(sql[j])) j++;
      out.push({ kind: 'number', text: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Identifier / keyword.
    if (/[A-Za-z_]/.test(ch)) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_]/.test(sql[j])) j++;
      const word = sql.slice(i, j);
      if (KEYWORDS.has(word.toUpperCase())) {
        out.push({ kind: 'keyword', text: word });
      } else if (sql[j] === '(') {
        out.push({ kind: 'func', text: word });
      } else {
        out.push({ kind: 'ident', text: word });
      }
      i = j;
      continue;
    }

    // Operator / punctuation — grab runs of symbol characters.
    if (/[,;()[\]{}.]/.test(ch)) {
      out.push({ kind: 'punct', text: ch });
      i += 1;
      continue;
    }
    if (/[=<>!+\-*/%|&]/.test(ch)) {
      let j = i + 1;
      while (j < n && /[=<>!+\-*/%|&]/.test(sql[j])) j++;
      out.push({ kind: 'op', text: sql.slice(i, j) });
      i = j;
      continue;
    }

    // Anything else — one char, untyped.
    out.push({ kind: 'ident', text: ch });
    i += 1;
  }
  return out;
}

export default function SqlCode({ code, className = '' }) {
  const tokens = tokenize(code || '');
  return (
    <pre className={`cb-sql-code ${className}`.trim()}>
      {tokens.map((t, i) =>
        t.kind === 'ws' ? (
          t.text
        ) : (
          <span key={i} className={`cb-sql-${t.kind}`}>{t.text}</span>
        )
      )}
    </pre>
  );
}
