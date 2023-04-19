import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  changeItemAmount,
  getCategories,
  removeItem,
  type NewListItem,
} from '@/redux/slices/newListSlice';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

function CartItem(item: NewListItem) {
  const dispatch = useAppDispatch();

  function handleIncrementAmount() {
    dispatch(
      changeItemAmount({
        categoryName: item.category,
        itemId: item.id,
        type: 'increment',
      })
    );
  }

  function removeItemFromList() {
    dispatch(removeItem({ categoryName: item.category, itemId: item.id }));
  }

  function handleDecrementAmount() {
    dispatch(
      changeItemAmount({
        categoryName: item.category,
        itemId: item.id,
        type: 'decrement',
      })
    );
  }

  return (
    <div className="flex h-full items-center justify-between">
      <div className="truncate text-lg font-medium">{item.name}</div>{' '}
      <div className="group flex items-center gap-2 rounded-lg py-1 pr-2 text-primary hover:bg-white hover:py-0 md:py-2 md:pr-2">
        <button
          onClick={removeItemFromList}
          className="hidden rounded-lg bg-primary px-1 py-2 group-hover:block md:px-2 md:py-3 "
        >
          <TrashIcon className="h-6 w-6 text-white" />
        </button>{' '}
        <button
          onClick={handleDecrementAmount}
          className="hidden transition-all group-hover:block"
        >
          <MinusIcon className="h-6 w-6 " />
        </button>{' '}
        <div className="w-max rounded-full border-2 border-primary px-4 py-1 text-sm ">
          <span className="font-semibold">{item.amount}</span> psc
        </div>
        <button
          onClick={handleIncrementAmount}
          className="hidden transition-all group-hover:block"
        >
          <PlusIcon className="h-6 w-6 " />
        </button>{' '}
      </div>
    </div>
  );
}

export default function Cart() {
  const categories = useAppSelector(getCategories);

  return (
    <div
      className="flex h-full flex-col justify-between bg-primary-light"
      key={'cart'}
    >
      <div className="overflow-y-auto px-4 py-8 xl:p-12">
        <div className="mb-12 rounded-3xl bg-secondary p-6 text-neutral-extralight">
          <h3 className="mb-4 font-bold">Didn’t find what you need?</h3>
          <button className="rounded-xl bg-white px-6 py-2 font-bold text-neutral-dark">
            Add Item
          </button>
        </div>
        <h2 className="mb-6 text-2xl font-bold text-neutral-dark">
          New shopping list
        </h2>
        <div className="space-y-6">
          {categories.map(([categoryName, items]) => (
            <div className="flex w-full flex-col" key={categoryName}>
              <h3 className="mb-2 text-xs font-medium text-[#828282] ">
                {categoryName}
              </h3>
              <div className="flex flex-col space-y-2 ">
                {items.map((item) => (
                  <CartItem {...item} key={item.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-0 bg-white p-4 xl:px-12 xl:py-6">
        <form className="flex overflow-hidden rounded-xl border-2 border-primary">
          <input type="text" className="grow p-2 outline-none" />
          <button className="rounded-l-lg bg-primary px-4 py-3 font-semibold text-white">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
