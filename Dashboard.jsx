import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import contractABI from "../utils/contractABI.jsx";
import "../index.css"; 

const contractAddress = "0x052d5D86568BEf96EaFa3b0A049Bc4dc11D10B93";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { account, isOwner } = location.state || {};

  const [selectedFunction, setSelectedFunction] = useState(null);
  const [targetAddress, setTargetAddress] = useState("");
  const [message, setMessage] = useState("");
  const [checkAddress, setCheckAddress] = useState("");
  const [frozenStatus, setFrozenStatus] = useState(null);
  const [newOwner, setNewOwner] = useState("");
  const [contractStatus, setContractStatus] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  // New state for fraud detection
  const [fraudThreshold, setFraudThreshold] = useState(1000); // Default value
  const [penaltyAmount, setPenaltyAmount] = useState(500);     // Default value
  const [transactions, setTransactions] = useState([]);
  const [fraudulentTransactions, setFraudulentTransactions] = useState([]);
  const [fraudUsers, setFraudUsers] = useState([]);

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  const sendEth = async () => {
    if (!window.ethereum) {
      setMessage("Ethereum provider not found");
      return;
    }

    if (!recipient || !amount) {
      setMessage("Please enter a valid recipient address and amount.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const amountInWei = ethers.parseEther(amount);
      const tx = await signer.sendTransaction({
        to: recipient,
        value: amountInWei,
      });
      await tx.wait();
      setMessage(`Successfully sent ${amount} ETH to ${recipient}`);
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Error sending ETH:", error);
      setMessage("Transaction failed.");
    }
  };

  const handleFreezeAccount = async () => {
    if (!targetAddress) return setMessage("Please enter an address to freeze.");
    try {
      const contract = await getContract();
      const tx = await contract.freezeAccount(targetAddress);
      await tx.wait();
      setMessage(`Account ${targetAddress} has been frozen.`);
    } catch (error) {
      console.error("Error freezing account:", error);
      setMessage("Error freezing account.");
    }
  };

  const handleUnfreezeAccount = async () => {
    if (!targetAddress) return setMessage("Please enter an address to unfreeze.");
    try {
      const contract = await getContract();
      const tx = await contract.unfreezeAccount(targetAddress);
      await tx.wait();
      setMessage(`Account ${targetAddress} has been unfrozen.`);
    } catch (error) {
      console.error("Error unfreezing account:", error);
      setMessage("Error unfreezing account.");
    }
  };

  const checkFrozenStatus = async () => {
    if (!checkAddress) return alert("Enter an address to check.");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const isFrozen = await contract.isAccountFrozen(checkAddress);
      setFrozenStatus(isFrozen);
    } catch (error) {
      console.error("Error checking frozen status:", error);
      setMessage("Failed to check account status.");
    }
  };

  const transferOwnership = async () => {
    if (!newOwner) return alert("Enter a valid address to transfer ownership.");
    try {
      const contract = await getContract();
      const tx = await contract.transferOwnership(newOwner);
      await tx.wait();
      setMessage(`Ownership transferred to ${newOwner}`);
      setNewOwner("");
    } catch (error) {
      console.error("Error transferring ownership:", error);
      setMessage("Failed to transfer ownership.");
    }
  };

  const handlePauseContract = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.pauseContract();
      await tx.wait();
      setContractStatus(true);
      setMessage("Contract has been paused.");
    } catch (error) {
      console.error("Error pausing contract:", error);
      setMessage("Error pausing contract.");
    }
  };

  const handleResumeContract = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.resumeContract();
      await tx.wait();
      setContractStatus(false);
      setMessage("Contract has been resumed.");
    } catch (error) {
      console.error("Error resuming contract:", error);
      setMessage("Error resuming contract.");
    }
  };

  // New functions

  const getUserTransactions = async () => {
    try {
      const contract = await getContract();
      const userTransactions = await contract.getUserTransactions(account);
      setTransactions(userTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setMessage("Failed to fetch user transactions.");
    }
  };

  const updateFraudDetectionThreshold = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.updateFraudDetectionThreshold(fraudThreshold);
      await tx.wait();
      setMessage(`Fraud detection threshold updated to ${fraudThreshold}`);
    } catch (error) {
      console.error("Error updating fraud detection threshold:", error);
      setMessage("Failed to update fraud detection threshold.");
    }
  };

  const updatePenaltyAmount = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.updatePenaltyAmount(penaltyAmount);
      await tx.wait();
      setMessage(`Penalty amount updated to ${penaltyAmount}`);
    } catch (error) {
      console.error("Error updating penalty amount:", error);
      setMessage("Failed to update penalty amount.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Dashboard</h2>
        <button onClick={() => setSelectedFunction("sendEth")}>Send ETH</button>
        {isOwner && (
          <>
            <button onClick={() => setSelectedFunction("freezeAccount")}>Freeze Account</button>
            <button onClick={() => setSelectedFunction("unfreezeAccount")}>Unfreeze Account</button>
            <button onClick={() => setSelectedFunction("transferOwnership")}>Transfer Ownership</button>
            <button onClick={() => setSelectedFunction("pauseContract")}>Pause Contract</button>
            <button onClick={() => setSelectedFunction("resumeContract")}>Resume Contract</button>
            <button onClick={() => setSelectedFunction("updateFraudDetectionThreshold")}>Update Fraud Detection Threshold</button>
            <button onClick={() => setSelectedFunction("updatePenaltyAmount")}>Update Penalty Amount</button>
          </>
        )}
        <button onClick={() => setSelectedFunction("checkFrozenStatus")}>Check Frozen Status</button>
        <button onClick={() => setSelectedFunction("getUserTransactions")}>View Transactions</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome, {account}</h1>
        <p>Contract Status: {contractStatus ? "Paused ⏸️" : "Active ✅"}</p>

        {/* Conditional Rendering Based on Selected Function */}
        {selectedFunction === "sendEth" && (
          <div className="form-container">
            <h3>Send ETH</h3>
            <input
              type="text"
              placeholder="Recipient address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={sendEth}>Send ETH</button>
          </div>
        )}

        {selectedFunction === "freezeAccount" && (
          <div className="form-container">
            <h3>Freeze Account</h3>
            <input
              type="text"
              placeholder="Enter address"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
            />
            <button onClick={handleFreezeAccount}>Freeze</button>
          </div>
        )}

{selectedFunction === "unfreezeAccount" && (
          <div className="form-container">
            <h3>Unfreeze Account</h3>
            <input
              type="text"
              placeholder="Enter address"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
            />
            <button onClick={handleUnfreezeAccount}>Unfreeze</button>
          </div>
        )}

        {selectedFunction === "checkFrozenStatus" && (
          <div className="form-container">
            <h3>Check Frozen Status</h3>
            <input
              type="text"
              placeholder="Enter address"
              value={checkAddress}
              onChange={(e) => setCheckAddress(e.target.value)}
            />
            <button onClick={checkFrozenStatus}>Check</button>
            {frozenStatus !== null && (
              <p>Status: {frozenStatus ? "Frozen ❄️" : "Active ✅"}</p>
            )}
          </div>
        )}

        {selectedFunction === "transferOwnership" && (
          <div className="form-container">
            <h3>Transfer Ownership</h3>
            <input
              type="text"
              placeholder="New owner address"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
            />
            <button onClick={transferOwnership}>Transfer</button>
          </div>
        )}

        {selectedFunction === "pauseContract" && (
          <div className="form-container">
            <h3>Pause Contract</h3>
            <button onClick={handlePauseContract}>Pause</button>
          </div>
        )}

        {selectedFunction === "resumeContract" && (
          <div className="form-container">
            <h3>Resume Contract</h3>
            <button onClick={handleResumeContract}>Resume</button>
          </div>
        )}

        {/* Fraud Detection Threshold */}
        {selectedFunction === "updateFraudDetectionThreshold" && (
          <div className="form-container">
            <h3>Update Fraud Detection Threshold</h3>
            <input
              type="number"
              value={fraudThreshold}
              onChange={(e) => setFraudThreshold(Number(e.target.value))}
            />
            <button onClick={updateFraudDetectionThreshold}>Update Threshold</button>
          </div>
        )}

        {/* Penalty Amount */}
        {selectedFunction === "updatePenaltyAmount" && (
          <div className="form-container">
            <h3>Update Penalty Amount</h3>
            <input
              type="number"
              value={penaltyAmount}
              onChange={(e) => setPenaltyAmount(Number(e.target.value))}
            />
            <button onClick={updatePenaltyAmount}>Update Penalty</button>
          </div>
        )}

        {/* User Transactions */}
        {selectedFunction === "getUserTransactions" && (
          <div className="form-container">
            <h3>User Transactions</h3>
            <button onClick={getUserTransactions}>Load Transactions</button>
            {transactions.length > 0 && (
              <ul>
                {transactions.map((tx, index) => (
                  <li key={index}>
                    {tx.transactionHash} - {tx.timestamp}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default Dashboard;
