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
  const [activeModule, setActiveModule] = useState('dashboard');
  const conversations = useConversations();
  const artifacts = useArtifacts();

  const showToast = (msg) => setToast(msg);

  const switchModule = (moduleId) => {
    setActiveModule(moduleId);
    conversations.goToStaging(moduleId);
  };

  return (
    <ArtifactsProvider value={artifacts}>
      <div
        style={{
          display: 'flex',
          height: '100dvh',
          background: 'var(--bg)',
        }}
      >
        <Sidebar
          conversations={conversations}
          activeModule={activeModule}
          onSwitchModule={switchModule}
        />
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          conversations={conversations}
          activeModule={activeModule}
          onSwitchModule={switchModule}
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
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            <Outlet
              context={{
                showToast,
                conversations,
                artifacts,
                activeModule,
                switchModule,
              }}
            />
            <ArtifactsPane artifacts={artifacts} />
          </div>
        </div>

        <Toast message={toast} onDismiss={() => setToast(null)} />
      </div>
    </ArtifactsProvider>
  );
}
