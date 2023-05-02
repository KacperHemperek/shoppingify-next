import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

import { useModal } from '@/hooks/useModal';
import useSidebar from '@/hooks/useSidebar';

import { formatErrorMessage } from '@/lib/trpcErrorFormater';

import { api } from '@/utils/api';

function useChangeListStatus({
  succesToastMessage,
  onSuccess,
  onError,
}: {
  succesToastMessage: string;
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const apiUtils = api.useContext();

  return api.list.changeStatus.useMutation({
    onSuccess: () => {
      onSuccess && onSuccess();
      toast.success(succesToastMessage);
      apiUtils.list.getCurrentListId.invalidate();
      apiUtils.list.getAll.invalidate();
      apiUtils.list.getListById.invalidate();
    },
    onError: (err) => {
      onError && onError();
      toast.error(formatErrorMessage(err) ?? 'Unknown error occured');
    },
  });
}

function ConfirmCancelListModal() {
  const { closeModal } = useModal();
  const { setSidebarOption } = useSidebar();
  const router = useRouter();

  const { mutate } = useChangeListStatus({
    succesToastMessage: 'Your current list was cancelled',
    onError: closeModal,
    onSuccess: () => {
      closeModal();
      window.innerWidth <= 768 && setSidebarOption(undefined);
      router.push('/history');
    },
  });

  const onListCancel = () => {
    mutate({ status: 'cancelled' });
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex justify-between mb-4 items-start">
        <h3 className="text-xl font-medium ">Canceling current list</h3>
        <button className="" onClick={closeModal}>
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
      <p className="mb-6">
        If you <span className="font-medium text-danger">cancel</span> this list
        there is no way to make it your{' '}
        <span className="font-medium text-primary">current</span> list again.
        Are you sure you want to still cancel it?
      </p>
      <div className="self-end space-x-6">
        <button
          className="rounded-lg py-2 px-4 font-medium"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          className="bg-danger rounded-lg py-2 px-4 text-white font-medium"
          onClick={onListCancel}
        >
          Yes
        </button>
      </div>
    </div>
  );
}

export default function CurrentListActionButtons() {
  const { openModal } = useModal();
  const { setSidebarOption } = useSidebar();
  const router = useRouter();

  const { mutate } = useChangeListStatus({
    succesToastMessage: 'Your current list was completed',
    onSuccess: () => {
      window.innerWidth <= 768 && setSidebarOption(undefined);
      router.push('/history');
    },
  });

  const onCancel = () => {
    openModal(<ConfirmCancelListModal />);
  };
  const onComplete = () => {
    mutate({ status: 'completed' });
  };

  return (
    <div className="flex space-x-6 justify-evenly p-4 bg-white">
      <button
        className="rounded-xl py-2 px-3 md:py-3 md:px-5 w-min font-medium transition hover:bg-danger hover:text-white"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        onClick={onComplete}
        className="font-medium bg-success rounded-xl text-white py-2 px-3 md:py-3 md:px-5 w-min"
      >
        Complete
      </button>
    </div>
  );
}
