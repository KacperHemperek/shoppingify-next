import { BackButton } from './BackButton';
import useSidebar from '@/hooks/useSidebar';
import { api } from '@/utils/api';

export default function List({ listId }: { listId: number }) {
  const {
    data: listData,
    isLoading: fetchingList,
    error: fetchingListError,
  } = api.list.getList.useQuery({ listId });

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
        <h2 className="text-2xl font-bold text-neutral-dark">
          {listData.name}
        </h2>
      </div>
    </div>
  );
}
