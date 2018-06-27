import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, NavLink,  Redirect, withRouter} from "react-router-dom";


import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class DashboardComponent extends Component {
  render() {
    return(
      <div>
          <h1> Already Log-in </h1>
      </div>
    );
  }
}

export default DashboardComponent;
