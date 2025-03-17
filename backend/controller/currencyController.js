import axios from 'axios';

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/';

export const getExchangeRates = async (req, res) => {
    try {
      const apiKey = process.env.EXCHANGE_RATE_API_KEY; // Replace with your API key
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`); // Replace with actual API URL
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exchange rates' });
    }
  };
  
