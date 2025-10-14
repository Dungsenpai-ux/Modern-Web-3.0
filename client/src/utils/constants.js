import abi from "./Transactions.json";

// Đọc contract address từ environment variables
export const contractAddress = import.meta.env.VITE_TRANSACTIONS_CONTRACT;
export const contractABI = abi.abi;

// Log để debug
console.log("📍 Contract Address:", contractAddress);
console.log("📄 Contract ABI:", contractABI ? "Loaded ✅" : "Missing ❌");