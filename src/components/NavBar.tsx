import {
  ArrowLeftOnRectangleIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  ChartBarSquareIcon,
  ListBulletIcon,
  PlusIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import useSidebar from '@/hooks/useSidebar';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { api } from '@/utils/api';

function NavOption({ icon, to }: { to: string; icon: React.ReactNode }) {
  const router = useRouter();

  return (
    <Link href={to} className="flex h-14 items-center">
      {router.pathname === to ? (
        <>
          <motion.div
            className="h-full w-2 rounded-r-lg bg-primary"
            layoutId={'nav-active'}
          />
          <div className="flex h-full w-full items-center justify-center">
            {icon}
          </div>
        </>
      ) : (
        <>
          <div className="h-full w-2" />
          <div className="flex h-full w-full items-center justify-center">
            {icon}
          </div>
        </>
      )}
    </Link>
  );
}

function NavBar() {
  const router = useRouter();
  const { user } = useUser();
  // const { mutateAsync } = useLogout();
  const utils = api.useContext();
  const { mutateAsync: logoutMutation } = api.user.logout.useMutation({
    onSuccess: () => {
      utils.user.getUserFromSession.invalidate();
    },
  });
  const { setSidebarOption } = useSidebar();

  const logout = async () => {
    await logoutMutation();
    // router.push('/login');
  };

  return (
    <nav className="flex flex-col justify-between bg-white">
      <div className="relative flex items-center justify-center p-3 md:p-6">
        <Image
          src={'/assets/logo.svg'}
          alt="Website Logo"
          width={40}
          height={40}
        />
      </div>
      <div className="flex flex-col space-y-6 md:space-y-12">
        <NavOption
          to={'/'}
          icon={<ListBulletIcon className="h-6 w-6 text-neutral-dark" />}
        />
        <NavOption
          to={'/history'}
          icon={<ArrowPathIcon className="h-6 w-6 text-neutral-dark" />}
        />
        <NavOption
          to={'/statistics'}
          icon={<ChartBarSquareIcon className="h-6 w-6 text-neutral-dark" />}
        />
        {user ? (
          <button onClick={logout} className="flex h-14 items-center">
            <div className="h-full w-2" />
            <div className="flex h-full w-full items-center justify-center">
              <ArrowLeftOnRectangleIcon className="h-6 w-6 text-neutral-dark" />
            </div>
          </button>
        ) : (
          <NavOption
            to={'/login'}
            icon={
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-neutral-dark" />
            }
          />
        )}
      </div>
      <div className="flex flex-col p-3 lg:p-6">
        <button
          className="mb-6 rounded-full bg-success p-3"
          onClick={() => setSidebarOption('addItem')}
        >
          <PlusIcon className="h-6 w-6 text-white" />
        </button>
        <button
          className="rounded-full bg-primary p-3"
          onClick={() => setSidebarOption('cart')}
        >
          <ShoppingCartIcon className="h-6 w-6 text-white" />
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
