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
        className="group flex h-full items-center
        justify-between"
      >
        <h4 className="truncate text-lg font-medium">{name}</h4>{' '}
        <div className="flex items-center gap-2 rounded-lg py-1 pr-2 text-primary group-hover:bg-white group-hover:py-0 md:py-2 md:pr-2">
          <button
            onClick={removeItemFromList}
            className="hidden rounded-lg bg-primary px-1 py-2 group-hover:block md:px-2 md:py-3 "
          >
            <TrashIcon className="h-6 w-6 text-white" />
          </button>{' '}
          <button
            onClick={handleDecrementAmount}
            className="hidden transition-all group-hover:block"
          >
            <MinusIcon className="h-6 w-6 " />
          </button>{' '}
          <ItemAmount amount={amount} />
          <button
            onClick={handleIncrementAmount}
            className="hidden transition-all group-hover:block"
          >
            <PlusIcon className="h-6 w-6 " />
          </button>{' '}
        </div>
      </motion.div>
    );
  }
);

CartItem.displayName = 'CartItem';

export default CartItem;
