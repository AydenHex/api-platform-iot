import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/link/';

export default [
  <Route path="/links/create" component={Create} exact key="create" />,
  <Route path="/links/edit/:id" component={Update} exact key="update" />,
  <Route path="/links/show/:id" component={Show} exact key="show" />,
  <Route path="/links/" component={List} exact strict key="list" />,
  <Route path="/links/:page" component={List} exact strict key="page" />
];
