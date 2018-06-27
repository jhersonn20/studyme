import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

export default class Example extends Component {
    render() {
        return (
          <Layout>
            <Header className="header">
              <div className="logo" />
              <Menu
                mode="horizontal"
                theme="dark"
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="1">Jhersonn Cayao</Menu.Item>

              </Menu>
            </Header>

            <Content style={{ padding: '0 50px', margin: '16px 0' }}>

              <Layout style={{ padding: '24px 0', background: '#fff' }}>
                <Sider width={200} style={{ background: '#fff' }}>
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
                <Content style={{ padding: '0 24px', minHeight: 720 }}>
                  Content
                </Content>
              </Layout>
            </Content>
            
            <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2016 Created by Ant UED
            </Footer>
</Layout>

        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
