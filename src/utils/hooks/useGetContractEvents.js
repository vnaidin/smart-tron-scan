/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
import { useEffect, useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export function useGetContractEvents(contractAddress, page, method) {
  const [contractTransactions, setContractTransactions] = useState([]);
  const [moreTransactionInfo, setMoreTransactionInfo] = useState([]);
  const [total, setTotal] = useState(0);

  async function getTransaction(hash, index) {
    const options = { method: 'GET', headers: { accept: 'application/json', 'TRON-PRO-API-KEY': '27642331-b2ef-4fc8-af35-cf6b1b041f5b' }, mode: 'cors' };

    fetch(`https://apilist.tronscanapi.com/api/transaction-info?hash=${hash}`, options)
      .then((response) => response.json())
      .then(({ contractRet, trigger_info, transfersAllList }) => {
        //        console.log({ contractRet, trigger_info, transfersAllList });
        setMoreTransactionInfo((prev) => ([...prev, {
          ...prev[index], contractRet, trigger_info, transfersAllList,
        }]));
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }

  function delayedForLoop(iterations, delay, arrayToFetch) {
    let currentIteration = 0;

    function next() {
      if (currentIteration < iterations) {
        // Perform your task for the current iteration here
        // console.log('Iteration', currentIteration + 1);
        getTransaction(arrayToFetch[currentIteration].hash, currentIteration);
        currentIteration++;
        setTimeout(next, delay);
      }
    }

    next(); // Start the loop
  }

  async function getTransactions() {
    const options = { method: 'GET', headers: { accept: 'application/json', 'TRON-PRO-API-KEY': '27642331-b2ef-4fc8-af35-cf6b1b041f5b' }, mode: 'cors' };
    const transactionsPerPage = 20;
    fetch(`https://apilist.tronscanapi.com/api/transaction?sort=-timestamp&count=true&limit=${transactionsPerPage}&start=${transactionsPerPage * page}&address=${contractAddress}${method && method.length > 1 ? `&method=${method}` : ''}`, options)
      .then((response) => response.json())
      .then((response) => {
        setContractTransactions(response.data);
        setTotal(response.total);
        setMoreTransactionInfo([]);

        delayedForLoop(response.data.length, 500, response.data);
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    if (contractAddress) {
      getTransactions();

      setInterval(() => {
        getTransactions();
      }, 1000 * 60 * 5);
    }
  }, [contractAddress, page, method]);
  return { data: contractTransactions, total, moreInfo: moreTransactionInfo };
}
