import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';

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

    };

    this.handleError  = this.handleError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOn  = this.handleOn.bind(this);
    this.handleOff  = this.handleOff.bind(this);
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

    this.props.form.setFields({
      [key]:{
        value: [val],
        errors: [new Error([value])]
      }
    })


    //console.log(key, value);
    //console.log(errors);
    // let data =  {};
    //
    // const error = JSON.stringify(`{ "${key}": { "errors": [new Error("${value}")]} }`);
    //
    // //console.log(error);
    //
    // console.log(JSON.parse(error));
    //
    // this.props.form.setFields(error);

    // console.log(errors);
    //
    // Object.entries(errors).forEach(([key, value]) =>{
    //  const error = `${key}: {errors: [new Error("${value}")]}`;
    //  const stringify = JSON.stringify(error);
    //
    //  console.log(JSON.parse(stringify));
    //  this.props.form.setFields(JSON.parse(stringify))


    // });

    // this.props.form.setFields({
    //   "name": {
    //     "errors": [new Error('tanginanmankasie')]
    //   },
    //   "password":{
    //     "errors": [new Error('putanginamo')]
    //   }
    // })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);
        //console.log(values.name);

        console.log(values['expiry'].format('YYYY-MM-DD'));

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
      }



    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

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
              initialValue: 'jack',
            })(
              <Select style={{ width: 190 }} placeholder="Select Client" >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Department"

          >
            {getFieldDecorator('dept', {
              rules: [{ required: true, message: 'Please input your Department!' }],
              initialValue: 'jack',
            })(
              <Select  style={{ width: 190 }} placeholder="Select Client" >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="Yiminghe">yiminghe</Option>
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
