import { Check, DownloadIcon, Edit, Share, X } from 'lucide-react';

interface FileActionsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onShare: () => void;
  onDownload: () => void;
}

export const FileActions = ({
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onShare,
  onDownload,
}: FileActionsProps) => (
  <div className="flex items-center justify-start gap-2">
    {isEditing ? (
      <>
        <button
          onClick={onSave}
          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[#0078D4] text-white rounded-md text-sm hover:bg-[#005A9E]">
          <Check size={16} />
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-300 text-gray-800 rounded-md text-sm hover:bg-gray-400">
          <X size={16} />
          Cancel
        </button>
      </>
    ) : (
      <>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-900 rounded-md text-sm hover:bg-gray-300">
          <Edit size={16} />
          Edit
        </button>
        {/* <button
          onClick={onShare}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-900 rounded-md text-sm hover:bg-gray-300">
          <Share size={16} />
          Share
        </button> */}
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-900 rounded-md text-sm hover:bg-gray-300">
          <DownloadIcon size={16} />
          Download
        </button>
      </>
    )}
  </div>
);
