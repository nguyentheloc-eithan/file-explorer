import { refreshHandler } from '@/core/states/refresh.state';
import { capitalizeFirstLetter } from '@/lib/utils';
import { ChevronRight, RotateCcw, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export interface IHeaderLayoutProp {
  selectedItemKey: string;
}

export const HeaderLayout = ({ selectedItemKey }: IHeaderLayoutProp) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (!value || value === '') {
      newSearchParams.delete('typeS');
      newSearchParams.delete('q');
    } else {
      newSearchParams.set('typeS', 'global_s');
      newSearchParams.set('q', value);
    }

    setSearchParams(newSearchParams);
  };

  return (
    <div className="flex items-center h-12 gap-2 px-2 bg-white border-b border-gray-300 shadow-sm">
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            refreshHandler(selectedItemKey);
          }}
          className="flex items-center justify-center gap-1 p-2 rounded hover:bg-gray-200">
          <RotateCcw size={16} /> Refresh
        </button>
      </div>
      <div className="flex items-center gap-1 px-2">
        <ChevronRight size={16} />
        <span>{capitalizeFirstLetter(selectedItemKey)}</span>
      </div>
      <div className="flex justify-end flex-1">
        <div className="relative w-72">
          <Search
            className="absolute text-gray-500 -translate-y-1/2 left-2 top-1/2"
            size={16}
          />
          <input
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={`Search at ${capitalizeFirstLetter(selectedItemKey)}`}
            className="w-full bg-gray-50 border border-gray-300 rounded px-8 py-1 text-[13px] focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
