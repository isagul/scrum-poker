import React from 'react';
import ReactDOM from 'react-dom';
import AddStoryList from './components/AddStoryList/index';
import ViewScrumMaster from './components/VievScrumMaster/index';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import './index.scss';
import 'antd/dist/antd.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
    <Switch>
      <Redirect exact from={ROUTES.defaultPath} to={ROUTES.addStoryList}></Redirect>
      <Route exact path={ROUTES.addStoryList} component={AddStoryList}></Route>
      <Route exact path={`${ROUTES.viewScrumMaster}/:sessionName`} component={ViewScrumMaster}></Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
