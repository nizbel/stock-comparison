const express = require('express');
const cors = require('cors');
const scrapeYahooFinance = require('./src/scraper');

const app = express();
const PORT = 5000;

const corsOptions = {
    origin: '*', // Allow only this origin
    methods: 'GET', // Allow only GET requests
    optionsSuccessStatus: 200, // For legacy browser support
  };
  
  app.use(cors(corsOptions));

app.get('/api/stock-data', async (req, res) => {
  const { stock, period1, period2 } = req.query; // Pass the Yahoo Finance URL as a query parameter
  console.log(stock);
  console.log(period1);

  try {
    if (!stock) {
      return res.status(400).json({ error: 'Missing stock parameter' });
    }
    const data = await scrapeYahooFinance(stock, period1, period2);
    res.json(data);
    res.json({})
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch stock data ${error}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});