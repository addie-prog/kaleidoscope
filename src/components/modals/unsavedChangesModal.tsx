import { Modal } from "../ui/modal";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export function UnsavedChangesModal({
  isOpen,
  onClose,
  onProceed,
}: UnsavedChangesModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[420px] m-4">
      <div
        className="bg-white rounded-2xl p-6 text-center mt-[15px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Unsaved changes detected
        </h3>

        <p className="text-sm text-gray-600 mb-6">
          Please save your changes before leaving this page.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Stay
          </button>

          <button
            onClick={onProceed}
            className="px-5 py-2 rounded-lg bg-[#EF4343] text-white hover:bg-red-600"
          >
            Leave Anyway
          </button>
        </div>
      </div>
    </Modal>
  );
}
