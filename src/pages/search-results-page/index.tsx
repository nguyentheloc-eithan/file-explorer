'use client';

import { ContextMenu } from '@/components/context-menu';
import { FileDataVisualization } from '@/components/file-data-visialization';
import { useFileStore } from '@/core/states/file.state';
import { ContextMenuState } from '@/types/context-menu.type';
import { IFileBase } from '@/types/file.type';
import { useState } from 'react';

export default function SearchResults({
  dataSearch,
}: {
  dataSearch: IFileBase[];
}) {
  const columns = ['Name', 'Date modified', 'Alias'];
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
    <div className="flex flex-col h-screen bg-white">
      {/* Results list */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          <div>
            <FileDataVisualization
              dataSources={dataSearch}
              onClick={(file) => setSelectedFile(file)}
              handleContextMenu={handleContextMenu}
              selectedRow={selectedFile}
              columns={columns}
            />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="px-4 py-1 text-xs text-gray-600 border-t border-gray-300">
        {dataSearch?.length} items
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
  );
}
