'use client';

import { useFileStore } from '@/core/states/file.state';
import { refreshHandler } from '@/core/states/refresh.state';
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
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  selectedFile?: IFileBase;
}

export function ContextMenu({ x, y, onClose, selectedFile }: ContextMenuProps) {
  const [searchParams] = useSearchParams();
  const activeKey = searchParams.get('ak');
  const { setTargetFileRename } = useFileStore();
  const { handleDownload, handleDelete, copyFile, moveFile } = useFileActions();

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
      case 'copy': {
        const fileId = selectedFile.id?.split(':')[1];
        if (!fileId) {
          toast.error('Invalid file ID for copying');
          return;
        }

        const result = await copyFile({ fileId });

        if (result.error) {
          toast.error(`Failed to copy file: ${result.error}`);
        } else {
          toast.success('File copied successfully');
          // Refresh the file list to show the newly copied file
          refreshHandler(activeKey || '');
        }
        break;
      }
      case 'move':
        {
          const fileId = selectedFile.id?.split(':')[1];

          if (!fileId) {
            toast.error('Invalid file ID for moving file');
            return;
          }

          const result = await moveFile(fileId, `${selectedFile?.name}_moved`);

          if (result.error) {
            toast.error(`Failed to move file: ${result.error}`);
          } else {
            toast.success('File moved successfully');
            // Refresh the file list to show the newly copied file
            refreshHandler(activeKey || '');
          }
        }
        break;
      case 'rename':
        setTargetFileRename(selectedFile);
        break;
      default:
        toast.info('This function is still developing');
    }
    onClose();
  };

  return (
    <>
      <div
        className="fixed z-50 w-64 bg-white border border-gray-300 rounded-lg shadow-lg text-black text-sm"
        style={{
          top: y,
          left: x,
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* Top toolbar */}
        <div className="flex items-center justify-between px-2 py-1 border-b border-gray-300">
          <button
            className="p-1.5 hover:bg-gray-200 rounded flex flex-col items-center text-[12px] justify-center"
            title="move"
            onClick={() => handleMenuItemClick('move')}>
            <Scissors
              size={16}
              className="text-blue-400"
            />
            Move
          </button>
          <button
            className="p-1.5 hover:bg-gray-200 rounded flex flex-col items-center text-[12px] justify-center"
            title="Copy"
            onClick={() => handleMenuItemClick('copy')}>
            <Copy
              size={16}
              className="text-blue-400"
            />
            Copy
          </button>
          <button
            className="p-1.5 hover:bg-gray-200 rounded flex flex-col items-center text-[12px] justify-center"
            title="Rename"
            onClick={() => handleMenuItemClick('rename')}>
            <FileEdit
              size={16}
              className="text-blue-400"
            />
            Rename
          </button>
          <button
            className="p-1.5 hover:bg-gray-200 rounded flex flex-col items-center text-[12px] justify-center"
            title="Share"
            onClick={() => handleMenuItemClick('share')}>
            <Share
              size={16}
              className="text-blue-400"
            />
            Share
          </button>
          <button
            className="p-1.5 hover:bg-gray-200 rounded flex flex-col items-center text-[12px] justify-center"
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
      className="w-full px-4 py-1.5 hover:bg-gray-200 flex items-center justify-between group"
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
