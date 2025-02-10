import { IFileBase } from '@/types/file.type';
import { File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  const searchString = searchParams.get('q') || '';

  const handleClick = (file: IFileBase) => {
    if (onClick) onClick(file);
  };

  const handleRightClick = (e: React.MouseEvent, file: IFileBase) => {
    if (handleContextMenu) {
      e.preventDefault();
      handleContextMenu(e, file);
    }
  };

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
          {dataSources?.map((file: IFileBase) => (
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
                <HighlightText
                  text={file.name}
                  searchTerm={searchString}
                />
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
