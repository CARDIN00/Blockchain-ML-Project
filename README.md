# Blockchain Fraud Detection System

A decentralized application built on Ethereum for fraud detection and account management with real-time transaction monitoring.

## Overview

This blockchain-based fraud detection system provides a comprehensive solution for monitoring transactions, detecting fraudulent activities, and managing user accounts within a secure decentralized environment. The application comes with an intuitive dashboard for both users and administrators.

## Features

- **Wallet Integration**: Seamless connection with MetaMask and other Ethereum wallets
- **Transaction Monitoring**: Real-time tracking of all on-chain transactions
- **Fraud Detection**: Automated system for identifying suspicious activities based on configurable thresholds
- **Account Management**: Functionality to freeze/unfreeze accounts suspected of fraudulent behavior
- **Administrative Controls**: Special dashboard for contract owners with advanced management features
- **Contract Pause Mechanism**: Emergency stop functionality to pause contract operations if needed
- **Ownership Transfer**: Ability to transfer contract ownership to new addresses

## Technology Stack

- **Frontend**: React.js with React Router for navigation
- **Blockchain Interaction**: ethers.js for Ethereum blockchain communication
- **Smart Contract**: Solidity 0.8.0+
- **Development Environment**: Hardhat/Truffle
- **Web3 Provider**: MetaMask

## Smart Contract Architecture

The fraud detection system is built around a primary smart contract (`FraudDetectionContract`) that handles:

- Transaction logging
- Account status management
- Fraud detection logic
- Administrative functions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blockchain-fraud-detection.git
cd blockchain-fraud-detection
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory and add:
```
REACT_APP_CONTRACT_ADDRESS=0x052d5D86568BEf96EaFa3b0A049Bc4dc11D10B93
```

4. Start the development server:
```bash
npm start
```

## Usage

### Connecting Your Wallet

1. Navigate to the application's homepage
2. Click "Connect Wallet" button
3. Approve the connection request in your MetaMask (or other wallet) extension

### User Dashboard

Once connected, users can:
- View transaction history
- Send ETH to other addresses
- Check account status

### Admin Functions

Contract owners have additional capabilities:
- Freeze/unfreeze suspicious accounts
- Update fraud detection parameters
- Pause/resume contract functionality
- Transfer ownership to another address

## Security Considerations

- The contract includes protection mechanisms like `onlyOwner` and `whenNotPaused` modifiers
- Account freezing is available for quick response to detected fraud
- Contract pausability for emergency situations

## Development and Testing

### Local Development

```bash
# Run local development chain
npx hardhat node

# Deploy contracts to local network
npx hardhat run scripts/deploy.js --network localhost
```

### Testing

```bash
# Run test suite
npx hardhat test
```

## Future Enhancements

- Integration with additional DeFi protocols
- Machine learning-based fraud detection algorithms
- Multi-signature requirements for administrative actions
- Support for custom ERC20 tokens

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- [Your Name] - Initial work

## Acknowledgments

- Ethereum community
- OpenZeppelin for smart contract security patterns
