import InvestorDetailView from './views/InvestorDetailView';
import ShareholderRegisterView from './views/ShareholderRegisterView';
import DailyTransactionsView from './views/DailyTransactionsView';
import OwnerChangesView from './views/OwnerChangesView';
import LockupsView from './views/LockupsView';
import ScreenerView from './views/ScreenerView';
import CompareOwnersView from './views/CompareOwnersView';
import ContactsView from './views/ContactsView';
import CardEvidenceView from './views/CardEvidenceView';
import ReportView from './views/ReportView';

const SCREEN_VIEWS = {
  'shareholders-owners': ShareholderRegisterView,
  'shareholders-daily-transactions': DailyTransactionsView,
  'shareholders-owner-changes': OwnerChangesView,
  'shareholders-lockups': LockupsView,
  'targeting-screener': ScreenerView,
  'targeting-compare-owners': CompareOwnersView,
  'crm-people': ContactsView,
};

export default function ArtifactView({ item }) {
  if (!item) return null;
  const { type, payload } = item;

  if (type === 'screen') {
    const View = SCREEN_VIEWS[payload?.screen];
    if (!View) {
      return (
        <div className="cb-screen-inner cb-screen-inner--pane">
          <div className="cb-screen-empty">Unknown screen: {String(payload?.screen)}</div>
        </div>
      );
    }
    return <View />;
  }

  if (type === 'investor') {
    return <InvestorDetailView slug={payload?.slug} />;
  }

  if (type === 'evidence') {
    return (
      <CardEvidenceView
        message={payload?.message}
        sourceModule={payload?.sourceModule}
      />
    );
  }

  if (type === 'report') {
    return <ReportView reportId={payload?.reportId} />;
  }

  return null;
}
