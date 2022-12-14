import React from 'react';
import {
  Spinner, Table, Button, OverlayTrigger, Popover,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useGetContractEvents } from '../../hooks';
import { SMART_CONTRACT_ADDRESSES } from '../../constants';
import CopyButton from '../CopyButton';
import MoreInfoOverlay from './TransactionMoreInfoOverlay';

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
            {/* <th>Amount</th> */}
            <th>Results</th>
            <th>Cost</th>
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
                      {minimizeHashes(event.hash, 5)}
                    </a>
                    <CopyButton txtToCopy={event.hash} />
                  </td>

                  <td>
                    {minimizeHashes(tronWeb.address?.fromHex(event.ownerAddress), 5)}
                    <CopyButton txtToCopy={event.ownerAddress} />
                  </td>
                  <td>
                    <OverlayTrigger
                      trigger="click"
                      placement="auto"
                      rootClose
                      rootCloseEvent="click"
                      overlay={<MoreInfoOverlay event={event} />}
                    >
                      <Button variant={event.contractRet === 'SUCCESS' ? 'success' : 'danger'}>{event ? 'More info' : 'No data!'}</Button>
                    </OverlayTrigger>
                  </td>

                  <td>
                    {new Date(event.timestamp).toLocaleString()}
                  </td>

                  {/* <td>
                    {tronWeb.fromSun(event.amount)}
                  </td> */}

                  <td>
                    <Button variant={event.contractRet === 'SUCCESS' ? 'success' : 'danger'}>{event.contractRet}</Button>
                  </td>

                  <td>
                    <OverlayTrigger
                      trigger="click"
                      placement="auto"
                      rootClose
                      rootCloseEvent="click"
                      overlay={(
                        <Popover id="popover-basic">
                          <Popover.Header as="h3">Transaction Costs</Popover.Header>
                          <Popover.Body>
                            {event.cost ? Object.entries(event.cost).map(
                              ([key, value]) => (
                                <p key={event.hash + key}>
                                  {key}
                                  {' '}
                                  :
                                  {' '}
                                  {typeof value === 'string' ? value : value}
                                </p>
                              ),
                            ) : 'no data!'}
                          </Popover.Body>
                        </Popover>
)}
                    >
                      <Button variant={event.contractRet === 'SUCCESS' ? 'success' : 'danger'}>Costs</Button>
                    </OverlayTrigger>
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
