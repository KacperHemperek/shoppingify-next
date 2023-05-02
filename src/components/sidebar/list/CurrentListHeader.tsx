import {
  HandThumbUpIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { motion, useAnimationControls } from 'framer-motion';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import { formatErrorMessage } from '@/lib/trpcErrorFormater';

import { type RouterOutputs, api } from '@/utils/api';

export default function CurrentListHeader({
  listData,
}: {
  listData: RouterOutputs['list']['getListById'];
}) {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(listData?.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiUtils = api.useContext();

  const tooltipControl = useAnimationControls();
  const formAnimationControl = useAnimationControls();

  const { mutate: updateListName } = api.list.updateListName.useMutation({
    onMutate: ({ listId, name }) => {
      apiUtils.list.getListById.cancel();
      apiUtils.list.getAll.cancel();

      const prevList = apiUtils.list.getListById.getData({ listId });
      const prevListOfLists = apiUtils.list.getAll.getData(undefined);

      const listWithNewName = !prevList ? prevList : { ...prevList, name };
      const listOfListsWithNewListName = prevListOfLists?.map((list) =>
        list.id === listId ? { ...list, name } : list
      );

      apiUtils.list.getListById.setData({ listId }, listWithNewName);
      apiUtils.list.getAll.setData(undefined, listOfListsWithNewListName);

      setEditMode(false);
      return { prevList, prevListOfLists };
    },
    onError: (err, input, context) => {
      toast.error(formatErrorMessage(err) ?? 'Unknown Error occured');

      if (!context?.prevList || !context.prevListOfLists) return;

      apiUtils.list.getListById.setData(
        { listId: input.listId },
        context.prevList
      );
      apiUtils.list.getAll.setData(undefined, context.prevListOfLists);
    },
    onSettled: () => {
      listData && apiUtils.list.getListById.invalidate({ listId: listData.id });
      apiUtils.list.getAll.invalidate();
    },
  });

  function onChangeNameSubmit(e: FormEvent) {
    e.preventDefault();

    if (!listData) return;

    if (!newName) {
      formAnimationControl.start({
        translateX: [-2, 3, -3, 2, 0],
        transition: { duration: 0.5, ease: 'easeInOut' },
      });
      toast.error('List name cannot be empty');

      return;
    }

    updateListName({ listId: listData.id, name: newName });
  }
  function toggleEditMode() {
    if (editMode) {
      setNewName(listData?.name);
    }

    setEditMode((prev) => !prev);
  }

  useEffect(() => {
    if (editMode) {
      inputRef.current?.focus();
    }
  }, [editMode]);

  return (
    <motion.form
      animate={formAnimationControl}
      onSubmit={onChangeNameSubmit}
      className="flex relative justify-between group my-6 items-center"
    >
      {editMode && listData?.state === 'current' && (
        <input
          placeholder="List name"
          ref={inputRef}
          className="text-2xl max-h-min resize-none flex-grow font-bold text-neutral-dark bg-transparent outline-none mr-2 placeholder:font-medium"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={!editMode}
        />
      )}
      {!editMode && (
        <>
          <motion.h1
            className="text-2xl truncate flex-grow font-bold text-neutral-dark bg-transparent outline-none mr-2"
            onHoverStart={() =>
              tooltipControl.start({
                opacity: 100,
                transition: { delay: 1 },
              })
            }
            onHoverEnd={() => tooltipControl.start({ opacity: 0 })}
          >
            {listData?.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={tooltipControl}
            className="bg-primary/10 backdrop-blur-sm  absolute text-center border border-primary top-full left-1/2 pointer-events-none group-hover:pointer-events-auto -translate-x-1/2 px-2 py-1 rounded-md text-xs group-hovered:delay-0"
          >
            {listData?.name}
          </motion.div>
        </>
      )}
      {listData?.state === 'current' && (
        <div
          className={classNames(
            editMode ? 'opacity-100' : 'opacity-0',
            'flex gap-2 cursor-pointer group-hover:opacity-100 transition-all items-center '
          )}
        >
          {!editMode && (
            <button onClick={toggleEditMode} type="button">
              <PencilSquareIcon className="w-5 h-5" />
            </button>
          )}

          {editMode && (
            <>
              <button type="submit">
                <HandThumbUpIcon className="w-5 h-5" />
              </button>
              <button type="button" onClick={toggleEditMode}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}
    </motion.form>
  );
}
