import { create } from 'zustand';
import { IFileBase } from '@/types/file.type';

interface FileStore {
  selectedFile: IFileBase | null;
  targetFileRename: IFileBase | null;
  setSelectedFile: (file: IFileBase | null) => void;
  setTargetFileRename: (rename: IFileBase | null) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  selectedFile: null,
  targetFileRename: null,
  setSelectedFile: (file) => set({ selectedFile: file }),
  setTargetFileRename: (rename) => set({ targetFileRename: rename }),
}));
