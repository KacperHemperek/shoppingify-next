import { XMarkIcon } from '@heroicons/react/24/outline';

import useCreateNewList from '@/hooks/useCreateNewList';
import { useModal } from '@/hooks/useModal';

function ConfirmSaveListAsCurrentModal({
  currentListName,
  newListName,
  resetListNameInput,
}: {
  currentListName: string;
  newListName: string;
  resetListNameInput: () => void;
}) {
  const { closeModal } = useModal();

  const { createList, isLoading } = useCreateNewList({
    onSuccessCallback: () => {
      resetListNameInput();
      closeModal();
    },
  });

  const onCreateList = () => {
    createList({ listName: newListName });
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-4 items-start">
        <h3 className="text-xl font-medium ">Changing current list</h3>
        <button className="" onClick={closeModal}>
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      <p className="mb-6">
        List <span className="text-primary font-medium">{currentListName}</span>{' '}
        is now your current list, do you want to{' '}
        <span className="text-danger font-medium">cancel</span> that list and
        make <span className="text-primary font-medium"> {newListName}</span>{' '}
        your current list
      </p>

      <div className="self-end space-x-6">
        <button
          className="bg-danger rounded-lg py-2 px-4 text-white font-medium disabled:bg-neutral-light transition"
          onClick={closeModal}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          className="bg-primary rounded-lg py-2 px-4 text-white font-medium disabled:bg-neutral-light transition"
          onClick={onCreateList}
          disabled={isLoading}
        >
          Ok
        </button>
      </div>
    </div>
  );
}

export default ConfirmSaveListAsCurrentModal;
