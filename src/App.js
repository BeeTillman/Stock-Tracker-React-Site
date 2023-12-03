import React, { useState, useEffect } from 'react';
import './styles.css';

const StockTracker = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [stockValue, setStockValue] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // Initial time left in seconds (1 hour)

  const stockList = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

  const fetchStockValue = async () => {
    try {
      const response = await fetch(
        `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=${symbol}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.REACT_APP_API_KEY,
          },
        }
      );

      const data = await response.json();
      const stockInfo = data.quoteResponse.result[0];
      setStockValue(stockInfo.regularMarketPrice);
      setTimeLeft(60 * 60); // Reset the timer after each successful update
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    // Fetch initial stock value
    fetchStockValue();

    // Set interval to update stock value every hour
    const intervalId = setInterval(() => {
      fetchStockValue();
    }, 60 * 60 * 1000);

    // Set interval to update timer every second
    const timerIntervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => (prevTimeLeft > 0 ? prevTimeLeft - 1 : 0));
    }, 1000);

    // Clean up intervals on component unmount
    return () => {
      clearInterval(intervalId);
      clearInterval(timerIntervalId);
    };
  }, [symbol]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Stock Tracker</h1>
      <p>Stock Symbol: {symbol}</p>
      <p>Stock Value: {stockValue !== null ? `$${stockValue.toFixed(2)}` : 'Loading...'}</p>
      <p>Time left until the next update: {formatTime(timeLeft)}</p>
      <div>
        <p>Select a Stock Symbol:</p>
        {stockList.map((stock) => (
          <button key={stock} onClick={() => setSymbol(stock)}>
            {stock}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockTracker;
