/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBaseApiParams } from '@/types/api.base.type';
import { FileMeta, IFileBase } from '@/types/file.type';
import axios from 'axios';
import { handleApiError } from '../utils';

interface IGetStatsParams {
  typeResponse?: 'RECENT_FILES' | 'TOP_FILES' | 'ALL';
  serverApiUrl: string;
  partitionId: string;
}

interface IUfileSearch extends Omit<IBaseApiParams, 'partitionId'> {
  textSearch: string;
  limit?: string | number;
}

export const getStats = async ({
  typeResponse = 'ALL',
  serverApiUrl,
  partitionId,
}: IGetStatsParams) => {
  const fetchURL = `${serverApiUrl}/ufyle/partition/${partitionId}/stats`;

  const response = await axios.get(fetchURL);
  const { data } = response;

  if (data && data.data) {
    const { recent, 'top-50': top50 } = data.data;

    const formattedTop50 = top50?.['file-write']?.length
      ? { ...top50, searchString: top50['file-write'].join(',') }
      : null;

    const formatRecent = recent?.['file-write']?.length
      ? { ...recent, searchString: recent['file-write'].join(',') }
      : null;

    console.log('Formatted Recent:', formatRecent);
    console.log('Formatted Top 50:', formattedTop50);

    // Only call APIs if searchString exists, otherwise return empty array
    const [dataRecentFile, dataTop50File] = await Promise.all([
      formatRecent
        ? axios.get(
            `${serverApiUrl}/ufyle/search?q=${formatRecent.searchString}&limit=100`
          )
        : Promise.resolve({ data: [] }),

      formattedTop50
        ? axios.get(
            `${serverApiUrl}/ufyle/search?q=${formattedTop50.searchString}&limit=100`
          )
        : Promise.resolve({ data: [] }),
    ]);

    switch (typeResponse) {
      case 'RECENT_FILES':
        return dataRecentFile.data;
      case 'TOP_FILES':
        return dataTop50File.data;
      default:
        return {
          recentFiles: dataRecentFile.data,
          top50Files: dataTop50File.data,
        };
    }
  }

  return null;
};

interface ICopyFileFnc {
  fileId: string;
  urlWithPid: string;
}

export const copyFile = async ({ fileId, urlWithPid }: ICopyFileFnc) => {
  const urlCopy = `${urlWithPid}/copy/${fileId}`;
  try {
    const response = await axios.post(urlCopy);

    return {
      data: response.data.success ? response.data.data : null,
      error: response.data.success ? null : response.data.error,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || 'An unknown error occurred';

    return {
      data: null,
      error: errorMessage,
    };
  }
};

export const ufileSearch = async ({
  textSearch,
  serverApiUrl,
  limit,
}: IUfileSearch) => {
  const urlFetch = `${serverApiUrl}/ufyle/search?q=${textSearch}&limit=${
    limit ? limit : 50
  }`;
  const { data: response } = await axios.get(urlFetch);
  if (!response.success) {
    const errorMessage = response.data?.error || 'API returned success: false';
    throw new Error(errorMessage);
  }
  return response.data;
};

interface IUploadParams extends IBaseApiParams {
  file: File;
  metaInfo: { name: string; tags?: string };
}
export const uploadFile = async ({
  file,
  serverApiUrl,
  metaInfo,
  partitionId,
}: IUploadParams) => {
  if (!file || !partitionId)
    throw new Error('No file selected or partition ID missing');

  const { name, tags } = metaInfo;
  const url = `${serverApiUrl}/ufyle/partition/${partitionId}/file?name=${encodeURIComponent(
    name
  )}${tags ? `&tags=${encodeURIComponent(tags)}` : ''}`;

  const response = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  const result = await handleApiError(response);
  return result;
};

interface IDeleteFileParams extends IBaseApiParams {
  fileId: string;
}
export const deleteFile = async ({
  fileId,
  partitionId,
  serverApiUrl,
}: IDeleteFileParams) => {
  if (!serverApiUrl) {
    return null;
  }

  const deleteUrl = `${serverApiUrl}/ufyle/partition/${partitionId}/file/${fileId}`;
  const response = await fetch(deleteUrl, { method: 'DELETE' });
  await handleApiError(response);
};
export const editFileMeta = async () => {};
export const getFileMeta = async () => {};

interface IRenameFileParams extends IBaseApiParams {
  values: any;
  fileId: string;
}

export const renameFile = async ({
  values,
  fileId,
  partitionId,
  serverApiUrl,
}: IRenameFileParams) => {
  //   const updateUrl = `${serverApiUrl}/ufyle/partition/${partitionId}/file/${fileId}/meta`;
  const updateUrl = `${serverApiUrl}/ufyle/partition/${partitionId}/rename/${fileId}?name=${values.name}`;
  const response = await fetch(updateUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: values?.name }),
  });

  const result = await handleApiError(response);
  return result;
};

export const downloadFile = async (
  serverApiUrl: string,
  partitionId: string,
  selectedFile: IFileBase | FileMeta
) => {
  try {
    const urlDownload = `${serverApiUrl}/ufyle/partition/${partitionId}/file/${
      selectedFile?.id?.split(':')[1]
    }`;

    const a = document.createElement('a');
    a.href = urlDownload;
    a.download = selectedFile?.name || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};
