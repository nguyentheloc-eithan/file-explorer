import { backend_url } from '@/configs/app-config';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Config {
  serverApiUrl: string;
}

interface ConfigContextType {
  config: Config;
  saveConfig: (config: Config) => void;
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
  const [config, setConfigState] = useState<Config>({ serverApiUrl: '' });
  const [isLoading, setIsLoading] = useState(true);

  const getBasePath = (): string => {
    const isLocalhost = /^localhost|127\.0\.0\.1|0\.0\.0\.0$/.test(
      window.location.hostname
    );
    if (isLocalhost) {
      return 'https://ufyle.dision.dev';
    }

    const match = window.location.pathname.match(/\/uf\/?(.*)/);
    return match
      ? `${window.location.origin}/uf/${match[1]}`
      : window.location.origin;
  };

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
      // const basePath = getBasePath();
      // const response = await axios.get(`${basePath}/config`);

      // let data;
      // if (typeof response.data === 'string') {
      //   // Parse the raw JSON string manually if it's not an object
      //   data = JSON.parse(response.data);
      // } else {
      //   data = response.data;
      // }

      // if (data?.app_config?.endpoint) {
      //   const newConfig: Config = { serverApiUrl: data.app_config.endpoint };
      //   saveConfig(newConfig);
      //   setConfigState(newConfig);
      // } else {
      //   console.error('Invalid response from backend');
      // }
      const newConfig: Config = { serverApiUrl: backend_url };
      saveConfig(newConfig);
      setConfigState(newConfig);
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = (newConfig: Config) => {
    const rawConfig = encodeURIComponent(JSON.stringify(newConfig));
    const hash = generateHash(rawConfig);
    setCookie('CONFIG_APP', rawConfig, 7);
    setCookie('CONFIG_APP_HASH', hash, 7);
    setConfigState(newConfig);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <ConfigAppContext.Provider
      value={{ config, saveConfig, loadConfig, isLoadingConfig: isLoading }}>
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
