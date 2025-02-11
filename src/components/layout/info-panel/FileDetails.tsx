import dayjs from 'dayjs';
import { DetailField } from './DetailField';
import { formatters } from '@/lib/utils';
import { FileMeta } from '@/types/file.type';

interface FileDetailsProps {
  selectedFileMeta: FileMeta | null;
  isEditing: boolean;
  editedValues: Partial<FileMeta>;
  editedTags: string;
  setEditedTags: (value: string) => void;
  onInputChange: (field: keyof FileMeta, value: string) => void;
}

export const FileDetails = ({
  selectedFileMeta,
  isEditing,
  editedValues,
  editedTags,
  setEditedTags,
  onInputChange,
}: FileDetailsProps) => (
  <div className="mt-8 bg-white">
    <h3 className="mb-4 font-semibold text-gray-900">Details</h3>
    <div className="space-y-2 text-sm text-gray-800">
      <DetailField
        label="Alias"
        value={selectedFileMeta?.alias}
        field="alias"
        isEditing={isEditing}
        editedTags={editedTags}
        setEditedTags={setEditedTags}
        editedValues={editedValues}
        onInputChange={onInputChange}
      />
      {selectedFileMeta && (
        <>
          <DetailField
            label="Size"
            value={formatters.fileSize(selectedFileMeta.size)}
            field="size"
            editable={false}
            isEditing={isEditing}
            editedTags={editedTags}
            setEditedTags={setEditedTags}
            editedValues={editedValues}
            onInputChange={onInputChange}
          />
          <DetailField
            label="Modified"
            value={dayjs(
              selectedFileMeta.mtime || '2025-02-08T08:35:19+07:00'
            ).format('DD/MM/YYYY HH:mm')}
            field="mtime"
            editable={false}
            isEditing={isEditing}
            editedTags={editedTags}
            setEditedTags={setEditedTags}
            editedValues={editedValues}
            onInputChange={onInputChange}
          />
          <DetailField
            label="Tags"
            value={selectedFileMeta.refs
              ?.filter((ref) => ref.startsWith('tag:'))
              .map((tag) => tag.replace('tag:', ''))
              .join(', ')}
            field="refs"
            isTag={true}
            isEditing={isEditing}
            editedTags={editedTags}
            setEditedTags={setEditedTags}
            editedValues={editedValues}
            onInputChange={onInputChange}
          />

          <div className="mt-4">
            <h3 className="mb-2 font-semibold text-gray-900">Synopsis</h3>
            {isEditing ? (
              <textarea
                value={editedValues.synopsis || ''}
                onChange={(e) => onInputChange('synopsis', e.target.value)}
                className="w-full h-24 bg-white border border-gray-300 px-2 py-1 rounded text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-600">
                {selectedFileMeta?.synopsis}
              </p>
            )}
          </div>
          <div className="mt-4">
            <h3 className="mb-2 font-semibold text-gray-900">Comment</h3>
            {isEditing ? (
              <textarea
                value={editedValues.comment || ''}
                onChange={(e) => onInputChange('comment', e.target.value)}
                className="w-full h-24 bg-white border border-gray-300 px-2 py-1 rounded text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-600">
                {selectedFileMeta?.comment}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  </div>
);
