'use client';

import { useFileActions } from '@/hooks/useFileActions';
import { IFileBase } from '@/types/file.type';
import {
  ChevronRight,
  Copy,
  DownloadIcon,
  FileEdit,
  Files,
  MonitorPlay,
  Pin,
  Scissors,
  Share,
  Star,
  Trash,
} from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  selectedFile?: IFileBase;
}

export function ContextMenu({ x, y, onClose, selectedFile }: ContextMenuProps) {
  const { handleDownload, handleDelete } = useFileActions();

  useEffect(() => {
    const handleClick = () => onClose();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [onClose]);

  const handleMenuItemClick = async (key: string) => {
    if (!selectedFile) {
      return;
    }
    switch (key) {
      case 'delete':
        await handleDelete(selectedFile.id?.split(':')[1]);
        break;
      case 'download':
        await handleDownload(selectedFile);
        break;
    }
    onClose();
  };

  return (
    <>
      <div
        className="fixed z-50 w-64 bg-[#2c2c2c] border border-gray-700 rounded-lg shadow-lg text-gray-200 text-[13px]"
        style={{
          top: y,
          left: x,
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* Top toolbar */}
        <div className="flex items-center justify-between px-2 py-1 border-b border-gray-700">
          <button
            className="p-1.5 hover:bg-gray-600 rounded flex flex-col items-center text-[12px] justify-center"
            title="Cut"
            onClick={() => handleMenuItemClick('cut')}>
            <Scissors
              size={16}
              className="text-blue-400"
            />
            Move
          </button>
          <button
            className="p-1.5 hover:bg-gray-600 rounded flex flex-col items-center text-[12px] justify-center"
            title="Copy"
            onClick={() => handleMenuItemClick('copy')}>
            <Copy
              size={16}
              className="text-blue-400"
            />
            Copy
          </button>
          <button
            className="p-1.5 hover:bg-gray-600 rounded flex flex-col items-center text-[12px] justify-center"
            title="Rename"
            onClick={() => handleMenuItemClick('rename')}>
            <FileEdit
              size={16}
              className="text-blue-400"
            />
            Rename
          </button>
          <button
            className="p-1.5 hover:bg-gray-600 rounded flex flex-col items-center text-[12px] justify-center"
            title="Share"
            onClick={() => handleMenuItemClick('share')}>
            <Share
              size={16}
              className="text-blue-400"
            />
            Share
          </button>
          <button
            className="p-1.5 hover:bg-gray-600 rounded flex flex-col items-center text-[12px] justify-center"
            title="Delete"
            onClick={() => handleMenuItemClick('delete')}>
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
            onClick={() => handleMenuItemClick('open')}
          />
          <MenuItem
            icon={
              <DownloadIcon
                size={16}
                className="text-blue-400"
              />
            }
            label="Download"
            onClick={() => handleMenuItemClick('download')}
          />
          <MenuItem
            icon={
              <Files
                size={16}
                className="text-blue-400"
              />
            }
            label="Copy as path"
            onClick={() => handleMenuItemClick('copy-path')}
          />
          <MenuItem
            icon={
              <Star
                size={16}
                className="text-blue-400"
              />
            }
            label="Add to Favorites"
            onClick={() => handleMenuItemClick('favorite')}
          />
          <MenuItem
            icon={
              <Pin
                size={16}
                className="text-blue-400"
              />
            }
            label="Pin to quick access"
            onClick={() => handleMenuItemClick('pin')}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
    </>
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
