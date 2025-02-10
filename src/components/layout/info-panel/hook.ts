import { useState, useEffect } from 'react';
import { FileMeta } from '@/types/file.type';
import { partitionId } from '@/constants/partition-id';
import { useConfigApp } from '@/providers/AppConfig';

export const useFileMeta = (selectedFile: FileMeta | null) => {
  const { config } = useConfigApp();

  const [selectedFileMeta, setSelectedFileMeta] = useState<FileMeta | null>(
    null
  );
  const [editedValues, setEditedValues] = useState<Partial<FileMeta>>({});
  const [editedTags, setEditedTags] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [selectedFile]);

  useEffect(() => {
    const getFileMeta = async () => {
      if (!selectedFile?.id) return;

      try {
        const urlGet = `${
          config.serverApiUrl
        }/ufyle/partition/${partitionId}/file/${
          selectedFile.id.split(':')[1]
        }/meta`;
        const response = await fetch(urlGet);
        const data = await response.json();
        if (data.success) {
          setSelectedFileMeta(data.data);
          setEditedValues(data.data);
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

  return {
    selectedFileMeta,
    setSelectedFileMeta,
    editedValues,
    setEditedValues,
    editedTags,
    setEditedTags,
    isEditing,
    setIsEditing,
  };
};
