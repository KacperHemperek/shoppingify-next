import AddItemForm from './AddItemForm';
import Cart from './Cart';
import ItemInfo from './ItemInfo';
import ListView from './List';
import useSidebar from '@/hooks/useSidebar';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

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
  const { sidebarOption, item, currentListId } = useSidebar();

  return (
    <div className="hidden w-[calc(100%-72px)] md:block md:w-full md:max-w-[300px] xl:max-w-sm">
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
          {sidebarOption === 'cart' && <Cart />}
          {sidebarOption === 'itemInfo' && item && (
            <ItemInfo key={'itemInfo'} />
          )}
          {sidebarOption === 'list' && currentListId && (
            <ListView listId={currentListId} key={'list'} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MobileSideBar() {
  const { sidebarOption, item, currentListId } = useSidebar();

  return (
    <motion.div
      key="sidebar"
      animate={sidebarOption ? { x: 0 } : { x: '100%' }}
      transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
      className="fixed right-0 h-screen max-h-screen w-[calc(100vw-72px)] bg-slate-50 md:hidden"
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
          {sidebarOption === 'list' && currentListId && (
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
