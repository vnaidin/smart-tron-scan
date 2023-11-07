import { useEffect, useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
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
