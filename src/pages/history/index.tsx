import { type RouterOutputs, api } from '@/utils/api';
import { useMemo } from 'react';

type SingleItemProps = RouterOutputs['list']['getAll'][number];

function SingleListItem(list: SingleItemProps) {
  return <div>{list.name}</div>;
}

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
      return dateA.getTime() - dateB.getTime();
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
        {Object.entries(listsGroupedByDate)?.map(([date, lists]) => (
          <div className="flex flex-col">
            {date}
            {lists.map((list) => (
              <SingleListItem {...list} key={list.id + list.name} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
