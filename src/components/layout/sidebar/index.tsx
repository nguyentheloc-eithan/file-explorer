/* eslint-disable @typescript-eslint/no-explicit-any */
import { sidebarConfig, SidebarItemType } from '@/configs/sidebar-config';
import { useFileStore } from '@/core/states/file.state';
import { detelePartition, updatePartition } from '@/lib/api/partition.api';
import { cn } from '@/lib/utils';
import { IAppConfig } from '@/providers/AppConfig';
import { Partition } from '@/types/partition.type';
import { ChevronRight, Edit3Icon, Layers, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
} from '@fluentui/react-components';

interface ISidebarProps {
  partitions: Partition[];
  appConfig: IAppConfig;
}

export function Sidebar({
  partitions: initialPartitions,
  appConfig,
}: ISidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [partitions, setPartitions] = useState<Partition[]>(initialPartitions);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setSelectedFile } = useFileStore();

  useEffect(() => {
    setPartitions(initialPartitions);
    const ak = searchParams.get('ak');
    if (!ak) {
      setSearchParams({ ak: 'home' });
    }
  }, [initialPartitions, searchParams, setSearchParams]);

  const sidebarItems = useMemo(() => {
    const homeIndex = sidebarConfig.findIndex((item) => item.key === 'home');
    if (homeIndex === -1) return sidebarConfig;

    const partitionItems: SidebarItemType[] = partitions.map((partition) => ({
      key: partition.name,
      label: partition.name,
      icon: <Layers size={16} />,
      editable: true,
    }));

    return [
      ...sidebarConfig.slice(0, homeIndex + 1),
      // ...partitionItems,
      ...sidebarConfig.slice(homeIndex + 1),
    ];
  }, [partitions]);

  const toggleExpand = (item: SidebarItemType) => {
    if (item.children) {
      setExpandedItems((prev) =>
        prev.includes(item.key!)
          ? prev.filter((k) => k !== item.key)
          : [...prev, item.key!]
      );
    }
  };

  const handleRename = (key: string, label: string) => {
    setEditingKey(key);
    setEditValue(label);
  };

  const handleDelete = async (key: string) => {
    const partition = partitions.find((p) => p.name === key);
    if (partition) {
      setPartitions((currentPartitions) =>
        currentPartitions.filter((p) => p.id !== partition.id)
      );
      await detelePartition({
        serverApiUrl: appConfig?.serverApiUrl,
        partitionId: partition.id,
      });
    }
  };

  const handleRenameSubmit = async (key: string) => {
    if (editValue.trim()) {
      const partition = partitions.find((p) => p.name === key);
      if (partition) {
        setPartitions((currentPartitions) =>
          currentPartitions.map((p) =>
            p.id === partition.id ? { ...p, name: editValue.trim() } : p
          )
        );

        try {
          await updatePartition({
            partitionId: partition.id,
            name: editValue.trim(),
            serverApiUrl: appConfig?.serverApiUrl,
          });
        } catch (error) {
          console.error('Failed to update partition name:', error);
        }
      } else {
        sidebarConfig.forEach((item) => {
          if (item.key === key) {
            item.label = editValue;
          } else if (item.children) {
            item.children.forEach((child) => {
              if (child.key === key) {
                child.label = editValue;
              }
            });
          }
        });
      }
    }
    setEditingKey(null);
  };

  const renderSidebarItem = (item: SidebarItemType, indent = 0) => {
    const isExpanded = expandedItems.includes(item.key!);
    const activeKey = searchParams.get('ak');
    const typeSearch = searchParams.get('typeS');

    const isActive = activeKey === item.key && typeSearch !== 'global_s';
    const hasChildren = !!item.children?.length;

    const handleClick = (event: React.MouseEvent) => {
      event.preventDefault();

      if (hasChildren) {
        toggleExpand(item);
        return;
      }

      setSelectedFile(null);

      const partition = partitions.find((p) => p.name == item.key);
      if (partition) {
        navigate(`/partition?ak=${partition.name}&pid=${partition.id}`);
      } else if (item.key) {
        navigate(`/${item.key}?ak=${item.key}`);
      }
    };

    return (
      <div
        key={item.key}
        className="relative">
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            // Check if the click is coming from the menu area
            const menuArea = e.currentTarget.querySelector('.menu-area');
            if (menuArea?.contains(e.target as Node)) {
              e.stopPropagation();
              return;
            }
            handleClick(e);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick(e as any);
            }
          }}
          className={cn(
            'group flex items-center gap-2 w-full cursor-pointer px-3 py-2 text-[14px] rounded hover:bg-gray-200 transition',
            isActive && 'bg-blue-100',
            indent > 0 && 'ml-4'
          )}>
          {hasChildren ? (
            <ChevronRight
              size={16}
              className={cn(
                'transition-transform',
                isExpanded ? 'rotate-90' : ''
              )}
            />
          ) : (
            item.icon
          )}
          {editingKey === item.key ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleRenameSubmit(item.key!)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                  handleRenameSubmit(item.key!);
                }
              }}
              className="px-1 border-b border-gray-400 focus:outline-none"
              autoFocus
            />
          ) : (
            <span className="truncate">{item.label}</span>
          )}

          {item.editable && (
            <div
              className={cn(
                'menu-area absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity',
                isActive && 'opacity-100'
              )}>
              <Menu positioning={{ autoSize: true }}>
                <MenuTrigger disableButtonEnhancement>
                  <div className="p-1 rounded hover:bg-gray-300">
                    <Edit3Icon size={12} />
                  </div>
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    <MenuItem
                      onClick={(e: any) => {
                        e.stopPropagation();
                        handleRename(item.key!, item.label);
                      }}
                      icon={<Edit3Icon size={12} />}>
                      Rename
                    </MenuItem>
                    <MenuItem
                      onClick={(e: any) => {
                        e.stopPropagation();
                        handleDelete(item.key!);
                      }}
                      icon={<Trash2 size={12} />}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {item.children!.map((child) =>
              renderSidebarItem(child, indent + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border-r border-gray-300 shadow-sm w-60">
      <nav className="p-3 space-y-1">
        {sidebarItems.map((item) => renderSidebarItem(item))}
      </nav>
    </div>
  );
}
