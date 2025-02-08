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
import { InfoPanel } from './InfoPanel';
import { Sidebar } from './Sidebar';
import { capitalizeFirstLetter, cleanActiveKey } from '@/lib/utils';

export function UfyleLayout() {
  const [searchParams] = useSearchParams();
  const [selectedItemKey, setSelectedItemKey] = useState<string>('');

  useEffect(() => {
    const activeKey = searchParams.get('ak');
    const cleanedKey = cleanActiveKey(activeKey);
    setSelectedItemKey(cleanedKey);
  }, [searchParams]);

  return (
    <div className="h-screen flex bg-[#202020] text-gray-200">
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Header toolbar */}
        <div className="bg-[#1c1c1c] border-b border-gray-800 flex items-center h-12 px-2 gap-2">
          <div className="flex items-center gap-1">
            <button className="p-2 rounded hover:bg-gray-700">
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
                className="absolute text-gray-400 -translate-y-1/2 left-2 top-1/2"
                size={16}
              />
              <input
                type="text"
                placeholder={`Search at ${capitalizeFirstLetter(
                  selectedItemKey
                )}`}
                className="w-full bg-[#2c2c2c] border border-gray-700 rounded px-8 py-1 text-sm focus:outline-none focus:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Actions toolbar */}

        <div className="bg-[#1c1c1c] border-b border-gray-800 flex items-center h-12 px-2 gap-2">
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1 text-sm rounded cursor-pointer hover:bg-gray-700">
              <Plus size={16} />
              New
            </button>
            <div className="w-px h-4 mx-1 bg-gray-700" />

            <button
              className="flex items-center gap-1 px-3 py-1 text-sm rounded cursor-pointer hover:bg-gray-700"
              title="Copy">
              Copy <Copy size={14} />
            </button>

            <div className="w-px h-4 mx-1 bg-gray-700" />
            <button
              className="flex items-center gap-1 px-3 py-1 text-sm rounded cursor-pointer hover:bg-gray-700"
              title="Delete">
              Delete <Trash size={16} />
            </button>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-700">
              Sort
              <ChevronDown size={16} />
            </button>
            <button className="flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-gray-700">
              View
              <ChevronDown size={16} />
            </button>
            <div className="w-px h-4 mx-1 bg-gray-700" />
            <button
              className="p-2 rounded hover:bg-gray-700"
              title="Details">
              <LayoutList size={16} />
            </button>
          </div>
        </div>
        <Outlet />
      </div>

      {/* Info Panel */}
      <InfoPanel />
    </div>
  );
}
