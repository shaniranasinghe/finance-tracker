import axios from 'axios';

// Placeholder for an exchange rate API key and base URL (you'll need to replace this with an actual API or mock data)
const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/';

// Function to convert currencies
export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;

  try {
    const response = await axios.get(`${EXCHANGE_API_URL}${fromCurrency}`);
    const exchangeRates = response.data.rates;

    if (!exchangeRates[toCurrency]) {
      throw new Error('Invalid target currency');
    }

    const convertedAmount = amount * exchangeRates[toCurrency];
    return convertedAmount;
  } catch (error) {
    throw new Error('Currency conversion failed');
  }
};
