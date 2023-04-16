import { useUser } from '@/hooks/useUser';
import NotLoggedIn from './NotLoggedIn';
import Loadingpage from '@/components/layounts/LoadingPage';
import SideBar from '@/components/sidebar/SideBarContainer';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';

function RouteGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user, loading } = useUser();

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

export type ShowAddItemOptions = 'itemInfo' | 'addItem' | 'cart';

function Layout({ children }: PropsWithChildren) {
  const { user } = useUser();

  return (
    <div className="flex h-screen w-screen overflow-x-hidden bg-neutral-extralight">
      <NavBar />
      <main className="scrollbar flex h-screen w-full overflow-y-auto bg-neutral-extralight">
        <RouteGuard>{children}</RouteGuard>
      </main>
      {user && <SideBar />}
    </div>
  );
}

export default Layout;
