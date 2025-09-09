import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

import { useAppDispatch } from '@/redux/hooks';
import {
  type NewListItem,
  changeItemAmount,
  removeItem,
} from '@/redux/slices/newListSlice';

import { ItemAmount } from '../ItemAmount';

const CartItem = forwardRef(
  ({ amount, category, id, name }: NewListItem, _ref) => {
    const dispatch = useAppDispatch();

    function handleIncrementAmount() {
      dispatch(
        changeItemAmount({
          categoryName: category,
          itemId: id,
          type: 'increment',
        })
      );
    }

    function removeItemFromList() {
      dispatch(removeItem({ categoryName: category, itemId: id }));
    }

    function handleDecrementAmount() {
      dispatch(
        changeItemAmount({
          categoryName: category,
          itemId: id,
          type: 'decrement',
        })
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        className="group flex h-full items-start justify-between flex-col max-w-full lg:flex-row lg:items-center"
      >
        <h4 className="truncate text-lg font-medium max-w-full">{name}</h4>{' '}
        <div className="flex items-center gap-2 rounded-lg py-1 pr-2 text-primary lg:group-hover:bg-white lg:group-hover:py-0 lg:py-2 lg:pr-2">
          <button
            onClick={removeItemFromList}
            className="hidden rounded-lg bg-primary px-1 py-2 lg:group-hover:block lg:hidden lg:px-2 lg:py-3 "
          >
            <TrashIcon className="h-6 w-6 text-neutral-extralight" />
          </button>{' '}
          <button
            onClick={handleDecrementAmount}
            className="transition-all lg:group-hover:block lg:hidden"
          >
            <MinusIcon className="h-6 w-6 " />
          </button>{' '}
          <ItemAmount amount={amount} />
          <button
            onClick={handleIncrementAmount}
            className="transition-all lg:group-hover:block lg:hidden"
          >
            <PlusIcon className="h-6 w-6 " />
          </button>{' '}
          <button
            onClick={removeItemFromList}
            className="rounded-lg p-1 -ml-1 lg:hidden"
          >
            <TrashIcon className="h-5 w-5 text-danger" />
          </button>{' '}
        </div>
      </motion.div>
    );
  }
);

CartItem.displayName = 'CartItem';

export default CartItem;
