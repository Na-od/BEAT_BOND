# Beat Bond

**Direct Creator-Fan Value Exchange Platform**

## Overview
Beat Bond is a decentralized platform that enables creators (musicians, artists, streamers, etc.) to launch their own community coins and bond markets, allowing fans to invest directly in their favorite creators. The platform leverages the Zora Protocol's CoinV4 standard and bonding curve mechanics to ensure transparent, automated, and fair value exchange between creators and fans.

## Key Features
- **Creator Coins:** Any creator can launch their own ERC-20 coin using Zora's CoinV4 protocol, with automated bonding curve pricing and treasury management.
- **Bond Marketplace:** Fans can discover, search, and invest in creator coins, with real-time metrics and transparent pricing.
- **Direct Value Exchange:** Creators earn directly from every transaction, and fans can trade or hold coins for exclusive access and rewards.
- **No Middlemen:** All transactions are on-chain, with no centralized platform fees or gatekeepers.
- **Zora Protocol Integration:** Full integration with Zora's CoinV4 contracts and SDK for coin creation, minting, burning, and price discovery.

## How Beat Bond Uses Zora Protocol
- **Coin Creation:** When a creator launches a coin, Beat Bond uses the Zora CoinV4 Factory contract and the Zora Coins SDK to deploy a new ERC-20 token with bonding curve pricing. Metadata is stored on IPFS (via Pinata or NFT.Storage).
- **Bonding Curve Pricing:** The price to mint or burn coins is determined by Zora's automated bonding curve, ensuring early supporters get better prices and creators earn protocol/tresury fees on every transaction.
- **On-Chain Transparency:** All coin transactions (mint, burn, transfer) are executed on-chain via Zora contracts, and users can view their coins on Zora's official explorer.
- **Zora SDK & APIs:** The platform uses the Zora SDK for contract interactions and the Zora API for fetching on-chain data and market metrics.

## Technical Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion
- **Web3:** wagmi, ethers, viem, @rainbow-me/rainbowkit
- **Zora Protocol:** @zoralabs/coins-sdk, @zoralabs/protocol-sdk, Zora CoinV4 contracts
- **Storage:** IPFS via Pinata and NFT.Storage for coin metadata and images
- **State Management:** Zustand

## User Flows
### For Creators
1. Connect wallet (Base or Base Sepolia network).
2. Launch a new creator coin by providing name, symbol, initial supply, and metadata (image, description, etc.).
3. Coin is deployed via Zora CoinV4 Factory; metadata is pinned to IPFS.
4. Share your coin with fans and track stats on the dashboard.

### For Fans
1. Browse the marketplace to discover creators and their coins.
2. View real-time price, supply, and other metrics (powered by Zora contracts).
3. Buy coins directly via the platform or on Zora's explorer (link provided for each coin).
4. Hold, trade, or redeem coins for exclusive creator rewards.

## For Hackathon Evaluators
- **Zora Protocol Usage:** All creator coins are deployed and managed using Zora's CoinV4 contracts and SDK. The platform does not use any custom ERC-20 logic; it is fully reliant on Zora's open protocol.
- **On-Chain Transparency:** Every coin and transaction can be verified on Zora's explorer. Each coin card in the marketplace includes a direct link to its Zora explorer page.
- **IPFS Storage:** All coin metadata and images are stored on IPFS for full decentralization.
- **No Centralized Backend:** The platform is fully decentralized, with all critical data on-chain or on IPFS.
- **Testnet Support:** The platform supports Base Sepolia for easy hackathon testing. Use a testnet wallet to try all features.

## Running the Project
1. Install dependencies: `npm install`
2. Set up environment variables for Pinata/NFT.Storage and WalletConnect (see `.env.example` if provided).
3. Start the dev server: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Contact & Support
For any questions or demo requests, please contact the project maintainer or open an issue.

---

*This project was built for hackathon evaluation and demonstrates a full-stack, decentralized creator economy platform using the Zora protocol.* 