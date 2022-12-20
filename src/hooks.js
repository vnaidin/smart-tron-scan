import { useEffect, useState } from 'react';
import { SMART_CONTRACT_ADDRESSES } from './constants';

export function useCheckTronInitiated() {
  const [tronIsOn, setTronIsOn] = useState();
  useEffect(() => {
    const { tronWeb } = window;
    const loadWatcher = setInterval(() => {
      if (tronWeb && tronWeb.ready) {
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
  const { tronWeb } = window;
  const [contractBalances, setContractBalances] = useState();
  const fetchData = () => {
    Promise.all(SMART_CONTRACT_ADDRESSES.map((contract) => {
      if (contract.type === 1) {
        return tronWeb?.contract().at('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t').then((usdtContract) => usdtContract.balanceOf(contract.address).call({}).then((resultUsdt) => ({ ...contract, balance: +tronWeb.fromSun(resultUsdt) })));
      }
      return tronWeb?.trx?.getBalance(contract.address).then((resultTrx) => ({
        ...contract,
        balance: +tronWeb.fromSun(resultTrx),
      }));
    })).then((result) => setContractBalances(result));
  };
  useEffect(() => {
    fetchData();
    setInterval(() => {
      fetchData();
    }, 1000 * 60 * 5);
  }, []);
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
