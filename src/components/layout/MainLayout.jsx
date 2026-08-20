import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';

/**
 * Shared shell for Home, Camera and History — Login stays outside this layout
 * since the original auth page has no navbar at all.
 */
export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
