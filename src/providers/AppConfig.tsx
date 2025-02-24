import React, { createContext, useContext, useEffect, useState } from 'react';

export interface IAppConfig {
  serverApiUrl: string;
}

interface ConfigContextType {
  config: IAppConfig;
  saveConfig: (config: IAppConfig) => void;
  loadConfig: () => void;
  isLoadingConfig: boolean;
}

const generateHash = (data: string): string => {
  return btoa(data).split('').reverse().join('');
};

const setCookie = (name: string, value: string, days: number): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;HttpOnly;`;
};

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [key, ...valParts] = cookie.split('=');
    if (key === name) return valParts.join('=') || null;
  }
  return null;
};

export const ConfigAppContext = createContext<ConfigContextType>({
  config: { serverApiUrl: '' },
  saveConfig: () => {},
  loadConfig: () => {},
  isLoadingConfig: true,
});

interface ConfigAppProviderProps {
  children: React.ReactNode;
}

export const ConfigAppProvider: React.FC<ConfigAppProviderProps> = ({
  children,
}) => {
  const [config, setConfigState] = useState<IAppConfig>({ serverApiUrl: '' });
  const [isLoading, setIsLoading] = useState(true);

  const loadConfig = async () => {
    setIsLoading(true);
    const rawConfig = getCookie('CONFIG_APP');
    const hash = getCookie('CONFIG_APP_HASH');

    if (rawConfig && hash && generateHash(rawConfig) === hash) {
      try {
        const parsedConfig = JSON.parse(decodeURIComponent(rawConfig));
        if (!parsedConfig.serverApiUrl) {
          console.error('Invalid config: serverApiUrl is required');
        }
        setConfigState(parsedConfig);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Failed to parse stored config:', error);
      }
    }

    try {
      // Fetch config.json from the public folder
      const response = await fetch('/config.json');
      const data = await response.json();

      if (data?.app_config?.endpoint) {
        const newConfig: IAppConfig = {
          serverApiUrl: data.app_config.endpoint,
        };
        saveConfig(newConfig);
        setConfigState(newConfig);
      } else {
        console.error('Invalid config.json: Missing app_config.endpoint');
      }
    } catch (error) {
      console.error('Failed to load config.json:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = (newConfig: IAppConfig) => {
    const rawConfig = encodeURIComponent(JSON.stringify(newConfig));
    const hash = generateHash(rawConfig);
    setCookie('CONFIG_APP', rawConfig, 7);
    setCookie('CONFIG_APP_HASH', hash, 7);
    setConfigState(newConfig);
    // fetchTagsAndDirs(newConfig.serverApiUrl);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <ConfigAppContext.Provider
      value={{
        config,
        saveConfig,
        loadConfig,
        isLoadingConfig: isLoading,
      }}>
      {children}
    </ConfigAppContext.Provider>
  );
};

export const useConfigApp = () => {
  const context = useContext(ConfigAppContext);
  if (!context) {
    throw new Error('useConfigApp must be used within a ConfigAppProvider');
  }
  return context;
};
