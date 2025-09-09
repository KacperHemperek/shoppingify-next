import { useRouter } from 'next/router';
import { type PropsWithChildren, useEffect } from 'react';

import NavBar from '@/components/NavBar';
import Loadingpage from '@/components/layouts/LoadingPage';
import Sidebar from '@/components/sidebar/SideBarContainer';

import useSidebar from '@/hooks/useSidebar';
import { useUser } from '@/hooks/useUser';

import NotLoggedIn from './NotLoggedIn';

function RouteGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user, loading } = useUser();
  const { setSidebarOption } = useSidebar();
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOption(undefined);
    }
  }, [router.pathname, setSidebarOption]);

  // input all your restricted routes
  const restrictedRoutes: string[] = ['/', '/history', '/statistics'];
  // input all routes that are not avalible to logged in user
  const redirectFromRoutesWhenUserLoggedIn: string[] = ['/login'];

  if (loading) {
    return <Loadingpage />;
  }

  if (restrictedRoutes.includes(location.pathname) && !user) {
    return <NotLoggedIn />;
  }

  if (redirectFromRoutesWhenUserLoggedIn.includes(location.pathname) && user) {
    router.push('/');
    return null;
  }
  return <>{children}</>;
}

export type ShowAddItemOptions = 'itemInfo' | 'addItem' | 'cart' | 'list';

function Layout({ children }: PropsWithChildren) {
  const { user } = useUser();

  return (
    <div className="flex h-full w-screen overflow-x-hidden bg-neutral-extralight">
      <NavBar />
      <main className="scrollbar flex h-screen w-full overflow-y-auto bg-neutral-extralight">
        <RouteGuard>{children}</RouteGuard>
      </main>
      {user && <Sidebar />}
    </div>
  );
}

export default Layout;
