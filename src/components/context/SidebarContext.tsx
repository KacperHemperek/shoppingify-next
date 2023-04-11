import React, { PropsWithChildren, useCallback, useState } from 'react';
import { ShowAddItemOptions } from '@/components/layounts/layout';
import { Item } from '@/types/Item.interface';

type SidebarContextType = {
  item: Item | null;
  categoryId: string | null;
  show: (item: Item, categoryId: string) => void;
  hide: (mobile?: boolean) => void;
  sidebarOption: ShowAddItemOptions | undefined;
  setSidebarOption: React.Dispatch<
    React.SetStateAction<ShowAddItemOptions | undefined>
  >;
};

export const SidebarContext = React.createContext<SidebarContextType>({
  item: null,
  categoryId: null,
  show: () => {},
  hide: () => {},
  sidebarOption: undefined,
  setSidebarOption: () => {},
});

function SidebarContextProvider({ children }: PropsWithChildren) {
  const [sidebarOption, setSidebarOption] = useState<
    ShowAddItemOptions | undefined
  >();
  const [item, setItem] = useState<Item | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const show = useCallback((item: Item, categoryId: string) => {
    setItem(item);
    setCategoryId(categoryId);
    setSidebarOption('itemInfo');
  }, []);

  const hide = (mobile: boolean = false) => {
    setItem(null);
    setSidebarOption(mobile ? undefined : 'cart');
  };

  return (
    <SidebarContext.Provider
      value={{ sidebarOption, setSidebarOption, item, show, hide, categoryId }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export default SidebarContextProvider;
