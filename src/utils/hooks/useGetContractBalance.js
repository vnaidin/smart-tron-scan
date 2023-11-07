import { useEffect, useState } from 'react';
// eslint-disable-next-line import/prefer-default-export
export function useGetContractBalance(address, currency) {
  const [contractBalances, setContractBalances] = useState();
  async function getAmount(contract, curr) {
    const options = { method: 'GET', headers: { accept: 'application/json', 'TRON-PRO-API-KEY': '27642331-b2ef-4fc8-af35-cf6b1b041f5b' }, mode: 'cors' };

    return fetch(`https://apilist.tronscanapi.com/api/account/tokens?address=${contract}&token=${curr}`, options)
      .then((response) => response.json())
      .then((response) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        setContractBalances((response.data.shift()?.balance / 1000000).toFixed(2) || 0);
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    if (address) {
      getAmount(address, currency);
    }
  }, [address]);
  return contractBalances;
}
