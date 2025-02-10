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
    <div className="overflow-auto">
      <div className="grid grid-cols-[1fr_200px_150px_100px] gap-1 p-2 text-[13px] border-b border-gray-800">
        {columns.map((column, index) => (
          <div key={index}>{column}</div>
        ))}
      </div>
      {dataSources?.map((file: IFileBase) => (
        <div
          key={file.id}
          onClick={() => handleClick(file)}
          onContextMenu={(e) => handleRightClick(e, file)}
          className={cn(
            'group grid grid-cols-[1fr_200px_150px_100px] gap-1 p-2 text-[13px]',
            'border-b border-gray-800/10 cursor-default select-none',
            'transition-colors duration-100',
            'hover:bg-gray-200',
            selectedRow?.id === file.id && 'bg-blue-100'
          )}>
          <div className="flex items-center gap-2">
            <File
              size={16}
              className={cn(
                'text-gray-400',
                'group-hover:text-blue-400',
                selectedRow?.id === file.id && 'text-blue-400'
              )}
            />
            {file.name}
          </div>
          <div>{file?.mtime || '05/02/2025 8:51 pm'}</div>
          <div>{file.alias}</div>
        </div>
      ))}
    </div>
  );
}
