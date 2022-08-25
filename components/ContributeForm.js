import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Campaign, web3 } from '@/ethereum';
import { Router } from '@/routes';

class ContributeForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false,
  };

  onSubmit = async (e) => {
    const { address } = this.props;
    e.preventDefault();
    const campaign = Campaign(address);
    this.setState({ loading: true, errorMessage: '' });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether'),
      });
      Router.replaceRoute(`/campaigns/${address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false, value: '' });
  };

  render() {
    const { errorMessage, value, loading } = this.state;
    return (
      <Form onSubmit={this.onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Amount to contribute</label>
          <Input
            value={value}
            onChange={(e) => this.setState({ value: e.target.value })}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>
        <Message error header="Oops" content={errorMessage} />
        <Button primary loading={loading}>
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
