import { backend_url } from '@/configs/app-config';
import { partitionId } from '@/constants/partition-id';
import { useFileStore } from '@/core/states/file.state';
import { useTriggerRefresh } from '@/core/states/refresh.state';
import { downloadFile } from '@/lib/api/file.api';
import { capitalizeFirstLetter, cleanActiveKey, formatters } from '@/lib/utils';
import { FileMeta } from '@/types/file.type';
import dayjs from 'dayjs';
import { Check, DownloadIcon, Edit, FileText, Share, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const InfoPanel = () => {
  const [searchParams] = useSearchParams();
  const [selectedItemKey, setSelectedItemKey] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const { selectedFile } = useFileStore();
  const [selectedFileMeta, setSelectedFileMeta] = useState<FileMeta | null>();
  const [editedValues, setEditedValues] = useState<{
    [K in keyof FileMeta]?: string | number | string[];
  }>({});
  const [editedTags, setEditedTags] = useState<string>('');
  const activeKey = searchParams.get('ak');
  const { setRefreshRecent, setRefreshHome } = useTriggerRefresh();

  useEffect(() => {
    const cleanedKey = cleanActiveKey(activeKey);
    setSelectedItemKey(cleanedKey);
  }, [activeKey, searchParams]);

  // Reset edit mode when selected file changes
  useEffect(() => {
    setIsEditing(false);
  }, [selectedFile]);

  console.log('selectedFileMeta', selectedFileMeta);
  useEffect(() => {
    const getFileMeta = async () => {
      if (!selectedFile?.id) return;

      try {
        const urlGet = `${backend_url}/ufyle/partition/${partitionId}/file/${
          selectedFile.id.split(':')[1]
        }/meta`;
        const response = await fetch(urlGet);
        const data = await response.json();
        if (data.success) {
          setSelectedFileMeta(data.data);
          setEditedValues(data.data);
          // Initialize tags string from refs
          const tags =
            data.data.refs
              ?.filter((ref: string) => ref.startsWith('tag:'))
              .map((tag: string) => tag.replace('tag:', ''))
              .join(', ') || '';
          setEditedTags(tags);
        }
      } catch (error) {
        console.error('Error fetching file metadata:', error);
        setSelectedFileMeta(null);
      }
    };

    getFileMeta();
  }, [selectedFile]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedValues(selectedFileMeta || {});
    // Reset tags input with current tags
    const tags =
      selectedFileMeta?.refs
        ?.filter((ref) => ref.startsWith('tag:'))
        .map((tag) => tag.replace('tag:', ''))
        .join(', ') || '';
    setEditedTags(tags);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues(selectedFileMeta || {});
  };
  const handleSave = async () => {
    const toastId = toast.loading('Saving changes...', {
      position: 'top-right',
      autoClose: false,
      hideProgressBar: true,
    });

    try {
      const currentRefs =
        selectedFileMeta?.refs?.filter((ref) => !ref.startsWith('tag:')) || [];
      const newTags = editedTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag)
        .map((tag) => `tag:${tag}`);

      const updatedValues = {
        ...editedValues,
        refs: [...currentRefs, ...newTags],
      };

      const updateUrl = `${backend_url}/ufyle/partition/${partitionId}/file/${selectedFileMeta?.id}/meta`;
      const response = await fetch(updateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedValues),
      });

      const data = await response.json();

      if (data.success) {
        if (activeKey == 'home') {
          setRefreshHome(true);
        } else if (activeKey == 'recent') {
          setRefreshRecent(true);
        }
        setSelectedFileMeta(updatedValues as FileMeta);
        toast.update(toastId, {
          render: 'Save successful!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(toastId, {
          render: 'Error saving file data.',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error saving file metadata:', error);
      toast.update(toastId, {
        render: 'Error saving file data.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsEditing(false);
    }
  };
  const handleInputChange = (field: keyof FileMeta, value: string) => {
    const newVal = { ...editedValues, [field]: value };
    setEditedValues(newVal);
  };

  const handleDownload = async () => {
    if (!selectedFile?.id) {
      toast.error('No file selected for download.');
      return;
    }

    try {
      await downloadFile(backend_url, partitionId, selectedFile);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const DetailField = ({
    label,
    value,
    field,
    editable = true,
    isTag = false,
  }: {
    label: string;
    value: string | undefined;
    field: keyof FileMeta;
    editable?: boolean;
    isTag?: boolean;
  }) => (
    <div className="grid items-center grid-cols-2 gap-2">
      <span className="text-gray-400">{label}</span>
      {isEditing && editable ? (
        isTag ? (
          <input
            type="text"
            value={editedTags}
            onChange={(e) => {
              e.target.focus();
              setEditedTags(e.target.value);
            }}
            placeholder="tag1, tag2, tag3"
            className="bg-[#333] px-2 py-1 rounded text-white text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        ) : (
          <input
            type="text"
            defaultValue={editedValues[field]?.toString() || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="bg-[#333] px-2 py-1 rounded text-white text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
  return (
    <div className="w-80 bg-[#202020] border-l border-gray-800 flex flex-col overflow-y-auto overflow-x-hidden">
      {selectedFile ? (
        <>
          <div className="flex flex-col flex-1 p-4">
            <div className="flex justify-center mt-4 mb-8">
              <div className="relative">
                <FileText
                  size={64}
                  // className="text-red-500"
                />
                <div className="absolute w-6 h-6 bg-white rounded-sm -right-2 -bottom-2" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold break-words">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedValues.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-[#333] px-2 py-1 rounded text-white text-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  selectedFileMeta?.name || selectedFile.name
                )}
              </h2>
              <div className="flex items-center justify-start gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center justify-center gap-2 px-3 py-1.5 bg-green-600 rounded-md text-[13px] hover:bg-green-700">
                      <Check size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[#333] rounded-md text-[13px] hover:bg-[#444]">
                      <X size={16} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#333] rounded-md text-[13px] hover:bg-[#444]">
                      <Edit size={16} />
                      Edit
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#333] rounded-md text-[13px] hover:bg-[#444]">
                      <Share size={16} />
                      Share
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#333] rounded-md text-[13px] hover:bg-[#444]">
                      <DownloadIcon size={16} />
                      Download
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-8">
              <h3 className="mb-4 font-semibold">Details</h3>
              <div className="space-y-2 text-[13px]">
                <div className="grid items-center grid-cols-2 gap-2">
                  <span className="text-gray-400">{'Alias'}</span>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={selectedFileMeta?.alias}
                      onChange={(e) =>
                        handleInputChange('alias', e.target.value)
                      }
                      className="bg-[#333] px-2 py-1 rounded text-white text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <span>{selectedFileMeta?.alias}</span>
                  )}
                </div>
                {selectedFileMeta && (
                  <>
                    <DetailField
                      label="Size"
                      value={formatters.fileSize(selectedFileMeta.size)}
                      field="size"
                      editable={false}
                    />
                    <DetailField
                      label="Modified"
                      value={dayjs(
                        selectedFileMeta.mtime || '2025-02-08T08:35:19+07:00'
                      ).format('DD/MM/YYYY HH:mm')}
                      field="mtime"
                      editable={false}
                    />
                    <DetailField
                      label="Tags"
                      value={selectedFileMeta.refs
                        ?.filter((ref) => ref.startsWith('tag:'))
                        .map((tag) => tag.replace('tag:', ''))
                        .join(', ')}
                      field="refs"
                      isTag={true}
                    />
                  </>
                )}
              </div>
              <div className="mt-4">
                <h3 className="mb-2 font-semibold">Synopsis</h3>
                {isEditing ? (
                  <textarea
                    value={editedValues.synopsis || ''}
                    onChange={(e) =>
                      handleInputChange('synopsis', e.target.value)
                    }
                    className="w-full h-24 bg-[#333] px-2 py-1 rounded text-white text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-[13px] text-gray-400">
                    {selectedFileMeta?.synopsis}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <h3 className="mb-2 font-semibold">Comment</h3>
                {isEditing ? (
                  <textarea
                    value={editedValues.comment || ''}
                    onChange={(e) =>
                      handleInputChange('comment', e.target.value)
                    }
                    className="w-full h-24 bg-[#333] px-2 py-1 rounded text-white text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-[13px] text-gray-400">
                    {selectedFileMeta?.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4">
          <h2 className="mb-4 font-semibold">
            {capitalizeFirstLetter(selectedItemKey)}
          </h2>
          <p className="text-[13px] text-gray-400">
            Select a single file to get more information and share your cloud
            content.
          </p>
        </div>
      )}
    </div>
  );
};
