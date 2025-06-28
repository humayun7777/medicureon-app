// =============================================
// Cryptocurrency Configuration for MediCureOn
// Ethereum token and wallet integration
// =============================================

export const cryptoConfig = {
  // Your Ethereum token details
  token: {
    name: "MediCureOn Token",
    symbol: "MDCR", // Replace with your actual token symbol
    contractAddress: "0x...", // Replace with your actual contract address
    decimals: 18,
    network: "ethereum" // or "polygon", "bsc", etc.
  },
  
  // Supported wallets
  wallets: {
    metamask: true,
    walletconnect: true,
    coinbaseWallet: true
  },
  
  // Discount rates for crypto payments
  discounts: {
    tokenPayment: 0.15, // 15% discount for token payments
    ethPayment: 0.10,   // 10% discount for ETH payments
    minimumDiscount: 5  // Minimum  discount
  },
  
  // Network configuration
  networks: {
    ethereum: {
      chainId: 1,
      name: "Ethereum Mainnet",
      rpcUrl: "https://mainnet.infura.io/v3/YOUR_PROJECT_ID"
    },
    polygon: {
      chainId: 137,
      name: "Polygon",
      rpcUrl: "https://polygon-mainnet.infura.io/v3/YOUR_PROJECT_ID"
    }
  }
};
