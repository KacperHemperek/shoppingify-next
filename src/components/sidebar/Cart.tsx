import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import Link from 'next/link';
import { forwardRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useModal } from '@/hooks/useModal';
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

import { ItemAmount } from './ItemAmount';

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

function useCreateNewList({
  onSuccessCallback,
}: {
  onSuccessCallback: () => void;
}) {
  const items = useAppSelector(getAllItems);
  const dispatch = useAppDispatch();
  const apiUtils = api.useContext();

  const { mutate } = api.list.create.useMutation({
    onError: (e) => {
      toast.error(formatErrorMessage(e) ?? 'Sorry something went wrong!');
    },
    onSuccess: () => {
      toast.success('List created successfully');
      apiUtils.list.getAll.invalidate();
      apiUtils.list.getCurrentListId.invalidate();

      onSuccessCallback();
      dispatch(clearList());
    },
  });

  function createList({ listName }: { listName: string }) {
    mutate({
      items: items.map((item) => ({ amount: item.amount, itemId: item.id })),
      listName,
    });
  }

  return { createList, items };
}

function ConfirmSaveListAsCurrentModal({
  currentListName,
  newListName,
  resetListNameInput,
}: {
  currentListName: string;
  newListName: string;
  resetListNameInput: () => void;
}) {
  const { closeModal } = useModal();

  const { createList } = useCreateNewList({
    onSuccessCallback: () => {
      resetListNameInput();
      closeModal();
    },
  });

  const onCreateList = () => {
    createList({ listName: newListName });
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-4 items-start">
        <h3 className="text-xl font-medium ">Changing current list</h3>
        <button className="" onClick={closeModal}>
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      <p className="mb-6">
        List <span className="text-primary font-medium">{currentListName}</span>{' '}
        is now your current list, do you want to{' '}
        <span className="text-danger font-medium">cancel</span> that list and
        make <span className="text-primary font-medium"> {newListName}</span>{' '}
        your current list
      </p>

      <div className="self-end space-x-6">
        <button
          className="bg-danger rounded-lg py-2 px-4 text-white font-medium"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          className="bg-primary rounded-lg py-2 px-4 text-white font-medium"
          onClick={onCreateList}
        >
          Ok
        </button>
      </div>
    </div>
  );
}

export default function Cart() {
  const categories = useAppSelector(getCategories);
  const dispatch = useAppDispatch();
  const { setSidebarOption } = useSidebar();
  const { openModal } = useModal();

  const { createList, items } = useCreateNewList({
    onSuccessCallback: () => setListname(''),
  });

  const [listname, setListname] = useState('');

  const { data: currentListId } = api.list.getCurrentListId.useQuery();

  const { data: currentList } = api.list.getListById.useQuery(
    { listId: currentListId ?? -1 },
    { enabled: !!currentListId }
  );

  const saveListDisabled = !listname.trim().length || !items.length;

  async function saveList(e: React.FormEvent) {
    e.preventDefault();

    if (currentListId) {
      openModal(
        <ConfirmSaveListAsCurrentModal
          currentListName={currentList?.name ?? ''}
          newListName={listname}
          resetListNameInput={() => setListname('')}
        />
      );
    } else {
      createList({
        listName: listname,
      });
    }
  }

  function onClearList() {
    dispatch(clearList());
  }

  return (
    <>
      <motion.div
        className="flex h-full flex-col justify-between  bg-primary-light"
        key={'cart'}
      >
        <div className="flex flex-col overflow-y-scroll px-4 py-8 xl:px-12">
          <button
            type="button"
            onClick={() => setSidebarOption(undefined)}
            className="mb-4 self-end md:hidden"
          >
            <XMarkIcon className="h-6 w-6 text-black" />
          </button>
          <div className="mb-12 rounded-3xl bg-secondary p-6 text-neutral-extralight">
            <h3 className="mb-4 font-bold">Didn’t find what you need?</h3>

            <button
              onClick={() => setSidebarOption('addItem')}
              className="rounded-xl bg-white  px-6 py-2 font-bold text-neutral-dark"
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
          <motion.form
            onSubmit={saveList}
            className={classNames(
              saveListDisabled ? 'border-neutral-light' : 'border-primary',
              'flex overflow-hidden rounded-xl border-2 '
            )}
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
              disabled={saveListDisabled}
              className="rounded-l-lg bg-primary p-4 font-semibold text-white disabled:bg-neutral-light"
            >
              Save
            </button>
          </motion.form>
        </div>
      </motion.div>
    </>
  );
}
