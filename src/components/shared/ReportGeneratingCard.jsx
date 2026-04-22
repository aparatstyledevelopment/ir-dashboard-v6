import { Loader2 } from 'lucide-react';
import { getReport } from '../../data/reports';

export default function ReportGeneratingCard({ reportId }) {
  const report = getReport(reportId);
  const subject = report?.subject || 'your briefing';

  return (
    <article className="fade-in-up cb-report-generating">
      <Loader2
        size={14}
        strokeWidth={2}
        className="cb-report-generating-spinner"
      />
      <span>
        Generating your report about <strong>{subject}</strong> — compiling
        narrative, charts and supporting tables.
      </span>
    </article>
  );
}
