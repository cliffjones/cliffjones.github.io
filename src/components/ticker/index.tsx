import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import './index.scss';

const BASE_CLASS = 'Ticker';
const KEY = 'PHX9J2061YD1MZJY';
const SYMBOL = 'GOOG';
const TICK_INTERVAL = 15000;

function Ticker() {
  const [ticks, setTicks] = useState([]);

  const fetchTick = useCallback(() => {
    axios
      .get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${SYMBOL}&apikey=${KEY}`)
      .then(({ data }) => {
        console.log('DATA', data);
        const time: number = Date.now();
        const price: number = parseFloat(data?.['Global Quote']?.['05. price'] ?? 0);
        const prevTick = ticks.length ? ticks[ticks.length - 1] : null;
        if (price && (!prevTick || price !== prevTick.price)) {
          const change = prevTick?.price ? (price - prevTick.price) / prevTick.price : 0;
          setTicks([...ticks, { time, price, change }]);
        }
      });
  }, [ticks]);

  useEffect(() => {
    fetchTick();
    const interval = setInterval(fetchTick, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchTick]);

  return <div className={BASE_CLASS}>
    {SYMBOL}:
    <ul>
      {ticks.map(({ time, price, change }) => <li key={time}>{price}, {change}</li>)}
    </ul>
  </div>;
}

export default Ticker;
