import React, { createContext, useContext, useState, useCallback } from 'react';
import { defaultRoutes } from '@/configs/routes.config';
import { RouteConfig } from '@/types/route.type';

interface RouteContextType {
  routes: RouteConfig[];
  addRoutes: (newRoutes: RouteConfig[]) => void;
  removeRoutes: (paths: string[]) => void;
  updateRoute: (path: string, updates: Partial<RouteConfig>) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [routes, setRoutes] = useState<RouteConfig[]>(defaultRoutes);

  const addRoutes = useCallback((newRoutes: RouteConfig[]) => {
    setRoutes((currentRoutes) => {
      const layoutRoute = currentRoutes.find((route) => route.children);
      if (!layoutRoute) return currentRoutes;

      // Create a new array with the updated layout route
      return currentRoutes.map((route) => {
        if (route.children) {
          return {
            ...route,
            children: [...route.children, ...newRoutes],
          };
        }
        return route;
      });
    });
  }, []);

  const removeRoutes = useCallback((paths: string[]) => {
    setRoutes((currentRoutes) => {
      return currentRoutes.map((route) => {
        if (route.children) {
          return {
            ...route,
            children: route.children.filter(
              (child) => !paths.includes(child.path)
            ),
          };
        }
        return route;
      });
    });
  }, []);

  const updateRoute = useCallback(
    (path: string, updates: Partial<RouteConfig>) => {
      setRoutes((currentRoutes) => {
        return currentRoutes.map((route) => {
          if (route.children) {
            return {
              ...route,
              children: route.children.map((child) =>
                child.path === path ? { ...child, ...updates } : child
              ),
            };
          }
          return route;
        });
      });
    },
    []
  );

  return (
    <RouteContext.Provider
      value={{ routes, addRoutes, removeRoutes, updateRoute }}>
      {children}
    </RouteContext.Provider>
  );
}
export const useUfyleRoutes = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoutes must be used within a RouteProvider');
  }
  return context;
};
