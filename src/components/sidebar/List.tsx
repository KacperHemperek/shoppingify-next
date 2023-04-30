import { type ListState } from '@prisma/client';
import classnames from 'classnames';
import { motion, useAnimationControls } from 'framer-motion';
import { useMemo } from 'react';

import useSidebar from '@/hooks/useSidebar';

import { api } from '@/utils/api';

import { type FormatedItem } from '@/server/api/routers/list';

import Checkbox from '../Checkbox';
import { BackButton } from './BackButton';
import { ItemAmount } from './ItemAmount';

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
        disabled && 'cursor-not-allowed',
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
        {item.name}
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
  const itemsGroupedByCategory = useMemo(() => {
    const groupedItems: { [key in string]: FormatedItem[] } = {};

    items.forEach((item) => {
      if (item.category in groupedItems) {
        groupedItems[item.category]?.push(item);
      } else {
        groupedItems[item.category] = [item];
      }
    });

    return groupedItems;
  }, [items]);

  return (
    <article className="space-y-6">
      {Object.entries(itemsGroupedByCategory).map(([category, items]) => (
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

export default function ListView({ listId }: { listId: number }) {
  const {
    data: listData,
    isLoading: fetchingList,
    error: fetchingListError,
  } = api.list.getListById.useQuery({ listId });

  const { setSidebarOption } = useSidebar();

  if (fetchingListError) {
    return (
      <div className="flex h-full flex-col justify-between  bg-primary-light">
        There was a problem getting that list
      </div>
    );
  }

  if (fetchingList) {
    return (
      <div className="flex h-full flex-col justify-between  bg-primary-light">
        Loading list ...
      </div>
    );
  }

  if (!listData) {
    return (
      <div className="flex h-full flex-col justify-between  bg-primary-light ">
        List not found
      </div>
    );
  }

  return (
    <div className="p flex h-full flex-col  justify-between bg-primary-light">
      <div className="flex flex-col overflow-y-scroll px-4 py-8 xl:px-12">
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
        <h2 className="mb-6 text-2xl font-bold text-neutral-dark">
          {listData.name}
        </h2>

        <List items={listData.items} listState={listData.state} />
      </div>
    </div>
  );
}
