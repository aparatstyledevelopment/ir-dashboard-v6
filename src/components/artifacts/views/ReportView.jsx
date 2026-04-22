import DashboardReport from './reports/DashboardReport';
import ShareholdersReport from './reports/ShareholdersReport';
import TargetingReport from './reports/TargetingReport';

const REPORTS = {
  dashboard: DashboardReport,
  shareholders: ShareholdersReport,
  targeting: TargetingReport,
};

export default function ReportView({ reportId }) {
  const Component = REPORTS[reportId];
  if (!Component) {
    return (
      <div className="cb-screen-inner cb-screen-inner--pane">
        <div className="cb-screen-empty">Unknown report: {String(reportId)}</div>
      </div>
    );
  }
  return (
    <div className="cb-screen-inner cb-screen-inner--pane">
      <Component />
    </div>
  );
}
