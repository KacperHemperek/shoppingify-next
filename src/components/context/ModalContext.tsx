import {
  type PropsWithChildren,
  type ReactNode,
  createContext,
  useState,
} from 'react';

import { useModal } from '@/hooks/useModal';

function Modal({ children }: PropsWithChildren) {
  const { closeModal } = useModal();

  return (
    <div
      onClick={closeModal}
      className="fixed bg-neutral-dark/20 w-screen h-screen z-50 flex backdrop-blur-[2px] p-6 items-center justify-center"
    >
      <div className="max-w-sm bg-neutral-extralight rounded-xl p-6">
        {children}
      </div>
    </div>
  );
}

type ModalContextType = {
  closeModal: () => void;
  openModal: (modalContent: ReactNode) => void;
  modalVisible: boolean;
};

const initialModalContextData: ModalContextType = {
  /* eslint-disable  @typescript-eslint/no-empty-function */
  closeModal: () => {},
  /* eslint-disable  @typescript-eslint/no-empty-function */
  openModal: () => {},
  modalVisible: false,
};

export const ModalContext = createContext<ModalContextType>(
  initialModalContextData
);

function ModalContextProvider({ children }: PropsWithChildren) {
  const [modalVisible, setModalVisible] = useState(
    initialModalContextData.modalVisible
  );
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  const openModal = (modalContent: ReactNode) => {
    setModalVisible(true);
    setModalContent(modalContent);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ closeModal, openModal, modalVisible }}>
      {modalVisible && modalContent && <Modal>{modalContent}</Modal>}
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContextProvider;
