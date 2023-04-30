import { useContext } from 'react';

import { ModalContext } from '@/components/context/ModalContext';

export function useModal() {
  return useContext(ModalContext);
}
