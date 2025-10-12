// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Transactions is Ownable, ReentrancyGuard, ERC721URIStorage {
    uint256 public transactionCount;
    uint256 public nftTokenId;

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
        string txType; // "ETH", "ERC20", "NFT"
    }

    mapping(uint256 => TransferStruct) public transactions;

    event Transfer(
        address from,
        address receiver,
        uint amount,
        string message,
        uint256 timestamp,
        string keyword,
        string txType
    );
    event ERC20Sent(address indexed token, address indexed from, address indexed to, uint256 amount);
    event NFTMinted(address indexed to, uint256 tokenId, string uri);

    constructor() ERC721("ModernWeb3NFT", "MW3N") Ownable(msg.sender) {}

    // Giao dịch ETH thực tế
    function sendETH(address payable receiver, string memory message, string memory keyword) public payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        receiver.transfer(msg.value);

        transactions[transactionCount] = TransferStruct(msg.sender, receiver, msg.value, message, block.timestamp, keyword, "ETH");
        emit Transfer(msg.sender, receiver, msg.value, message, block.timestamp, keyword, "ETH");
        transactionCount += 1;
    }

    // Giao dịch ERC20 token
    function sendERC20(address token, address receiver, uint256 amount, string memory message, string memory keyword) public nonReentrant {
        require(amount > 0, "Amount must be > 0");
        IERC20(token).transferFrom(msg.sender, receiver, amount);

        transactions[transactionCount] = TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword, "ERC20");
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword, "ERC20");
        emit ERC20Sent(token, msg.sender, receiver, amount);
        transactionCount += 1;
    }

    // Mint NFT (chỉ Owner hoặc bạn mở rộng logic cho user gọi)
    function mintNFT(address to, string memory tokenURI, string memory message, string memory keyword) public onlyOwner nonReentrant {
        nftTokenId += 1;
        _mint(to, nftTokenId);
        _setTokenURI(nftTokenId, tokenURI);

        transactions[transactionCount] = TransferStruct(msg.sender, to, nftTokenId, message, block.timestamp, keyword, "NFT");
        emit Transfer(msg.sender, to, nftTokenId, message, block.timestamp, keyword, "NFT");
        emit NFTMinted(to, nftTokenId, tokenURI);
        transactionCount += 1;
    }

    // Lấy lịch sử giao dịch (trả về một số lượng tối đa để tránh gas cao)
    function getTransactions(uint256 fromIdx, uint256 toIdx) public view returns (TransferStruct[] memory) {
        require(toIdx > fromIdx && toIdx <= transactionCount, "Invalid index range");
        TransferStruct[] memory txs = new TransferStruct[](toIdx - fromIdx);
        for (uint256 i = fromIdx; i < toIdx; i++) {
            txs[i - fromIdx] = transactions[i];
        }
        return txs;
    }

    // Giao dịch mint NFT cho user (nếu muốn mở quyền cho user mint)
    function mintNFTByUser(string memory tokenURI, string memory message, string memory keyword) public nonReentrant {
        nftTokenId += 1;
        _mint(msg.sender, nftTokenId);
        _setTokenURI(nftTokenId, tokenURI);

        transactions[transactionCount] = TransferStruct(msg.sender, msg.sender, nftTokenId, message, block.timestamp, keyword, "NFT");
        emit Transfer(msg.sender, msg.sender, nftTokenId, message, block.timestamp, keyword, "NFT");
        emit NFTMinted(msg.sender, nftTokenId, tokenURI);
        transactionCount += 1;
    }
}