// filepath: client/src/components/Transactions.jsx
import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import useFetch from "../hooks/useFetch";
import dummyData from "../utils/dummyData";
import { shortenAddress } from "../utils/shortenAddress";

const TransactionsCard = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url, gifUrl, ipfsHash }) => {
  // ✅ ƯU TIÊN SỬ DỤNG GIF TỪ IPFS, NẾU KHÔNG CÓ THÌ DÙNG KEYWORD
  const gifFromIPFS = gifUrl || url; // gifUrl từ IPFS data
  const gifFromKeyword = useFetch({ keyword }); // Fallback từ Giphy API
  const finalGif = gifFromIPFS || gifFromKeyword;

  return (
    <div className="bg-[#181918] m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl"
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="display-flex justify-start w-full mb-6 p-2">
          <a href={`https://sepolia.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">From: {shortenAddress(addressFrom)}</p>
          </a>
          <a href={`https://sepolia.etherscan.io/address/${addressTo}`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">To: {shortenAddress(addressTo)}</p>
          </a>
          <p className="text-white text-base">Amount: {amount} ETH</p>
          {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message}</p>
            </>
          )}
          
          {/* ✅ HIỂN THỊ IPFS HASH NẾU CÓ */}
          {ipfsHash && (
            <>
              <br />
              <a 
                href={`https://ipfs.io/ipfs/${ipfsHash}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-400 text-sm hover:underline"
              >
                📦 View on IPFS: {ipfsHash.substring(0, 15)}...
              </a>
            </>
          )}
        </div>
        
        {/* ✅ HIỂN THỊ GIF TỪ IPFS */}
        {finalGif && (
          <img
            src={finalGif}
            alt="gif"
            className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
          />
        )}
        
        <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const { transactions, currentAccount } = useContext(TransactionContext);

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">
            Latest Transactions
          </h3>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest transactions
          </h3>
        )}

        <div className="flex flex-wrap justify-center items-center mt-10">
          {/* ✅ HIỂN THỊ TẤT CẢ TRANSACTIONS VỚI DỮ LIỆU TỪ IPFS (không mutate state) */}
          {currentAccount && transactions?.length === 0 && (
            <p className="text-gray-300 text-base">Chưa có giao dịch nào. Hãy thử gửi một giao dịch để thấy lịch sử hiển thị ở đây.</p>
          )}
          {[...(transactions || [])].reverse().map((transaction, i) => (
            <TransactionsCard key={i} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;