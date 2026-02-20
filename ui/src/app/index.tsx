import * as React from 'react';
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppRouteConfig, IAppRoute, routes } from './routes';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './app.css';
import './carbon-styles.scss';

// Flatten routes to extract all IAppRoute objects from groups
const flattenRoutes = (routeConfigs: AppRouteConfig[]): IAppRoute[] => {
  const flatRoutes: IAppRoute[] = [];

  routeConfigs.forEach((config) => {
    if ('routes' in config && config.routes) {
      // It's a group, add all its child routes
      flatRoutes.push(...config.routes);
    } else if ('element' in config) {
      // It's a regular route
      flatRoutes.push(config);
    }
  });

  return flatRoutes;
};

const App = ({ basename }: { basename: string }) => {
  return (
    <ErrorBoundary>
      <RouterProvider
        router={createBrowserRouter(
          flattenRoutes(routes).map(
            (route: IAppRoute) => ({ element: route.element, path: route.path }) as RouteObject,
          ),
          { basename: basename },
        )}
      />
    </ErrorBoundary>
  );
};

export default App;
