import { useConfigApp } from '@/providers/AppConfig';
import axios from 'axios';
import { useEffect, useState } from 'react';

export function useTags() {
  const { config } = useConfigApp();
  const [tagItems, setTagItems] = useState<string[]>([]);

  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await axios.get(
          `${config.serverApiUrl}/ufyle/search-ref?q=tag`
        );
        if (response.data) {
          const uniqueTags: string[] = Array.from(new Set(response.data.data));
          setTagItems(uniqueTags);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    getTags();
  }, [config.serverApiUrl]);

  return { tagItems, setTagItems };
}
