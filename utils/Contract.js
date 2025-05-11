import { ethers } from "ethers";
import contractABI from "./contractABI.json";

const contractAddress = "0x052d5D86568BEf96EaFa3b0A049Bc4dc11D10B93";

// Function to get the contract instance
const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not detected");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

// Function to get the contract owner
export const getContractOwner = async () => {
  const contract = await getContract();
  return contract.owner();
};

export default getContract;
