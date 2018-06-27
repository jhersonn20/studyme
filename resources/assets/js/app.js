
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

//require('./bootstrap');
import 'antd/dist/antd.css';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, Redirect, withRouter } from "react-router-dom";

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import LoginForm from './components/LoginComponent';
import MasterPage from './components/MasterPage';
import DashboardComponent from './components/DashboardComponent';


{/*const PrivateRoute = ({component: Component, ...rest}) => {
  <Route
    {...rest}
    render={props => }

} */ }

const Root = () => {
  return (
    <div>
      <Router>
       <Switch>
         <Route exact path="/login" component={LoginForm} />
          <Route path="/" component={DashboardComponent} />
       </Switch>

      </Router>
    </div>
  )
}

render(<Root />,document.getElementById('example')

);
