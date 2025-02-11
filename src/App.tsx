import { renderRoutes } from '@/utils/route.utils';
import { RouteProvider, useUfyleRoutes } from './providers/RoutesProvider';

function AppRoutes() {
  const { routes } = useUfyleRoutes();
  return renderRoutes(routes);
}

function App() {
  return (
    <RouteProvider>
      <AppRoutes />
    </RouteProvider>
  );
}

export default App;
