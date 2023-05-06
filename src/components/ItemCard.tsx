import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

import useSidebar from '@/hooks/useSidebar';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addItem,
  itemAlreadyOnLIst,
  removeItem,
} from '@/redux/slices/newListSlice';

import { type Item } from '@/types/Item.interface';

const ItemCardButton = ({
  children,
  onClick,
  setHover,
  hover,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  setHover: (value: React.SetStateAction<boolean>) => void;
  hover: boolean;
}) => {
  return (
    <button
      className="relative p-1"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
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
      {children}
    </button>
  );
};

const ItemCard = React.forwardRef(
  (
    {
      item,
      categoryId,
      delay = 0.6,
    }: { item: Item; categoryId: number; delay?: number },
    _ref
  ) => {
    const { show } = useSidebar();
    const [hover, setHover] = useState(false);
    const dispatch = useAppDispatch();
    const isInNewList = useAppSelector((state) =>
      itemAlreadyOnLIst(state, item.id, item.category)
    );

    const addItemToList = (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(
        addItem({
          categoryName: item.category,
          itemName: item.name,
          itemId: item.id,
          categoryId: categoryId,
        })
      );
    };

    const removeItemFromList = (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(removeItem({ itemId: item.id, categoryName: item.category }));
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
        className="flex h-min items-center justify-between space-x-4 rounded-xl bg-white p-3 lg:p-5 shadow-md  hover:cursor-pointer"
      >
        <span className="font-medium truncate">{item.name}</span>
        {!isInNewList && (
          <ItemCardButton
            hover={hover}
            onClick={addItemToList}
            setHover={setHover}
          >
            <PlusIcon className="h-6 w-6 text-neutral" />
          </ItemCardButton>
        )}
        {isInNewList && (
          <ItemCardButton
            hover={hover}
            onClick={removeItemFromList}
            setHover={setHover}
          >
            <MinusIcon className="h-6 w-6 text-neutral" />
          </ItemCardButton>
        )}
      </motion.div>
    );
  }
);

ItemCard.displayName = 'ItemCard';

export default ItemCard;
