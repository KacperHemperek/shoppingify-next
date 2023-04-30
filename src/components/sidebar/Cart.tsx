import { ItemAmount } from './ItemAmount';
import useSidebar from '@/hooks/useSidebar';
import { formatErrorMessage } from '@/lib/trpcErrorFormater';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  changeItemAmount,
  getCategories,
  removeItem,
  type NewListItem,
  getAllItems,
  clearList,
} from '@/redux/slices/newListSlice';
import { api } from '@/utils/api';
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { forwardRef, useState } from 'react';
import { toast } from 'react-hot-toast';

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

export default function Cart() {
  const categories = useAppSelector(getCategories);
  const items = useAppSelector(getAllItems);
  const dispatch = useAppDispatch();
  const { setSidebarOption } = useSidebar();

  const [listname, setListname] = useState('');

  const apiUtils = api.useContext();

  const { mutate: createList } = api.list.create.useMutation({
    onError: (e) => {
      toast.error(formatErrorMessage(e) ?? 'Sorry something went wrong!');
      setListname('');
    },
    onSuccess: () => {
      toast.success('List created successfully');
      apiUtils.list.getAll.invalidate();
    },
  });

  async function saveList(e: React.FormEvent) {
    e.preventDefault();

    createList({
      listName: listname,
      items: items.map((item) => ({ amount: item.amount, itemId: item.id })),
    });
  }

  function onClearList() {
    dispatch(clearList());
  }

  return (
    <motion.div
      className="flex h-full flex-col justify-between  bg-primary-light"
      key={'cart'}
    >
      <div className="overflow-y-scroll px-4 flex flex-col py-8 xl:px-12">
        <button
          type="button"
          onClick={() => setSidebarOption(undefined)}
          className="md:hidden self-end mb-4"
        >
          <XMarkIcon className="h-6 w-6 text-black" />
        </button>
        <div className="mb-12 rounded-3xl bg-secondary p-6 text-neutral-extralight">
          <h3 className="mb-4 font-bold">Didn’t find what you need?</h3>

          <button
            onClick={() => setSidebarOption('addItem')}
            className="bg-white rounded-xl  px-6 py-2 font-bold text-neutral-dark"
          >
            Add Item
          </button>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-dark">
            New shopping list
          </h2>
          <button
            onClick={onClearList}
            className="group rounded-xl bg-transparent p-2 transition-all hover:bg-danger"
          >
            <TrashIcon className="h-6 w-6 text-neutral-dark transition-all group-hover:text-neutral-extralight" />
          </button>
        </div>
        {!items.length && (
          <span>
            You don’t have any items,{' '}
            <Link className="font-medium text-primary underline" href="/">
              Add some
            </Link>
          </span>
        )}
        {!!items.length && (
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
                    className="mb-2 text-xs font-medium text-[#828282]"
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
        )}
      </div>
      <div className="mt-0 bg-white p-4 xl:px-12 xl:py-6">
        <form
          onSubmit={saveList}
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
