import { IBaseApiParams } from '@/types/api.base.type';
import axios from 'axios';

export const getDirs = async ({
  partitionId,
  serverApiUrl,
}: IBaseApiParams) => {
  const url = `${serverApiUrl}/ufyle/partition/${partitionId}/dirs`;
  const response = await axios.get(url);
  return response.data.success ? response.data.data : [];
};

export const getTags = async ({
  partitionId,
  serverApiUrl,
}: IBaseApiParams) => {
  const url = `${serverApiUrl}/ufyle/partition/${partitionId}/tags`;
  const response = await axios.get(url);
  return response.data.success ? response.data.data : [];
};
