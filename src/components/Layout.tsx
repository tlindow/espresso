import type { ComponentChildren } from 'preact';
import { NavBar } from './NavBar';

interface Props {
  children: ComponentChildren;
}

export function Layout({ children }: Props) {
  return (
    <>
      <header class="app-header">
        <h1 class="app-title">Espresso</h1>
      </header>
      <main class="app-main">{children}</main>
      <NavBar />
    </>
  );
}
