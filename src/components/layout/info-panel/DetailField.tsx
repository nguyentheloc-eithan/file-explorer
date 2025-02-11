/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ref, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, InputRef, Select, Space } from 'antd';
import { FileMeta } from '@/types/file.type';
import { useConfigApp } from '@/providers/AppConfig';
import axios from 'axios';

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

// SWR Fetcher Function
const fetchTags = async (url: string) => {
  const response = await axios.get(url);
  return response.data?.data ? Array.from(new Set(response.data.data)) : [];
};

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
}: DetailFieldProps) => {
  const [items, setItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<Ref<InputRef> | undefined>(null);
  const { config } = useConfigApp();

  // Use SWR for data fetching with caching
  const { data: tagItems = [] } = useSWR(
    `${config.serverApiUrl}/ufyle/search-ref?q=tag`,
    fetchTags
  );

  // Ensure items are reset when editedTags changes
  useEffect(() => {
    setItems(editedTags ? editedTags.split(', ') : []);
  }, [editedTags]);

  const onInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      inputValue &&
      !items.includes(inputValue) &&
      !tagItems.includes(inputValue)
    ) {
      const newItems = [...items, inputValue];
      setItems(newItems);
      setEditedTags(newItems.join(', '));
    }
    setInputValue('');
  };

  return (
    <div className="grid items-center grid-cols-3 gap-2">
      <span className="col-span-1 text-gray-700">{label}</span>
      {isEditing && editable ? (
        isTag ? (
          <Select
            mode="tags"
            value={items}
            className="w-full col-span-2"
            maxTagCount="responsive"
            onChange={(newTags) => {
              setItems(newTags);
              setEditedTags(newTags.join(', '));
            }}
            placeholder="Enter tags"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    placeholder="Add a tag"
                    ref={inputRef as any}
                    value={inputValue}
                    onChange={onInputChangeHandler}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={addItem}
                  />
                </Space>
              </>
            )}
            options={tagItems.map((tag) => ({ label: tag, value: tag }))}
          />
        ) : (
          <input
            type="text"
            defaultValue={editedValues[field]?.toString() || ''}
            onChange={(e) => onInputChange(field, e.target.value)}
            className="w-full col-span-2 px-2 py-1 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      ) : (
        <span className="w-full col-span-2 text-gray-900">{value}</span>
      )}
    </div>
  );
};
