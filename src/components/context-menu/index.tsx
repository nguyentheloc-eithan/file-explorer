'use client';

import { IFileBase } from '@/types/file.type';
import {
  ChevronRight,
  Copy,
  FileEdit,
  Files,
  MonitorPlay,
  Pin,
  Scissors,
  Share,
  Star,
  Trash,
} from 'lucide-react';
import type React from 'react'; // Added import for React
import { useEffect } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  selectedFile?: IFileBase;
}

export function ContextMenu({ x, y, onClose, selectedFile }: ContextMenuProps) {
  console.log('row selected: ', selectedFile);
  useEffect(() => {
    const handleClick = () => onClose();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [onClose]);

  return (
    <div
      className="fixed z-50 w-64 bg-[#2c2c2c] border border-gray-700 rounded-lg shadow-lg text-gray-200 text-sm"
      style={{
        top: y,
        left: x,
      }}
      onClick={(e) => e.stopPropagation()}>
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-700">
        <button
          className="p-1.5 hover:bg-gray-600 rounded flex flex-col items-center text-[12px] justify-center"
          title="Cut">
          <Scissors
            size={16}
            className="text-blue-400"
          />
          Move
        </button>
        <button
          className="p-1.5 hover:bg-gray-600 rounded flex flex-col items-center text-[12px] justify-center"
          title="Copy">
          <Copy
            size={16}
            className="text-blue-400"
          />
          Copy
        </button>
        <button
          className="p-1.5 hover:bg-gray-600 rounded flex flex-col items-center text-[12px] justify-center"
          title="Rename">
          <FileEdit
            size={16}
            className="text-blue-400"
          />
          Rename
        </button>
        <button
          className="p-1.5 hover:bg-gray-600 rounded flex flex-col items-center text-[12px] justify-center"
          title="Share">
          <Share
            size={16}
            className="text-blue-400"
          />
          Share
        </button>
        <button
          className="p-1.5 hover:bg-gray-600 rounded flex flex-col items-center text-[12px] justify-center"
          title="Delete">
          <Trash
            size={16}
            className="text-blue-400"
          />
          Delete
        </button>
      </div>

      {/* Menu items */}
      <div className="py-1">
        <MenuItem
          icon={
            <MonitorPlay
              size={16}
              className="text-blue-400"
            />
          }
          label="Open"
          shortcut="Enter"
        />
        {/* <MenuItem
          icon={
            <MonitorPlay
              size={16}
              className="text-blue-400"
            />
          }
          label="Open with"
          hasSubmenu
        /> */}

        <MenuItem
          icon={
            <Star
              size={16}
              className="text-blue-400"
            />
          }
          label="Add to Favorites"
        />
        <MenuItem
          icon={
            <Pin
              size={16}
              className="text-blue-400"
            />
          }
          label="Pin to quick access"
        />
        <MenuItem
          icon={
            <Files
              size={16}
              className="text-blue-400"
            />
          }
          label="Copy as path"
          //   shortcut="Ctrl+Shift+C"
        />
        {/* <MenuItem
          icon={
            <Settings
              size={16}
              className="text-blue-400"
            />
          }
          label="Properties"
          shortcut="Alt+Enter"
        /> */}
        {/* <MenuItem
          icon={
            <FileCode
              size={16}
              className="text-blue-400"
            />
          }
          label="Edit in Notepad"
        /> */}
        {/* <MenuItem
          icon={
            <Archive
              size={16}
              className="text-blue-400"
            />
          }
          label="WinRAR"
          hasSubmenu
        /> */}
        {/* <MenuItem
          icon={
            <MoreHorizontal
              size={16}
              className="text-blue-400"
            />
          }
          label="Show more options"
        /> */}
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  hasSubmenu?: boolean;
  onClick?: () => void;
}

function MenuItem({
  icon,
  label,
  shortcut,
  hasSubmenu,
  onClick,
}: MenuItemProps) {
  return (
    <button
      className="w-full px-4 py-1.5 hover:bg-gray-600 flex items-center justify-between group"
      onClick={onClick}>
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {hasSubmenu && (
        <ChevronRight
          size={16}
          className="text-gray-400 group-hover:text-gray-200"
        />
      )}
      {shortcut && <span className="text-xs text-gray-400">{shortcut}</span>}
    </button>
  );
}
