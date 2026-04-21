import { useOutletContext } from 'react-router-dom';
import DashboardPage from './page.jsx';
import ShareholdersPage from './shareholders/page.jsx';
import TargetingPage from './targeting/page.jsx';
import ComingSoon from '../components/ui/ComingSoon';
import { MODULES } from '../data/modules';

export default function ModuleRouter() {
  const { activeModule } = useOutletContext();

  switch (activeModule) {
    case 'dashboard':
      return <DashboardPage />;
    case 'shareholders':
      return <ShareholdersPage />;
    case 'targeting':
      return <TargetingPage />;
    default: {
      const def = MODULES.find((m) => m.id === activeModule);
      const label = def?.label || 'Module';
      return (
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflowY: 'auto',
            background: 'var(--bg)',
          }}
        >
          <div
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              width: '100%',
              padding: '0 16px 32px',
            }}
          >
            <ComingSoon moduleName={label} />
          </div>
        </main>
      );
    }
  }
}
