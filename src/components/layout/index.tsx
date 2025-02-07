import {
  ChevronDown,
  ChevronRight,
  Clipboard,
  Copy,
  LayoutList,
  Plus,
  RotateCcw,
  Scissors,
  Search,
  Trash,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function UfyleLayout() {
  const [searchParams] = useSearchParams();
  const [selectedItemKey, setSelectedItemKey] = useState<string>('');

  const cleanKey = (key: string | null): string => {
    if (key) {
      return key.replace(/[-_]/g, '');
    }
    return '';
  };

  useEffect(() => {
    const activeKey = searchParams.get('active_key');
    const cleanedKey = cleanKey(activeKey);
    setSelectedItemKey(cleanedKey);
  }, [searchParams]);

  return (
    <div className="h-screen flex bg-[#202020] text-gray-200">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header toolbar */}
        <div className="bg-[#1c1c1c] border-b border-gray-800 flex items-center h-12 px-2 gap-2">
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-700 rounded">
              <RotateCcw size={16} />
            </button>
          </div>
          <div className="flex items-center gap-1 px-2">
            <ChevronRight size={16} />
            <span>{selectedItemKey}</span>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="relative w-72">
              <Search
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder={`Search ${selectedItemKey}`}
                className="w-full bg-[#2c2c2c] border border-gray-700 rounded px-8 py-1 text-sm focus:outline-none focus:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Actions toolbar */}

        <div className="bg-[#1c1c1c] border-b border-gray-800 flex items-center h-12 px-2 gap-2">
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1 hover:bg-gray-700 rounded text-sm">
              <Plus size={16} />
              New
              <ChevronDown size={16} />
            </button>
            <div className="h-4 w-px bg-gray-700 mx-1" />
            <button
              className="p-2 hover:bg-gray-700 rounded"
              title="Cut">
              <Scissors size={16} />
            </button>
            <button
              className="p-2 hover:bg-gray-700 rounded"
              title="Copy">
              <Copy size={16} />
            </button>
            <button
              className="p-2 hover:bg-gray-700 rounded"
              title="Paste">
              <Clipboard size={16} />
            </button>
            <div className="h-4 w-px bg-gray-700 mx-1" />
            <button
              className="p-2 hover:bg-gray-700 rounded"
              title="Delete">
              <Trash size={16} />
            </button>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1 hover:bg-gray-700 rounded text-sm">
              Sort
              <ChevronDown size={16} />
            </button>
            <button className="flex items-center gap-1 px-3 py-1 hover:bg-gray-700 rounded text-sm">
              View
              <ChevronDown size={16} />
            </button>
            <div className="h-4 w-px bg-gray-700 mx-1" />
            <button
              className="p-2 hover:bg-gray-700 rounded"
              title="Details">
              <LayoutList size={16} />
            </button>
          </div>
        </div>
        <Outlet />
      </div>

      {/* Info Panel */}
      <div className="w-64 bg-[#202020] border-l border-gray-800 p-4">
        <h2 className="font-semibold mb-4">Documents (18 items)</h2>
        <p className="text-sm text-gray-400">
          Select a single file to get more information and share your cloud
          content.
        </p>
      </div>
    </div>
  );
}
