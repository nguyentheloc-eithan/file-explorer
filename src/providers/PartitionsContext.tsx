import { Partition } from '@/types/partition.type';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useConfigApp } from './AppConfig';

interface PartitionsContextType {
  partitions: Partition[];
  isLoading: boolean;
  error: Error | null;
}

const PartitionsContext = createContext<PartitionsContextType | undefined>(
  undefined
);

export function PartitionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { config, isLoadingConfig: configLoading } = useConfigApp();
  const [partitions, setPartitions] = useState<Partition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPartitions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${config.serverApiUrl}/ufyle/partitions`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setPartitions(data.meta);
        } else {
          throw new Error('Failed to fetch partitions');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    if (!configLoading && config.serverApiUrl) {
      fetchPartitions();
    }
  }, [config.serverApiUrl, configLoading]);

  const value = {
    partitions,
    isLoading: isLoading || configLoading,
    error,
  };

  return (
    <PartitionsContext.Provider value={value}>
      {children}
    </PartitionsContext.Provider>
  );
}

export function usePartitions() {
  const context = useContext(PartitionsContext);
  if (context === undefined) {
    throw new Error('usePartitions must be used within a PartitionsProvider');
  }
  return context;
}
