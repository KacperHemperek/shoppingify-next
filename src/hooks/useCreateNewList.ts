import { toast } from 'react-hot-toast';

import { formatErrorMessage } from '@/lib/trpcErrorFormater';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearList, getAllItems } from '@/redux/slices/newListSlice';

import { api } from '@/utils/api';

function useCreateNewList({
  onSuccessCallback,
}: {
  onSuccessCallback: () => void;
}) {
  const items = useAppSelector(getAllItems);
  const dispatch = useAppDispatch();
  const apiUtils = api.useContext();

  const { mutate, ...rest } = api.list.create.useMutation({
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
      items: items.map((item) => ({
        amount: item.amount,
        itemId: item.id,
        categoryId: item.categoryId,
      })),
      listName,
    });
  }

  return { createList, items, ...rest };
}

export default useCreateNewList;
