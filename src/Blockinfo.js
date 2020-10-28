import React, { useEffect, useState } from 'react';
import { Table, Grid } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { api } = useSubstrate();
  const [blockInfo, setBlockInfo] = useState(0);
  const [chain, setChain] = useState(1);

  useEffect(() => {
    const unsubscribeAll = null;
    const getInfo = async () => {
      try {
        api.rpc.chain.subscribeNewHeads((header) => {
          setBlockInfo(header);
        });

        api.rpc.system.chain((chain) => {
          setChain(chain);
        });
      } catch (e) {
        console.error(e);
      }
    };
    getInfo();
    return () => unsubscribeAll && unsubscribeAll();
  }, [api.derive.chain, api.rpc.chain, blockInfo, chain]);

  return (
    <Grid.Column>
      <h1>Block Info</h1>
      {blockInfo && chain && (
        <Table celled striped size='small'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan='2'>
                Block Info
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Chain</Table.Cell>
              <Table.Cell>
                { chain.toHuman() }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Block Height</Table.Cell>
              <Table.Cell>
                { blockInfo.number.toNumber() }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Block Hash</Table.Cell>
              <Table.Cell>
                { blockInfo.hash.toHuman() }
              </Table.Cell>
            </Table.Row>            
          </Table.Body>
        </Table>
      )}
    </Grid.Column>
  );
}

export default function BlockInfo(props) {
  const { api } = useSubstrate();
  return api.rpc &&
    api.rpc.system &&
    api.rpc.chain &&
    api.derive.chain &&
    api.derive.chain.bestNumber &&
    api.rpc.chain.getBlock &&
    api.rpc.chain.subscribeNewHeads ? (
    <Main {...props} />
  ) : null;
}
