import { Routes, Route } from 'react-router-dom';
import RootLayout from './app/layout.jsx';
import DashboardPage from './app/page.jsx';
import ShareholdersPage from './app/shareholders/page.jsx';
import OwnersListPage from './app/shareholders/owners/page.jsx';
import DailyTransactionsListPage from './app/shareholders/daily-transactions/page.jsx';
import OwnerChangesListPage from './app/shareholders/owner-changes/page.jsx';
import LockupsListPage from './app/shareholders/lockups/page.jsx';
import TargetingPage from './app/targeting/page.jsx';
import ScreenerListPage from './app/targeting/screener/page.jsx';
import CompareOwnersListPage from './app/targeting/compare-owners/page.jsx';
import PeopleListPage from './app/crm/people/page.jsx';
import ModulePage from './app/[module]/page.jsx';
import InvestorDetailPage from './app/investor/[slug]/page.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<DashboardPage />} />

        <Route path="shareholders" element={<ShareholdersPage />} />
        <Route path="shareholders/owners" element={<OwnersListPage />} />
        <Route
          path="shareholders/daily-transactions"
          element={<DailyTransactionsListPage />}
        />
        <Route
          path="shareholders/owner-changes"
          element={<OwnerChangesListPage />}
        />
        <Route path="shareholders/lockups" element={<LockupsListPage />} />

        <Route path="targeting" element={<TargetingPage />} />
        <Route path="targeting/screener" element={<ScreenerListPage />} />
        <Route
          path="targeting/compare-owners"
          element={<CompareOwnersListPage />}
        />

        <Route path="crm/people" element={<PeopleListPage />} />

        <Route path="investor/:slug" element={<InvestorDetailPage />} />
        <Route path=":module" element={<ModulePage />} />
      </Route>
    </Routes>
  );
}
