import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Table } from 'antd';
import reqwest from 'reqwest';

const columns = [{
  title: 'Client',
  dataIndex: 'client',
  sorter: true,
  width: '20%',
},{
  title: 'Department',
  dataIndex: 'dept',
  sorter: true,
  width: '20%',
},{
  title: 'Name',
  dataIndex: 'name',
  sorter: true,
  width: '20%',
},  {
  title: 'Email',
  dataIndex: 'email',
}];

class UserTable2 extends React.Component {
  state = {
    data: [],
    pagination: {},
    loading: false,
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: 'api/user',
      method: 'get',
      data: {
        results: 10,
        ...params,
      },
      type: 'json',
    }).then((data) => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
       pagination.total = data.total;
      //pagination.total = 200;
      this.setState({
        loading: false,
        data: data,
        pagination,
      });
    });
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    return (
      <Table
        columns={columns}
        rowKey={record => record.id}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }
}

export default UserTable2;
