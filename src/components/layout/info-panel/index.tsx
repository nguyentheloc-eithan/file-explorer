/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { FileIcon } from 'lucide-react';
import { FileActions } from './FileActions';
import { FileDetails } from './FileDetails';
import { capitalizeFirstLetter, cleanActiveKey } from '@/lib/utils';
import { FileMeta } from '@/types/file.type';
import { useFileMeta } from './hook';
import { toast } from 'react-toastify';
import { backend_url } from '@/configs/app-config';
import { partitionId } from '@/constants/partition-id';
import { useSearchParams } from 'react-router-dom';
import { useFileStore } from '@/core/states/file.state';
import { refreshHandler, useTriggerRefresh } from '@/core/states/refresh.state';
import { downloadFile } from '@/lib/api/file.api';

export const InfoPanelV2 = () => {
  const [searchParams] = useSearchParams();
  const [selectedItemKey, setSelectedItemKey] = useState<string>('');
  const { selectedFile } = useFileStore();
  const { setRefreshRecent, setRefreshHome } = useTriggerRefresh();
  const activeKey = searchParams.get('ak');
  const [isLightTheme, setIsLightTheme] = useState(false);

  const {
    selectedFileMeta,
    setSelectedFileMeta,
    editedValues,
    setEditedValues,
    editedTags,
    setEditedTags,
    isEditing,
    setIsEditing,
  } = useFileMeta(selectedFile as any);

  useEffect(() => {
    const cleanedKey = cleanActiveKey(activeKey);
    setSelectedItemKey(cleanedKey);

    // Detect system theme
    const checkTheme = window.matchMedia('(prefers-color-scheme: light)');
    setIsLightTheme(checkTheme.matches);

    // Listen for changes
    const handleThemeChange = (event: MediaQueryListEvent) => {
      setIsLightTheme(event.matches);
    };

    checkTheme.addEventListener('change', handleThemeChange);
    return () => checkTheme.removeEventListener('change', handleThemeChange);
  }, [activeKey, searchParams]);

  const handleInputChange = (field: keyof FileMeta, value: string) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedValues(selectedFileMeta || {});
    const tags =
      selectedFileMeta?.refs
        ?.filter((ref) => ref.startsWith('tag:'))
        .map((tag) => tag.replace('tag:', ''))
        .join(', ') || '';
    setEditedTags(tags);
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
      refreshHandler(activeKey as string);
    }
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

  if (!selectedFile) {
    return (
      <div
        className={`p-4 w-80 ${
          isLightTheme ? 'bg-white text-black' : 'bg-white text-black'
        }`}>
        <h2 className="mb-4 font-semibold">
          {capitalizeFirstLetter(selectedItemKey)}
        </h2>
        <p className="text-[13px]">
          Select a single file to get more information and share your cloud
          content.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-80 border-l flex flex-col overflow-y-auto overflow-x-hidden
      ${'bg-white border-gray-300 text-black'}`}>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex justify-center mt-4 mb-8">
          <div className="relative">
            <FileIcon
              size={64}
              className={'text-gray-600'}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold break-words">
            {isEditing ? (
              <input
                type="text"
                value={editedValues.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-2 py-1 rounded text-lg focus:outline-none focus:ring-1
                  ${'bg-gray-200 text-black focus:ring-blue-400'}`}
              />
            ) : (
              selectedFileMeta?.name || selectedFile.name
            )}
          </h2>
          <FileActions
            isEditing={isEditing}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
              setEditedValues(selectedFileMeta || {});
            }}
            onEdit={handleEdit}
            onShare={() => {}}
            onDownload={handleDownload}
          />
        </div>
        <FileDetails
          selectedFileMeta={selectedFileMeta}
          isEditing={isEditing}
          editedValues={editedValues}
          editedTags={editedTags}
          setEditedTags={setEditedTags}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};
