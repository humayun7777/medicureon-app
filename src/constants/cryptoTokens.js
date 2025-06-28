// =============================================
// Cryptocurrency Token Information
// Your Ethereum token details and supported cryptos
// =============================================

export const cryptoTokens = {
  // Your primary token
  medicureToken: {
    name: "MediCureOn Token",
    symbol: "MDCR", // Replace with your actual symbol
    contractAddress: "0x...", // Replace with your contract address
    decimals: 18,
    network: "ethereum",
    icon: "/assets/images/crypto-icons/mdcr-token.png",
    discountRate: 0.15 // 15% discount
  },
  
  // Supported cryptocurrencies
  supportedTokens: [
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      icon: "/assets/images/crypto-icons/eth.png",
      discountRate: 0.10 // 10% discount
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      contractAddress: "0xA0b86a33E6A1B1Cf95d8a9F4f7A3d8D7E3C9B5F7",
      decimals: 6,
      icon: "/assets/images/crypto-icons/usdc.png",
      discountRate: 0.05 // 5% discount
    }
  ]
};
