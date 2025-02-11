import axios from 'axios';

interface IUpdatePartitionProps {
  partitionId: string;
  serverApiUrl: string;
  name: string;
}
interface IDeletePartitionProps {
  partitionId: string;
  serverApiUrl: string;
}
export const updatePartition = async ({
  partitionId,
  serverApiUrl,
  name,
}: IUpdatePartitionProps) => {
  const url = `${serverApiUrl}/ufyle-admin/partition/${partitionId}?name=${name}`;
  const response = await axios.post(url);
  return response.data.success ? response.data.data : null;
};

export const detelePartition = async ({
  partitionId,
  serverApiUrl,
}: IDeletePartitionProps) => {
  const url = `${serverApiUrl}/ufyle-admin/partition/${partitionId}`;
  const response = await axios.delete(url);
  return response.data.success ? response.data.data : null;
};
