const express = require('express')
const router = express.Router()
const axios = require('axios');
const CoinModel = require('../model/cryptoModel')
const {YOUR_API_KEY} = require('../../config')
// API endpoint
router.get('/coins', async (req, res) => {
  try {
    const response = await axios.get('https://api.coincap.io/v2/assets', {
      headers: {
        Authorization: `Bearer ${YOUR_API_KEY}`,
      },
      params: {
        limit: 100,
      },
    });

    const coins = response.data.data;

    // Save coins in the database
    for (const coin of coins) {
      const { symbol, name, marketCapUsd, priceUsd } = coin;

      // Create or update the coin document in the database
      await CoinModel.findOneAndUpdate(
        { symbol },
        { symbol, name, marketCapUsd, priceUsd },
        { upsert: true }
      );
    }

    // Sort coins by changePercent24Hr
    const sortedCoins = coins.sort(
      (a, b) => b.changePercent24Hr - a.changePercent24Hr
    );

    res.status(200).json({status : true, data : sortedCoins});
  } catch (error) {
    console.error('Error fetching coins:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

 
 



module.exports = router