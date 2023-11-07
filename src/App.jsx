/* eslint-disable no-console */
import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import {
  BalancesTable, CopyButton, TransactionsTable,
} from './components';
import { useGetUsersWallet } from './utils/hooks';
import './App.css';
import { minimizeString } from './utils/helpers';

function App() {
  const { tronWeb } = window;
  const [contractToViewEvents, setContractToViewEvents] = useState();
  const { userWallet } = useGetUsersWallet();

  return (
    <Container>
      <header>
        <Row className="my-3">
          {userWallet ? (
            <h2 className="text-center">
              <strong style={{ overflowWrap: 'break-word' }}>
                {' '}
                {minimizeString(userWallet, 5)}
                {' '}
                (
                {tronWeb?.defaultAddress?.name}
                )
              </strong>
              <CopyButton txtToCopy={userWallet} size={20} />
            </h2>
          ) : (<h2 className="text-center"> SC Management System</h2>)}
        </Row>
      </header>
      <main>
        <Row>
          <BalancesTable
            setContractToViewEvents={(address) => setContractToViewEvents(address)}
            wallet={userWallet}
          />
        </Row>
        <hr />
        <Row>
          <TransactionsTable contractToViewEvents={contractToViewEvents} />
        </Row>
      </main>
      <footer />
    </Container>
  );
}

export default App;
