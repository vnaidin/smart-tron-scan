import React, { useState } from 'react';
import {
  Spinner, Table, Form, Row, Badge,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useGetContractEvents } from '../../utils/hooks';
import { SMART_CONTRACT_ADDRESSES } from '../../utils/constants';
import CopyButton from '../CopyButton';
import { fromSun, minimizeString } from '../../utils/helpers';
import TransactionsPagination from './TransactionsPagination';

export default function TransactionsTable({ contractToViewEvents }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentMethod, setCurrentMethod] = useState();
  const { data, total, moreInfo } = useGetContractEvents(
    contractToViewEvents,
    +currentPage,
    currentMethod,
  );
  const currentSmartContract = SMART_CONTRACT_ADDRESSES.find(
    (addr) => addr.address === contractToViewEvents,
  );
  return (
    currentSmartContract ? (
      <>
        <h3 style={{ overflowWrap: 'break-word ' }} className="my-1 text-center">
          {currentSmartContract?.title}
          {` (${minimizeString(contractToViewEvents, 6)})`}
        </h3>

        <Row className="my-2">

          <TransactionsPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            total={total}
          />

          {currentSmartContract?.methods
            && (
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => { setCurrentMethod(e.target.value); setCurrentPage(0); }}
                style={{ width: 'auto' }}
              >
                <option>select method</option>
                <option value={null}>-</option>
                {Object.entries(
                  currentSmartContract?.methods,
                ).map(([methText, methCode]) => (
                  <option key={methCode} value={methCode}>{methText}</option>
                ))}
              </Form.Select>
            )}
        </Row>
        <Table
          striped
          bordered
          hover
          size="sm"
          responsive
        >
          <thead>
            <tr>
              <th>Transaction</th>
              <th>From_Wallet</th>
              <th>Data</th>
              <th>Date</th>
              <th>Amount</th>
              {/* <th>Results</th> */}
              {/* <th>Cost</th> */}
            </tr>
          </thead>
          {data
            ? (
              <tbody>
                {data?.map((event, index) => (
                  <tr key={event.hash}>
                    <td>
                      <a
                        href={`https://tronscan.io/#/transaction/${event.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {minimizeString(event.hash, 3)}
                      </a>
                      <CopyButton txtToCopy={event.hash} size={20} />
                    </td>
                    <td>
                      <a
                        href={`https://tronscan.io/#/address/${event.ownerAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {minimizeString(event.ownerAddress, 5)}
                      </a>
                      <CopyButton txtToCopy={event.ownerAddress} size={20} />
                    </td>
                    <td>
                      <Badge bg={event.contractRet === 'SUCCESS' ? 'success' : 'danger'}>

                        {/* event.trigger_info?.methodName || event.trigger_info?.method */}
                        <>
                          {event.trigger_info?.methodName ? (
                            <p className="my-0 text-start">
                              Method :
                              {' '}
                              {event.trigger_info.methodName === '3ccfd60b' ? 'withdraw' : event.trigger_info.methodName}
                            </p>
                          ) : undefined}
                          {event.trigger_info?.parameter
                            && Object.keys(event.trigger_info?.parameter).length > 0 ? (
                              <>
                                <p className="my-0 text-start">
                                  {'Parameter :\n'}
                                </p>
                                {Object.entries(event.trigger_info?.parameter)
                                  .map(([k, v]) => (
                                    <p
                                      className="p-0 m-0 text-start"
                                    >
                                      {`${k}: ${v}`}
                                    </p>
                                  ))}
                              </>
                            ) : undefined}
                        </>
                      </Badge>
                    </td>

                    <td>
                      {new Date(event.timestamp).toLocaleString()}
                    </td>

                    <td>
                      {event.contractData.data === '3ccfd60b' ? (
                        <div>
                          {event.contractRet === 'SUCCESS' && moreInfo[index]?.transfersAllList ? fromSun(moreInfo[index]?.transfersAllList[0]?.amount_str) : 0}
                          <img
                            className="mx-1"
                            src={`/smart-tron-scan/${currentSmartContract?.type === 'trx' ? 'trx' : 'usdt'}-logo.png`}
                            alt={currentSmartContract?.type === 0 ? 'TRX' : 'USDT'}
                            width={15}
                            height={15}
                          />
                        </div>
                      ) : (
                        <>
                          {fromSun(event.amount)}
                          <img
                            className="mx-1"
                            src={`/smart-tron-scan/${currentSmartContract?.type === 'trx' ? 'trx' : 'usdt'}-logo.png`}
                            alt={currentSmartContract?.type === 0 ? 'TRX' : 'USDT'}
                            width={15}
                            height={15}
                          />
                        </>
                      )}
                    </td>

                  </tr>
                ))}

              </tbody>
            )
            : <Spinner animation="border" />}
        </Table>
        <Row className="my-2">
          <TransactionsPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            total={total}
          />
        </Row>
      </>
    ) : (
      <Row>
        <h3 className="text-center">Choose SC to view transactions...</h3>
      </Row>
    )
  );
}

TransactionsTable.defaultProps = {
  contractToViewEvents: null,
};

TransactionsTable.propTypes = {
  contractToViewEvents: PropTypes.string,
};
