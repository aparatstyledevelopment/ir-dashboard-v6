import { Routes, Route } from 'react-router-dom';
import RootLayout from './app/layout.jsx';
import DashboardPage from './app/page.jsx';
import ModulePage from './app/[module]/page.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path=":module" element={<ModulePage />} />
      </Route>
    </Routes>
  );
}
