import { Navigate } from 'react-router-dom';
import { UfyleLayout } from '@/components/layout';
import { HomePage } from '@/pages/home-page';
import { RecentPage } from '@/pages/recent-page';
import TopFilesPage from '@/pages/top-files-page';
import NotFoundPage from '@/pages/not-found-page';
import { RouteConfig } from '@/types/route.type';
import { PartitionPage } from '@/pages/partition-page';
import UnderConstruction from '@/components/common/alerts/UnderConstruction';

export const defaultRoutes: RouteConfig[] = [
  {
    path: '/',
    element: (
      <Navigate
        to="/home"
        replace
      />
    ),
  },
  {
    path: '/',
    element: <UfyleLayout />,
    children: [
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'top-files',
        element: <TopFilesPage />,
      },
      {
        path: 'starred',
        element: <UnderConstruction />,
      },
      {
        path: 'recent',
        element: <RecentPage />,
      },
      {
        path: 'shared',
        element: <UnderConstruction />,
      },
      {
        path: 'trash',
        element: <UnderConstruction />,
      },
      {
        path: 'partition',
        element: <PartitionPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
