import { Button } from '@fluentui/react-components';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { TagSelector } from '../tag-selector/TagSelector';

interface FileWithTags {
  file: File;
  tags: string[];
}

interface UploadModalProps {
  files: File[];
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: (filesWithTags: FileWithTags[]) => Promise<void>;
  tagItems: string[];
  setTagItems: (tags: string[]) => void;
}

const UploadModal = ({
  files,
  isVisible,
  onCancel,
  onConfirm,
  tagItems,
  setTagItems,
}: UploadModalProps) => {
  const [fileStates, setFileStates] = useState<FileWithTags[]>(() =>
    files.map((file) => ({ file, tags: [] }))
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFileStates(files.map((file) => ({ file, tags: [] })));
  }, [files]);

  // Handle tag changes for a specific file
  const handleTagChange = (fileIndex: number, value: string[]) => {
    setFileStates((prev) =>
      prev.map((item, index) =>
        index === fileIndex ? { ...item, tags: value } : item
      )
    );
  };

  const handleAddTag = (fileIndex: number, newTag: string) => {
    setTagItems([...tagItems, newTag]);
    setFileStates((prev) =>
      prev.map((item, index) =>
        index === fileIndex ? { ...item, tags: [...item.tags, newTag] } : item
      )
    );
  };

  // New function to handle file deletion
  const handleDeleteFile = (fileIndex: number) => {
    setFileStates((prev) => prev.filter((_, index) => index !== fileIndex));
  };

  const handleConfirm = async () => {
    setIsUploading(true);
    try {
      await onConfirm(fileStates);
    } finally {
      setIsUploading(false);
      setFileStates(files.map((file) => ({ file, tags: [] })));
    }
  };

  return (
    <Modal
      title="Add Tags to Files"
      open={isVisible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button
          key="cancel"
          appearance="secondary"
          onClick={onCancel}
          disabled={isUploading}>
          Cancel
        </Button>,
        <Button
          key="upload"
          appearance="primary"
          onClick={handleConfirm}
          disabled={isUploading || fileStates.length === 0}>
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>,
      ]}>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {fileStates.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            No files selected for upload
          </div>
        ) : (
          fileStates.map((fileState, index) => (
            <div
              key={index}
              className="p-4 space-y-2 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    {fileState.file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(fileState.file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <Button
                  appearance="subtle"
                  icon={<Trash2 className="w-4 h-4 text-red-500" />}
                  onClick={() => handleDeleteFile(index)}
                  disabled={isUploading}
                  className="p-1 hover:bg-red-50"
                  aria-label="Delete file"
                />
              </div>
              <TagSelector
                selectedTags={fileState.tags}
                tagItems={tagItems}
                onTagsChange={(value) => handleTagChange(index, value)}
                onAddTag={(newTag) => handleAddTag(index, newTag)}
              />
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default UploadModal;
