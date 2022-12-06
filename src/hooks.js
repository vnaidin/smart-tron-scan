import { useEffect, useState } from "react";
import { SMART_CONTRACT_ADDRESSES } from "./constants";

export function useCheckTronInitiated() {
    const [tronIsOn, setTronIsOn] = useState()
    useEffect(() => {
        const { tronWeb } = window;
        const loadWatcher = setInterval(() => {
            if (tronWeb && tronWeb.ready) {
                setTronIsOn(true)
                clearInterval(loadWatcher);
            } else {
                console.error('connect tronweb!');
                setTronIsOn(false)
            }
        }, 1000);
        return () => clearInterval(loadWatcher);
    }, []);
    return tronIsOn;
}

export function useTrackWalletChange() {
    /**
 * when tronLink extension is opened we check for the connection and so on
 */
    useEffect(() => {
        window.addEventListener('message', (res) => {
            if (res.data.message && res.data.message.action === 'setAccount') {
                if (window.tronWeb /* && (window.tronWeb.ready === false) */) {
                    if (res.data.message.data.address !== window.tronWeb?.defaultAddress.base58) {
                        window.location.reload();
                    }
                }
            }
        });
        return () => window.removeEventListener('message', null);
    }, []);
}

export function useGetContractBalances() {
    const { tronWeb } = window;
    const [contractBalances, setContractBalances] = useState()
    const fetchData = () => {
        Promise.all(SMART_CONTRACT_ADDRESSES.map(contract => {
            if (contract.type === 1) {
                return tronWeb?.contract().at('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t').then(usdtContract => usdtContract.balanceOf(contract.address).call({}).then(resultUsdt => ({ ...contract, balance: +tronWeb.fromSun(resultUsdt) })))
            }
            else {
                return tronWeb?.trx?.getBalance(contract.address).then(resultTrx => ({ ...contract, balance: +tronWeb.fromSun(resultTrx) }))
            }
        })).then(result => setContractBalances(result))
    }
    useEffect(() => {
        fetchData()
        setInterval(() => {
            fetchData()
        }, 1000 * 60 * 5);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return contractBalances
}

export function useGetContractEvents(contractAddress) {
    const TronGrid = require('trongrid');
    const TronWeb = require('tronweb');

    const tronWeb1 = new TronWeb({
        fullHost: 'https://api.trongrid.io'
    });

    const tronGrid = new TronGrid(tronWeb1);

    const [contractTransactions, setContractTransactions] = useState()

    async function getTransactions() {

        const options = {
            only_to: true,
            only_confirmed: true,
            limit: 40,
        };

        // callback
        tronGrid.account.getTransactions(contractAddress, options, (err, transactions) => {
            if (err)
                return console.error(err);

            setContractTransactions(transactions.data);
        });
    }

    useEffect(() => {
        if (contractAddress) {
            getTransactions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractAddress])
    return contractTransactions
}

