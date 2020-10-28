import React, { useState } from 'react';
import { Button, Form, Input, Grid, Label, Icon } from 'semantic-ui-react';
import { Abi, ContractPromise } from '@polkadot/api-contract';
import { useSubstrate } from './substrate-lib';

import metadata from './config/erc20-metadata.json';

export default function Main (props) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ addressTo: null, amount: 0 });
  const { accountPair } = props;

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }));

  const { addressTo, amount } = formState;
  const erc20Address = '5EDkjch8RL54X2tBmxbdxDfYXcV2YiN7hnQ3c1cKrCsh5CfK';
  const { api } = useSubstrate();
  const contract = new ContractPromise(api, new Abi(metadata), erc20Address);

  const transfer = () => {
    const gasLimit = 400000n * 2000000n;

    const setBalance = (stage) => {
      contract.query.balanceOf(addressTo, 0, gasLimit, addressTo).then((balance) => {
        setStatus(`Transaction is ${stage}.\n Address: ${addressTo} balance: ${balance.output.toNumber()}`);
      });
    };

    contract.tx.transfer(0, gasLimit, addressTo, amount)
      .signAndSend(accountPair, (result) => {
        if (result.status.isInBlock) {
          setBalance('In block');
        } else if (result.status.isFinalized) {
          setBalance('Finalized');
        }
      });
  };

  return (
    <Grid.Column width={8}>
      <h1>ERC20 Token Transfer</h1>
      <Form>
        <Form.Field>
          <Label basic color='teal'>
            <Icon name='hand point right' />
            1 Unit = 1000000000000
          </Label>
        </Form.Field>
        <Form.Field>Contract Address: {erc20Address}</Form.Field>
        <Form.Field>
          <Input
            fluid
            label='To'
            type='text'
            placeholder='address'
            state='addressTo'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Amount'
            type='number'
            state='amount'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <Button onClick={transfer}>Submit</Button>
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
