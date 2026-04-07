import { useRoute } from './router';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { AddReview } from './views/AddReview';
import { ReviewDetail } from './views/ReviewDetail';
import { ShopList } from './views/ShopList';
import { ShopDetail } from './views/ShopDetail';
import { Settings } from './views/Settings';

export function App() {
  const route = useRoute();

  let view;
  switch (route.page) {
    case 'add':
      view = <AddReview />;
      break;
    case 'review':
      view = <ReviewDetail id={route.id!} />;
      break;
    case 'shops':
      view = <ShopList />;
      break;
    case 'shop':
      view = <ShopDetail id={route.id!} />;
      break;
    case 'settings':
      view = <Settings />;
      break;
    default:
      view = <Home />;
  }

  return <Layout>{view}</Layout>;
}
