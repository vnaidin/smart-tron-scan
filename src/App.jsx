/* eslint-disable no-console */
import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import './App.css';
import {
  BalancesTable, CopyButton, TransactionsTable, TronExtensionChecker,
} from './components';
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
              <CopyButton txtToCopy={tronWeb?.defaultAddress?.base58} />
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
