import React, { useState, useEffect } from 'react';
import './styles.css';

const StockTracker = () => {
  const [symbol, setSymbol] = useState('AAPL'); // Initial stock symbol (Apple Inc.)
  const [stockValue, setStockValue] = useState(null);

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
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    // Fetch initial stock value
    fetchStockValue();

    // Set interval to update stock value every 5 seconds (adjust as needed)
    const intervalId = setInterval(fetchStockValue, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [symbol]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Stock Tracker</h1>
      <p>Stock Symbol: {symbol}</p>
      <p>Stock Value: {stockValue !== null ? `$${stockValue.toFixed(2)}` : 'Loading...'}</p>
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
