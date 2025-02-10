/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InteractionTag,
  InteractionTagPrimary,
} from '@fluentui/react-components';
import { X } from 'lucide-react';

const SelectedTagIndicator = ({ searchParams, setSearchParams }: any) => {
  const selectedTag = searchParams.get('q');
  const isTagSearch = searchParams.get('typeS') === 'ref_t';

  if (!selectedTag || !isTagSearch) {
    return null;
  }

  const handleClearTag = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    newParams.delete('typeS');
    setSearchParams(newParams);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-gray-500">Selected tag:</div>
      <InteractionTag
        appearance="filled"
        onClick={handleClearTag}>
        <InteractionTagPrimary>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium">#{selectedTag}</span>
            <X
              size={12}
              className="cursor-pointer"
            />
          </div>
        </InteractionTagPrimary>
      </InteractionTag>
    </div>
  );
};

export default SelectedTagIndicator;
