export interface Partition {
  no?: number | string;
  alias: string;
  comment: string;
  id: string;
  name: string;
  tags: string[] | null;
}

export interface PartitionsResponse {
  success: boolean;
  data: number;
  meta: Partition[];
}
