import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Table, Input } from 'antd';
import reqwest from 'reqwest';

const Search = Input.Search;

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
  constructor(props){
    super(props);

    this.state = {
      data: [],
      pagination: {},
      loading: false,
      searchInput: '',
    };

    this.handleTableChange = this.handleTableChange.bind(this);
    this.handleSearch      = this.handleSearch.bind(this);
  }


  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    const searchInput = this.state.searchInput;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    if(searchInput.length > 0)  {
      this.fetch.push(searchInput: searchInput);
    }

    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });

    console.dir(this.fetch.searchInput)
  }

  fetch = (params = {}) => {
    this.setState({ loading: true });

    reqwest({
      url: 'api/user',
      method: 'get',
      data: {
        ...params,
      },
      type: 'json',
    }).then((data) => {

      const pagination = { ...this.state.pagination };

      //console.dir(data);
      // Read total count from server
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

    });

  }

  handleSearch = (e) => {
    this.setState({searchInput: e.target.value,})
    
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    return (
      <div>
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Search
              placeholder = "Input search text"
              onSearch = {value => console.log(value)}
              style={{ width: 200 }}
              onPressEnter = {this.handleSearch}
            />
        </div>

        <Table
          {...this.state}
          bordered
          columns={columns}
          rowKey={record => record.id}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          size="small"
        />
      </div>
    );
  }
}


export default UserTable;
