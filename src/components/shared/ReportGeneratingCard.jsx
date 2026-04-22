import { getReport } from '../../data/reports';

export default function ReportGeneratingCard({ reportId }) {
  const report = getReport(reportId);
  const subject = report?.subject || 'your briefing';

  return (
    <article className="fade-in-up cb-report-generating">
      <span>
        Generating your report about <strong>{subject}</strong> — compiling
        narrative, charts and supporting tables.
      </span>
    </article>
  );
}
