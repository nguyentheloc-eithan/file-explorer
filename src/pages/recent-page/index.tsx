'use client';

import { ContextMenu } from '@/components/context-menu';
import { FileDataVisualization } from '@/components/file-data-visialization';
import { useFileStore } from '@/core/states/file.state';
import { ContextMenuState } from '@/types/context-menu.type';
import { IFileBase } from '@/types/file.type';
import { useState } from 'react';
import { useRecentPage } from './hook';

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

  const columns = ['Name', 'Date modified', 'Alias'];
  return (
    <div>
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          {/*Data visualization*/}
          <FileDataVisualization
            dataSources={recentFilesData || []}
            onClick={(file) => setSelectedFile(file)}
            handleContextMenu={handleContextMenu}
            selectedRow={selectedFile}
            columns={columns}
          />
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
    </div>
  );
}
