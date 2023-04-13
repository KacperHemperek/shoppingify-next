import { PlusIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import useSidebar from '@/hooks/useSidebar';
import { Item } from '@/types/Item.interface';

const ItemCard = React.forwardRef(
  (
    {
      item,
      categoryId,
      delay = 0.6,
    }: { item: Item; categoryId: number; delay?: number },
    ref
  ) => {
    const { show } = useSidebar();
    const [hover, setHover] = useState(false);

    const addItemToList = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log('add item ' + item.name);
    };

    return (
      <motion.div
        onClick={() => show(item, categoryId)}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay } }}
        transition={{
          layout: {
            delay: 0.2,
          },
        }}
        exit={{ opacity: 0, y: -10 }}
        layout={'position'}
        className="flex h-min items-center justify-between space-x-4 rounded-xl bg-white p-5 shadow-md  hover:cursor-pointer"
      >
        <span className="font-medium">{item.name}</span>
        <button
          className="relative p-1"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={addItemToList}
        >
          <motion.div
            className="absolute inset-0 -z-10  bg-slate-100"
            variants={{
              showed: {
                clipPath: 'circle(48%)',
              },
              hidden: {
                clipPath: 'circle(0%)',
              },
            }}
            animate={hover ? 'showed' : 'hidden'}
          />
          <PlusIcon className="h-6 w-6 text-neutral" />
        </button>
      </motion.div>
    );
  }
);

export default ItemCard;
