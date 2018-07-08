import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;


class HeaderPageComponent extends Component {

  render(){
    return(
      <Header className="header">
        <div  className="logo_header" />
        <Menu
          mode="horizontal"
          theme="dark"
          style={{ lineHeight: '64px', float: 'right' }}
        >
          <Menu.Item key="1">Jhersonn Cayao</Menu.Item>

        </Menu>
      </Header>
    );
  }

}


export default HeaderPageComponent;
