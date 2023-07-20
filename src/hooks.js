/* eslint-disable camelcase */
import { useEffect, useState } from 'react';

export function useCheckTronInitiated() {
  const [tronIsOn, setTronIsOn] = useState();
  useEffect(() => {
    const loadWatcher = setInterval(() => {
      if (window.tronWeb && window.tronWeb.ready) {
        setTronIsOn(true);
        clearInterval(loadWatcher);
      } else {
        // eslint-disable-next-line no-console
        console.error('connect tronweb!');
        setTronIsOn(false);
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

export function useGetContractBalance(address, currency) {
  const [contractBalances, setContractBalances] = useState();
  async function getAmount(contract, curr) {
    const options = { method: 'GET', headers: { accept: 'application/json', 'TRON-PRO-API-KEY': '27642331-b2ef-4fc8-af35-cf6b1b041f5b' }, mode: 'cors' };

    return fetch(`https://apilist.tronscanapi.com/api/account/tokens?address=${contract}&token=${curr}`, options)
      .then((response) => response.json())
      .then((response) => {
        setContractBalances(window.tronWeb.fromSun(response.data.shift()?.balance) || 0);
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    getAmount(address, currency);
  }, [address]);
  return contractBalances;
}

export function useGetContractEvents(contractAddress, page, method) {
  const [contractTransactions, setContractTransactions] = useState([]);

  async function getTransactions() {
    const options = { method: 'GET', headers: { accept: 'application/json', 'TRON-PRO-API-KEY': '27642331-b2ef-4fc8-af35-cf6b1b041f5b' }, mode: 'cors' };

    fetch(`https://apilist.tronscanapi.com/api/transaction?sort=-timestamp&count=true&limit=50&start=${50 * page}&address=${contractAddress}${method && method.length > 1 ? `&method=${method}` : ''}`, options)
      .then((response) => response.json())
      .then((response) => { setContractTransactions(response); })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    if (contractAddress) {
      getTransactions();
    }
  }, [contractAddress, page, method]);
  return contractTransactions;
}

export function useGetMoreTransactionsInfo(event) {
  const [addTransactionInfo, setAddTransactionInfo] = useState();

  async function getTransaction() {
    const options = { method: 'GET', headers: { accept: 'application/json', 'TRON-PRO-API-KEY': '27642331-b2ef-4fc8-af35-cf6b1b041f5b' } };

    fetch(`https://apilist.tronscanapi.com/api/transaction-info?hash=${event.hash}`, options)
      .then((response) => response.json())
      .then(({ contractRet, trigger_info }) => {
        setAddTransactionInfo({ contractRet, trigger_info });
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }
  useEffect(() => {
    if (event.hash) {
      getTransaction();
    }
  }, [event.hash]);
  return addTransactionInfo;
}
