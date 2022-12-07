import React from 'react';
import {
  Spinner, Table, Button, OverlayTrigger, Popover,
} from 'react-bootstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { useGetContractEvents } from '../hooks';
import { SMART_CONTRACT_ADDRESSES } from '../constants';

export default function TransactionsTable({ contractToViewEvents }) {
  const { tronWeb } = window;
  const currentEvents = useGetContractEvents(contractToViewEvents);
  const minimizeHashes = (link, nOfSymbols = 4) => (link && link.length !== 0 ? `${link.substring(0, nOfSymbols)}...${link.substring(link.length - nOfSymbols)}` : '');

  return (
    <>
      <h4 style={{ overflowWrap: 'break-word' }}>
        Contract:
        {contractToViewEvents}
      </h4>
      <Table striped bordered hover size="sm" responsive>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>From_Wallet</th>
            <th>Data</th>
            <th>Date</th>
            <th>Results</th>
          </tr>
        </thead>
        {currentEvents
          ? (
            <tbody>
              {currentEvents.map((event) => (
                <tr key={event.hash}>
                  <td>
                    <a
                      href={`https://tronscan.io/#/transaction/${event.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {minimizeHashes(event.hash, 7)}
                    </a>
                  </td>

                  <td>
                    {minimizeHashes(tronWeb.address?.fromHex(event.ownerAddress), 9)}
                  </td>
                  <td>
                    <OverlayTrigger
                      trigger="click"
                      placement="auto"
                      rootClose
                      rootCloseEvent="click"
                      overlay={(
                        <Popover id="popover-basic">
                          <Popover.Header as="h3">Transaction Data</Popover.Header>
                          <Popover.Body>
                            {event.trigger_info ? Object.entries(event.trigger_info).map(
                              ([key, value]) => (
                                <p key={event.hash + key}>
                                  {key}
                                  {' '}
                                  :
                                  {' '}
                                  {typeof value === 'string' ? value : Object.entries(value).toString()}
                                </p>
                              ),
                            ) : 'no data!'}
                          </Popover.Body>
                        </Popover>
)}
                    >
                      <Button variant="success">More info</Button>
                    </OverlayTrigger>
                  </td>

                  <td>
                    {new Date(event.timestamp).toLocaleString()}
                  </td>

                  <td>
                    <Button variant={event.contractRet === 'SUCCESS' ? 'success' : 'danger'}>{event.contractRet}</Button>
                  </td>

                </tr>
              ))}

            </tbody>
          )
          : <Spinner animation="border" />}
      </Table>
    </>
  );
}

TransactionsTable.defaultProps = {
  contractToViewEvents: [...SMART_CONTRACT_ADDRESSES].sort(() => 0.5 - Math.random())[0].address,
};

TransactionsTable.propTypes = {
  contractToViewEvents: PropTypes.string,
};
