const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape historical stock data table from Yahoo Finance.
 * @param {string} stock - Stock to be gathered
 * @returns {Promise<Array>} - Array of objects representing rows of the stock table.
 */

// Add a request interceptor
axios.interceptors.request.use((config) => {
  console.log('Request Configuration:', config); // This logs all headers
  return config;
}, (error) => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

const scrapeYahooFinance = async (stock, period1, period2) => {
  const url = `https://finance.yahoo.com/quote/${stock}.SA/history/?period1=${period1}&period2=${period2}`;
  console.log(url);
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Host': 'finance.yahoo.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
    });

    console.log(html);
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

    return data;
  } catch (error) {
    console.error('Error scraping Yahoo Finance data:', error.message);
    throw error;
  }
};

module.exports = scrapeYahooFinance;