PORT=3000
TD_API_KEY=YOUR_TD_AMERITRADE_API_KEY
// index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// -----------------------
// In-memory Data Stores
// -----------------------
const inventory = [];         // Holds scrap metal inventory records
const futuresContracts = [];  // Holds created futures contracts

// -----------------------
// Inventory Management Endpoints
// -----------------------

// Add a new inventory record (simulate scanning or manual entry)
app.post('/inventory', (req, res) => {
  const { type, quantity, condition } = req.body;
  if (!type || typeof quantity !== 'number' || !condition) {
    return res.status(400).json({ error: 'Please provide type, numeric quantity, and condition.' });
  }
  const id = inventory.length + 1;
  const newItem = { id, type, quantity, condition, createdAt: new Date() };
  inventory.push(newItem);
  res.status(201).json(newItem);
});

// Get all inventory items
app.get('/inventory', (req, res) => {
  res.json(inventory);
});

// -----------------------
// Market Data Integration
// -----------------------

// Endpoint to fetch real-time market data for a given symbol (e.g., scrap metal or related commodity)
// For example, symbol 'HG=F' might represent Copper Futures.
app.get('/market/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  const apiKey = process.env.TD_API_KEY;
  const url = `https://api.tdameritrade.com/v1/marketdata/${symbol}/quotes`;

  try {
    const response = await axios.get(url, { params: { apikey: apiKey } });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching market data:', error.message);
    res.status(500).json({ error: 'Error fetching market data' });
  }
});

// -----------------------
// Dynamic Pricing Calculation
// -----------------------

// Endpoint that calculates a purchase price using a dynamic pricing formula.
// Formula: Purchase Price = Market Price * (1 + Adjustment Factor) + Operational Costs + Hedging Impact
app.post('/pricing/calculate', (req, res) => {
  const { marketPrice, adjustmentFactor, operationalCosts, hedgingImpact } = req.body;

  // Validate inputs are numbers
  if (
    typeof marketPrice !== 'number' ||
    typeof adjustmentFactor !== 'number' ||
    typeof operationalCosts !== 'number' ||
    typeof hedgingImpact !== 'number'
  ) {
    return res.status(400).json({ error: 'All inputs (marketPrice, adjustmentFactor, operationalCosts, hedgingImpact) must be numbers.' });
  }

  const purchasePrice = marketPrice * (1 + adjustmentFactor) + operationalCosts + hedgingImpact;
  res.json({ purchasePrice });
});

// -----------------------
// Futures Contract Management
// -----------------------

// Create a new futures contract based on inventory and market data.
// In a production system, this would include validations, margin calculations, and integration with a trading API.
app.post('/futures', async (req, res) => {
  const { commodity, quantity, expirationDate, targetPrice, contractType } = req.body;

  // Basic input validation
  if (!commodity || typeof quantity !== 'number' || !expirationDate || typeof targetPrice !== 'number' || !contractType) {
    return res.status(400).json({ error: 'Please provide commodity, numeric quantity, expirationDate, numeric targetPrice, and contractType (e.g., "long" or "short").' });
  }

  // In a real integration, you might now call a trading API (like ThinkOrSwim via the TD Ameritrade API) to place an order.
  const contractId = futuresContracts.length + 1;
  const newContract = {
    id: contractId,
    commodity,
    quantity,
    expirationDate,
    targetPrice,
    contractType, // 'long' or 'short'
    createdAt: new Date()
  };

  futuresContracts.push(newContract);
  res.status(201).json(newContract);
});

// Get all futures contracts
app.get('/futures', (req, res) => {
  res.json(futuresContracts);
});

// -----------------------
// Start the Server
// -----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BRidge PoC server is running on port ${PORT}`);
});
