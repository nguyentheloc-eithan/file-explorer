import { RouteConfig } from '@/types/route.type';
import { Route, Routes } from 'react-router-dom';

export const renderRoutes = (routes: RouteConfig[]) => {
  return (
    <Routes>{routes.map((route, index) => renderRoute(route, index))}</Routes>
  );
};

const renderRoute = (route: RouteConfig, index: number) => {
  return (
    <Route
      key={index}
      path={route.path}
      element={route.element}>
      {route.children?.map((childRoute, childIndex) =>
        renderRoute(childRoute, childIndex)
      )}
    </Route>
  );
};

export const updateRoutes = (
  currentRoutes: RouteConfig[],
  updates: Partial<RouteConfig>[],
  matcher: (route: RouteConfig, update: Partial<RouteConfig>) => boolean = (
    route,
    update
  ) => route.path === update.path
): RouteConfig[] => {
  return currentRoutes.map((route) => {
    const update = updates.find((u) => matcher(route, u));

    if (update) {
      return {
        ...route,
        ...update,
        children: update.children || route.children,
      };
    }

    if (route.children) {
      return {
        ...route,
        children: updateRoutes(route.children, updates, matcher),
      };
    }

    return route;
  });
};
