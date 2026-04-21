import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import MobileDrawer from '../components/layout/MobileDrawer';
import ArtifactsPane from '../components/layout/ArtifactsPane';
import Toast from '../components/ui/Toast';
import { useConversations } from '../hooks/useConversations';
import { useArtifacts, ArtifactsProvider } from '../hooks/useArtifacts';

export default function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const conversations = useConversations();
  const artifacts = useArtifacts();

  const showToast = (msg) => setToast(msg);

  return (
    <ArtifactsProvider value={artifacts}>
      <div
        style={{
          display: 'flex',
          height: '100dvh',
          background: 'var(--bg)',
        }}
      >
        <Sidebar conversations={conversations} />
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          conversations={conversations}
        />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <TopBar onOpenDrawer={() => setDrawerOpen(true)} />
          <Outlet context={{ showToast, conversations, artifacts }} />
        </div>

        <ArtifactsPane artifacts={artifacts} />

        <Toast message={toast} onDismiss={() => setToast(null)} />
      </div>
    </ArtifactsProvider>
  );
}
