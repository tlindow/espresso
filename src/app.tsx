import { useRoute } from './router';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { LogShot } from './views/LogShot';
import { ShotDetail } from './views/ShotDetail';
import { CafeList } from './views/CafeList';
import { CafeDetail } from './views/CafeDetail';
import { Journal } from './views/Journal';
import { Settings } from './views/Settings';

export function App() {
  const route = useRoute();

  let view;
  switch (route.page) {
    case 'log':
      view = <LogShot />;
      break;
    case 'shot':
      view = <ShotDetail id={route.id!} />;
      break;
    case 'cafes':
      view = <CafeList />;
      break;
    case 'cafe':
      view = <CafeDetail id={route.id!} />;
      break;
    case 'journal':
      view = <Journal />;
      break;
    case 'settings':
      view = <Settings />;
      break;
    default:
      view = <Home />;
  }

  return <Layout>{view}</Layout>;
}
