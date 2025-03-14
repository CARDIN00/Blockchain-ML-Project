// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FraudDetectionContract {

    bool public isPaused = false;

    // Struct to store transaction details
    struct Transaction {
        uint256 time;      // Timestamp of the transaction
        uint256 amount;    // Transaction amount
        address user;      // Address of the transaction initiator
        bool isFraudulent; // Indicates if the transaction is fraudulent
    }

    // Array to store all transactions
    Transaction[] private transactions;

    // Mapping to freeze accounts (if required)
    mapping(address => bool) private frozenAccounts;


    // Owner of the contract
    address public owner;
    constructor() {
        owner = msg.sender; // Set the deployer as the owner
    }

    // Events for logging
    event TransactionLogged(uint256 indexed time, uint256 amount, address indexed user);
    event AccountFrozen(address indexed user);
    event AccountUnfrozen(address indexed user);

   

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    //to restrict functionality if paused
    modifier whenNotPaused() {
    require(!isPaused, "Contract is paused");
    _;
    }

    //FUNCTIONS

     // Function to retrieve all transactions
    function getAllTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

     // Function to freeze an account
    function freezeAccount(address _user) public onlyOwner {
        frozenAccounts[_user] = true;
        emit AccountFrozen(_user);
    }

    // Function to unfreeze an account
    function unfreezeAccount(address _user) public onlyOwner {
        frozenAccounts[_user] = false;
        emit AccountUnfrozen(_user);
    }

    // Function to check if an account is frozen
    function isAccountFrozen(address _user) public view returns (bool) {
        return frozenAccounts[_user];
    }

    // Function to retrieve the total number of transactions
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    // Function to transfer ownership
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be the zero address");
        owner = _newOwner;
    }



    // Function to log a transaction
    function logTransaction( uint256 _amount, bool _isFraudulent) public  whenNotPaused   {
        require(!frozenAccounts[msg.sender], "Your account is frozen. Cannot log transactions.");

        // Add the transaction to the array
        uint time = block.timestamp;
        transactions.push(Transaction(time, _amount, msg.sender, _isFraudulent));

        emit TransactionLogged(time, _amount, msg.sender);
    }



       
    // Function to retrieve transactions for a specific user
    function getUserTransactions(address _user) public view returns (Transaction[] memory) {
        require(transactions.length > 0, "No transactions available");
        
        uint count = 0;
        // Count transactions by the user
        for (uint i = 0; i < transactions.length; i++) {
            if (transactions[i].user == _user) {
                count++;
            }
        }

        // Create an array to store user transactions
        Transaction[] memory userTransactions = new Transaction[](count);
        uint index = 0;

        for (uint i = 0; i < transactions.length; i++) {
            if (transactions[i].user == _user) {
                userTransactions[index] = transactions[i];
                index++;
            }
        }

        return userTransactions;
    }

   

    // Function to retrieve fraudulent transactions
    function getFraudulentTransactions() public view returns (Transaction[] memory) {
        require(transactions.length > 0, "No transactions available");
        
        uint256 count = 0;
        // Count fraudulent transactions
        for (uint256 i = 0; i < transactions.length; i++) {
            if (transactions[i].isFraudulent) {
                count++;
            }
        }
        // Create an array to store fraudulent transactions
        Transaction[] memory frauds = new Transaction[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < transactions.length; i++) {
            if (transactions[i].isFraudulent) {
                frauds[index] = transactions[i];
                index++;
            }
        }
        return frauds;
    }

    // function to get fraud ID's
    function getFraudulentTransactionUsers() public view returns (address[] memory) {
    uint256 count = 0;
    for (uint256 i = 0; i < transactions.length; i++) {
        if (transactions[i].isFraudulent) {
            count++;
        }
    }

    address[] memory fraudUsers = new address[](count);
    uint256 index = 0;

    for (uint256 i = 0; i < transactions.length; i++) {
        if (transactions[i].isFraudulent) {
            fraudUsers[index] = transactions[i].user;
            index++;
        }
    }

    return fraudUsers;
    }

    // Threshold for fraud detection (example)
    uint256 public fraudDetectionThreshold = 1000; // Default value
    uint256 public penaltyAmount = 500;           // Default penalty

    // Function to update fraud detection threshold
    function updateFraudDetectionThreshold(uint256 _newThreshold) public onlyOwner {
        require(_newThreshold > 0, "Threshold must be greater than zero");
        fraudDetectionThreshold = _newThreshold;
    }

    // Function to update penalty amount
    function updatePenaltyAmount(uint256 _newPenalty) public onlyOwner {
        require(_newPenalty > 0, "Penalty must be greater than zero");
        penaltyAmount = _newPenalty;
    }

    // Function to pause the contract
    function pauseContract() public onlyOwner {
        isPaused = true;
    }

    // Function to resume the contract
    function resumeContract() public onlyOwner {
        isPaused = false;
    }
    
}
