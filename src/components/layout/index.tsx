import { partitionId } from '@/constants/partition-id';
import { refreshHandler } from '@/core/states/refresh.state';
import { useSearchData } from '@/hooks/useSearch';
import { useTags } from '@/hooks/useTags';
import { uploadFile } from '@/lib/api/file.api';
import { cleanActiveKey } from '@/lib/utils';
import SearchResults from '@/pages/search-results-page';
import { useConfigApp } from '@/providers/AppConfig';
import {
  InteractionTag,
  InteractionTagPrimary,
  Spinner,
} from '@fluentui/react-components';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SelectedTagIndicator from '../tag-indicator';
import UploadModal from '../upload-modal';
import { HeaderLayout } from './header';
import { InfoPanelV2 } from './info-panel';
import { Sidebar } from './sidebar';
import { usePartitions } from '@/providers/PartitionsContext';
export function UfyleLayout() {
  const { config } = useConfigApp();
  const { partitions } = usePartitions();
  const { dataGlobalSearch, loadingGlobalSearch } = useSearchData();
  const { tagItems, setTagItems } = useTags();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedItemKey, setSelectedItemKey] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const activeKey = searchParams.get('ak');
  const qString = searchParams.get('q');

  useEffect(() => {
    const cleanedKey = cleanActiveKey(activeKey);
    setSelectedItemKey(cleanedKey);
  }, [activeKey]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);

    if (files.length === 0) return;

    setUploadFiles(files);
    setIsModalVisible(true);
  }, []);

  const tableContainerClass = `w-full relative flex flex-col h-screen overflow-y-auto text-gray-900 bg-gray-100 bg-white
    ${isDragging ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
    ${isUploading ? 'opacity-70' : ''}`;

  const handleUploadConfirm = async (
    filesWithTags: Array<{ file: File; tags: string[] }>
  ) => {
    setIsUploading(true);
    try {
      for (const { file, tags } of filesWithTags) {
        await uploadFile({
          file,
          serverApiUrl: config.serverApiUrl,
          metaInfo: {
            name: file.name,
            tags: tags.join(','),
          },
          partitionId,
        });
      }
      setIsModalVisible(false);
      toast.success('Uploaded file ssuccessfully');
    } catch (error) {
      toast.success(`Error upload file: ${error}`);
    } finally {
      setIsUploading(false);
      setUploadFiles([]);
      refreshHandler(activeKey as string);
    }
  };

  return (
    <div className="flex h-screen text-gray-900 bg-gray-100">
      <UploadModal
        files={uploadFiles}
        isVisible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setUploadFiles([]);
        }}
        onConfirm={handleUploadConfirm}
        tagItems={tagItems}
        setTagItems={setTagItems}
      />
      <Sidebar
        partitions={partitions}
        appConfig={config}
      />

      <div className="flex flex-col flex-1">
        {/* Header toolbar */}
        <HeaderLayout selectedItemKey={selectedItemKey} />

        {/* Actions toolbar */}
        <div className="flex items-center h-12 gap-2 px-2 bg-white border-b border-gray-300 shadow-sm">
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1 text-sm rounded cursor-pointer hover:bg-gray-200">
              <Plus size={16} />
              New
            </button>
            <div className="w-px h-4 mx-1 bg-gray-400" />
            {tagItems && tagItems.length > 0 && (
              <>
                {tagItems.map((item, index) => (
                  <InteractionTag
                    key={index}
                    onClick={() => {
                      setSearchParams({
                        ...Object.fromEntries(searchParams.entries()),
                        typeS: 'ref_t',
                        q: item,
                      });
                    }}>
                    <InteractionTagPrimary>
                      <div className="flex items-center justify-center gap-[4px]">
                        <div className="text-[12px] font-medium">#</div>
                        <div className="text-[12px] font-medium">{item}</div>
                      </div>
                    </InteractionTagPrimary>
                  </InteractionTag>
                ))}
              </>
            )}
          </div>
          <div className="flex-1" />
          <SelectedTagIndicator
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>

        <div
          className={tableContainerClass}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          {qString && qString !== '' ? (
            loadingGlobalSearch ? (
              <Spinner
                size="extra-small"
                label="Searching..."
              />
            ) : (
              <SearchResults dataSearch={dataGlobalSearch} />
            )
          ) : (
            <Outlet />
          )}
        </div>
      </div>

      {/* Info Panel */}
      <InfoPanelV2 />
    </div>
  );
}
