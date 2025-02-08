export interface FileMeta {
  no?: number | string;
  key?: string | number;
  alias: string;
  atime: number;
  comment: string;
  ctime: number;
  etag: string;
  id: string;
  link: string;
  mtime: number | string;
  name: string;
  partition: string;
  refs: string[];
  size: number;
  synopsis: string;
  url: string;
}

export interface IFileBase {
  alias: string;
  fragments: {
    Id: string[];
    Url: string[];
  };
  mtime?: string | number;
  id: string;
  key: string;
  name: string;
  refs: string[];
  url: string;
}
