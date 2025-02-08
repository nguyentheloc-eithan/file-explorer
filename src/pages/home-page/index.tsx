'use client';

import { useFileStore } from '@/core/states/file.state';
import { cn } from '@/lib/utils';
import { IFileBase } from '@/types/file.type';
import {
  Archive,
  File,
  FileText,
  Folder,
  Music,
  Star,
  Trash2,
  Users,
  Video,
} from 'lucide-react';
import { useHome } from './hook';
import { ContextMenuState } from '@/types/context-menu.type';
import { useState } from 'react';
import { ContextMenu } from '@/components/context-menu';

export function HomePage() {
  const { recentFilesData } = useHome();
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
      {/* Quick Access Section */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-[13px] font-semibold">Quick Access</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickAccessItems.map((item) => (
                <QuickAccessItem
                  key={item.name}
                  icon={item.icon}
                  name={item.name}
                  alias={item.alias}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[13px] font-semibold">Recent Files</h2>
            <div className="space-y-1">
              {recentFilesData?.map((file: IFileBase) => (
                <div
                  key={file.id}
                  onContextMenu={(e) => handleContextMenu(e, file)}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded hover:bg-gray-800 cursor-pointer',
                    selectedFile?.id === file.id && 'bg-gray-700'
                  )}
                  onClick={() => setSelectedFile(file)}>
                  <File size={16} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] truncate">{file.name}</div>
                    <div className="text-xs text-gray-400">{file.alias}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {file?.mtime ? file?.mtime : '05/02/2025 8:51 pm'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
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

function QuickAccessItem({
  icon,
  name,
  alias,
}: {
  icon: React.ReactNode;
  name: string;
  alias: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 border border-gray-800 rounded cursor-pointer hover:bg-gray-800">
      <div className="text-blue-400">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium truncate">{name}</div>
        <div className="text-xs text-gray-400 truncate">{alias}</div>
      </div>
    </div>
  );
}

const quickAccessItems = [
  { icon: <Folder size={20} />, name: 'Top Files', alias: 'Frequently Used' },
  { icon: <Star size={20} />, name: 'Starred', alias: 'Favorite Items' },
  {
    icon: <FileText size={20} />,
    name: 'Documents',
    alias: 'Text Files & PDFs',
  },
  { icon: <Users size={20} />, name: 'Shared', alias: 'Shared Files' },
  { icon: <Music size={20} />, name: 'Music', alias: 'Audio Files' },
  { icon: <Video size={20} />, name: 'Videos', alias: 'Movie & Clips' },
  { icon: <Trash2 size={20} />, name: 'Trash', alias: 'Deleted Files' },
  { icon: <Archive size={20} />, name: 'References', alias: 'Project Files' },
];
