import { partitionId } from '@/constants/partition-id';
import { useConfigApp } from '@/providers/AppConfig';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useTags() {
  const [searchParams] = useSearchParams();
  const pid = searchParams.get('pid');
  const ak = searchParams.get('ak');

  const { config } = useConfigApp();

  const [tagItems, setTagItems] = useState<string[]>([]);

  useEffect(() => {
    const getTags = async () => {
      // const url = `${config.serverApiUrl}/ufyle/search-ref?q=tag`;
      const url = `${config.serverApiUrl}/ufyle/partition/${partitionId}/tags`;

      try {
        const response = await axios.get(url);
        if (response.data) {
          const uniqueTags: string[] = Array.from(new Set(response.data.data));
          setTagItems(uniqueTags);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    // if (ak == 'home') {
    //   setTagItems([]);
    // }
    // if (pid) getTags();
    getTags();
  }, [ak, config.serverApiUrl, pid]);

  return { tagItems, setTagItems };
}
