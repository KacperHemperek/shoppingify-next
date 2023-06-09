import {
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  ChartBarSquareIcon,
  ListBulletIcon,
  PlusIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import useSidebar from '@/hooks/useSidebar';
import { useUser } from '@/hooks/useUser';

import { useAppDispatch } from '@/redux/hooks';
import { clearList } from '@/redux/slices/newListSlice';

import { api } from '@/utils/api';

function NavButtonOption({
  onClick,
  children,
}: {
  children: React.ReactNode;
  onClick: (e?: React.MouseEvent) => void;
}) {
  return (
    <button onClick={onClick} className="flex h-14 items-center">
      <div className="h-full w-2" />
      <div className="flex h-full w-full items-center justify-center">
        {children}
      </div>
    </button>
  );
}

function NavLinkOption({
  children,
  to,
}: {
  to: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Link href={to} className="flex h-14 items-center">
      {router.pathname === to ? (
        <>
          <motion.div
            className="h-full w-1 md:w-2 rounded-r-lg bg-primary"
            layoutId={'nav-active'}
          />
          <div className="flex h-full w-full items-center justify-center">
            {children}
          </div>
        </>
      ) : (
        <>
          <div className="h-full w-2" />
          <div className="flex h-full w-full items-center justify-center">
            {children}
          </div>
        </>
      )}
    </Link>
  );
}

function NavBar() {
  const dispatch = useAppDispatch();

  const { user } = useUser();
  const utils = api.useContext();
  const router = useRouter();
  const { mutate: logoutMutation } = api.user.logout.useMutation({
    onSuccess: () => {
      utils.user.getUserFromSession.invalidate();
      dispatch(clearList());
      router.push('/login');
    },
  });

  const {
    data: currentListId,
    isLoading: fetchingCurrentlist,
    isError,
  } = api.list.getCurrentListId.useQuery();

  const { setSidebarOption, setShownListId: setCurrentListId } = useSidebar();

  const logout = async () => {
    logoutMutation();
  };

  const showCurrentList = () => {
    if (currentListId && !fetchingCurrentlist && !isError) {
      setCurrentListId(currentListId);
      setSidebarOption('list');
    }
  };

  return (
    <nav className="flex flex-col justify-between bg-white">
      <Link
        href="/"
        className="relative flex items-center justify-center m-2 md:m-6"
      >
        <Image
          src={'/assets/logo.svg'}
          alt="Website Logo"
          width={40}
          height={40}
        />
      </Link>
      <div className="flex flex-col space-y-6 xl:space-y-10">
        <NavLinkOption to={'/'}>
          <ListBulletIcon className="h-6 w-6 text-neutral-dark" />
        </NavLinkOption>
        <NavLinkOption to={'/history'}>
          <ArrowPathIcon className="h-6 w-6 text-neutral-dark" />
        </NavLinkOption>
        <NavLinkOption to={'/statistics'}>
          <ChartBarSquareIcon className="h-6 w-6 text-neutral-dark" />
        </NavLinkOption>
        {!!currentListId && (
          <NavButtonOption onClick={showCurrentList}>
            <ClipboardDocumentListIcon className="h-6 w-6 text-neutral-dark" />
          </NavButtonOption>
        )}
        {user ? (
          <NavButtonOption onClick={logout}>
            <ArrowLeftOnRectangleIcon className="h-6 w-6 text-neutral-dark" />
          </NavButtonOption>
        ) : (
          <NavLinkOption to={'/login'}>
            <ArrowRightOnRectangleIcon className="h-6 w-6 text-neutral-dark" />
          </NavLinkOption>
        )}
      </div>
      <div className="flex flex-col p-2 lg:p-6">
        <button
          className="mb-6 rounded-full bg-success p-3"
          onClick={() => setSidebarOption('addItem')}
        >
          <PlusIcon className="h-4 w-4 md:h-6 md:w-6 text-white" />
        </button>
        <button
          className="rounded-full bg-primary p-3"
          onClick={() => setSidebarOption('cart')}
        >
          <ShoppingCartIcon className="h-4 w-4 md:h-6 md:w-6 text-white" />
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
