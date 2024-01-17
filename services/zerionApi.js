import { ZERION_API_KEY } from "@env"
import base64 from 'react-native-base64'

const apiKey = base64.encode(ZERION_API_KEY) + 'Og==';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: `Basic ${apiKey}`
  }
};

export const getWalletBalance = async (walletAddress) => {
  try {
    const response = await fetch(`https://api.zerion.io/v1/wallets/${walletAddress}/portfolio?currency=usd`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при запросе к Zerion API в методе getWalletBalance:', error);
    return {};
  }
};

export const fetchWalletPositions = async (walletAddresses = []) => {
  const fetchPositionForWallet = async (address) => {
    try {
      const url = `https://api.zerion.io/v1/wallets/${address}/positions/?currency=usd`;
      const response = await fetch(url, options);
      const { data } = await response.json();

      // COMMENT: filter coin with value < 0.01
      const filteredData = data?.filter(item => item.attributes?.value >= 0.01);

      return filteredData || [];
    } catch (error) {
      console.error('Ошибка при запросе к Zerion API в методе fetchWalletPositions:', error);
      return []
    }
  };

  const positions = await Promise.all(walletAddresses?.map(fetchPositionForWallet));

  const formattedPositions = positions?.flatMap(walletData => {
    const reformatedData = walletData?.map(pos => ({
      symbol: pos?.attributes?.fungible_info?.symbol,
      name: pos?.attributes?.fungible_info?.name,
      value: pos?.attributes?.value || 0,
      amount: pos?.attributes?.quantity?.float || 0
    }))

    const merged = reformatedData?.reduce((acc, { name, value, symbol, amount }) => {
      if (acc[name]) {
        acc[value] += value;
        acc[amount] += amount;
      } else {
        acc[name] = {
          name,
          value,
          symbol,
          amount
        };
      }
      return acc;
    }, {})

    return merged ? Object.values(merged) : [];
  });

  return formattedPositions;
}