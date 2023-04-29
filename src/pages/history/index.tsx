import useSidebar from '@/hooks/useSidebar';
import { type RouterOutputs, api } from '@/utils/api';
import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { ListState } from '@prisma/client';
import { memo, useMemo } from 'react';

function TagComponent({ variant }: { variant: ListState }) {
  const wrapperClassName: { [key in typeof variant]: string } = {
    cancelled: 'text-danger border-danger',
    completed: 'text-success border-success',
    current: 'text-primary border-primary',
  };

  const universalClassName = 'p-1 text-xs rounded-lg border';

  return (
    <div className={wrapperClassName[variant] + ' ' + universalClassName}>
      {variant}
    </div>
  );
}

const Tag = memo(TagComponent);

type SingleItemProps = RouterOutputs['list']['getAll'][number];

function SingleListItemComponent(list: SingleItemProps) {
  const { setSidebarOption, setCurrentListId } = useSidebar();

  const dateToDisplay = Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
    .format(list.createdAt)
    .replace(/\//g, '.');

  const goToListSidebarView = () => {
    setSidebarOption('list');
    setCurrentListId(list.id);
  };

  return (
    <div
      onClick={goToListSidebarView}
      className="bg-white rounded-xl flex items-center p-5 shadow-md cursor-pointer "
    >
      <div className="flex flex-col md:flex-row items-start justify-start md:justify-between md:items-center w-full">
        <p className="truncate font-medium mb-2 md:mb-0">{list.name}</p>
        <div className="grid grid-cols-6 gap-4 max-w-[240px] xl:max-w-sm md:w-full md:grid-cols-12">
          <div className="flex items-center col-span-4 md:col-span-8 md:justify-end text-neutral-light min-w-fit gap-2">
            <CalendarIcon className="w-5 h-5" />
            <p className="text-sm ">{dateToDisplay}</p>
          </div>
          <div className="flex justify-center items-center col-span-1 md:col-span-3 ">
            <Tag variant={list.state} />
          </div>
          <div className="w-min col-span-1 justify-end items-center hidden md:flex">
            <ChevronRightIcon className="text-primary w-5 h-5" />
          </div>
        </div>
      </div>
      <ChevronRightIcon className="text-primary w-5 h-5 block md:hidden" />
    </div>
  );
}

const SingleListItem = memo(SingleListItemComponent);

function History() {
  const {
    data: lists,
    isLoading: fetchingLists,
    error: errorFetchingLists,
  } = api.list.getAll.useQuery();

  const listsGroupedByDate = useMemo(() => {
    if (!lists) return [];
    lists?.sort((listA, listB) => {
      const [dateA, dateB] = [
        new Date(listA.createdAt),
        new Date(listB.createdAt),
      ];
      return dateB.getTime() - dateA.getTime();
    });

    const result: {
      [date in string]: SingleItemProps[];
    } = {};

    for (let list of lists) {
      console.log(list.createdAt.toDateString());
      const formatedDate = Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
      }).format(list.createdAt);

      const listArray = result?.[formatedDate];
      if (formatedDate in result && listArray) {
        listArray.push(list);
      } else {
        result[formatedDate] = [list];
      }
    }

    return result;
  }, [lists]);
  if (errorFetchingLists) {
    return <div>Error occured when fetching lists</div>;
  }

  if (fetchingLists || !listsGroupedByDate) {
    return <div>Loading lists</div>;
  }

  return (
    <div className="flex w-full flex-col px-3 py-8 md:px-6 xl:px-20">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-neutral-dark">
          Shopping History
        </h1>
        {Object.entries(listsGroupedByDate).map(([date, lists]) => (
          <article className="flex flex-col mt-12" key={date}>
            <h5 className="text-xs font-medium mb-4">{date}</h5>
            <div className="space-y-6 w-full">
              {lists.map((list) => (
                <SingleListItem {...list} key={list.id + list.name} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default History;
