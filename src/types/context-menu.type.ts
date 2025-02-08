import { IFileBase } from './file.type';

export interface ContextMenuState {
  show: boolean;
  x: number;
  y: number;
  file?: IFileBase;
}
