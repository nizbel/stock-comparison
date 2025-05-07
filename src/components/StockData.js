import React, { useState, useEffect } from 'react';

function StockData() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = 'https://zany-xylophone-9wr46xx9gxf75g6-5000.app.github.dev';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${backendUrl}/api/stock-data?stock=HGRE11&period1=1578268800&period2=1746570735`
        );
        const data = await response.json();
        console.log(data);
        setStockData(data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Stock Data</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Adj Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map((row, index) => (
            <tr key={index}>
              <td>{row.date}</td>
              <td>{row.open}</td>
              <td>{row.high}</td>
              <td>{row.low}</td>
              <td>{row.close}</td>
              <td>{row.adjClose}</td>
              <td>{row.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockData;