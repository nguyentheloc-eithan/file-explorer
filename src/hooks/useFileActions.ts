/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useFileActions.ts

import { partitionId } from '@/constants/partition-id';
import { refreshHandler } from '@/core/states/refresh.state';
import { deleteFile } from '@/lib/api/file.api';
import { useConfigApp } from '@/providers/AppConfig';
import { IFileBase } from '@/types/file.type';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface FileInfo {
  id: string;
  name?: string;
}
interface ICopyFileFnc {
  fileId: string;
}

export const useFileActions = () => {
  const { config } = useConfigApp();
  const urlWithPid = `${config.serverApiUrl}/ufyle/partition/${partitionId}`;

  const [searchParams] = useSearchParams();
  const activeKey = searchParams.get('ak');

  const handleDownload = async (file: IFileBase) => {
    if (!file?.id) {
      toast.error('No file selected for download.');
      return;
    }

    try {
      const fileId = file.id.split(':')[1];
      const urlDownload = `${config.serverApiUrl}/ufyle/partition/${partitionId}/file/${fileId}`;

      const a = document.createElement('a');
      a.href = urlDownload;
      a.download = file.name || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file.');
    }
  };

  const handleShare = async (file: FileInfo) => {
    // Implement share functionality here
  };

  const copyFile = async ({ fileId }: ICopyFileFnc) => {
    const urlCopy = `${urlWithPid}/file/copy/${fileId}`;
    try {
      const response = await axios.post(urlCopy);

      return {
        data: response.data.success ? response.data.data : null,
        error: response.data.success ? null : response.data.error,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || 'An unknown error occurred';

      return {
        data: null,
        error: errorMessage,
      };
    }
  };

  const moveFile = async (fileId: string, name: string) => {
    const urlMove = `${urlWithPid}/move/${fileId}?name=${name}`;
    try {
      const response = await axios.post(urlMove);

      return {
        data: response.data.success ? response.data.data : null,
        error: response.data.success ? null : response.data.error,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || 'An unknown error occurred';

      return {
        data: null,
        error: errorMessage,
      };
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteFile({
        fileId: fileId,
        partitionId: partitionId,
        serverApiUrl: config.serverApiUrl,
      });
    } finally {
      refreshHandler(activeKey || '');
    }
  };

  return {
    handleDownload,
    handleShare,
    handleDelete,
    copyFile,
    moveFile,
  };
};
