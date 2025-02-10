import { capitalizeFirstLetter, cleanActiveKey } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  LayoutList,
  Plus,
  RotateCcw,
  Search,
  Trash,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { InfoPanelV2 } from './info-panel';
import { Sidebar } from './sidebar';

export function UfyleLayout() {
  const [searchParams] = useSearchParams();
  const [selectedItemKey, setSelectedItemKey] = useState<string>('');

  useEffect(() => {
    const activeKey = searchParams.get('ak');
    const cleanedKey = cleanActiveKey(activeKey);
    setSelectedItemKey(cleanedKey);
  }, [searchParams]);

  return (
    <div className="flex h-screen text-gray-900 bg-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Header toolbar */}
        <div className="flex items-center h-12 gap-2 px-2 bg-white border-b border-gray-300 shadow-sm">
          <div className="flex items-center gap-1">
            <button className="p-2 rounded hover:bg-gray-200">
              <RotateCcw size={16} />
            </button>
          </div>
          <div className="flex items-center gap-1 px-2">
            <ChevronRight size={16} />
            <span>{selectedItemKey}</span>
          </div>
          <div className="flex justify-end flex-1">
            <div className="relative w-72">
              <Search
                className="absolute text-gray-500 -translate-y-1/2 left-2 top-1/2"
                size={16}
              />
              <input
                type="text"
                placeholder={`Search at ${capitalizeFirstLetter(
                  selectedItemKey
                )}`}
                className="w-full bg-gray-50 border border-gray-300 rounded px-8 py-1 text-[13px] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Actions toolbar */}
        <div className="flex items-center h-12 gap-2 px-2 bg-white border-b border-gray-300 shadow-sm">
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1 text-[13px] rounded cursor-pointer hover:bg-gray-200">
              <Plus size={16} />
              New
            </button>
            <div className="w-px h-4 mx-1 bg-gray-400" />

            <button
              className="flex items-center gap-1 px-3 py-1 text-[13px] rounded cursor-pointer hover:bg-gray-200"
              title="Copy">
              <Copy size={14} />
            </button>

            <div className="w-px h-4 mx-1 bg-gray-400" />
            <button
              className="flex items-center gap-1 px-3 py-1 text-[13px] rounded cursor-pointer hover:bg-gray-200"
              title="Delete">
              <Trash size={16} />
            </button>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1 text-[13px] rounded hover:bg-gray-200">
              Sort
              <ChevronDown size={16} />
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-[13px] rounded hover:bg-gray-200">
              View
              <ChevronDown size={16} />
            </button>
            <div className="w-px h-4 mx-1 bg-gray-400" />
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="Details">
              <LayoutList size={16} />
            </button>
          </div>
        </div>
        <div className="flex flex-col h-screen overflow-y-auto text-gray-900 bg-gray-100">
          <Outlet />
        </div>
      </div>

      {/* Info Panel */}
      <InfoPanelV2 />
    </div>
  );
}
