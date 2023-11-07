/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';

export function useGetExchangeRates() {
  const [exchangeRates, setExchangeRates] = useState();

  const options = { method: 'GET', headers: { accept: 'application/json' }, mode: 'cors' };

  const fetchData = () => {
    // fetch(encodeURI('https://api.binance.com/api/v3/ticker/24hr?symbols=["TRXUSDT","BTCUSDT","TRXBTC"]'), options)
    fetch(encodeURI('https://api.binance.com/api/v3/ticker/24hr?symbols=["TRXUSDT"]'), options)
      .then((response) => response.json())
      .then((response) => {
        const filteredResp = response.map(({
          symbol,
          lastPrice, priceChangePercent,
        }) => ({ symbol, lastPrice: +lastPrice, priceChangePercent: +priceChangePercent }));

        setExchangeRates(...filteredResp);
      })
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
    setInterval(() => {
      fetchData();
    }, 1000 * 60 * 5);// 5 minutes update_interval
  }, []);
  return exchangeRates;
}
