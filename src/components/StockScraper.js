import React, { useState } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';

function StockScraper() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  const scrapeStockData = async () => {
    setLoading(true);

    const url =
      'https://finance.yahoo.com/quote/HGRE11.SA/history/?period1=1578268800&period2=1746570735';
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    try {
      // Fetch the page HTML
      const { data: html } = await axios.get(corsProxy + url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      // Use Cheerio to parse and extract table data
      const $ = cheerio.load(html);
      const rows = $('table[data-test="historical-prices"] tbody tr');
      const data = [];

      rows.each((index, row) => {
        const columns = $(row).find('td');
        if (columns.length > 0) {
          const date = $(columns[0]).text().trim();
          const open = $(columns[1]).text().trim();
          const high = $(columns[2]).text().trim();
          const low = $(columns[3]).text().trim();
          const close = $(columns[4]).text().trim();
          const adjClose = $(columns[5]).text().trim();
          const volume = $(columns[6]).text().trim();

          data.push({
            date,
            open,
            high,
            low,
            close,
            adjClose,
            volume,
          });
        }
      });

      setStockData(data);
    } catch (error) {
      console.error('Error scraping stock data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Stock Scraper</h1>
      <button onClick={scrapeStockData} disabled={loading}>
        {loading ? 'Loading...' : 'Scrape Stock Data'}
      </button>

      {stockData.length > 0 && (
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
      )}
    </div>
  );
}

export default StockScraper;