import React, { useState } from 'react';
import {
  Row, /* Button, */ Col, Badge, Accordion,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useGetContractBalance } from '../../utils/hooks';
import SendMoney from './SendMoney';
import CopyButton from '../CopyButton';
import { SMART_CONTRACT_ADDRESSES } from '../../utils/constants';
import { minimizeString } from '../../utils/helpers';

export default function BalancesTable({ setContractToViewEvents, wallet }) {
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
            <Badge
              bg={limit >= contractBalance && address === currContract ? 'danger' : 'success'}
              as="td"
              className="mx-2 "
            >
              <p />
            </Badge>
            {title}
            {' '}
            (
            {minimizeString(address, 7)}
            )
          </Accordion.Header>
          <Accordion.Body>
            <Row className="gap-1">
              <Col
                xs={5}
                sm={6}
                md={6}
                lg={7}
                xl={7}
                xxl={8}
                className="px-1 py-1"
              >
                <a
                  href={`https://tronscan.org/#/contract/${address}/transactions`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TronScan
                </a>
                <CopyButton txtToCopy={address} size={20} />
              </Col>
              <Col
                className="px-1 py-1"
              >
                Balance:
                {' '}
                <strong>{contractBalance}</strong>
                <img
                  className="mx-1"
                  src={`/smart-tron-scan/${type === 'trx' ? 'trx' : 'usdt'}-logo.png`}
                  alt={type === 0 ? 'TRX' : 'USDT'}
                  width={15}
                  height={15}
                />
              </Col>
              {wallet && (
              <Col
                xs={12}
                sm={6}
                md={6}
                lg={7}
                xl={7}
                xxl={8}
              >
                <SendMoney
                  contractAddress={address}
                  contractType={type}
                />
              </Col>
              )}
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>

  );
}

BalancesTable.propTypes = {
  setContractToViewEvents: PropTypes.func.isRequired,
  wallet: PropTypes.string.isRequired,
};
