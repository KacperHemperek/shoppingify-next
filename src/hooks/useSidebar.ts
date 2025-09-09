import { useContext } from 'react';

import { SidebarContext } from '@/components/context/SidebarContext';

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarContextProvider');
  }
  return context;
}

export default useSidebar;
