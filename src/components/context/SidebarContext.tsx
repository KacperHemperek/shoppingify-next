import React, { useCallback, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { ShowAddItemOptions } from '@/components/layounts/layout';
import type { Item } from '@/types/Item.interface';

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
  /* eslint-disable  @typescript-eslint/no-empty-function */
  show: () => {},
  /* eslint-disable  @typescript-eslint/no-empty-function */
  hide: () => {},
  sidebarOption: undefined,
  /* eslint-disable  @typescript-eslint/no-empty-function */
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

  const hide = (mobile = false) => {
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
