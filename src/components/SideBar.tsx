import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { useUser } from '@/hooks/useUser';
import DropDown from '@/components/DropDown';
import useSidebar from '@/hooks/useSidebar';

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="flex w-fit font-semibold text-primary" onClick={onClick}>
      <div className="mr-2">&#8592;</div>
      <div>back</div>
    </button>
  );
}

function ItemInfo() {
  const { item, categoryId, setSidebarOption } = useSidebar();

  const { hide } = useSidebar();

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
          onClick={async () => {
            setSidebarOption('cart');
          }}
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

function useDropdownOptions() {
  //TODO: get dropdown options from

  return {};
}

function useAddItem() {
  const { user } = useUser();
  //TODO: add item to database
}

const AddItemSchema = z.object({
  name: z.string().min(1, 'Required'),
  desc: z.string().min(1, 'Required'),
  category: z.string().min(1, 'Required'),
});

export type AddItemType = z.infer<typeof AddItemSchema>;

//FIXME: isValid not updating only on category change
function AddItemForm() {
  const { setSidebarOption } = useSidebar();

  const methods = useForm<AddItemType>({
    resolver: zodResolver(AddItemSchema),
  });

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { isValid },
    watch,
  } = methods;

  const watchCategory = watch('category');
  const {} = useDropdownOptions();
  // const { mutateAsync: addItem, isLoading, error } = useAddItem();

  const addNewItem = async (data: AddItemType) => {
    const item: { name: string; desc: string } = {
      name: data.name,
      desc: data.desc,
    };
    //TODO: update options
    // const categoryId = options?.find(
    //   (option) => option.value.toLowerCase() === data.category.toLowerCase()
    // )?.id;

    // await addItem({
    //   item,
    //   categoryId,
    //   categoryName:
    //     data.category.trim() === '' ? undefined : data.category.trim(),
    // });

    reset();
    setSidebarOption('cart');
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
              className=" rounded-xl border-2 border-neutral-light p-4 outline-2 outline-primary transition-all placeholder:text-sm placeholder:text-neutral-light focus:placeholder:text-primary"
              placeholder={'Enter an name'}
              disabled={false}
            />
          </label>
          <label htmlFor="email" className="label mb-6">
            <span className="mb-2">Note (optional)</span>
            <textarea
              {...register('desc')}
              rows={3}
              className=" resize-none rounded-xl border-2 border-neutral-light p-4 outline-2 outline-primary transition-all placeholder:text-sm placeholder:text-neutral-light focus:placeholder:text-primary"
              placeholder={'Enter an note'}
              disabled={false}
            />
          </label>
          <label className="label mb-2">Category</label>
          {/* TODO: pass options tp dropdown */}
          <DropDown
            placeholder="Enter a category"
            options={[]}
            setValue={setValue}
            inputName="category"
            value={watchCategory}
            disabled={false}
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
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button px-6 py-4"
            disabled={!isValid}
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
            <div className="flex h-full bg-primary-light" key={'cart'}>
              Cart
            </div>
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
  const { sidebarOption, item, categoryId } = useSidebar();

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
  }, []);

  return (
    <>
      <DesktopSideBar />
      <MobileSideBar />
    </>
  );
}

export default SideBar;
