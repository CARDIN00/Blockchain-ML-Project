import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import contractABI from "../utils/contractABI.jsx";

const contractAddress = "0x052d5D86568BEf96EaFa3b0A049Bc4dc11D10B93";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { account, isOwner } = location.state || {};

  const [targetAddress, setTargetAddress] = useState("");
  const [message, setMessage] = useState("");
  const [checkAddress, setCheckAddress] = useState("");
  const [frozenStatus, setFrozenStatus] = useState(null);
  const [newOwner, setNewOwner] = useState("");
  const [contractStatus, setContractStatus] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  useEffect(() => {
    const fetchContractStatus = async () => {
      if (!window.ethereum) {
        console.error("Ethereum provider not found");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const paused = await contract.isPaused();
        setContractStatus(paused);
      } catch (error) {
        console.error("Error fetching contract status:", error);
      }
    };

    fetchContractStatus();
  }, []);

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

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Connected Wallet: {account ? account : "Not Connected"}</p>
      <p>Contract Status: {contractStatus ? "Paused ⏸️" : "Active ✅"}</p>

      <button onClick={() => navigate("/transactions", { state: { account } })}>
        View Transactions
      </button>

      <button onClick={() => navigate("/fraud-detection", { state: { account } })}>
        Fraud Detection
      </button>

      <button onClick={() => navigate("/account-status", { state: { account } })}>
        Account Status
      </button>

      <div>
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

      {isOwner && (
        <div>
          <h2>Owner Panel</h2>

          <div>
            <h3>Freeze / Unfreeze Account</h3>
            <input
              type="text"
              placeholder="Enter address"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
            />
            <button onClick={handleFreezeAccount} disabled={contractStatus || !isOwner}>
              Freeze
            </button>
            <button onClick={handleUnfreezeAccount} disabled={contractStatus || !isOwner}>
              Unfreeze
            </button>
          </div>

          <div>
            <h3>Check Account Freeze Status</h3>
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

          <div>
            <h3>Transfer Ownership</h3>
            <input
              type="text"
              placeholder="New owner address"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
            />
            <button onClick={transferOwnership}>Transfer</button>
          </div>

          <div>
            <h3>Pause / Resume Contract</h3>
            <button onClick={handlePauseContract} disabled={contractStatus || !isOwner}>
              Pause Contract
            </button>
            <button onClick={handleResumeContract} disabled={!contractStatus || !isOwner}>
              Resume Contract
            </button>
          </div>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Dashboard;
