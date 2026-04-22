import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import MobileDrawer from '../components/layout/MobileDrawer';
import ArtifactsPane from '../components/layout/ArtifactsPane';
import SettingsPage from '../components/pages/SettingsPage';
import ProfilePage from '../components/pages/ProfilePage';
import NotificationsPage from '../components/pages/NotificationsPage';
import QuickActionsPage from '../components/pages/QuickActionsPage';
import ArtifactView from '../components/artifacts/ArtifactView';
import Toast from '../components/ui/Toast';
import { useConversations } from '../hooks/useConversations';
import { useArtifacts, ArtifactsProvider } from '../hooks/useArtifacts';
import useHistoryBack from '../hooks/useHistoryBack';

// Full-screen page wrapper for quick-action items. Uses the same
// ArtifactView renderer as the artifacts pane, but takes over the
// whole main content area instead of sharing it as a side pane.
// `entryDepth` is the stack length BEFORE the QA flow started — back
// navigation should only pop inside the QA flow; reaching the entry
// depth exits the full-screen page entirely (and the remaining items,
// e.g. a report the user already had open, reappear in the side pane).
function QaScreenPage({ artifacts, entryDepth, onExit }) {
  const { item, stack } = artifacts.state;
  const canGoBackInsideQa = stack.length > entryDepth + 1;
  const handleBack = () => {
    if (canGoBackInsideQa) artifacts.closeArtifact();
    else onExit();
  };
  if (!item) {
    // Stack was emptied elsewhere — bail.
    onExit();
    return null;
  }
  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          className="cb-screen-back"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            margin: 0,
          }}
        >
          <ArrowLeft size={12} strokeWidth={2} />
          Back
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <ArtifactView item={item} />
      </div>
    </main>
  );
}

export default function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [page, setPage] = useState(null);
  const [qaEntryDepth, setQaEntryDepth] = useState(0);
  const conversations = useConversations();
  const artifacts = useArtifacts();

  const showToast = (msg) => setToast(msg);

  const switchModule = (moduleId) => {
    setPage(null);
    artifacts.closeAll();
    setActiveModule(moduleId);
    conversations.goToStaging(moduleId);
  };

  const goBack = () => setPage(null);

  // Exit the full-screen QA flow. Pop any artifacts pushed during the
  // flow (screen, investor detail, etc.) back down to the depth that
  // was present when the flow started — that way anything the user
  // had open before (e.g. a generated report) reappears in the side
  // pane beside the chat.
  const exitQaScreen = () => {
    artifacts.truncateStack(qaEntryDepth);
    setPage(null);
  };

  useHistoryBack(!!page, () => {
    if (page === 'qa-screen') exitQaScreen();
    else goBack();
  });

  const handleOpenQuickAction = (screen) => {
    // Capture the current stack depth BEFORE we push the QA item.
    // React batches state updates, but this read reflects the stack
    // as of the current render, which is what we want.
    setQaEntryDepth(artifacts.state.stack.length);
    artifacts.openArtifact({ type: 'screen', payload: { screen } });
    setPage('qa-screen');
  };

  return (
    <ArtifactsProvider value={artifacts}>
      <div className="cb-app-root">
        <Sidebar
          conversations={conversations}
          activeModule={activeModule}
          onSwitchModule={switchModule}
          onOpenSettings={() => setPage('settings')}
          onOpenProfile={() => setPage('profile')}
          onOpenQuickAction={handleOpenQuickAction}
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
          <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
            {page === 'settings' ? (
              <SettingsPage onBack={goBack} />
            ) : page === 'profile' ? (
              <ProfilePage onBack={goBack} />
            ) : page === 'notifications' ? (
              <NotificationsPage onBack={goBack} />
            ) : page === 'quickactions' ? (
              <QuickActionsPage
                activeModule={activeModule}
                onBack={goBack}
                onItemClick={(screen) => handleOpenQuickAction(screen)}
              />
            ) : page === 'qa-screen' ? (
              <QaScreenPage artifacts={artifacts} entryDepth={qaEntryDepth} onExit={exitQaScreen} />
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
