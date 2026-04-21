import ListScreen from '../../screen/ListScreen';
import { PEER_OVERLAP } from '../../../data/targets';

const cellBase = {
  padding: '9px 10px',
  borderBottom: '1px solid var(--border)',
  fontSize: '12px',
  letterSpacing: '-0.01em',
  textAlign: 'center',
};

export default function CompareOwnersView() {
  return (
    <ListScreen
      inArtifact
      title="Compare owners"
      subtitle="Peer overlap matrix — which funds own which peers, including INTEG B. ✓ marks ownership."
      searchFields={[]}
    >
      <div
        style={{
          marginTop: '14px',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          overflowX: 'auto',
        }}
      >
        <table
          className="tabular"
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
            letterSpacing: '-0.01em',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  ...cellBase,
                  textAlign: 'left',
                  color: 'var(--text-tertiary)',
                  fontWeight: 500,
                  fontSize: '11px',
                  padding: '10px 14px',
                }}
              >
                Fund
              </th>
              {PEER_OVERLAP.peers.map((p) => (
                <th
                  key={p}
                  style={{
                    ...cellBase,
                    color:
                      p === 'INTEG B' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    fontWeight: p === 'INTEG B' ? 600 : 500,
                    fontSize: '11px',
                    padding: '10px 14px',
                  }}
                >
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PEER_OVERLAP.funds.map((f, ri) => (
              <tr key={ri}>
                <td
                  style={{
                    ...cellBase,
                    textAlign: 'left',
                    fontWeight: 500,
                    padding: '11px 14px',
                    borderBottom:
                      ri === PEER_OVERLAP.funds.length - 1 ? 'none' : '1px solid var(--border)',
                  }}
                >
                  {f.name}
                </td>
                {f.holds.map((h, ci) => (
                  <td
                    key={ci}
                    style={{
                      ...cellBase,
                      color: h ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      fontWeight: h ? 600 : 400,
                      padding: '11px 14px',
                      borderBottom:
                        ri === PEER_OVERLAP.funds.length - 1
                          ? 'none'
                          : '1px solid var(--border)',
                    }}
                  >
                    {h ? '✓' : '·'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p
        style={{
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          marginTop: '12px',
          letterSpacing: '-0.01em',
        }}
      >
        Rows are institutional holders · columns are the 5 closest medtech peers including
        us · the 4 non-INTEG-B columns surface "peer gap" candidates we don't yet hold.
      </p>
    </ListScreen>
  );
}
