// hooks/useFileActions.ts
import { backend_url } from '@/configs/app-config';
import { partitionId } from '@/constants/partition-id';
import { refreshHandler } from '@/core/states/refresh.state';
import { deleteFile } from '@/lib/api/file.api';
import { IFileBase } from '@/types/file.type';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface FileInfo {
  id: string;
  name?: string;
}

export const useFileActions = () => {
  const [searchParams] = useSearchParams();
  const activeKey = searchParams.get('ak');

  const handleDownload = async (file: IFileBase) => {
    if (!file?.id) {
      toast.error('No file selected for download.');
      return;
    }

    try {
      const fileId = file.id.split(':')[1];
      const urlDownload = `${backend_url}/ufyle/partition/${partitionId}/file/${fileId}`;

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
    console.log('Sharing file:', file);
  };
  const handleDelete = async (fileId: string) => {
    try {
      await deleteFile({
        fileId: fileId,
        partitionId: partitionId,
        serverApiUrl: backend_url,
      });
    } finally {
      refreshHandler(activeKey || '');
    }
  };

  return {
    handleDownload,
    handleShare,
    handleDelete,
  };
};
