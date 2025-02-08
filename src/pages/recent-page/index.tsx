'use client';

import { IFileBase } from '@/types/file.type';
import { File } from 'lucide-react';
import { useRecentPage } from './hook';
import { ContextMenuState } from '@/types/context-menu.type';
import { useState } from 'react';
import { useFileStore } from '@/core/states/file.state';
import { cn } from '@/lib/utils';
import { ContextMenu } from '@/components/context-menu';

export function RecentPage() {
  const { recentFilesData } = useRecentPage();
  const { selectedFile, setSelectedFile } = useFileStore();

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
  });

  const handleContextMenu = (e: React.MouseEvent, file: IFileBase) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      file,
    });
  };
  return (
    <div>
      {/* Main content area */}
      <div className="flex flex-col flex-1">
        <>
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-[1fr_200px_150px_100px] gap-1 p-2 text-[13px] border-b border-gray-800">
              <div>Name</div>
              <div>Date modified</div>
              <div>Alias</div>
            </div>
            <div className="overflow-auto">
              {recentFilesData?.map((file: IFileBase) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  onContextMenu={(e) => handleContextMenu(e, file)}
                  className={cn(
                    'grid grid-cols-[1fr_200px_150px_100px] gap-1 p-2 text-[13px] hover:bg-gray-800',
                    selectedFile?.id === file.id && 'bg-gray-700'
                  )}>
                  <div className="flex items-center gap-2">
                    <File size={16} />
                    {file.name}
                  </div>
                  <div> {file?.mtime ? file?.mtime : '05/02/2025 8:51 pm'}</div>
                  <div>{file.alias}</div>
                </div>
              ))}
            </div>
            {/* Context Menu */}
            {contextMenu.show && (
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                selectedFile={contextMenu.file}
                onClose={() => setContextMenu({ show: false, x: 0, y: 0 })}
              />
            )}
          </div>
        </>
      </div>
    </div>
  );
}
