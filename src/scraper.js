const axios = require('axios');
const cheerio = require('cheerio');
const hgre = require('./data.json');
const hgreDividends = require('./dividends.json');

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

const getDividends = async (stock, start, end) => {
  if (stock === 'HGRE11') {
    const data = [];

    hgreDividends.forEach(day => {
      if (day.date_ex >= start && day.date_ex <= end) {
        const item = {
          date_ex: new Date(day.date_ex).getTime(), 
          date_pay: new Date(day.date_pay).getTime(), 
          value: day.value
        };
        data.push(item);
      }
    });

    data.reverse();
    return data;
  }
}

const scrapeYahooFinance = async (stock, start, end) => {
  if (stock === 'HGRE11') {
    const data = [];

    hgre.forEach(day => {
      if (day.date >= start && day.date <= end) {
        const item = [new Date(day.date).getTime(), day.value];
        data.push(item);
      }
    });

    data.reverse();
    return data;
  }

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}.SA&outputsize=full&apikey=L1P0G55QNUD7E3VM`;
  console.log(url);
  try {
    const { data: json } = await axios.get(url, {
      headers: {'User-Agent': 'request'}
    });

    const days_data = json['Time Series (Daily)'];
    const dates = [];
    const values = [];

    console.log(days_data);
    for (let date in days_data) {
      if (date >= start && date <= end) {
        let value = Number(days_data[date]['4. close']).toFixed(2);
        dates.push(date);
        console.log(dates);
        values.push(value);
      }
    }

    return {dates, values};
  } catch (error) {
    console.error('Error scraping Yahoo Finance data:', error.message);
    throw error;
  }
};

module.exports = {getDividends, scrapeYahooFinance};