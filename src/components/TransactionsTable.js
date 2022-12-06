import React from 'react';
import { Spinner, Table, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useGetContractEvents } from '../hooks';
import { SMART_CONTRACT_ADDRESSES } from '../constants';

export default function TransactionsTable({ contractToViewEvents }) {
    const { tronWeb } = window;
    const currentEvents = useGetContractEvents(contractToViewEvents);
    const minimizeHashes = (link, nOfSymbols = 4) => (link && link.length !== 0 ? `${link.substring(0, nOfSymbols)}...${link.substring(link.length - nOfSymbols)}` : '');

    return (<>
        <h4>Contract: {contractToViewEvents}</h4>
        <Table striped bordered hover size="sm" responsive>
            <thead>
                <tr>
                    <th>Transaction</th>
                    <th>From_Wallet</th>
                    <th>Date</th>
                    <th>Results</th>
                </tr>
            </thead>
            {currentEvents ?
                <tbody>
                    {currentEvents.map((event) => <tr key={event.txID}>
                        <td>
                            <a
                                href={`https://tronscan.io/#/transaction/${event.txID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {minimizeHashes(event.txID, 7)}
                            </a>
                        </td>

                        <td>
                            {minimizeHashes(tronWeb.address?.fromHex(event.raw_data?.contract[0].parameter?.value?.owner_address), 9)}
                        </td>

                        <td>
                            {new Date(event.block_timestamp).toLocaleString()}
                        </td>

                        <td>
                            <Button variant={event.ret[0]['contractRet'] === 'SUCCESS' ? 'success' : 'danger'}>{event.ret[0]['contractRet']}</Button>
                        </td>

                    </tr>
                    )}

                </tbody>
                :
                <Spinner animation='border'></Spinner>}
        </Table>
    </>
    );
}

TransactionsTable.defaultProps = {
    contractToViewEvents: [...SMART_CONTRACT_ADDRESSES].sort(() => 0.5 - Math.random())[0]['address'],
};

TransactionsTable.propTypes = {
    contractToViewEvents: PropTypes.string.isRequired,
};
