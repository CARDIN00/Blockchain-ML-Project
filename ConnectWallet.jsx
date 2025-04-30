import { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import contractABI from "../utils/contractABI.jsx";

const contractAddress = "0x052d5D86568BEf96EaFa3b0A049Bc4dc11D10B93";

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fraudThreshold, setFraudThreshold] = useState(1000);  // Added state for fraud threshold
  const [penaltyAmount, setPenaltyAmount] = useState(500);      // Added state for penalty amount
  const [transactions, setTransactions] = useState([]);         // Added state for user transactions
  const [fraudulentTransactions, setFraudulentTransactions] = useState([]); // State for fraudulent transactions
  const [fraudUsers, setFraudUsers] = useState([]);             // State for fraudulent users
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to use this feature.");
      return;
    }

    setIsLoading(true); // Start loading
    setMessage("Connecting wallet...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      //  Get contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      //  Check if the connected address is the contract owner
      const owner = await contract.owner();
      const userIsOwner = address.toLowerCase() === owner.toLowerCase();
      setIsOwner(userIsOwner);

      setMessage("Wallet Connected Successfully!");

      //  Navigate to Dashboard with all required state values
      navigate("/dashboard", {
        state: {
          account: address,
          isOwner: userIsOwner,
          fraudThreshold,            // Pass fraud threshold state
          penaltyAmount,             // Pass penalty amount state
          transactions,              // Pass transactions state
          fraudulentTransactions,    // Pass fraudulent transactions state
          fraudUsers,                // Pass fraud users state
        },
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        //  Handle user rejection case
        setMessage("Connection rejected by user.");
      } else {
        setMessage("Error connecting wallet. Please try again.");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="connect-container">
      <h1>Connect Wallet</h1>
      <button className="connect-wallet-btn" onClick={connectWallet} disabled={isLoading}>
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </button>
      {account && (
        <p>
          Connected Address: {account} {isOwner ? "(Owner)" : "(User)"}
        </p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ConnectWallet;
