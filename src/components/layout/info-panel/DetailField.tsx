import { FileMeta } from '@/types/file.type';

interface DetailFieldProps {
  label: string;
  value: string | undefined;
  field: keyof FileMeta;
  editable?: boolean;
  isTag?: boolean;
  isEditing: boolean;
  editedTags: string;
  setEditedTags: (value: string) => void;
  editedValues: Partial<FileMeta>;
  onInputChange: (field: keyof FileMeta, value: string) => void;
}

export const DetailField = ({
  label,
  value,
  field,
  editable = true,
  isTag = false,
  isEditing,
  editedTags,
  setEditedTags,
  editedValues,
  onInputChange,
}: DetailFieldProps) => (
  <div className="grid items-center grid-cols-2 gap-2">
    <span className="text-gray-700">{label}</span>
    {isEditing && editable ? (
      isTag ? (
        <textarea
          value={editedTags}
          onChange={(e) => {
            e.target.focus();
            setEditedTags(e.target.value);
          }}
          placeholder="tag1, tag2, tag3"
          className="bg-white border border-gray-300 px-2 py-1 rounded text-gray-900 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          type="text"
          defaultValue={editedValues[field]?.toString() || ''}
          onChange={(e) => onInputChange(field, e.target.value)}
          className="bg-white border border-gray-300 px-2 py-1 rounded text-gray-900 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )
    ) : (
      <span className="text-gray-900">{value}</span>
    )}
  </div>
);
