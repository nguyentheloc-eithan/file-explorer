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
