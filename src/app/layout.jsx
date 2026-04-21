import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import MobileDrawer from '../components/layout/MobileDrawer';
import ArtifactsPane from '../components/layout/ArtifactsPane';
import SettingsPage from '../components/pages/SettingsPage';
import ProfilePage from '../components/pages/ProfilePage';
import NotificationsPage from '../components/pages/NotificationsPage';
import Toast from '../components/ui/Toast';
import { useConversations } from '../hooks/useConversations';
import { useArtifacts, ArtifactsProvider } from '../hooks/useArtifacts';

export default function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [page, setPage] = useState(null);
  const conversations = useConversations();
  const artifacts = useArtifacts();

  const showToast = (msg) => setToast(msg);

  const switchModule = (moduleId) => {
    setPage(null);
    setActiveModule(moduleId);
    conversations.goToStaging(moduleId);
  };

  const goBack = () => setPage(null);

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
          onOpenSettings={() => setPage('settings')}
          onOpenProfile={() => setPage('profile')}
        />
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          conversations={conversations}
          activeModule={activeModule}
          onSwitchModule={switchModule}
          onOpenSettings={() => { setPage('settings'); setDrawerOpen(false); }}
          onOpenProfile={() => { setPage('profile'); setDrawerOpen(false); }}
        />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <TopBar
            onOpenDrawer={() => setDrawerOpen(true)}
            onOpenNotifications={() => setPage('notifications')}
            onSearch={(q) => showToast(`Search: "${q}" — full search coming soon.`)}
          />
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            {page === 'settings' ? (
              <SettingsPage onBack={goBack} />
            ) : page === 'profile' ? (
              <ProfilePage onBack={goBack} />
            ) : page === 'notifications' ? (
              <NotificationsPage onBack={goBack} />
            ) : (
              <Outlet
                context={{
                  showToast,
                  conversations,
                  artifacts,
                  activeModule,
                  switchModule,
                }}
              />
            )}
            {!page && <ArtifactsPane artifacts={artifacts} />}
          </div>
        </div>

        <Toast message={toast} onDismiss={() => setToast(null)} />
      </div>
    </ArtifactsProvider>
  );
}
