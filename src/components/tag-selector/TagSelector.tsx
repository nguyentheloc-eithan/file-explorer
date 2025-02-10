/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from '@fluentui/react-components';
import { AddCircleRegular } from '@fluentui/react-icons';
import { Divider, Select, Space } from 'antd';
import { InputRef } from 'antd';
import { useRef, useState } from 'react';
import { stylesDetails } from './styles';

interface TagSelectorProps {
  selectedTags: string[];
  tagItems: string[];
  onTagsChange: (tags: string[]) => void;
  onAddTag: (tag: string) => void;
}

export const TagSelector = ({
  selectedTags,
  tagItems,
  onTagsChange,
  onAddTag,
}: TagSelectorProps) => {
  const [newTagName, setNewTagName] = useState('');
  const inputRef = useRef<InputRef>(null);

  const handleAddTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newTagName && !tagItems.includes(newTagName)) {
      onAddTag(newTagName);
    }
    setNewTagName('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="Select or add tags"
      value={selectedTags}
      onChange={onTagsChange}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 4px' }}>
            <Input
              placeholder="Add new tag"
              ref={inputRef}
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              style={stylesDetails.input}
              onKeyDown={(e: any) => e.stopPropagation()}
            />
            <Button
              icon={<AddCircleRegular />}
              onClick={handleAddTag}
              appearance="subtle"
              style={stylesDetails.button}>
              Add Tag
            </Button>
          </Space>
        </>
      )}
      options={tagItems.map((item) => ({ label: item, value: item }))}
      className="fluent-select"
    />
  );
};
