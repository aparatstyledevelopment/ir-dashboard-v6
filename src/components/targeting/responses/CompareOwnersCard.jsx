import ResponseCard from '../../dashboard/responses/ResponseCard';
import { PEER_OVERLAP } from '../../../data/targets';

export default function CompareOwnersCard({
  onFollowUp,
  onSourceOpen,
  onShowToast,
  isChipSpent,
  onAttach,
  isAttached,
}) {
  return (
    <ResponseCard
      title="Compare Owners — INTEG B vs 4 Peers"
      followUps={[
        { id: 'l2.tgt.cmp.overlap', label: 'Show overlap percentage' },
        { id: 'l2.tgt.cmp.unique', label: 'Unique to INTEG B' },
        { id: 'l2.tgt.cmp.gap', label: 'Shared by 3+ peers, not us' },
      ]}
      expansionChips={[
        [
          { id: 'exp.tgt.cmp.dna', label: 'Map holder DNA per peer' },
          { id: 'exp.tgt.cmp.churn', label: 'Detect peer-level churn' },
          { id: 'exp.tgt.cmp.cluster', label: 'Cluster by investor archetype' },
        ],
        [
          { id: 'exp.tgt.cmp.leader', label: 'Identify lead buyer per cluster' },
          { id: 'exp.tgt.cmp.story', label: "Generate 'why us vs peers' story" },
          { id: 'exp.tgt.cmp.forecast', label: 'Forecast peer-flow spillover' },
        ],
      ]}
      expandedToast="You've seen the AI suggestions for owner comparison — full peer DNA engine ships with production."
      mockToast="In production, this would join each peer's live register with ours for dynamic diffing."
      sourceModule="Targeting → Compare Owners"
      onFollowUp={onFollowUp}
      onSourceOpen={onSourceOpen}
      onShowToast={onShowToast}
      isChipSpent={isChipSpent}
      onAttach={onAttach}
      isAttached={isAttached}
    >
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          margin: '0 0 14px',
          letterSpacing: '-0.01em',
        }}
      >
        Overlap matrix across INTEG B and our 4 closest peers. Rows are shared
        institutional holders; ✓ marks ownership.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table
          className="tabular"
          style={{
            borderCollapse: 'collapse',
            fontSize: '12px',
            letterSpacing: '-0.01em',
            minWidth: '100%',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  fontWeight: 500,
                  color: 'var(--text-tertiary)',
                  fontSize: '11px',
                  padding: '8px 10px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                Fund
              </th>
              {PEER_OVERLAP.peers.map((p) => (
                <th
                  key={p}
                  style={{
                    textAlign: 'center',
                    fontWeight: p === 'INTEG B' ? 600 : 500,
                    color:
                      p === 'INTEG B'
                        ? 'var(--text-primary)'
                        : 'var(--text-tertiary)',
                    fontSize: '11px',
                    padding: '8px 10px',
                    borderBottom: '1px solid var(--border)',
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
                    padding: '9px 10px',
                    borderBottom:
                      ri === PEER_OVERLAP.funds.length - 1
                        ? 'none'
                        : '1px solid var(--border)',
                  }}
                >
                  {f.name}
                </td>
                {f.holds.map((h, ci) => (
                  <td
                    key={ci}
                    style={{
                      textAlign: 'center',
                      padding: '9px 10px',
                      borderBottom:
                        ri === PEER_OVERLAP.funds.length - 1
                          ? 'none'
                          : '1px solid var(--border)',
                      color: h
                        ? 'var(--text-primary)'
                        : 'var(--text-tertiary)',
                      fontWeight: h ? 600 : 400,
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
    </ResponseCard>
  );
}
