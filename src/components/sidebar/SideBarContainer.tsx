import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

import useSidebar from '@/hooks/useSidebar';

import AddItemForm from './addItem/AddItemForm';
import Cart from './cart/Cart';
import ItemInfo from './itemInfo/ItemInfo';
import ListView from './list/List';

const x = '100%';

const variants = {
  enter: {
    x,
  },
  center: {
    x: 0,
  },
  exit: {
    x: 0,
  },
};

function DesktopSideBar() {
  const { sidebarOption, item, shownListId: currentListId } = useSidebar();

  return (
    <div className="hidden w-[calc(100%-63px)] md:block md:w-full md:max-w-[300px] xl:max-w-sm">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          variants={variants}
          animate={'center'}
          initial={'enter'}
          exit={'exit'}
          key={sidebarOption}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
          className="h-screen bg-neutral-extralight md:relative "
        >
          {sidebarOption === 'addItem' && <AddItemForm key="addItem" />}
          {sidebarOption === 'cart' && <Cart key="cart" />}
          {sidebarOption === 'itemInfo' && item && (
            <ItemInfo key={'itemInfo'} />
          )}
          {sidebarOption === 'list' && (
            <ListView listId={currentListId} key={'list'} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MobileSideBar() {
  const { sidebarOption, item, shownListId: currentListId } = useSidebar();

  return (
    <motion.div
      key="sidebar"
      animate={sidebarOption ? { x: 0 } : { x: '100%' }}
      transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
      // NOTE: width calc(100vw - 63px) because 63px is the width of the side nav menu
      className="fixed right-0 h-screen max-h-screen w-[calc(100vw-63px)] bg-slate-50 md:hidden"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          variants={variants}
          animate={'center'}
          initial={'enter'}
          exit={'exit'}
          key={sidebarOption}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
          className="h-screen bg-neutral-extralight"
        >
          {sidebarOption === 'addItem' && <AddItemForm key="addItem" />}
          {sidebarOption === 'cart' && <Cart />}
          {sidebarOption === 'itemInfo' && item && (
            <ItemInfo key={'itemInfo'} />
          )}
          {sidebarOption === 'list' && (
            <ListView listId={currentListId} key={'list'} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function SideBar() {
  const { setSidebarOption } = useSidebar();

  useEffect(() => {
    if (window.innerWidth > 768) {
      setSidebarOption('cart');
    }
  }, [setSidebarOption]);

  return (
    <>
      <DesktopSideBar />
      <MobileSideBar />
    </>
  );
}

export default SideBar;
