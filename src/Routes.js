import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  Analytics as AnalyticsView,
  Adwords as AdwordsView,
  Facebook as FacebookView,
  NotFound as NotFoundView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/dashboard"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={AnalyticsView}
        exact
        layout={MainLayout}
        path="/analytics"
      />
      <RouteWithLayout
        component={AdwordsView}
        exact
        layout={MainLayout}
        path="/adwords"
      />
      <RouteWithLayout
        component={FacebookView}
        exact
        layout={MainLayout}
        path="/facebook"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
