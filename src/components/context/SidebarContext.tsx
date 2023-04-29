import type { ShowAddItemOptions } from '@/components/layounts/layout';
import type { Item } from '@/types/Item.interface';
import React, { useCallback, useState } from 'react';
import type { PropsWithChildren } from 'react';

type SidebarContextType = {
  item: Item | null;
  categoryId: number | null;
  show: (item: Item, categoryId: number) => void;
  hide: (mobile?: boolean) => void;
  currentListId: number | undefined;
  setCurrentListId: React.Dispatch<
    React.SetStateAction<number | undefined | undefined>
  >;
  sidebarOption: ShowAddItemOptions | undefined;
  setSidebarOption: React.Dispatch<
    React.SetStateAction<ShowAddItemOptions | undefined>
  >;
};

export const SidebarContext = React.createContext<SidebarContextType>({
  item: null,
  categoryId: null,
  /* eslint-disable  @typescript-eslint/no-empty-function */
  show: () => {},
  /* eslint-disable  @typescript-eslint/no-empty-function */
  hide: () => {},
  /* eslint-disable  @typescript-eslint/no-empty-function */
  setSidebarOption: () => {},
  /* eslint-disable  @typescript-eslint/no-empty-function */
  setCurrentListId: () => {},
  sidebarOption: undefined,
  currentListId: undefined,
});

function SidebarContextProvider({ children }: PropsWithChildren) {
  const [sidebarOption, setSidebarOption] = useState<
    ShowAddItemOptions | undefined
  >();
  const [currentList, setCurrentList] = useState<number | undefined>();
  const [item, setItem] = useState<Item | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const show = useCallback((item: Item, categoryId: number) => {
    setItem(item);
    setCategoryId(categoryId);
    setSidebarOption('itemInfo');
  }, []);

  const hide = (mobile = false) => {
    setSidebarOption(mobile ? undefined : 'cart');
  };

  return (
    <SidebarContext.Provider
      value={{
        sidebarOption,
        setSidebarOption,
        item,
        show,
        hide,
        categoryId,
        setCurrentListId: setCurrentList,
        currentListId: currentList,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export default SidebarContextProvider;
