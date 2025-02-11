/* eslint-disable @typescript-eslint/no-explicit-any */
import { ufileSearch } from '@/lib/api/file.api';
import { useConfigApp } from '@/providers/AppConfig';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useSearchData = () => {
  const { config } = useConfigApp();

  const [searchParams] = useSearchParams();
  const qString = searchParams.get('q') || '';
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchSearchData = async () => {
      if (!qString) {
        setData(null);
        return;
      }

      setIsLoading(true);

      // Wait for at least 500ms before making the API call
      timeoutId = setTimeout(async () => {
        try {
          const response = await ufileSearch({
            textSearch: qString || '',
            serverApiUrl: config.serverApiUrl,
            limit: 50,
          });
          setData(response);
        } catch (err: any) {
          setError(err.message || 'Error occurred while fetching search data');
        } finally {
          setIsLoading(false);
        }
      }, 500);
    };

    fetchSearchData();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [config.serverApiUrl, qString]);

  return { dataGlobalSearch: data, error, loadingGlobalSearch: isLoading };
};
