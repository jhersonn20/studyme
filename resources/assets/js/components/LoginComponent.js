import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch, NavLink,  Redirect, withRouter} from "react-router-dom";
import { Form, Icon, Input, Button, Checkbox } from 'antd';





const FormItem = Form.Item;


class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        {/*console.log('Received values of form: ', values); */ }
        console.log(values);
      }



    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="flex-center position-ref full-height">
        <div id='login_header'></div>
        <div className='login-box'>

          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' },{type: 'email', message: 'Invalid Email format!'}],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: false,
              })(
                <Checkbox>Remember me</Checkbox>
              )}

              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>

            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}



const WrappedNormalLoginForm = Form.create()(LoginForm);

export default WrappedNormalLoginForm;
