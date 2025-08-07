# Zora Plugin for Eliza

This plugin provides integration with the **Zora protocol** for creating cryptocurrencies on the Base blockchain within the Eliza ecosystem.

## Features

- **Coin Creation**: Create new coins on the Zora protocol
- **IPFS Integration**: Automatic image and metadata upload to IPFS via Pinata
- **Base Network Support**: Works on Base Mainnet and Base Sepolia testnet
- **Flexible Configuration**: Support for both ZORA and ETH trading pairs

## Installation

```bash
npm install @elizaos/plugin-zora
```

## Configuration

### Environment Variables

Set the following environment variables:

```bash
PINATA_JWT=your_pinata_jwt_token_here
```

### Getting a Pinata JWT

1. Sign up at [Pinata](https://pinata.cloud/)
2. Go to your API Keys section
3. Create a new API key with the following permissions:
   - `pinFileToIPFS`
   - `pinJSONToIPFS`
4. Copy the JWT token and set it as `PINATA_JWT`

## Usage

### Basic Coin Creation

The plugin provides a `COINIT` action that can be used to create new Zora coins:

```typescript
// Example usage in Eliza
const result = await eliza.executeAction("COINIT", {
  name: "My Community Coin",
  symbol: "MCC",
  description: "A community-driven coin for our ecosystem",
  image: "path/to/image.png", // or "https://example.com/image.png"
  category: "social",
  currency: "ZORA"
});
```

### Action Parameters

The `COINIT` action accepts the following parameters:

- **name** (required): The name of the coin to create
- **symbol** (required): The symbol of the coin to create
- **description** (required): The description of the coin
- **image** (required): Local image file path or URI (ipfs:// or https://)
- **category** (optional): The category of the coin, defaults to 'social'
- **payoutRecipient** (optional): The address that will receive creator earnings, defaults to wallet address
- **platformReferrer** (optional): The address that will receive platform referrer fees
- **currency** (optional): The currency for deployment, can be 'ZORA' or 'ETH', defaults to 'ZORA'

### Response Format

Successful coin creation returns:

```json
{
  "success": true,
  "transactionHash": "0x...",
  "coinAddress": "0x...",
  "imageUri": "ipfs://...",
  "uri": "ipfs://...",
  "deployment": { ... },
  "zoraURL": "https://zora.co/coin/base:0x..." // Only for base-mainnet
}
```

## Supported Networks

- **Base Mainnet**: Production environment
- **Base Sepolia**: Test environment

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## Architecture

The plugin consists of several key components:

- **ZoraActionProvider**: Main provider class that handles coin creation
- **Utils**: IPFS upload utilities for images and metadata
- **Schemas**: Zod schemas for parameter validation
- **Actions**: Eliza action definitions and handlers

## Dependencies

- `@zoralabs/coins-sdk`: Official Zora SDK for coin creation
- `viem`: Ethereum library for transaction handling
- `zod`: Schema validation
- `@elizaos/core`: Eliza core framework

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the [Zora Documentation](https://docs.zora.co/coins)
- Visit the [Eliza Community](https://github.com/elizaos/eliza)
- Open an issue in this repository
