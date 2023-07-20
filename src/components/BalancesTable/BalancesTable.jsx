import React, { useState } from 'react';
import {
  Row, /* Button, */ Col, Badge, Accordion,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useGetContractBalance } from '../../hooks';
// import SendMoney from './SendMoney';
import CopyButton from '../CopyButton';
import { SMART_CONTRACT_ADDRESSES } from '../../constants';

export default function BalancesTable({ setContractToViewEvents }) {
  const [currContract, setCurrContract] = useState('');
  const contractBalance = useGetContractBalance(
    currContract,
    SMART_CONTRACT_ADDRESSES.find((contract) => contract.address === currContract)?.type,
  );

  return (
    <Accordion defaultActiveKey="0">
      {SMART_CONTRACT_ADDRESSES.map(({
        title, address, type, limit,
      }) => (
        <Accordion.Item eventKey={address} key={address}>
          <Accordion.Header onClick={() => {
            setCurrContract(address);
            setContractToViewEvents(address);
          }}
          >
            {title}
            {' '}
            (
            {address}
            )
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col>
                <a
                  href={`https://tronscan.org/#/contract/${address}/transactions`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge
                    bg={limit >= contractBalance ? 'danger' : 'success'}
                    as="td"
                    className="ml-1 "
                  >
                    <h6>
                      {' Transactions: '}
                      {title}
                    </h6>
                  </Badge>
                </a>
                <CopyButton txtToCopy={address} />
              </Col>
              <Col>
                Balance:
                {' '}
                {contractBalance}
                <img
                  className="mx-1"
                  src={`/smart-tron-scan/${type === 'trx' ? 'trx' : 'usdt'}-logo.png`}
                  alt={type === 0 ? 'TRX' : 'USDT'}
                  width={15}
                  height={15}
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>

  );
}

BalancesTable.propTypes = {
  setContractToViewEvents: PropTypes.func.isRequired,
};
