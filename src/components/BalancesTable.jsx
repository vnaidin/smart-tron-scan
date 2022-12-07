import React, { useRef } from 'react';
import {
  Spinner, Table, Button, Col, Row,
} from 'react-bootstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { useGetContractBalances } from '../hooks';

export default function BalancesTable({ setContractToViewEvents }) {
  const { tronWeb } = window;
  const contractBalances = useGetContractBalances();
  const inpRef = useRef();
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
                    <Row style={{ width: '10em' }}>
                      <input
                        type="number"
                        min={1000}
                        defaultValue={contract.type === 1 ? 1000 : 20000}
                        ref={inpRef}
                        placeholder="amount"
                        name="send-tokens"
                      />
                      <Button
                        id="my-nft-btns"
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          if (contract.type === 1) {
                            return tronWeb.contract().at('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t').then((usdtContract) => usdtContract.transfer(contract.address, tronWeb.toSun(inpRef.current?.value)).send());
                          }

                          return tronWeb.trx.sendTransaction(
                            contract.address,
                            tronWeb.toSun(inpRef.current?.value),
                          );
                        }}
                        type="button"
                      >
                        Send
                        {contract.type === 0 ? 'TRX' : 'USDT'}
                      </Button>
                    </Row>
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
