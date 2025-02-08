import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sidebarConfig, SidebarItemType } from '@/configs/sidebar-config';
import { useFileStore } from '@/core/states/file.state';

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setSelectedFile } = useFileStore();

  const toggleExpand = (item: SidebarItemType) => {
    if (item.children) {
      setExpandedItems((prev) =>
        prev.includes(item.key!)
          ? prev.filter((k) => k !== item.key)
          : [...prev, item.key!]
      );
    }
  };

  const renderSidebarItem = (item: SidebarItemType, indent = 0) => {
    const isExpanded = expandedItems.includes(item.key!);
    const activeKey = searchParams.get('ak');
    const isActive = activeKey === item.key;
    const hasChildren = !!item.children?.length;

    const handleClick = (event: React.MouseEvent, item: SidebarItemType) => {
      event.preventDefault();

      if (item.children) {
        toggleExpand(item);
        return;
      }

      if (item.key) {
        setSelectedFile(null);
        const keyActivestring = `ak=${item.key}`;
        navigate(`/${item.key}?${keyActivestring}`);
      }
    };

    return (
      <div key={item.key}>
        <button
          onClick={(event) => handleClick(event, item)}
          className={cn(
            'flex items-center gap-2 w-full px-2 py-1 text-sm rounded hover:bg-gray-800',
            isActive && 'bg-gray-700',
            indent > 0 && 'ml-4'
          )}>
          {hasChildren && (
            <ChevronRight
              size={16}
              className={isExpanded ? 'rotate-90' : ''}
            />
          )}
          {item.icon}
          <span className="truncate">{item.label}</span>
        </button>

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
    <div className="w-48 bg-[#202020] border-r border-gray-800">
      <nav className="p-2 space-y-1">
        {sidebarConfig.map((item) => renderSidebarItem(item))}
      </nav>
    </div>
  );
}
