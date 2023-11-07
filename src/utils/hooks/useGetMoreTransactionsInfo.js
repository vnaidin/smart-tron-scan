/* eslint-disable camelcase */
import { useEffect, useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export function useGetMoreTransactionsInfo(event) {
  const [addTransactionInfo, setAddTransactionInfo] = useState();

  async function getTransaction() {
    const options = { method: 'GET', headers: { accept: 'application/json', 'TRON-PRO-API-KEY': '27642331-b2ef-4fc8-af35-cf6b1b041f5b' } };

    fetch(`https://apilist.tronscanapi.com/api/transaction-info?hash=${event.hash}`, options)
      .then((response) => response.json())
      .then(({ contractRet, trigger_info, transfersAllList }) => {
        setAddTransactionInfo({ contractRet, trigger_info, transfersAllList });
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
