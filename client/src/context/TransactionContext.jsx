import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";
// IPFS helpers (không dùng trong phiên bản contract hiện tại)

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ 
    addressTo: "", 
    amount: "", 
    keyword: "", 
    message: "",
    gifUrl: "",
    gifFile: null // ← THÊM GIF FILE
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  // ✅ Đảm bảo MetaMask đang ở đúng mạng (Hardhat localhost 31337)
  const ensureNetwork = async () => {
    try {
      if (!ethereum) return;
      const targetChainIdHex = '0x7A69'; // 31337
      const currentChainId = await ethereum.request({ method: 'eth_chainId' });
      if (currentChainId !== targetChainIdHex) {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainIdHex }],
          });
        } catch (switchError) {
          // 4902: chain chưa được add
          if (switchError?.code === 4902) {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: targetChainIdHex,
                  chainName: 'Localhost 8545',
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                  rpcUrls: ['http://127.0.0.1:8545'],
                },
              ],
            });
          } else {
            console.error('⚠️ Không thể chuyển mạng:', switchError);
          }
        }
      }
    } catch (e) {
      console.error('⚠️ ensureNetwork error:', e);
    }
  };

  const handleChange = (e, name) => {
    // ✅ Xử lý file upload riêng
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      if (file) {
        console.log('📁 File selected:', file.name, file.type, file.size);
        setformData((prevState) => ({ ...prevState, [name]: file }));
      }
    } else {
      // Text input thông thường
      setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }
  };

  // ✅ LẤY TRANSACTIONS TỪ CONTRACT: transactionCount + getTransactions(0, count)
  const getAllTransactions = async () => {
    try {
      if (!ethereum) return console.log("Ethereum is not present");
      const transactionsContract = createEthereumContract();
      const countBN = await transactionsContract.transactionCount();
      const count = Number(countBN.toString());
      if (!count) { setTransactions([]); return; }

      const fetched = await transactionsContract.getTransactions(0, count);
      const structured = fetched.map((t) => {
        const ts = t.timestamp?.toNumber ? t.timestamp.toNumber() : Number(t.timestamp);
        const isETH = (t.txType || "ETH") === "ETH";
        let amountStr = "0";
        try {
          amountStr = isETH ? ethers.utils.formatEther(t.amount) : (t.amount?.toString?.() || String(t.amount));
        } catch {
          amountStr = t.amount?._hex ? (parseInt(t.amount._hex, 16) / 1e18).toString() : String(t.amount);
        }
        return {
          addressTo: t.receiver,
          addressFrom: t.sender,
          timestamp: new Date(ts * 1000).toLocaleString(),
          message: t.message,
          keyword: t.keyword,
          amount: amountStr,
          txType: t.txType || "ETH",
        };
      });
      console.log("📊 All transactions:", structured);
      setTransactions(structured);
    } catch (error) {
      console.log("getAllTransactions error:", error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      // Đảm bảo đang ở mạng localhost trước khi lấy accounts
      await ensureNetwork();

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions(); // ← Tự động load transactions
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (!ethereum) return;
      const transactionsContract = createEthereumContract();
      const currentTransactionCount = await transactionsContract.transactionCount();
      window.localStorage.setItem("transactionCount", currentTransactionCount.toString());
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");
      // Chuyển MetaMask sang localhost nếu đang ở Sepolia (hoặc mạng khác)
      await ensureNetwork();

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  // ✅ CẬP NHẬT HÀM GỬI GIAO DỊCH - LƯU URL VÀO IPFS
  const sendTransaction = async () => {
    try {
      if (!ethereum) return console.log("No ethereum object");
      const { addressTo, amount, keyword, message } = formData;
      const transactionsContract = createEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      const tx = await transactionsContract.sendETH(addressTo, message || "", keyword || "", {
        value: parsedAmount,
      });

      setIsLoading(true);
      console.log(`Loading - ${tx.hash}`);
      await tx.wait();
      console.log(`Success - ${tx.hash}`);
      setIsLoading(false);

      const transactionsCount = await transactionsContract.transactionCount();
      setTransactionCount(Number(transactionsCount.toString()));
      await getAllTransactions();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    // Khi app mount, cố gắng chuyển network rồi kiểm tra ví
    ensureNetwork().finally(() => {
      checkIfWalletIsConnect();
    });
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};