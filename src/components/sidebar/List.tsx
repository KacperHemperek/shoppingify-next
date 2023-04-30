import Checkbox from '../Checkbox';
import { BackButton } from './BackButton';
import { ItemAmount } from './ItemAmount';
import useSidebar from '@/hooks/useSidebar';
import { FormatedItem } from '@/server/api/routers/list';
import { api } from '@/utils/api';
import { ListState } from '@prisma/client';
import classnames from 'classnames';
import { useMemo, useState } from 'react';

function ListItem({
  item,
  disabled,
}: {
  item: FormatedItem;
  disabled: boolean;
}) {
  return (
    <label
      className={classnames(
        disabled && 'cursor-not-allowed',
        'flex justify-between items-center'
      )}
    >
      <div
        className={classnames(
          disabled && 'text-neutral-light',
          'flex gap-2 font-medium'
        )}
      >
        <Checkbox checked={item.checked} disabled={disabled} />
        {item.name}
      </div>
      <ItemAmount amount={item.amount} />
    </label>
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
        <div className="flex flex-col">
          <h5 className="mb-4 text-xs font-medium text-[#828282]">
            {category}
          </h5>
          <div className="space-y-4">
            {items.map((item) => (
              <ListItem item={item} disabled={listState !== 'current'} />
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
  const [checked, setChecked] = useState(false);

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
    <div className="flex h-full flex-col justify-between  bg-primary-light p">
      <div className="overflow-y-scroll px-4 flex flex-col py-8 xl:px-12">
        <div className="md:hidden block">
          <BackButton
            onClick={() => {
              setSidebarOption(undefined);
            }}
          />
        </div>
        <div className="md:block hidden">
          <BackButton
            onClick={() => {
              setSidebarOption('cart');
            }}
          />
        </div>
        <h2 className="text-2xl font-bold text-neutral-dark mb-6">
          {listData.name}
        </h2>

        <List items={listData.items} listState={listData.state} />
      </div>
    </div>
  );
}
