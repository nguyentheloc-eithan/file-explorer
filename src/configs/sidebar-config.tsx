import {
  FileText,
  Home,
  Image,
  Music,
  Share2,
  Star,
  Trash2,
  User2,
  Video,
} from 'lucide-react';

export interface SidebarItemType {
  icon: React.ReactNode;
  label: string;
  children?: SidebarItemType[];
  key?: string;
}

export const sidebarConfig: SidebarItemType[] = [
  {
    icon: <Home size={16} />,
    label: 'Home',
    key: 'home',
  },
  {
    icon: <Image size={16} />,
    label: 'Recents',
    key: 'recents',
  },
  {
    icon: <Star size={16} />,
    label: 'Starred',
    key: 'starred',
  },
  {
    icon: <Share2 size={16} />,
    label: 'Shared with me',
    key: 'shared',
  },

  {
    icon: <Trash2 size={16} />,
    label: 'Trash',
    key: 'trash',
  },
  {
    icon: <User2 size={16} />,
    label: 'Personal',
    key: 'personal',
    children: [
      {
        icon: <FileText size={16} />,
        label: 'Documents',
        key: 'documents',
      },
      {
        icon: <Image size={16} />,
        label: 'Pictures',
        key: 'pictures',
      },
      {
        icon: <Music size={16} />,
        label: 'Music',
        key: 'music',
      },
      {
        icon: <Video size={16} />,
        label: 'Videos',
        key: 'videos',
      },
    ],
  },
];
