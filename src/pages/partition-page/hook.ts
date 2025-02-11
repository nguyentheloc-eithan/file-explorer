import { useTriggerRefresh } from '@/core/states/refresh.state';
import { deleteFile, getStats } from '@/lib/api/file.api';
import { useConfigApp } from '@/providers/AppConfig';
import { FileMeta } from '@/types/file.type';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSWR from 'swr';

export const usePartitionPage = () => {
  const { config } = useConfigApp();
  const [searchParams] = useSearchParams();
  const partitionId = searchParams.get('pid');

  const RECENT_FILES_CACHE_KEY = (serverUrl: string) =>
    `${serverUrl}/ufyle/partition/${partitionId}/stats/RECENT_FILES`;

  const cacheKey = RECENT_FILES_CACHE_KEY(config.serverApiUrl);
  const { refreshRecent, setRefreshRecent } = useTriggerRefresh();

  const fetcher = async () => {
    const data = await getStats({
      partitionId: partitionId || '',
      serverApiUrl: config.serverApiUrl,
      typeResponse: 'TOP_FILES',
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

  useEffect(() => {
    if (refreshRecent) {
      mutate(undefined, {
        revalidate: true,
      });
      setRefreshRecent(false);
    }
  }, [refreshRecent, mutate, setRefreshRecent]);

  const editMetaInfo = async (newMetaFile: FileMeta) => {
    try {
      const updateUrl = `${config.serverApiUrl}/ufyle/partition/${partitionId}/file/${newMetaFile?.id}/meta`;

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
        partitionId: partitionId || '',
        serverApiUrl: config.serverApiUrl,
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
