/* eslint-disable no-console */
import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import './App.css';
import { BalancesTable, TransactionsTable, TronExtensionChecker } from './components';
import { useCheckTronInitiated, useTrackWalletChange } from './hooks';

function App() {
  const { tronWeb } = window;
  const allowedRendering = useCheckTronInitiated();

  const [contractToViewEvents, setContractToViewEvents] = useState();

  useTrackWalletChange();

  return allowedRendering
    ? (
      <Container>
        <Row className="my-3">
          <header>
            <h3>
              Welcome ==&gt;
              <strong style={{ overflowWrap: 'break-word' }}>
                {' '}
                {tronWeb?.defaultAddress?.base58}
                {' '}
                (
                {tronWeb?.defaultAddress?.name}
                )
              </strong>
              <svg
                className="ms-2"
                onClick={() => {
                  if (navigator && navigator.clipboard) {
                    navigator.clipboard.writeText(tronWeb?.defaultAddress?.base58).then(() => {
                      console.log('copied successfully!');
                    }, (err) => {
                      console.error(err);
                    });
                  } else {
                    console.warn("Browser doesn't support copying!");
                  }
                }}
                width="40"
                height="40"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M31 10.375H13C11.35 10.375 10 11.6125 10 13.125V32.375H13V13.125H31V10.375ZM35.5 15.875H19C17.35 15.875 16 17.1125 16 18.625V37.875C16 39.3875 17.35 40.625 19 40.625H35.5C37.15 40.625 38.5 39.3875 38.5 37.875V18.625C38.5 17.1125 37.15 15.875 35.5 15.875ZM35.5 37.875H19V18.625H35.5V37.875Z" fill="black" />
              </svg>
            </h3>
          </header>
        </Row>
        <main>
          <Row>
            <BalancesTable
              setContractToViewEvents={(address) => setContractToViewEvents(address)}
            />
          </Row>
          <Row>
            <TransactionsTable contractToViewEvents={contractToViewEvents} />
          </Row>
        </main>
      </Container>
    )
    : <TronExtensionChecker />;
}

export default App;
