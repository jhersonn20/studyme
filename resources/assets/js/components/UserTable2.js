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

class UserTable extends React.Component {
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
    this.setState({ loading: true });

    reqwest({
      url: 'api/user',
      method: 'get',
      data: {
        pageSize: 5,
        ...params,
      },
      type: 'json',
    }).then((data) => {

      const pagination = { ...this.state.pagination };
      //console.dir(data);
      // Read total count from server
       results: 15,
       pagination.pageSize  = data.per_page,
       pagination.total     = data.total;
       pagination.current   = data.current_page;
       pagination.page_size = data.to;

      //pagination.total = 200;
      this.setState({
        loading: false,
        data: data.data,
        pagination,
      });
      console.log(this.state.data);
    });

  }

  componentDidMount() {
    this.fetch();

    console.dir(this.fetch);

  }

  render() {
    return (
      <Table
        bordered
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


export default UserTable;
