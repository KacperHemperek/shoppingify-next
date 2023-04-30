import { useContext } from 'react';

import { SidebarContext } from '@/components/context/SidebarContext';

function useSidebar() {
  return useContext(SidebarContext);
}

export default useSidebar;
