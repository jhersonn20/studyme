import React from 'react';

import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import reqwest from 'reqwest';

const Option = Select.Option;

class ClientSelectorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
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
      console.dir(body);

      const data = body.map(client => ({
        text: client.client_desc,
        value: client.client_desc,
      }));
      this.setState({ data, fetching: false });

    });
  }

  fetchUser = (value) => {
    console.log('fetching user', value);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });

    fetch('client/fetch')
      .then(response => response.json())
      .then((body) => {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return;
        }
        const data = body.results.map(user => ({
          text: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        }));
        this.setState({ data, fetching: false });
      });
  }

  handleChange = (value) => {
    this.setState({
      value,

    });
  }

  componentWillMount(){
    this.fetchClient();
  }

  render() {
    const { fetching, data, value } = this.state;
    return (
      <Select
        labelInValue
        value={value}
        placeholder="Select Client"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(d => <Option key={d.value}>{d.text}</Option>)}
      </Select>
    );
  }
}

export default ClientSelectorComponent;
