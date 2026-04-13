import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import MobileDrawer from '../components/layout/MobileDrawer';
import Toast from '../components/ui/Toast';

export default function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => setToast(msg);

  return (
    <div
      style={{
        display: 'flex',
        height: '100dvh',
        background: 'var(--bg)',
      }}
    >
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <TopBar onOpenDrawer={() => setDrawerOpen(true)} />
        <Outlet context={{ showToast }} />
      </div>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
