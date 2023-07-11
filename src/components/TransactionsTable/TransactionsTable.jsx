import React, { useState } from 'react';
import {
  Spinner, Table, Button, OverlayTrigger, Popover, Pagination, Form, Row,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useGetContractEvents } from '../../hooks';
import { SMART_CONTRACT_ADDRESSES } from '../../constants';
import CopyButton from '../CopyButton';
import MoreInfoOverlay from './TransactionMoreInfoOverlay';

export default function TransactionsTable({ contractToViewEvents }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentMethod, setCurrentMethod] = useState();
  const { tronWeb } = window;
  const { data, total } = useGetContractEvents(contractToViewEvents, +currentPage, currentMethod);
  const minimizeHashes = (link, nOfSymbols = 4) => (link && link.length !== 0 ? `${link.substring(0, nOfSymbols)}...${link.substring(link.length - nOfSymbols)}` : '');

  const paginationItems = Array(total ? Math.round(total / 50) + 1 : 1).fill(0).map((x, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <Pagination.Item key={`page-${i}`} active={i === currentPage} onClick={() => setCurrentPage(i)}>
      {i}
    </Pagination.Item>
  )).slice(currentPage, currentPage + 3);
  const currentSmartContract = SMART_CONTRACT_ADDRESSES.find(
    (addr) => addr.address === contractToViewEvents,
  );
  return (
    <>
      <h4 style={{ overflowWrap: 'break-word ' }}>
        Contract:
        {' '}
        {currentSmartContract.title}
        {` (${contractToViewEvents})`}
      </h4>

      <Row className="my-2 d-flex">

        <Pagination style={{ width: 'auto' }} className="my-0 mx-3">
          <Pagination.First onClick={() => setCurrentPage(1)} />
          <Pagination.Prev onClick={() => setCurrentPage((prev) => prev - 1)} />
          {paginationItems}
          <Pagination.Next onClick={() => setCurrentPage((prev) => prev + 1)} />
          <Pagination.Last onClick={() => setCurrentPage(Math.floor(total / 50))} />
        </Pagination>

        {currentSmartContract.methods
  && (
  <Form.Select
    aria-label="Default select example"
    onChange={(e) => { setCurrentMethod(e.target.value); setCurrentPage(0); }}
    style={{ width: 'auto' }}
  >
    <option>select method</option>
    <option value={null}>-</option>
    {Object.entries(
      currentSmartContract.methods,
    ).map(([methText, methCode]) => (
      <option key={methCode} value={methCode}>{methText}</option>
    ))}
  </Form.Select>
  )}
      </Row>
      <Table striped bordered hover size="sm" responsive>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>From_Wallet</th>
            <th>Data</th>
            <th>Date</th>
            <th>Amount</th>
            {/* <th>Results</th> */}
            <th>Cost</th>
          </tr>
        </thead>
        {data
          ? (
            <tbody>
              {data?.map((event) => (
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

                  <td>
                    {tronWeb.fromSun(event.amount)}
                    {' '}
                    TRX
                  </td>

                  {/* <td>
                    <Button
                    variant={event.contractRet === 'SUCCESS' ? 'success' : 'danger'}>
                    {event.contractRet}</Button>
                  </td> */}

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
      <Row className="my-2">
        <Pagination>
          <Pagination.First onClick={() => setCurrentPage(1)} />
          <Pagination.Prev onClick={() => setCurrentPage((prev) => prev - 1)} />
          {paginationItems}
          <Pagination.Next onClick={() => setCurrentPage((prev) => prev + 1)} />
          <Pagination.Last onClick={() => setCurrentPage(Math.floor(total / 50))} />
        </Pagination>
      </Row>
    </>
  );
}

TransactionsTable.defaultProps = {
  contractToViewEvents: SMART_CONTRACT_ADDRESSES.find((x) => x.title === 'TronTrade').address,
};

TransactionsTable.propTypes = {
  contractToViewEvents: PropTypes.string,
};
