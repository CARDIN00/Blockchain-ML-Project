import { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import contractABI from "../utils/contractABI.jsx";

const contractAddress = "0x052d5D86568BEf96EaFa3b0A049Bc4dc11D10B93";

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
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

      // Get contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Check if the connected address is the contract owner
      const owner = await contract.owner();
      const userIsOwner = address.toLowerCase() === owner.toLowerCase();
      setIsOwner(userIsOwner);

      setMessage("Wallet Connected Successfully!");

      // Navigate to Dashboard with all required state values
      navigate("/dashboard", {
        state: {
          account: address,
          isOwner: userIsOwner,
        },
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        // User rejected the connection request
        setMessage("Connection rejected by user.");
      } else {
        setMessage("Error connecting wallet. Please try again.");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <h1>Connect Wallet</h1>
      <button onClick={connectWallet} disabled={isLoading}>
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
