import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import './index.scss';

const BASE_CLASS = 'Ticker';
const KEY = 'PHX9J2061YD1MZJY';
const API_URL_BASE = `https://www.alphavantage.co/query?apikey=${KEY}&function=`;
const SYMBOLS = [
  '$ADA',
  '$BTC',
  '$DOGE',
  '$ETH',
  '$LTC',
  '$SOL',
  // 'AAPL',
  // 'ADBE',
  // 'DEO',
  // 'GOOG',
  // 'HOOD',
  // 'KO',
  // 'MSFT',
  // 'NFLX',
  // 'NVDA',
  // 'RBLX',
  // 'SOFI',
];
const TIME: any = { SECOND: 1000 };
TIME.MINUTE = TIME.SECOND * 60;
TIME.HOUR = TIME.MINUTE * 60;
const TICK_INTERVAL = TIME.MINUTE;
const TICK_CYCLES = 50;

function Ticker() {
  const [symbolNum, setSymbolNum] = useState(0);
  const [ticks, setTicks] = useState({});

  // Initialize ticker data from local storage.
  useEffect(() => {
    // localStorage.clear();
    const storedTicks: any = JSON.parse(localStorage.getItem('ticks'));
    if (Object.keys(storedTicks ?? {}).length) {
      setTicks(storedTicks);
    }
  }, []);

  // Define a way to update the supplied ticker data based on an API call.
  const fetchTick = useCallback((ticks: any, symbol: string) => {
    const isCrypto = symbol[0] === '$';
    const apiUrl = isCrypto
      ? `${API_URL_BASE}CURRENCY_EXCHANGE_RATE&from_currency=${symbol.slice(1)}&to_currency=USD`
      : `${API_URL_BASE}GLOBAL_QUOTE&symbol=${symbol}`;
    axios
      .get(apiUrl)
      .then(({ data }) => {
        console.log('DATA', data);
        const symbolTicks = ticks?.[symbol] ?? [];
        const prevTick = symbolTicks.length ? symbolTicks[symbolTicks.length - 1] : null;
        let newSymbolTicks: any[];
        if (isCrypto) {
          const realData = data?.['Realtime Currency Exchange Rate'] ?? {};
          const timeString = `${realData['6. Last Refreshed']} ${realData['7. Time Zone']}`;
          const time = (new Date(timeString)).getTime();
          const price = parseFloat(realData['5. Exchange Rate'] ?? 0);
          if (time && price && time !== prevTick?.price) {
            newSymbolTicks = [
              ...symbolTicks,
              { time, price },
            ];
          }
        } else {
          const realData = data?.['Global Quote'] ?? {};
          const time: number = Date.now();
          const closePrice = parseFloat(realData['08. previous close'] ?? 0);
          const openPrice = parseFloat(realData['02. open'] ?? 0);
          if (closePrice && openPrice && openPrice !== prevTick?.price) {
            newSymbolTicks = [
              ...symbolTicks,
              { time: time - (12 * TIME.HOUR), price: closePrice },
              { time, price: openPrice },
            ];
          }
        }
        const newTicks = { ...ticks, [symbol]: newSymbolTicks };
        setTicks(newTicks);
        localStorage.setItem('ticks', JSON.stringify(newTicks));
        console.log('TICKS', newTicks);
      });
  }, []);

  // Set the ticker going at a regular interval.
  useEffect(() => {
    const interval = setInterval(() => {
      if (symbolNum >= SYMBOLS.length * TICK_CYCLES) {
        clearInterval(interval);
        return;
      }
      fetchTick(ticks, SYMBOLS[symbolNum % SYMBOLS.length]);
      setSymbolNum(symbolNum + 1);
    }, TICK_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchTick, symbolNum, ticks]);

  return (
    <div className={BASE_CLASS}>
      {SYMBOLS.map((symbol: string) => (
        <div key={symbol} className={`${BASE_CLASS}-row`}>
          {symbol}:
          <ul>
            {ticks[symbol]?.map(({ time, price }, index: number) => {
              if (index < 1) {
                return <li key={time}></li>;
              }
              const prevTick = ticks[symbol][index - 1];
              const change = prevTick.price ? (price - prevTick.price) / prevTick.price : 0;
              const changePercent = `${(change * 100).toFixed(2)}%`;
              const timeString = new Date(time).toLocaleString();
              let changeLetter: string;
              if (change < -0.03) {
                changeLetter = 'k'
              } else if (change < -0.01) {
                changeLetter = 's'
              } else if (change < -0.003) {
                changeLetter = 't'
              } else if (change < -0.001) {
                changeLetter = 'n'
              } else if (change < 0) {
                changeLetter = 'm'
              } else if (change < 0.001) {
                changeLetter = 'u'
              } else if (change < 0.003) {
                changeLetter = 'o'
              } else if (change < 0.01) {
                changeLetter = 'a'
              } else if (change < 0.03) {
                changeLetter = 'e'
              } else {
                changeLetter = 'i'
              }
              if (time - prevTick.time > 24 * TIME.HOUR) {
                changeLetter = ` ${changeLetter}`;
              }
              return <li key={time} title={`${changePercent} at ${timeString}`}>{changeLetter}</li>;
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Ticker;
