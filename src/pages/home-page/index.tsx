import { ContextMenu } from '@/components/context-menu';
import { useFileStore } from '@/core/states/file.state';
import { cn } from '@/lib/utils';
import { ContextMenuState } from '@/types/context-menu.type';
import { IFileBase } from '@/types/file.type';
import { File, Folder, Star, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHome } from './hook';

export function HomePage() {
  const { statsData } = useHome();
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
    <div className="bg-[#F8F9FA] text-gray-800 h-full p-4 overflow-auto">
      {/* Quick Access Section */}
      <div className="space-y-6">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickAccessItems.map((item) => (
              <QuickAccessItem
                navLink={item.navLink}
                key={item.name}
                icon={item.icon}
                name={item.name}
                alias={item.alias}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            Recent Files
          </h2>
          <div className="space-y-1">
            {statsData?.map((file: IFileBase) => (
              <div
                key={file.id}
                onContextMenu={(e) => handleContextMenu(e, file)}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition',
                  selectedFile?.id === file.id && 'bg-gray-300'
                )}
                onClick={() => setSelectedFile(file)}>
                <File
                  size={16}
                  className="text-gray-600"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{file.name}</div>
                  <div className="text-xs text-gray-500">{file.alias}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {file?.mtime ? file?.mtime : '05/02/2025 8:51 pm'}
                </div>
              </div>
            ))}
          </div>
        </section>
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
  navLink,
}: {
  icon: React.ReactNode;
  name: string;
  alias: string;
  navLink: string;
}) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(navLink);
      }}
      className="flex items-center gap-3 p-3 transition bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100">
      <div className="text-blue-500">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{name}</div>
        <div className="text-xs text-gray-500 truncate">{alias}</div>
      </div>
    </div>
  );
}

const quickAccessItems = [
  {
    icon: <Folder size={20} />,
    name: 'Recents',
    alias: 'Frequently Used',
    navLink: '/recent?ak=recent',
  },
  {
    icon: <Star size={20} />,
    name: 'Starred',
    alias: 'Favorite Items',
    navLink: '/starred?ak=starred',
  },
  {
    icon: <Users size={20} />,
    name: 'Shared',
    alias: 'Shared Files',
    navLink: '/shared?ak=shared',
  },
  {
    icon: <Trash2 size={20} />,
    name: 'Trash',
    alias: 'Deleted Files',
    navLink: '/trash?ak=trash',
  },
];
