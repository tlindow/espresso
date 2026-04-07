import { useRoute } from '../router';

const tabs = [
  { page: 'home', path: '#/', label: 'Home', icon: '\u2302' },
  { page: 'add', path: '#/add', label: 'Review', icon: '+' },
  { page: 'shops', path: '#/shops', label: 'Shops', icon: '\u2615' },
  { page: 'settings', path: '#/settings', label: 'Settings', icon: '\u2699' },
] as const;

export function NavBar() {
  const route = useRoute();

  return (
    <nav class="nav-bar">
      {tabs.map((tab) => (
        <a
          key={tab.page}
          href={tab.path}
          class={`nav-tab${route.page === tab.page ? ' nav-tab--active' : ''}`}
          aria-current={route.page === tab.page ? 'page' : undefined}
        >
          <span class="nav-icon">{tab.icon}</span>
          <span class="nav-label">{tab.label}</span>
        </a>
      ))}
    </nav>
  );
}
