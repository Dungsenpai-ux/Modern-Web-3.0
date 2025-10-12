// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ModernNFT
 * @dev NFT Contract cho Modern Web 3.0
 * - Mint NFT với metadata trên IPFS
 * - Royalty support
 * - Enumerable để dễ query
 */
contract ModernNFT is ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    
    // Giá mint NFT (0.01 ETH)
    uint256 public mintPrice = 0.01 ether;
    
    // Tổng số NFT tối đa
    uint256 public constant MAX_SUPPLY = 10000;
    
    // Royalty percentage (5%)
    uint256 public royaltyPercentage = 500; // 5% = 500/10000
    
    struct NFTMetadata {
        string ipfsHash;
        address creator;
        uint256 createdAt;
        uint256 price;
    }
    
    mapping(uint256 => NFTMetadata) public nftMetadata;
    mapping(address => uint256[]) public creatorNFTs;
    
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string ipfsHash,
        uint256 timestamp
    );
    
    event NFTTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 price
    );

    constructor() ERC721("Modern Web 3.0 NFT", "MW3NFT") Ownable(msg.sender) {}

    /**
     * @dev Mint NFT mới
     * @param ipfsHash IPFS hash của metadata
     */
    function mintNFT(string memory ipfsHash) public payable nonReentrant returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, ipfsHash);
        
        nftMetadata[newTokenId] = NFTMetadata({
            ipfsHash: ipfsHash,
            creator: msg.sender,
            createdAt: block.timestamp,
            price: msg.value
        });
        
        creatorNFTs[msg.sender].push(newTokenId);
        
        emit NFTMinted(newTokenId, msg.sender, ipfsHash, block.timestamp);
        
        return newTokenId;
    }
    
    /**
     * @dev Owner mint NFT miễn phí
     */
    function ownerMint(address to, string memory ipfsHash) public onlyOwner returns (uint256) {
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, ipfsHash);
        
        nftMetadata[newTokenId] = NFTMetadata({
            ipfsHash: ipfsHash,
            creator: to,
            createdAt: block.timestamp,
            price: 0
        });
        
        creatorNFTs[to].push(newTokenId);
        
        emit NFTMinted(newTokenId, to, ipfsHash, block.timestamp);
        
        return newTokenId;
    }
    
    /**
     * @dev Batch mint nhiều NFT
     */
    function batchMint(string[] memory ipfsHashes) public payable nonReentrant returns (uint256[] memory) {
        require(msg.value >= mintPrice * ipfsHashes.length, "Insufficient payment");
        require(_tokenIdCounter + ipfsHashes.length <= MAX_SUPPLY, "Exceeds max supply");
        
        uint256[] memory tokenIds = new uint256[](ipfsHashes.length);
        
        for (uint256 i = 0; i < ipfsHashes.length; i++) {
            _tokenIdCounter++;
            uint256 newTokenId = _tokenIdCounter;
            
            _safeMint(msg.sender, newTokenId);
            _setTokenURI(newTokenId, ipfsHashes[i]);
            
            nftMetadata[newTokenId] = NFTMetadata({
                ipfsHash: ipfsHashes[i],
                creator: msg.sender,
                createdAt: block.timestamp,
                price: mintPrice
            });
            
            creatorNFTs[msg.sender].push(newTokenId);
            tokenIds[i] = newTokenId;
            
            emit NFTMinted(newTokenId, msg.sender, ipfsHashes[i], block.timestamp);
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Lấy NFTs của một creator
     */
    function getNFTsByCreator(address creator) public view returns (uint256[] memory) {
        return creatorNFTs[creator];
    }
    
    /**
     * @dev Lấy tổng số NFT đã mint
     */
    function totalMinted() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Set giá mint
     */
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }
    
    /**
     * @dev Set royalty percentage
     */
    function setRoyaltyPercentage(uint256 newPercentage) public onlyOwner {
        require(newPercentage <= 1000, "Max 10%");
        royaltyPercentage = newPercentage;
    }
    
    /**
     * @dev Rút tiền từ contract
     */
    function withdraw() public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Override functions để tương thích với cả URIStorage và Enumerable
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
