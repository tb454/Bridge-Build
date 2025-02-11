// server.js
// A self-contained BRidge PoC backend using fictional data on port 4000

const express = require('express');
const cors = require('cors');
const app = express();

// Set the port to 4000
const PORT = process.env.PORT || 4000;

// Enable CORS (so your React app can call these endpoints)
app.use(cors());
app.use(express.json());

// -------------------------------------------------
// In‑memory Data Stores
// -------------------------------------------------
const inventory = [];         // Holds scrap metal inventory records
const futuresContracts = [];  // Holds futures contract records

// -------------------------------------------------
// Inventory Management Endpoints
// -------------------------------------------------

// POST /inventory - Add a new inventory record
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

// GET /inventory - Retrieve all inventory records
app.get('/inventory', (req, res) => {
  res.json(inventory);
});

// -------------------------------------------------
// Market Data Endpoint (Fictional Data)
// -------------------------------------------------

// GET /market/:symbol - Return fictional market data for the given symbol
app.get('/market/:symbol', (req, res) => {
  const { symbol } = req.params;
  // Generate fictional static data
  const data = {
    symbol,
    lastPrice: +(100 + Math.random() * 50).toFixed(2),
    change: +(Math.random() * 5).toFixed(2),
    changePercent: +(Math.random() * 2).toFixed(2)
  };
  res.json(data);
});

// -------------------------------------------------
// Dynamic Pricing Calculation Endpoint
// -------------------------------------------------

// POST /pricing/calculate - Calculate purchase price using a dynamic pricing formula
// Formula: Purchase Price = Market Price * (1 + Adjustment Factor) + Operational Costs + Hedging Impact
app.post('/pricing/calculate', (req, res) => {
  const { marketPrice, adjustmentFactor, operationalCosts, hedgingImpact } = req.body;
  if (
    typeof marketPrice !== 'number' ||
    typeof adjustmentFactor !== 'number' ||
    typeof operationalCosts !== 'number' ||
    typeof hedgingImpact !== 'number'
  ) {
    return res.status(400).json({ error: 'All inputs must be numbers.' });
  }
  const purchasePrice = marketPrice * (1 + adjustmentFactor) + operationalCosts + hedgingImpact;
  res.json({ purchasePrice });
});

// -------------------------------------------------
// Futures Contract Management Endpoints
// -------------------------------------------------

// POST /futures - Create a new futures contract
app.post('/futures', (req, res) => {
  const { commodity, quantity, expirationDate, targetPrice, contractType } = req.body;
  if (!commodity || typeof quantity !== 'number' || !expirationDate || typeof targetPrice !== 'number' || !contractType) {
    return res.status(400).json({ error: 'Please provide commodity, numeric quantity, expirationDate, numeric targetPrice, and contractType.' });
  }
  const id = futuresContracts.length + 1;
  const newContract = {
    id,
    commodity,
    quantity,
    expirationDate,
    targetPrice,
    contractType,
    createdAt: new Date()
  };
  futuresContracts.push(newContract);
  res.status(201).json(newContract);
});

// GET /futures - Retrieve all futures contracts
app.get('/futures', (req, res) => {
  res.json(futuresContracts);
});

// -------------------------------------------------
// Start the Server
// -------------------------------------------------
app.listen(PORT, () => {
  console.log(`BRidge PoC server is running on port ${PORT}`);
});
