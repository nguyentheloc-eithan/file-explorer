import { backend_url } from '@/configs/app-config';
import { partitionId } from '@/constants/partition-id';
import { FileMeta } from '@/types/file.type';
import { useEffect, useState } from 'react';

export const useFileMeta = (fileId: string | undefined) => {
  const [fileMeta, setFileMeta] = useState<FileMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFileMeta = async () => {
      if (!fileId) return;
      setIsLoading(true);
      try {
        const urlGet = `${backend_url}/ufyle/partition/${partitionId}/file/${
          fileId.split(':')[1]
        }/meta`;
        const response = await fetch(urlGet);
        const data = await response.json();
        if (data.success) {
          setFileMeta(data.data);
        }
      } catch (error) {
        console.error('Error fetching file metadata:', error);
        setFileMeta(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileMeta();
  }, [fileId]);

  return { fileMeta, setFileMeta, isLoading };
};
