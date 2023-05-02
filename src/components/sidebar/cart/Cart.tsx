import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

import useCreateNewList from '@/hooks/useCreateNewList';
import { useModal } from '@/hooks/useModal';
import useSidebar from '@/hooks/useSidebar';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  getCategories,
  clearList,
  getListname,
  setListname as setListnameRedux,
} from '@/redux/slices/newListSlice';

import { api } from '@/utils/api';

import CartItem from './CartItem';
import ConfirmSaveListAsCurrentModal from './ConfirmSaveListAsCurrentModal';

export default function Cart() {
  const categories = useAppSelector(getCategories);
  const dispatch = useAppDispatch();
  const { setSidebarOption } = useSidebar();
  const { openModal } = useModal();
  const listname = useAppSelector(getListname);

  const { createList, items } = useCreateNewList({
    onSuccessCallback: () => {
      setSidebarOption('list');
      setListname('');
    },
  });

  const { data: currentListId } = api.list.getCurrentListId.useQuery();

  const { data: currentList } = api.list.getListById.useQuery(
    { listId: currentListId ?? -1 },
    { enabled: !!currentListId }
  );

  const saveListDisabled = !listname?.trim()?.length || !items?.length;

  function setListname(value: string) {
    dispatch(setListnameRedux(value));
  }

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
              type="submit"
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
