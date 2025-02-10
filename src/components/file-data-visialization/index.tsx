import React, { useState } from 'react';
import { IFileBase } from '@/types/file.type';
import { File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';
import { useFileStore } from '@/core/states/file.state';
import { useConfigApp } from '@/providers/AppConfig';
import { partitionId } from '@/constants/partition-id';
import { renameFile } from '@/lib/api/file.api';

interface FileDataVisualizationProps {
  dataSources: IFileBase[];
  onClick?: (file: IFileBase) => void;
  handleContextMenu?: (e: React.MouseEvent, file: IFileBase) => void;
  selectedRow: IFileBase | null;
  columns: string[];
}

const HighlightText = ({
  text,
  searchTerm,
}: {
  text: string;
  searchTerm: string;
}) => {
  if (!searchTerm || !text) return <>{text}</>;

  const parts = String(text).split(new RegExp(`(${searchTerm})`, 'gi'));

  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span
            key={index}
            className="bg-yellow-200">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export function FileDataVisualization({
  dataSources,
  onClick,
  handleContextMenu,
  selectedRow,
  columns,
}: FileDataVisualizationProps) {
  const { config } = useConfigApp();
  const [searchParams] = useSearchParams();
  const searchString = searchParams.get('q') || '';
  const { targetFileRename, setTargetFileRename } = useFileStore();
  const [localData, setLocalData] = useState<IFileBase[]>(dataSources);

  const handleClick = (file: IFileBase) => {
    if (onClick) onClick(file);
  };

  const handleRightClick = (e: React.MouseEvent, file: IFileBase) => {
    if (handleContextMenu) {
      e.preventDefault();
      handleContextMenu(e, file);
    }
  };

  const handleRename = async (newName: string) => {
    if (!targetFileRename) return;

    // Update local state immediately
    setLocalData((prevData) =>
      prevData.map((file) =>
        file.id === targetFileRename.id ? { ...file, name: newName } : file
      )
    );

    try {
      await renameFile({
        values: { name: newName },
        fileId: targetFileRename.id?.split(':')[1],
        partitionId: partitionId,
        serverApiUrl: config?.serverApiUrl,
      });
    } catch (err) {
      // Even if the API call fails, we keep the local change
      console.error('Failed to rename file:', err);
    } finally {
      setTargetFileRename(null);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleRename(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename(e.currentTarget.value);
    }
  };

  // Use localData instead of dataSources for rendering
  return (
    <div className="flex-1 inline-block min-w-full overflow-auto bg-white">
      <div className="inline-block min-w-full">
        <div className="sticky top-0 bg-white border-b border-gray-200">
          <div className="grid grid-cols-[1fr_150px_300px] gap-4 px-4 py-1">
            {columns.map((column, index) => (
              <div
                key={index}
                className="font-medium text-gray-700">
                {column}
              </div>
            ))}
          </div>
        </div>
        <div>
          {localData?.map((file: IFileBase) => (
            <div
              key={file.id}
              onClick={() => handleClick(file)}
              onContextMenu={(e) => handleRightClick(e, file)}
              className={cn(
                'grid grid-cols-[1fr_150px_300px] gap-4 px-4 py-1 hover:bg-[#f5f5f5] group',
                'border-b border-gray-300 cursor-pointer select-none',
                'transition-colors duration-100',
                'hover:bg-gray-100',
                selectedRow?.id === file.id && 'bg-blue-50'
              )}>
              <div className="flex items-center gap-2">
                <File
                  size={16}
                  className={cn(
                    'text-sm text-gray-600',
                    'group-hover:text-blue-500',
                    selectedRow?.id === file.id && 'text-blue-500'
                  )}
                />
                {targetFileRename?.id === file.id ? (
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={file.name}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                  />
                ) : (
                  <HighlightText
                    text={file.name}
                    searchTerm={searchString}
                  />
                )}
              </div>
              <div className="text-sm text-gray-600">
                <HighlightText
                  text={(file?.mtime as string) || '05/02/2025 8:51 pm'}
                  searchTerm={searchString}
                />
              </div>
              <div className="text-sm text-gray-600">
                <HighlightText
                  text={file.alias}
                  searchTerm={searchString}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
