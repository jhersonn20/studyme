import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import reqwest from 'reqwest';
import moment from 'moment';
import axios from 'axios';

import { Table, Input, InputNumber, Popconfirm, Form, DatePicker, message, Button } from 'antd';


const FormItem = Form.Item;
const EditableContext = React.createContext();
const dateFormat = "YYYY-MM-DD";
const Search = Input.Search;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }else if (this.props.inputType === 'date') {
      return <DatePicker  />
    }

    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          const iType = this.props.inputType === 'date' ? {type: 'object'} : this.props.inputType === 'email' ? {type: 'email', message: 'Please enter valid email!'} : {whitespace: false};
          //console.log(iType);
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {

                    rules: [iType ,{
                      required: true,
                      message: `Please Input ${title}!`,
                    },],
                    initialValue: this.props.inputType === 'date' ? moment(record[dataIndex]) : record[dataIndex] ,

                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class UserEditTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       editingKey: '',
       data: [],
       pagination: {},
       loading: false,
    };

    this.columns = [
      {
        title: 'Client',
        dataIndex: 'client',
        width: '15%',
        editable: false,
        sorter: true,
      },
      {
        title: 'Department',
        dataIndex: 'dept',
        width: '15%',
        editable: true,
        sorter: true,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        width: '20%',
        editable: true,
        sorter: true,
      },
      {
        title: 'Email Address',
        dataIndex: 'email',
        width: '20%',
        editable: true,
        sorter: true,
      },
      {
        title: 'Expiry',
        dataIndex: 'expiry',
        width: '10%',
        editable: true,
        sorter: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        width: '10%',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (

                      <Button type="primary" size='small' style={{ marginRight: 8 }}  onClick={() => this.save(form, record.id)}>Save</Button>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.id)}
                  >
                    <Button type="danger" size='small'>Cancel</Button>
                  </Popconfirm>
                </span>
              ) : (
                  <div style={{ marginRight: 8 }}>
                    <Button type="primary" style={{ marginRight: 8 }} size='small'  onClick={() => this.edit(record.id)}>Edit</Button>
                    <Button type="danger" size='small' onClick={() => this.delete(record.id)}>Delete</Button>
                  </div>
              )}
            </div>
          );
        },
      },
    ];
  }

  handleClient = (record) => {
    if(record.client !== "ARCC"){
      return false;
    }
    return true;
  }

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
       pagination.page_size = data.per_page;

      //pagination.total = 200;
      this.setState({
        loading: false,
        data: data.data,
        pagination,
      });

    });

  }

  componentDidMount() {
    this.fetch();
  }


  isEditing = (record) => {
    return record.id === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });

  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1) {
        const item   = newData[index];
        row.expiry   = row.expiry.format(dateFormat);

        reqwest({
          url: 'api/user/' + item.id,
          method: 'post',
          data: {
            id: item.id,
            ...row
          },
          type: 'json',
        }).then((data) => {

          message.success(data.message);


          this.fetch();
        }).catch(error => {
          if (error.response.status == 422) {
            message.error('Please Check Invalid Inputs!', 10);
            Object.entries(errors).forEach(([key, value]) =>{
              this.handleError(key,value);

           });
           this.setState({loading: false});

         }else {
            message.error('Unable to get Errors! Please consult System Administrator',10);
            this.setState({loading: false});
         }

        });

        this.setState({ data: newData, editingKey: '' });
      } else {

        this.setState({ data: newData, editingKey: '' });
      }

    });
  }

  delete = (record) => {
    console.log(record);
    this.fetch();
  }

  cancel = () => {
    this.setState({ editingKey: '' });
    this.fetch();
  };

  handleSearch = (e) => {
    const pager = { ...this.state.pagination};

  }

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'expiry' ? 'date' : col.dataIndex === 'email' ? 'email' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });


    return (
      <div>
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Search
              placeholder = "Input search text"
              onSearch = {this.handleSearch}
              style={{ width: 200 }}
              onPressEnter = {this.handleSearch}

            />
        </div>

        <Table
          onChange = {this.handleTableChange}
          rowKey={record => record.id}
          pagination={this.state.pagination}
          loading={this.state.loading}
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          size="small"
          bordered
        />

      </div>

    );
  }
}

export default UserEditTable;
