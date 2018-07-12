import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import reqwest from 'reqwest';

import ClientSelectorComponent from './Utils/ClientSelectorComponent';

import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, message, Spin, DatePicker } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const dateFormat = "YYYY-MM-DD";
const dateconfig = {
      rules: [{ type: 'object', required: true, message: 'Please select date!' }
    ],
    initialValue: moment(new Date()),
};
const dateToday = Date.now();

class RegistrationForm extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      loading: false,
      clientData: [],
      deptData: [],
      fetching: false,
      disableSelect: true,
    };

    this.handleError  = this.handleError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOn  = this.handleOn.bind(this);
    this.handleOff  = this.handleOff.bind(this);
  }

  fetchClient = (params = {}) => {
    this.setState({ data: [], fetching: true });

    reqwest({
      url: 'api/client/fetch',
      method: 'get',
      data: {
        ...params,
      },
      type: 'json',
    }).then((body) => {

      const clientData = body.map(client => ({
        text: client.client_desc,
        value: client.client_code,
      }));
      this.setState({ clientData, fetching: false });

    });
  }

  fetchDept = (params = {}) => {
    this.setState({ data: [], fetching: true });

    reqwest({
      url: 'api/department/fetch',
      method: 'get',
      data: {
        ...params,
      },
      type: 'json',
    }).then((body) => {

      const deptData = body.map(dept => ({
        text: dept.dept_desc,
        value: dept.dept_code,
      }));
      this.setState({ deptData, fetching: false });

    });
  }

  handleOn = () => {
    this.setState({
      loading: true,
    })

  }

  handleOff = () => {
    this.setState({
      loading: false,
    })

  }

  handleError = (key,value) => {
    const {getFieldsValue} = this.props.form;
    const val = getFieldsValue([key]);

    console.log(val[key]);


    this.props.form.setFields({
      [key]:{
        value: val[key],
        errors: [new Error([value])]
      }
    });

  }

  onChangeClient = (value) => {

    if(value === "ARCC") {

        this.setState({disableSelect: false});
    }else{
      const {getFieldsValue} = this.props.form;

      this.props.form.setFields({
        "dept":{
          value: "",

        }
      });


      this.setState({disableSelect: true});
    }
  }



  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);
        //console.log(values.name);

        axios.post('api/register',{
          'client' : values.client,
          'dept' : values.dept,
          'name' : values.name,
          'email' : values.email,
          'password' : values.password,
          'expiry' : values['expiry'].format('YYYY-MM-DD'),
        }).
        then(response => {
            //console.log(response.data);
          //  message.success(response.data.message);
          message.success('New account has been created. Email Verification has been sent!',30);
          this.props.form.resetFields();
          this.setState({loading: false});
        }).
        catch(error=> {
          if (error.response.status == 422) {
            const errors = error.response.data.errors;
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
     }else{
       this.setState({loading: false});
     }

    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  componentWillMount(){
    this.fetchClient();
    this.fetchDept();
  }



  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;
    const {clientData, deptData } = this.state;

    const formItemLayout = {
      labelCol: {
        lg: {span: 6 },
        xs: { span: 20 },
        sm: { span: 8 },
      },
      wrapperCol: {
        lg: {span: 6 },
        xs: { span: 20 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        lg: {
          span: 2,
          offset: 9,
        },
        xs: {
          span: 20,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Spin spinning={this.state.loading} tip="Please wait data has been processing..." size="large">
        <Form onSubmit={this.handleSubmit} method="POST">
          <FormItem
            {...formItemLayout}
            label="Client"

          >
            {getFieldDecorator('client', {
              rules: [{ required: true, message: 'Please input your Client!' }],

            })(
              <Select
                placeholder="Select Client"
                filterOption={false}
                style={{ width: '190' }}
                onChange={this.onChangeClient}

              >
                {clientData.map(d => <Option key={d.value}>{d.text}</Option>)}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Department"

          >
            {getFieldDecorator('dept', {


            })(
              <Select
                placeholder="Select Client"
                filterOption={false}
                style={{ width: '190' }}
                disabled={this.state.disableSelect}
              >
                {deptData.map(d => <Option key={d.value}>{d.text}</Option>)}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Full Name"

          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input your Name!' }],
            })(
              <Input />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="E-mail"
          >
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'The input is not valid E-mail!',
              }, {
                required: true, message: 'Please input your E-mail!',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Password"
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: 'Please input your password!',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>

          <FormItem
          {...formItemLayout}
          label="DatePicker"
        >
          {getFieldDecorator('expiry', dateconfig)(
            <DatePicker  />
          )}
        </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" onClick={this.handleOn}>Register</Button>

          </FormItem>
        </Form>
      </Spin>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default WrappedRegistrationForm;
