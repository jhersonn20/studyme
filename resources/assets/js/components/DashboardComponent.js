import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, NavLink,  Redirect, withRouter} from "react-router-dom";

import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import HeaderPageComponent from './Utils/HeaderPageComponent';
import SidebarComponent from './Utils/SidebarComponent';
//import UsersTable from '../components/UserTable';
import UserEditTable from '../components/UserEditTable';
import WrappedRegistrationForm from '../components/RegisterUser';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class DashboardComponent extends Component {
  render() {
    return(
      <div>
        <Layout>
          <HeaderPageComponent/>

          <Content style={{ padding: '0 50px', margin: '16px 0' }}>
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
              <SidebarComponent/>
              <Content style={{ padding: '0 24px', minHeight: 720 }}>
                <UserEditTable />
              </Content>
            </Layout>
          </Content>

          <Footer style={{ textAlign: 'center', }}>
            Developed by Al Rushaid Construction Company Limited.
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default DashboardComponent;
