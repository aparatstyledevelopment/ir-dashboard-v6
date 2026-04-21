import { Routes, Route } from 'react-router-dom';
import RootLayout from './app/layout.jsx';
import DashboardPage from './app/page.jsx';
import ShareholdersPage from './app/shareholders/page.jsx';
import TargetingPage from './app/targeting/page.jsx';
import ModulePage from './app/[module]/page.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="shareholders" element={<ShareholdersPage />} />
        <Route path="targeting" element={<TargetingPage />} />
        <Route path=":module" element={<ModulePage />} />
      </Route>
    </Routes>
  );
}
