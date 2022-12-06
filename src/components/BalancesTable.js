import React, { useRef } from 'react';
import { Spinner, Table, Button, Popover, OverlayTrigger, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useGetContractBalances } from '../hooks';

export default function BalancesTable({ setContractToViewEvents }) {
    const { tronWeb } = window;
    const contractBalances = useGetContractBalances();
    const inpRef = useRef();
    const minimizeHashes = (link, nOfSymbols = 4) => (link && link.length !== 0 ? `${link.substring(0, nOfSymbols)}...${link.substring(link.length - nOfSymbols)}` : '');

    return (
        <Table striped bordered hover size="sm" responsive>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Address</th>
                    <th>Balance</th>
                    <th>Actions</th>
                </tr>
            </thead>
            {contractBalances ?
                <tbody>

                    {contractBalances.map(contract => <tr key={contract.address}
                        style={{ border: contract?.limit >= contract.balance ? '10px solid red' : 'none' }}>
                        <td>
                            {contract.title}
                        </td>

                        <td>
                            <a
                                href={`https://tronscan.org/#/contract/${contract.address}/transactions`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {minimizeHashes(contract.address, 7)}
                            </a>
                        </td>

                        <td>
                            {contract.balance}
                            <img
                                className="mx-1"
                                src={`/coin_icons/${contract.type === 0 ? 'trx' : 'usdt'}-logo.png`}
                                alt={contract.type === 0 ? 'trx' : 'usdt'}
                                width={15}
                                height={15}
                            />
                        </td>

                        <td className='row m-0'>
                            <Col>
                                <OverlayTrigger
                                    trigger="click"
                                    placement="top"
                                    rootClose
                                    rootCloseEvent="click"
                                    // show
                                    overlay={<Popover>
                                        <Popover.Body className="d-flex flex-column gap-2">
                                            <input
                                                type='number'
                                                min={1000}
                                                defaultValue={contract.type === 1 ? 1000 : 20000}
                                                ref={inpRef}
                                                placeholder='amount'
                                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                                autoFocus
                                                name="send-tokens"
                                            />
                                            <button
                                                id="my-nft-btns"
                                                onClick={() => {
                                                    if (contract.type === 1) {
                                                        return tronWeb.contract().at('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t').then(usdtContract => usdtContract.transfer(contract.address, tronWeb.toSun(inpRef.current?.value)).send())
                                                    }
                                                    else {
                                                        tronWeb.trx.sendTransaction(contract.address, tronWeb.toSun(inpRef.current?.value));
                                                    }
                                                }}
                                                type="button"
                                            >
                                                Ok
                                            </button>
                                        </Popover.Body>
                                    </Popover>}
                                >
                                    <Button variant='primary' size='sm' >Send {contract.type === 0 ? 'TRX' : 'USDT'}</Button>
                                </OverlayTrigger>
                            </Col>

                            <Col><Button variant='secondary' size='sm' onClick={() => setContractToViewEvents(contract.address)} >Show Events</Button></Col>

                        </td>
                    </tr>
                    )}

                </tbody>
                :
                <Spinner animation='border'></Spinner>}
        </Table>
    );
}

BalancesTable.propTypes = {
    setContractToViewEvents: PropTypes.func.isRequired
};
