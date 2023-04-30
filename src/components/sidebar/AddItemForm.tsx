import { XMarkIcon } from '@heroicons/react/24/outline';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import useSidebar from '@/hooks/useSidebar';

import { formatErrorMessage } from '@/lib/trpcErrorFormater';

import { api } from '@/utils/api';

import DropDown from '../DropDown';

export type AddItemType = {
  name: string;
  desc: string;
  category: string;
};

function AddItemForm() {
  const { setSidebarOption } = useSidebar();

  const methods = useForm<AddItemType>();

  const { register, reset, handleSubmit, setValue, watch } = methods;

  const watchCategory = watch('category');
  const { data: dropdownOptions } =
    api.category.getCategoriesForDropdown.useQuery();

  const utils = api.useContext();

  const { mutate: createItemMutation, isLoading: creatingItem } =
    api.item.add.useMutation({
      onSuccess: () => {
        reset();
        setSidebarOption('cart');
        utils.item.getAll.invalidate();
      },
      onError: (e) => {
        toast.error(formatErrorMessage(e) ?? '');
      },
    });

  const addNewItem = async (data: AddItemType) => {
    const categoryId = dropdownOptions?.find(
      (option) => option.name.toLowerCase() === data.category.toLowerCase()
    )?.id;
    createItemMutation({
      categoryName: data.category.trim(),
      desc: data.desc.trim(),
      name: data.name.trim(),
      categoryId,
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(addNewItem)}
        className="flex h-full w-full flex-col items-center justify-between px-6 py-8 xl:px-8"
      >
        <div className=" flex w-full flex-col">
          <div className="mb-10 flex w-full items-center justify-between">
            <h1 className=" text-2xl font-medium">Add a new item</h1>
            <button
              type="button"
              onClick={() => setSidebarOption(undefined)}
              className="md:hidden"
            >
              <XMarkIcon className="h-6 w-6 text-black" />
            </button>
          </div>
          <label htmlFor="email" className="label mb-6">
            <span className="mb-2">Name</span>
            <input
              {...register('name')}
              type="text"
              className=" input"
              placeholder={'Enter an name'}
              disabled={creatingItem}
            />
          </label>
          <label htmlFor="email" className="label mb-6">
            <span className="mb-2">Note (optional)</span>
            <textarea
              {...register('desc')}
              rows={3}
              className="input"
              placeholder={'Enter an note'}
              disabled={creatingItem}
            />
          </label>
          <label className="label mb-2">Category</label>

          <DropDown
            placeholder="Enter a category"
            options={dropdownOptions ?? []}
            setValue={setValue}
            inputName="category"
            value={watchCategory}
            disabled={creatingItem}
            register={register('category')}
          />
        </div>

        <div className="flex space-x-6">
          <button
            type="button"
            className="rounded-xl px-6 py-4 font-medium transition hover:bg-danger hover:text-white"
            onClick={() => {
              setSidebarOption('cart');
            }}
            disabled={creatingItem}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button px-6 py-4"
            disabled={creatingItem}
          >
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default AddItemForm;
