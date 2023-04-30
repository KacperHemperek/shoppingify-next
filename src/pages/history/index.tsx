import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { type ListState } from '@prisma/client';
import { useRouter } from 'next/router';
import { memo, useMemo } from 'react';

import Loadingpage from '@/components/layounts/LoadingPage';

import useSidebar from '@/hooks/useSidebar';

import { type RouterOutputs, api } from '@/utils/api';

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
  const { setSidebarOption, setShownListId: setCurrentListId } = useSidebar();

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
      className="flex cursor-pointer items-center rounded-xl bg-white p-5 shadow-md "
    >
      <div className="flex w-full flex-col items-start justify-start md:flex-row md:items-center md:justify-between">
        <p className="mb-2 truncate font-medium md:mb-0">{list.name}</p>
        <div className="grid max-w-[240px] grid-cols-6 gap-4 md:w-full md:grid-cols-12 xl:max-w-sm">
          <div className="col-span-4 flex min-w-fit items-center gap-2 text-neutral-light md:col-span-8 md:justify-end">
            <CalendarIcon className="h-5 w-5" />
            <p className="text-sm ">{dateToDisplay}</p>
          </div>
          <div className="col-span-1 flex items-center justify-center md:col-span-3 ">
            <Tag variant={list.state} />
          </div>
          <div className="col-span-1 hidden w-min items-center justify-end md:flex">
            <ChevronRightIcon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
      <ChevronRightIcon className="block h-5 w-5 text-primary md:hidden" />
    </div>
  );
}

const SingleListItem = memo(SingleListItemComponent);

function History() {
  const router = useRouter();

  const { setSidebarOption } = useSidebar();

  const {
    data: lists,
    isLoading: fetchingLists,
    error: errorFetchingLists,
  } = api.list.getAll.useQuery();

  const listsGroupedByDate = useMemo(() => {
    const result: {
      [date in string]: SingleItemProps[];
    } = {};

    if (!lists) return Object.entries(result);
    lists?.sort((listA, listB) => {
      const [dateA, dateB] = [
        new Date(listA.createdAt),
        new Date(listB.createdAt),
      ];
      return dateB.getTime() - dateA.getTime();
    });

    for (const list of lists) {
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

    return Object.entries(result);
  }, [lists]);

  if (errorFetchingLists) {
    return <div>Error occured when fetching lists</div>;
  }

  if (fetchingLists) {
    return <Loadingpage />;
  }

  return (
    <div className="flex w-full flex-col px-3 py-8 md:px-6 xl:px-20">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-neutral-dark">
          Shopping History
        </h1>
        {!listsGroupedByDate.length && (
          <div>
            <h2 className="my-6 text-lg font-medium text-neutral-light">
              You don’t have any lists,{' '}
              <a
                className="cursor-pointer font-bold text-primary underline"
                onClick={() => {
                  router.push('/');
                  setSidebarOption('cart');
                }}
              >
                create list
              </a>
            </h2>
          </div>
        )}
        {!!listsGroupedByDate &&
          listsGroupedByDate.map(([date, lists]) => (
            <article className="mt-12 flex flex-col" key={date}>
              <h5 className="mb-4 text-xs font-medium">{date}</h5>
              <div className="w-full space-y-6">
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
