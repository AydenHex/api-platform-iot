import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/opening/';

export default [
  <Route path="/openings/create" component={Create} exact key="create" />,
  <Route path="/openings/edit/:id" component={Update} exact key="update" />,
  <Route path="/openings/show/:id" component={Show} exact key="show" />,
  <Route path="/openings/" component={List} exact strict key="list" />,
  <Route path="/openings/:page" component={List} exact strict key="page" />
];
