import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;


class SideBarComponent extends Component {

  render(){
    return(
      <Sider width={200} style={{ background: '#d6d3d3' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%' }}
        >
          <Menu.Item key="1">
            <Icon type="dashboard" />
            <span>Dashboard</span>
          </Menu.Item>

          <Menu.Item key="2">
            <Icon type="download" />
            <span>Downloads</span>
          </Menu.Item>

          <Menu.Item key="3">
            <Icon type="upload" />
            <span>Upload</span>
          </Menu.Item>

        </Menu>
      </Sider>
    );
  }

}


export default SideBarComponent;
