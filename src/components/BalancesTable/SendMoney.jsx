/* eslint-disable no-console */
import React, { useRef } from 'react';
import { Button, Row } from 'react-bootstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

export default function SendMoney({ contractType, contractAddress }) {
  const { tronWeb } = window;

  const inpRef = useRef();

  return (
    <Row>
      <input
        type="number"
        min={1000}
        style={{ width: '7em' }}
        defaultValue={contractType === 1 ? 1000 : 20000}
        ref={inpRef}
        placeholder="amount"
        name="send-tokens"
      />
      <Button
        id="my-nft-btns"
        variant="primary"
        style={{ width: '5em' }}
        size="sm"
        onClick={() => {
          if (contractType === 1) {
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
            ).then((res) => console.log(res)).catch((err) => console.error(new Error(err).message));
          }
        }}
        type="button"
      >
        Send
      </Button>
    </Row>
  );
}

SendMoney.propTypes = {
  contractType: PropTypes.number.isRequired,
  contractAddress: PropTypes.string.isRequired,
};
