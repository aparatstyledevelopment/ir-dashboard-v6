import { FileText, ExternalLink } from 'lucide-react';
import { getReport } from '../../data/reports';
import { useArtifactsContext } from '../../hooks/useArtifacts';

export default function ReportReadyCard({ reportId }) {
  const report = getReport(reportId);
  const artifacts = useArtifactsContext();

  if (!report) return null;

  const handleOpen = () => {
    artifacts.openArtifact({ type: 'report', payload: { reportId } });
  };

  return (
    <article className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p
        style={{
          margin: 0,
          fontSize: '13px',
          color: 'var(--text-secondary)',
          letterSpacing: '-0.01em',
          lineHeight: 1.6,
        }}
      >
        Your report is generated. Open the document below to read the full
        narrative and supporting charts.
      </p>
      <button
        type="button"
        className="cb-report-tile"
        onClick={handleOpen}
      >
        <span className="cb-report-tile-icon">
          <FileText size={18} strokeWidth={1.75} />
        </span>
        <span className="cb-report-tile-body">
          <span className="cb-report-tile-title">{report.title}</span>
          <span className="cb-report-tile-sub">
            Report · {report.sections} sections · {report.charts} charts · {report.readTime}
          </span>
        </span>
        <span className="cb-report-tile-cta">
          <ExternalLink size={12} strokeWidth={2} />
          Open report
        </span>
      </button>
    </article>
  );
}
