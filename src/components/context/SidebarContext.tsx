import React, { useCallback, useState } from 'react';
import type { PropsWithChildren } from 'react';

import type { ShowAddItemOptions } from '@/components/layouts/layout';

import type { Item } from '@/types/Item.interface';

type SidebarContextType = {
  item: Item | null;
  categoryId: number | null;
  show: (item: Item, categoryId: number) => void;
  hide: (mobile?: boolean) => void;
  shownListId: number | undefined;
  setShownListId: React.Dispatch<
    React.SetStateAction<number | undefined | undefined>
  >;
  sidebarOption: ShowAddItemOptions | undefined;
  setSidebarOption: React.Dispatch<
    React.SetStateAction<ShowAddItemOptions | undefined>
  >;
};

export const SidebarContext = React.createContext<SidebarContextType | null>(
  null
);

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
        setShownListId: setCurrentList,
        shownListId: currentList,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export default SidebarContextProvider;
