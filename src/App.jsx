import { Routes, Route } from 'react-router-dom';
import RootLayout from './app/layout.jsx';
import ModuleRouter from './app/ModuleRouter.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="*" element={<ModuleRouter />} />
      </Route>
    </Routes>
  );
}
