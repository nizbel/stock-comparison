const express = require('express');
const cors = require('cors');
const {scrapeYahooFinance, getDividends} = require('./src/scraper');

const app = express();
const PORT = 5000;

const corsOptions = {
    origin: '*', // Allow only this origin
    methods: 'GET', // Allow only GET requests
    optionsSuccessStatus: 200, // For legacy browser support
  };
  
  app.use(cors(corsOptions));

app.get('/api/stock-data', async (req, res) => {
  let { stock, start, end } = req.query;

  try {
    if (!stock) {
      return res.status(400).json({ error: 'Missing stock parameter' });
    }
    if (!end) {
      end = (new Date()).toISOString().split('T')[0];
    }
    const data = await scrapeYahooFinance(stock, start, end);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch stock data ${error}` });
  }
});

app.get('/api/dividend-data', async (req, res) => {
  let { stock, start, end } = req.query;

  try {
    if (!stock) {
      return res.status(400).json({ error: 'Missing stock parameter' });
    }
    if (!end) {
      end = (new Date()).toISOString().split('T')[0];
    }
    const data = await getDividends(stock, start, end);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch stock data ${error}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});