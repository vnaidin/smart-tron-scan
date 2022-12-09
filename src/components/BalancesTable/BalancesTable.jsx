import React from 'react';
import {
  Spinner, Table, Button, Col,
} from 'react-bootstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { useGetContractBalances } from '../../hooks';
import SendMoney from './SendMoney';
import CopyButton from '../CopyButton';

export default function BalancesTable({ setContractToViewEvents }) {
  const contractBalances = useGetContractBalances();
  const minimizeHashes = (link, nOfSymbols = 4) => (link && link.length !== 0 ? `${link.substring(0, nOfSymbols)}...${link.substring(link.length - nOfSymbols)}` : '');

  return (
    <Table striped bordered hover size="sm" responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>Address</th>
          <th>Balance</th>
          <th>Actions</th>
        </tr>
      </thead>
      {contractBalances
        ? (
          <tbody>

            {contractBalances.map((contract) => (
              <tr
                key={contract.address}
                style={{ border: contract?.limit >= contract.balance ? '10px solid red' : 'none' }}
              >
                <td>
                  {contract.title}
                </td>

                <td>
                  <a
                    href={`https://tronscan.org/#/contract/${contract.address}/transactions`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {minimizeHashes(contract.address, 7)}
                  </a>
                  <CopyButton txtToCopy={contract.address} />
                </td>

                <td>
                  {contract.balance}
                  <img
                    className="mx-1"
                    src={`/smart-tron-scan/${contract.type === 0 ? 'trx' : 'usdt'}-logo.png`}
                    alt={contract.type === 0 ? 'TRX' : 'USDT'}
                    width={15}
                    height={15}
                  />
                </td>

                <td className="row m-0">
                  <Col>
                    <SendMoney
                      contractAddress={contract.address}
                      contractType={contract.type}
                    />
                  </Col>

                  <Col className="align-items-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setContractToViewEvents(contract.address)}
                    >
                      Show Events
                    </Button>

                  </Col>

                </td>
              </tr>
            ))}

          </tbody>
        )
        : <Spinner animation="border" />}
    </Table>
  );
}

BalancesTable.propTypes = {
  setContractToViewEvents: PropTypes.func.isRequired,
};
