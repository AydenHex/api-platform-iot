import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/heater/';

export default [
  <Route path="/heaters/create" component={Create} exact key="create" />,
  <Route path="/heaters/edit/:id" component={Update} exact key="update" />,
  <Route path="/heaters/show/:id" component={Show} exact key="show" />,
  <Route path="/heaters/" component={List} exact strict key="list" />,
  <Route path="/heaters/:page" component={List} exact strict key="page" />
];
