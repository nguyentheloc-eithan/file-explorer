import { IFileBase } from '@/types/file.type';
import { File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDataVisualizationProps {
  dataSources: IFileBase[];
  onClick?: (file: IFileBase) => void;
  handleContextMenu?: (e: React.MouseEvent, file: IFileBase) => void;
  selectedRow: IFileBase | null;
  columns: string[];
}

export function FileDataVisualization({
  dataSources,
  onClick,
  handleContextMenu,
  selectedRow,
  columns,
}: FileDataVisualizationProps) {
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
    <div className="overflow-auto bg-white">
      <div className="grid grid-cols-[1fr_200px_150px_100px] gap-1 p-2 text-[13px] border-b border-gray-300 bg-gray-50">
        {columns.map((column, index) => (
          <div
            key={index}
            className="font-medium text-gray-700">
            {column}
          </div>
        ))}
      </div>
      {dataSources?.map((file: IFileBase) => (
        <div
          key={file.id}
          onClick={() => handleClick(file)}
          onContextMenu={(e) => handleRightClick(e, file)}
          className={cn(
            'group grid grid-cols-[1fr_200px_150px_100px] gap-1 p-2 text-[13px]',
            'border-b border-gray-300 cursor-pointer select-none',
            'transition-colors duration-100',
            'hover:bg-gray-100',
            selectedRow?.id === file.id && 'bg-blue-50'
          )}>
          <div className="flex items-center gap-2">
            <File
              size={16}
              className={cn(
                'text-gray-500',
                'group-hover:text-blue-500',
                selectedRow?.id === file.id && 'text-blue-500'
              )}
            />
            {file.name}
          </div>
          <div className="text-gray-500">
            {file?.mtime || '05/02/2025 8:51 pm'}
          </div>
          <div className="text-gray-500">{file.alias}</div>
        </div>
      ))}
    </div>
  );
}
