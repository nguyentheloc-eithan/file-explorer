import { backend_url } from '@/configs/app-config';
import { partitionId } from '@/constants/partition-id';
import { useTriggerRefresh } from '@/core/states/refresh.state';
import { deleteFile, getStats } from '@/lib/api/file.api';
import { FileMeta } from '@/types/file.type';
import useSWR from 'swr';

const RECENT_FILES_CACHE_KEY = (serverUrl: string) =>
  `${serverUrl}/ufyle/partition/${partitionId}/stats/RECENT_FILES`;

export const useRecentPage = () => {
  const cacheKey = RECENT_FILES_CACHE_KEY(backend_url);
  const { refreshRecent, setRefreshRecent } = useTriggerRefresh();

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

  if (refreshRecent) {
    mutate(undefined, {
      revalidate: true,
    });
    setRefreshRecent(false);
  }

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

      mutate(undefined, {
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
      console.error('Error deleting file:', err);
      throw err;
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
