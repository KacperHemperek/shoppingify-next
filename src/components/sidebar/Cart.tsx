import useSidebar from '@/hooks/useSidebar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  changeItemAmount,
  getCategories,
  removeItem,
  type NewListItem,
  getAllItems,
} from '@/redux/slices/newListSlice';
import { api } from '@/utils/api';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useState } from 'react';

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
        className="flex h-full items-center justify-between"
      >
        <h4 className="truncate text-lg font-medium">{name}</h4>{' '}
        <div className="group flex items-center gap-2 rounded-lg py-1 pr-2 text-primary hover:bg-white hover:py-0 md:py-2 md:pr-2">
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
          <div className="w-max rounded-full border-2 border-primary px-4 py-1 text-sm ">
            <span className="font-semibold">{amount}</span> psc
          </div>
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

export default function Cart() {
  const categories = useAppSelector(getCategories);
  const items = useAppSelector(getAllItems);
  const { setSidebarOption } = useSidebar();

  const [listname, setListname] = useState('');

  const { mutateAsync } = api.list.create.useMutation();

  async function saveList(e: React.FormEvent) {
    e.preventDefault();
    try {
      await mutateAsync({
        listName: listname,
        items: items.map((item) => ({ amount: item.amount, itemId: item.id })),
      });
    } catch (e) {}
  }

  return (
    <motion.div
      className="flex h-full flex-col justify-between  bg-primary-light"
      key={'cart'}
    >
      <div className="overflow-y-scroll px-4 py-8 xl:p-12">
        <div className="mb-12 rounded-3xl bg-secondary p-6 text-neutral-extralight">
          <h3 className="mb-4 font-bold">Didn’t find what you need?</h3>

          <button
            onClick={() => setSidebarOption('addItem')}
            className="rounded-xl bg-white px-6 py-2 font-bold text-neutral-dark"
          >
            Add Item
          </button>
        </div>
        <h2 className="mb-6 text-2xl font-bold text-neutral-dark">
          New shopping list
        </h2>
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {categories.map(([categoryName, items]) => (
              <motion.div
                exit={{ opacity: 0 }}
                layout="position"
                className="flex w-full flex-col"
                key={categoryName}
              >
                <motion.h3
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-2 text-xs font-medium text-[#828282] "
                >
                  {categoryName}
                </motion.h3>
                <motion.div className="flex flex-col space-y-2 ">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <CartItem {...item} key={item.id} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-0 bg-white p-4 xl:px-12 xl:py-6">
        <form
          className={`${
            listname.trim().length < 1
              ? 'border-neutral-light'
              : 'border-primary'
          } flex overflow-hidden rounded-xl border-2 `}
        >
          <input
            type="text"
            placeholder="Enter list name"
            className="grow px-4 font-medium outline-none"
            value={listname}
            onChange={(e) => {
              setListname(e.target.value);
            }}
          />
          <button
            onClick={saveList}
            disabled={listname.trim().length < 1}
            className="rounded-l-lg bg-primary p-4 font-semibold text-white disabled:bg-neutral-light"
          >
            Save
          </button>
        </form>
      </div>
    </motion.div>
  );
}
