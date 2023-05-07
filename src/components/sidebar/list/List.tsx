import { type ListState } from '@prisma/client';
import classnames from 'classnames';
import { motion, useAnimationControls } from 'framer-motion';
import { useMemo } from 'react';

import useSidebar from '@/hooks/useSidebar';

import { api } from '@/utils/api';

import { type FormatedItem } from '@/server/api/routers/list';

import Checkbox from '../../Checkbox';
import { BackButton } from '../BackButton';
import { ItemAmount } from '../ItemAmount';
import CurrentListActionButtons from './CurrentListActionButtons';
import CurrentListHeader from './CurrentListHeader';

function ListItem({
  item,
  disabled,
}: {
  item: FormatedItem;
  disabled: boolean;
}) {
  const controls = useAnimationControls();
  const { shownListId: currentListId } = useSidebar();

  const apiUtils = api.useContext();

  const { mutate: toggleItem } = api.list.toggleListItem.useMutation({
    onMutate: ({ itemId, value }) => {
      if (!currentListId) return;
      apiUtils.list.getListById.cancel();

      const currentListData = apiUtils.list.getListById.getData({
        listId: currentListId,
      });
      if (!currentListData) return;
      const updatedItems = currentListData.items.map((item) =>
        item.id === itemId ? { ...item, checked: value } : item
      );
      const updatedListData = { ...currentListData, items: updatedItems };

      apiUtils.list.getListById.setData(
        { listId: currentListId },
        updatedListData
      );

      return { previusListData: currentListData };
    },
    onError: (_err, _input, context) => {
      if (!currentListId) return;

      apiUtils.list.getListById.setData(
        { listId: currentListId },
        context?.previusListData
      );
    },
    onSettled: () => {
      currentListId &&
        apiUtils.list.getListById.invalidate({ listId: currentListId });
    },
  });

  function onItemClicked() {
    if (disabled) {
      controls.start({
        translateX: [-2, 3, -3, 2, 0],
        transition: { duration: 0.5, ease: 'easeInOut' },
      });
    }
  }

  return (
    <motion.label
      className={classnames(
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        'flex items-center justify-between'
      )}
      animate={controls}
      onClick={onItemClicked}
    >
      <div
        className={classnames(
          disabled && 'text-neutral-light',
          'flex gap-2 font-medium'
        )}
      >
        <Checkbox
          checked={item.checked}
          disabled={disabled}
          onCheck={(value: boolean) => {
            toggleItem({ itemId: item.id, value });
          }}
          newValue={!item.checked}
        />
        <div className="relative flex ">
          <motion.div
            className={classnames(
              disabled ? 'bg-neutral-light' : 'bg-neutral-dark',
              'h-[1px] absolute self-start top-[55%] -translate-y-1/2'
            )}
            initial={false}
            animate={{
              width: item.checked ? '100%' : '0%',
              transition: { duration: 0.2, ease: 'easeInOut' },
            }}
          ></motion.div>
          <span className="mx-1">{item.name}</span>
        </div>
      </div>
      <ItemAmount amount={item.amount} />
    </motion.label>
  );
}

function List({
  items,
  listState,
}: {
  items: FormatedItem[];
  listState: ListState;
}) {
  const itemsGroupedByCategory = useMemo<[string, FormatedItem[]][]>(() => {
    const groupedItems: { [key in string]: FormatedItem[] } = {};

    items.forEach((item) => {
      if (item.category in groupedItems) {
        groupedItems[item.category]?.push(item);
      } else {
        groupedItems[item.category] = [item];
      }
    });
    const result = Object.entries(groupedItems);
    return result;
  }, [items]);

  return (
    <article className="space-y-6">
      {!!itemsGroupedByCategory.length &&
        itemsGroupedByCategory.map(([category, items]) => (
          <div className="flex flex-col" key={category}>
            <h5 className="mb-4 text-xs font-medium text-[#828282]">
              {category}
            </h5>
            <div className="space-y-4">
              {items.map((item) => (
                <ListItem
                  key={item.name + item.id}
                  item={item}
                  disabled={listState !== 'current'}
                />
              ))}
            </div>
          </div>
        ))}
    </article>
  );
}

export default function ListView({ listId }: { listId?: number }) {
  const {
    data: listData,
    isLoading: fetchingList,
    error: fetchingListError,
  } = api.list.getListById.useQuery(
    { listId: listId ?? -1 },
    {
      enabled: !!listId,
    }
  );

  const { setSidebarOption } = useSidebar();

  if (fetchingListError) {
    return (
      <motion.div className="flex h-full flex-col justify-between  bg-primary-light">
        There was a problem getting that list
      </motion.div>
    );
  }

  if (fetchingList) {
    return (
      <motion.div className="flex h-full flex-col justify-between  bg-primary-light">
        Loading list ...
      </motion.div>
    );
  }

  if (!listData) {
    return (
      <motion.div className="flex h-full flex-col justify-between  bg-primary-light">
        List not found
      </motion.div>
    );
  }

  return (
    <motion.div className="p flex h-full flex-col justify-between bg-primary-light">
      <div className="flex flex-col overflow-y-auto px-4 py-8 xl:px-12">
        <div className="block md:hidden">
          <BackButton
            onClick={() => {
              setSidebarOption(undefined);
            }}
          />
        </div>
        <div className="hidden md:block">
          <BackButton
            onClick={() => {
              setSidebarOption('cart');
            }}
          />
        </div>

        <CurrentListHeader listData={listData} />

        <List items={listData.items} listState={listData.state} />
      </div>

      {listData.state === 'current' && <CurrentListActionButtons />}
    </motion.div>
  );
}
