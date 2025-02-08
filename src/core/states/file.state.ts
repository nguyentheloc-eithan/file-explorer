import { create } from 'zustand';
import { IFileBase } from '@/types/file.type';

interface FileStore {
  selectedFile: IFileBase | null;
  setSelectedFile: (file: IFileBase | null) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  selectedFile: null,
  setSelectedFile: (file) => set({ selectedFile: file }),
}));
