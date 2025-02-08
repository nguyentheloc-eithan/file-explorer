import { backend_url } from '@/configs/app-config';
import { partitionId } from '@/constants/partition-id';
import { useFileStore } from '@/core/states/file.state';
import { capitalizeFirstLetter, cleanActiveKey, formatters } from '@/lib/utils';
import { FileMeta } from '@/types/file.type';
import dayjs from 'dayjs';
import { Edit, FileText, Settings, Share } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
export const InfoPanel = () => {
  const [searchParams] = useSearchParams();
  const [selectedItemKey, setSelectedItemKey] = useState<string>('');

  const { selectedFile } = useFileStore();
  const [selectedFileMeta, setSelectedFileMeta] = useState<FileMeta | null>();

  useEffect(() => {
    const activeKey = searchParams.get('ak');
    const cleanedKey = cleanActiveKey(activeKey);
    setSelectedItemKey(cleanedKey);
  }, [searchParams]);

  useEffect(() => {
    const getFileMeta = async () => {
      if (!selectedFile?.id) {
        return;
      }

      try {
        const urlGet = `${backend_url}/ufyle/partition/${partitionId}/file/${
          selectedFile.id.split(':')[1]
        }/meta`;
        const response = await fetch(urlGet);
        const data = await response.json();
        if (data.success) {
          setSelectedFileMeta(data.data);
        }
      } catch (error) {
        console.error('Error fetching file metadata:', error);
        setSelectedFileMeta(null);
      }
    };

    getFileMeta();
  }, [selectedFile]);

  return (
    <div className="w-96 bg-[#202020] border-l border-gray-800 flex flex-col overflow-y-auto overflow-x-hidden">
      {selectedFile ? (
        <>
          <div className="flex flex-col flex-1 p-4">
            <div className="flex justify-center mt-4 mb-8">
              <div className="relative">
                <FileText
                  size={64}
                  className="text-red-500"
                />
                <div className="absolute w-6 h-6 bg-white rounded-sm -right-2 -bottom-2" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold break-words">
                {selectedFileMeta?.name || selectedFile.name}
              </h2>
              <div className="flex items-center justify-start gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#333] rounded-md text-sm hover:bg-[#444]">
                  <Edit size={16} />
                  Edit
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#333] rounded-md text-sm hover:bg-[#444]">
                  <Share size={16} />
                  Share
                </button>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="mb-4 font-semibold">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-400">Alias</span>
                  <span>{selectedFileMeta?.alias || selectedFile.alias}</span>
                </div>
                {selectedFileMeta && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-400">Size</span>
                      <span>{formatters.fileSize(selectedFileMeta.size)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-400">Modified</span>
                      <span>
                        {dayjs(
                          selectedFileMeta.mtime
                            ? selectedFileMeta.mtime
                            : '2025-02-08T08:35:19+07:00'
                        ).format('DD/MM/YYYY HH:mm')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-400">Tags</span>
                      <span className="break-words">
                        {selectedFileMeta.refs?.length > 0 &&
                          selectedFileMeta.refs
                            .filter((ref) => ref.startsWith('tag:'))
                            .map((tag) => tag.replace('tag:', ''))
                            .join(', ')}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4">
                <h3 className="mb-2 font-semibold">Synopsis</h3>
                <p className="text-sm text-gray-400">
                  {selectedFileMeta?.synopsis}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="mb-2 font-semibold">Comment</h3>
                <p className="text-sm text-gray-400">
                  {selectedFileMeta?.comment}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-800">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#333] rounded-md text-sm hover:bg-[#444] w-full">
              <Settings size={16} />
              Properties
            </button>
          </div>
        </>
      ) : (
        <div className="p-4">
          <h2 className="mb-4 font-semibold">
            {capitalizeFirstLetter(selectedItemKey)}
          </h2>
          <p className="text-sm text-gray-400">
            Select a single file to get more information and share your cloud
            content.
          </p>
        </div>
      )}
    </div>
  );
};
