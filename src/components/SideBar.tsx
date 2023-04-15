import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm, FormProvider } from 'react-hook-form';
import DropDown from '@/components/DropDown';
import useSidebar from '@/hooks/useSidebar';
import { api } from '@/utils/api';
import { useAppSelector } from '@/redux/hooks';
import { getCategories } from '@/redux/slices/newListSlice';

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="flex w-fit font-semibold text-primary" onClick={onClick}>
      <div className="mr-2">&#8592;</div>
      <div>back</div>
    </button>
  );
}

function ItemInfo() {
  const { item, setSidebarOption } = useSidebar();
  const utils = api.useContext();

  const { mutateAsync: deleteItemMutation } = api.item.delete.useMutation({
    onSuccess: () => {
      utils.item.getAll.invalidate();
    },
  });

  const { hide } = useSidebar();

  if (!item) {
    return <div>There was a problem retrieving item</div>;
  }

  async function deleteItem(itemId: number, categoryName: string) {
    try {
      await deleteItemMutation({ itemId, categoryName });

      setSidebarOption('cart');
    } catch (e) {}
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
          disabled={false}
          className="submit-button px-6 py-4"
        >
          Add to list
        </button>
      </div>
    </div>
  );
}

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

  const { mutateAsync: createItemMutation, isLoading: creatingItem } =
    api.item.add.useMutation({
      onSuccess: () => {
        utils.item.getAll.invalidate();
      },
    });

  const addNewItem = async (data: AddItemType) => {
    try {
      const categoryId = dropdownOptions?.find(
        (option) => option.name.toLowerCase() === data.category.toLowerCase()
      )?.id;
      await createItemMutation({
        categoryName: data.category.trim(),
        desc: data.desc.trim(),
        name: data.name.trim(),
        categoryId,
      });

      console.log(data);
      reset();
      setSidebarOption('cart');
    } catch (e) {
      console.log(e);
    }
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

const x = '100%';

const variants = {
  enter: {
    x,
  },
  center: {
    x: 0,
  },
  exit: {
    x: 0,
  },
};

function DesktopSideBar() {
  const { sidebarOption, item } = useSidebar();

  return (
    <div className="hidden w-[calc(100%-72px)] md:block md:w-full md:max-w-[300px] xl:max-w-sm">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          variants={variants}
          animate={'center'}
          initial={'enter'}
          exit={'exit'}
          key={sidebarOption}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
          className="h-screen bg-neutral-extralight md:relative "
        >
          {sidebarOption === 'addItem' && <AddItemForm key="addItem" />}
          {sidebarOption === 'cart' && (
            <div className="flex h-full bg-primary-light" key={'cart'}></div>
          )}
          {sidebarOption === 'itemInfo' && item && (
            <ItemInfo key={'itemInfo'} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MobileSideBar() {
  const { sidebarOption, item } = useSidebar();

  return (
    <motion.div
      key="sidebar"
      animate={sidebarOption ? { x: 0 } : { x: '100%' }}
      transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
      className="fixed right-0 h-screen max-h-screen w-[calc(100vw-72px)] bg-slate-50 md:hidden"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          variants={variants}
          animate={'center'}
          initial={'enter'}
          exit={'exit'}
          key={sidebarOption}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
          className="h-screen bg-neutral-extralight"
        >
          {sidebarOption === 'addItem' && <AddItemForm key="addItem" />}
          {sidebarOption === 'cart' && (
            <div className="flex h-full bg-primary-light" key={'cart'}>
              Cart
            </div>
          )}
          {sidebarOption === 'itemInfo' && item && (
            <ItemInfo key={'itemInfo'} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function SideBar() {
  const { setSidebarOption } = useSidebar();

  useEffect(() => {
    if (window.innerWidth > 768) {
      setSidebarOption('cart');
    }
  }, [setSidebarOption]);

  return (
    <>
      <DesktopSideBar />
      <MobileSideBar />
    </>
  );
}

export default SideBar;
