import React from 'react';
import ReactDOM from 'react-dom';
import AddStoryList from './components/AddStoryList/index';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import * as ROUTES from './contants/routes';
import './index.scss';
import 'antd/dist/antd.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
    <Switch>
      <Redirect exact from={ROUTES.defaultPath} to={ROUTES.addStoryList}></Redirect>
      <Route exact path={ROUTES.addStoryList} component={AddStoryList}></Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
