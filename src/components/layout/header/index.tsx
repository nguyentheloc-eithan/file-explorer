import { capitalizeFirstLetter } from '@/lib/utils';
import { ChevronRight, RotateCcw, Search } from 'lucide-react';

export interface IHeaderLayoutProp {
  selectedItemKey: string;
}
export const HeaderLayout = ({ selectedItemKey }: IHeaderLayoutProp) => {
  return (
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
            placeholder={`Search at ${capitalizeFirstLetter(selectedItemKey)}`}
            className="w-full bg-gray-50 border border-gray-300 rounded px-8 py-1 text-[13px] focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
