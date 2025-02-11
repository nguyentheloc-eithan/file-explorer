import {
  FileClock,
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
  editable: boolean;
}

export const sidebarConfig: SidebarItemType[] = [
  {
    icon: <Home size={16} />,
    label: 'Home',
    key: 'home',
    editable: true,
  },
  {
    icon: <FileClock size={16} />,
    label: 'Recent',
    key: 'recent',
    editable: true,
  },
  {
    icon: <Star size={16} />,
    label: 'Starred',
    key: 'starred',
    editable: true,
  },
  {
    icon: <Share2 size={16} />,
    label: 'Shared with me',
    key: 'shared',
    editable: true,
  },

  {
    icon: <Trash2 size={16} />,
    label: 'Trash',
    key: 'trash',
    editable: true,
  },
  {
    icon: <User2 size={16} />,
    label: 'Personal',
    key: 'personal',
    editable: true,

    children: [
      {
        icon: <FileText size={16} />,
        label: 'Documents',
        key: 'documents',
        editable: true,
      },
      {
        icon: <Image size={16} />,
        label: 'Pictures',
        key: 'pictures',
        editable: true,
      },
      {
        icon: <Music size={16} />,
        label: 'Music',
        key: 'music',
        editable: true,
      },
      {
        icon: <Video size={16} />,
        label: 'Videos',
        key: 'videos',
        editable: true,
      },
    ],
  },
];
