import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IFileBase } from '@/types/file.type';
import dayjs from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatFileData = (item: IFileBase) => {
  const rawId = item.id ? item.id.split(':')[1] : '';
  return { ...item, id: rawId, key: rawId };
};

export const handleApiError = async (response: Response) => {
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export const formatters = {
  date: (timestamp?: number): string => {
    if (!timestamp) return 'N/A';
    try {
      const milliseconds =
        timestamp.toString().length <= 10 ? timestamp * 1000 : timestamp;
      return dayjs(milliseconds).format('DD-MM-YYYY HH:mm');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return 'Invalid Date';
    }
  },

  fileSize: (size?: number): string => {
    if (!size && size !== 0) return 'N/A';
    return `${(size / 1024).toFixed(2)} KB`;
  },

  value: (value?: string | number): string => {
    if (value === undefined || value === null || value === '') return 'N/A';
    return String(value);
  },

  extractTags: (refs?: string[]): string[] => {
    if (!refs) return [];
    return refs
      .filter((ref) => ref.startsWith('tag:'))
      .map((tag) => tag.replace('tag:', ''));
  },

  extractPaths: (refs?: string[]): string[] => {
    if (!refs) return [];
    return refs
      .filter((ref) => ref.startsWith('dir:'))
      .map((dir) => dir.replace('dir:', ''));
  },
};
