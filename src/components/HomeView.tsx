'use client';

import {
  Download,
  File,
  FileText,
  Folder,
  Image,
  Monitor,
  Music,
  Video,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export function HomeView() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col bg-[#202020] text-gray-200">
      {/* Quick access section */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-semibold mb-3">Quick access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickAccessItem
                icon={<Monitor size={20} />}
                name="Desktop"
                location="Stored locally"
              />
              <QuickAccessItem
                icon={<Download size={20} />}
                name="Downloads"
                location="Stored locally"
              />
              <QuickAccessItem
                icon={<FileText size={20} />}
                name="Documents"
                location="Stored locally"
              />
              <QuickAccessItem
                icon={<Image size={20} />}
                name="Pictures"
                location="Stored locally"
              />
              <QuickAccessItem
                icon={<Music size={20} />}
                name="Music"
                location="Stored locally"
              />
              <QuickAccessItem
                icon={<Video size={20} />}
                name="Videos"
                location="Stored locally"
              />
              <QuickAccessItem
                icon={<Folder size={20} />}
                name="Screenshots"
                location="Pictures"
              />
              <QuickAccessItem
                icon={<Folder size={20} />}
                name="references"
                location="Documents"
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold mb-3">Recent files</h2>
            <div className="space-y-1">
              {recentFiles.map((file) => (
                <div
                  key={file.name}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded hover:bg-gray-800 cursor-pointer',
                    selectedItem === file.name && 'bg-gray-700'
                  )}
                  onClick={() => setSelectedItem(file.name)}>
                  <File size={16} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{file.name}</div>
                    <div className="text-xs text-gray-400">{file.location}</div>
                  </div>
                  <div className="text-xs text-gray-400">{file.date}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function QuickAccessItem({
  icon,
  name,
  location,
}: {
  icon: React.ReactNode;
  name: string;
  location: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 cursor-pointer border border-gray-800">
      <div className="text-blue-400">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{name}</div>
        <div className="text-xs text-gray-400 truncate">{location}</div>
      </div>
    </div>
  );
}

const recentFiles = [
  { name: 'ufyle (1)', date: '07/02/2025 10:18 pm', location: 'Downloads' },
  {
    name: '777K733068283F4c388cdee5fcb4970',
    date: '07/02/2025 9:57 pm',
    location: 'Downloads',
  },
  {
    name: 'Visitor Management System (VMS) Documents',
    date: '06/02/2025 9:52 pm',
    location: 'Downloads',
  },
  { name: 'hosts', date: '05/02/2025 8:52 pm', location: 'Documents' },
  {
    name: 'favicon',
    date: '18/01/2025 5:14 am',
    location: 'Documents/projects/e_promoting/src/app',
  },
  { name: 'ex3', date: '22/11/2024 9:42 pm', location: 'Pictures' },
  {
    name: 'image2LCD',
    date: '15/11/2024 7:14 am',
    location: 'electronoobs.com',
  },
];
