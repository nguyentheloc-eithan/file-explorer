import { backend_url } from '@/configs/app-config';
import { partitionId } from '@/constants/partition-id';
import { deleteFile, getStats } from '@/lib/api/file.api';
import { FileMeta } from '@/types/file.type';
import useSWR from 'swr';

const RECENT_FILES_CACHE_KEY = (serverUrl: string) =>
  `${serverUrl}/ufyle/partition/${partitionId}/stats/RECENT_FILES`;

export const useHome = () => {
  const cacheKey = RECENT_FILES_CACHE_KEY(backend_url);

  const fetcher = async () => {
    const data = await getStats({
      partitionId: partitionId,
      serverApiUrl: backend_url,
      typeResponse: 'RECENT_FILES',
    });
    return data.data;
  };

  const {
    data: recentFiles,
    error,
    isLoading,
    mutate,
  } = useSWR(cacheKey, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
  const editMetaInfo = async (newMetaFile: FileMeta) => {
    try {
      const updateUrl = `${backend_url}/ufyle/partition/${partitionId}/file/${newMetaFile?.id}/meta`;

      const response = await fetch(updateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMetaFile),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      await mutate(undefined, {
        revalidate: true,
      });

      return result;
    } catch (error) {
      console.error('Error updating meta info:', error);
      throw error;
    }
  };

  const deleteFileData = async (fileId: string) => {
    try {
      await deleteFile({
        fileId,
        partitionId,
        serverApiUrl: backend_url,
      });
    } catch (err) {
      console.error('Error delete file:', err);
      throw error;
    }
  };

  return {
    recentFilesData: recentFiles,
    editMetaInfo,
    isLoading,
    deleteFileData,
    error,
  };
};
