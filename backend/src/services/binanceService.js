import axios from "axios";

const BASE_URL = "https://api.binance.com/api/v3";

// Fetch single symbol price
export const getPrice = async (symbol) => {
  const { data } = await axios.get(`${BASE_URL}/ticker/price`, {
    params: { symbol: symbol.toUpperCase() },
  });
  return parseFloat(data.price);
};

// Fetch multiple symbols in one go — avoids N calls
export const getPrices = async (symbols) => {
  const results = await Promise.all(symbols.map(getPrice));
  return Object.fromEntries(
    symbols.map((s, i) => [s.toUpperCase(), results[i]]),
  );
};
