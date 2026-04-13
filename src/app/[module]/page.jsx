import { useParams } from 'react-router-dom';
import ComingSoon from '../../components/ui/ComingSoon';
import { MODULES } from '../../data/modules';

export default function ModulePage() {
  const { module } = useParams();
  const def = MODULES.find((m) => m.id === module);
  const label = def ? def.label : 'Module';

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
