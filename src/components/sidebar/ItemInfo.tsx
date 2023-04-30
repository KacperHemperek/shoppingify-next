import useSidebar from '@/hooks/useSidebar';

import { useAppDispatch } from '@/redux/hooks';
import { addItem } from '@/redux/slices/newListSlice';

import { api } from '@/utils/api';

import { BackButton } from './BackButton';

function ItemInfo() {
  const dispatch = useAppDispatch();

  const { item, setSidebarOption } = useSidebar();
  const utils = api.useContext();

  const { mutate: deleteItemMutation } = api.item.delete.useMutation({
    onSuccess: () => {
      utils.item.getAll.invalidate();
      setSidebarOption('cart');
    },
  });

  const { hide } = useSidebar();

  if (!item) {
    return <div>There was a problem retrieving item</div>;
  }

  function deleteItem(itemId: number, categoryName: string) {
    deleteItemMutation({ itemId, categoryName });
  }

  function addToList() {
    if (item) {
      dispatch(
        addItem({
          categoryName: item.category,
          itemId: item.id,
          itemName: item.name,
        })
      );

      setSidebarOption('cart');
    }
  }

  return (
    <div className="absolute left-0 top-0 flex h-screen w-full max-w-md flex-col justify-between bg-white px-6 py-8 xl:p-8">
      <div className="">
        <div className="hidden md:block">
          <BackButton onClick={() => hide()} />
        </div>
        <div className="md:hidden">
          <BackButton onClick={() => hide(true)} />
        </div>
        <div className="my-5">
          <h3 className="mb-2 text-xs font-medium text-neutral-light">name</h3>
          <span className="text-2xl font-medium">{item?.name}</span>
        </div>
        <div className="my-5">
          <h3 className="mb-2 text-xs font-medium text-neutral-light">
            category
          </h3>
          <span className="text-lg font-medium">{item?.category}</span>
        </div>
        <div className="my-5">
          <h3 className="mb-2 text-xs font-medium text-neutral-light">note</h3>

          <span className="text-lg font-medium">{item?.desc}</span>
        </div>
      </div>
      <div className="flex space-x-6 self-center">
        {/* mobile button */}
        <button
          type="button"
          className="rounded-xl px-6 py-4 font-medium shadow-danger/30 transition hover:scale-[101%] hover:bg-danger hover:text-white hover:shadow-md md:hidden"
          onClick={async () => {
            setSidebarOption(undefined);
          }}
        >
          delete
        </button>
        {/* desktop button */}
        <button
          type="button"
          className="hidden rounded-xl px-6 py-4 font-medium shadow-danger/30 transition hover:scale-[101%] hover:bg-danger hover:text-white hover:shadow-md md:block"
          onClick={() => deleteItem(item.id, item.category)}
        >
          delete
        </button>
        <button
          type="submit"
          onClick={addToList}
          className="submit-button px-6 py-4"
        >
          Add to list
        </button>
      </div>
    </div>
  );
}

export default ItemInfo;
