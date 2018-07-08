import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import reqwest from 'reqwest';
import moment from 'moment';

import { Table, Input, InputNumber, Popconfirm, Form, DatePicker } from 'antd';


const FormItem = Form.Item;
const EditableContext = React.createContext();
const dateFormat = "YYYY-MM-DD";

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
        width: '20%',
        editable: false,
        sorter: true,
      },
      {
        title: 'Department',
        dataIndex: 'dept',
        width: '20%',
        editable: this.handleClient(client),
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
        width: '20%',
        editable: true,
        sorter: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.id)}
                        style={{ marginRight: 8 }}
                      >
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel(record.id)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.id)}>Edit</a>
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
        console.log(expiry)
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        //console.dir(item);
        //console.dir(row);
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(data);
        this.setState({ data: newData, editingKey: '' });
      }
      //this.fetch();
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
    this.fetch();
  };
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
    );
  }
}

export default UserEditTable;
