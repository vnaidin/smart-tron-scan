import { useEffect, useState } from 'react';
import { SMART_CONTRACT_ADDRESSES } from './constants';

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

export function useGetContractBalances() {
  const [contractBalances, setContractBalances] = useState([]);
  async function getAmount(contract, currency) {
    const options = { method: 'GET', headers: { accept: 'application/json' }, mode: 'cors' };

    return fetch(`https://apilist.tronscanapi.com/api/account/tokens?address=${contract.address}&token=${currency}`, options)
      .then((response) => response.json())
      .then((response) => {
        const formedResponse = response.data.shift();
        // console.log(formedResponse, { ...contract, balance: formedResponse.amount });
        return ({ ...contract, balance: window.tronWeb.fromSun(formedResponse?.balance) || 0 });
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }

  const fetchData = () => {
    Promise.all(SMART_CONTRACT_ADDRESSES.map((contract) => {
      if (contract.type === 'usdt') {
        return getAmount(contract, 'usdt');
      }
      return getAmount(contract, 'trx');
    })).then((result) => {
      setContractBalances(result);
    });
  };

  useEffect(() => {
    if (contractBalances.length === 0) { fetchData(); }
  }, [contractBalances]);
  return contractBalances;
}

export function useGetContractEvents(contractAddress) {
  const [contractTransactions, setContractTransactions] = useState();

  async function getTransactions() {
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    fetch(`https://apilist.tronscanapi.com/api/transaction?sort=-timestamp&count=true&limit=40&start=0&address=${contractAddress}`, options)
      .then((response) => response.json())
      .then((response) => { setContractTransactions(response.data); })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    if (contractAddress) {
      getTransactions();
    }
  }, [contractAddress]);
  return contractTransactions;
}

export function useGetMoreTransactionsInfo(event) {
  const { tronWeb } = window;

  const [addTransactionInfo, setAddTransactionInfo] = useState();

  useEffect(() => {
    tronWeb.getEventByTransactionID(event.hash).then((result) => {
      setAddTransactionInfo({
        name: result[0]?.name,
        // eslint-disable-next-line no-underscore-dangle
        amount: +tronWeb.fromSun(result[0]?.result?._amount),
      });
    });
    tronWeb.contract().at(event.toAddress).then(
      (contr) => {
        contr.blacklisted(event.ownerAddress).call({}).then((isInRefsRegistry) => {
          setAddTransactionInfo((prev) => ({
            ...prev,
            blacklisted: isInRefsRegistry,
          }));
        });
      },
    );
  }, [event]);
  return addTransactionInfo;
}
