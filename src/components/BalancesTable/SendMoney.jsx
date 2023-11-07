/* eslint-disable no-console */
import React, { useRef } from 'react';
import {
  Button, Form, InputGroup, Row,
} from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function SendMoney({ contractType, contractAddress }) {
  const { tronWeb } = window;

  const inpRef = useRef();

  return (
    <Row>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">Send to SC:</InputGroup.Text>
        <Form.Control
          aria-label="amount"
          aria-describedby="basic-addon1"
          type="number"
          min={1000}
          style={{ width: '7em' }}
          defaultValue={contractType === 'usdt' ? 1000 : 20000}
          ref={inpRef}
          placeholder="amount"
        />
        <InputGroup.Text>
          {' '}
          <Button
            id="my-nft-btns"
            variant="primary"
            style={{ width: '5em' }}
            size="sm"
            onClick={() => {
              if (contractType === 'usdt') {
                return tronWeb.contract().at('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t').then(
                  (usdtContract) => usdtContract.transfer(
                    contractAddress,
                    tronWeb.toSun(inpRef.current?.value),
                  ).send(),
                );
                // eslint-disable-next-line no-else-return
              } else {
                return tronWeb.trx.sendTransaction(
                  contractAddress,
                  tronWeb.toSun(inpRef.current?.value),
                ).then((res) => console.log(res)).catch(
                  (err) => console.error(new Error(err).message),
                );
              }
            }}
            type="button"
          >
            Send
          </Button>

        </InputGroup.Text>
      </InputGroup>

    </Row>
  );
}

SendMoney.propTypes = {
  contractType: PropTypes.string.isRequired,
  contractAddress: PropTypes.string.isRequired,
};
