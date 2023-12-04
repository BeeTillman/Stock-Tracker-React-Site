/*
  StockTracker Component
  Written by: Billups Tillman (GitHub: https://github.com/BeeTillman)

  This React component fetches and displays stock information using the Yahoo Finance API.
  It allows users to select a stock symbol from a list and updates the stock value every hour.
*/

// Importing necessary modules from the React library
import React, { useState, useEffect } from 'react';

// Importing the external styles for the component
import './styles.css';

// Functional component for the StockTracker
const StockTracker = () => {
  // State variables using the 'useState' hook to manage component state
  const [symbol, setSymbol] = useState('AAPL'); // Current stock symbol
  const [stockValue, setStockValue] = useState(null); // Current stock value
  const [timeLeft, setTimeLeft] = useState(60 * 60); // Time left until the next update in seconds (initially set to 1 hour)

  // List of stock symbols to choose from
  const stockList = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

  // Function to fetch stock data from the Yahoo Finance API
  const fetchStockValue = async () => {
    try {
      // Making a GET request to the Yahoo Finance API
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

      // Parsing the JSON response
      const data = await response.json();

      // Extracting relevant stock information from the response
      const stockInfo = data.quoteResponse.result[0];

      // Updating the component state with the fetched stock value
      setStockValue(stockInfo.regularMarketPrice);

      // Resetting the timer after each successful update
      setTimeLeft(60 * 60);
    } catch (error) {
      // Handling errors that may occur during the fetch operation
      console.error('Error fetching stock data:', error);
    }
  };

  // Effect hook to run code on component mount and when the 'symbol' state changes
  useEffect(() => {
    // Fetching the initial stock value when the component mounts
    fetchStockValue();

    // Setting intervals to update stock value every hour and timer every second
    const intervalId = setInterval(() => {
      fetchStockValue();
    }, 60 * 60 * 1000);

    const timerIntervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => (prevTimeLeft > 0 ? prevTimeLeft - 1 : 0));
    }, 1000);

    // Cleaning up intervals on component unmount to avoid memory leaks
    return () => {
      clearInterval(intervalId);
      clearInterval(timerIntervalId);
    };
  }, [symbol]); // Dependency array ensures that the effect runs when 'symbol' changes

  // Function to format time in minutes and seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Rendering JSX for the StockTracker component
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* Title Header */}
      <div className='title'>
        <header>
          <h1>Stock Tracker</h1>
        </header>
      </div>

      {/* Header with GitHub link */}
      <div className='written-by'>
        <header>
          <p>
            Written by{' '}
            <a href="https://github.com/BeeTillman" target="_blank" rel="noopener noreferrer">
              Billups Tillman
            </a>
          </p>
        </header>
      </div>

      {/* Tablist for stock symbols */}
      <div className="tablist">
        {stockList.map((stock) => (
          <button
            key={stock}
            onClick={() => setSymbol(stock)}
            className={symbol === stock ? 'active' : ''}
          >
            {stock}
          </button>
        ))}
      </div>

      {/* Stock information section */}
      <div className="stock-info">
        <p>Stock Symbol: {symbol}</p>
        <p>Stock Value: {stockValue !== null ? `$${stockValue.toFixed(2)}` : 'Loading...'}</p>
        <p>Time left until the next update: {formatTime(timeLeft)}</p>
      </div>
    </div>
  );
};

// Exporting the StockTracker component as the default export
export default StockTracker;
