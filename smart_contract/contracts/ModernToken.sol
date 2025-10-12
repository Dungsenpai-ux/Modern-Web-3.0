// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ModernToken
 * @dev Token ERC-20 cho dự án Modern Web 3.0
 * - Tên: Modern Web Token
 * - Symbol: MWT
 * - Decimals: 18
 * - Tính năng: Burnable, Pausable, Mintable
 */
contract ModernToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    // Tổng supply tối đa: 1 tỷ tokens
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    
    // Mapping để theo dõi whitelist (nếu cần)
    mapping(address => bool) public whitelist;
    
    event AddedToWhitelist(address indexed account);
    event RemovedFromWhitelist(address indexed account);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    constructor() ERC20("Modern Web Token", "MWT") Ownable(msg.sender) {
        // Mint 100 triệu tokens cho owner ban đầu
        _mint(msg.sender, 100_000_000 * 10**18);
    }

    /**
     * @dev Mint thêm token (chỉ owner)
     * @param to Địa chỉ nhận token
     * @param amount Số lượng token
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Tạm dừng tất cả transfers (khẩn cấp)
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Tiếp tục transfers
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Thêm address vào whitelist
     */
    function addToWhitelist(address account) public onlyOwner {
        whitelist[account] = true;
        emit AddedToWhitelist(account);
    }

    /**
     * @dev Xóa address khỏi whitelist
     */
    function removeFromWhitelist(address account) public onlyOwner {
        whitelist[account] = false;
        emit RemovedFromWhitelist(account);
    }

    /**
     * @dev Batch mint cho nhiều addresses
     */
    function batchMint(address[] memory recipients, uint256[] memory amounts) public onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(totalSupply() + amounts[i] <= MAX_SUPPLY, "Exceeds max supply");
            _mint(recipients[i], amounts[i]);
            emit TokensMinted(recipients[i], amounts[i]);
        }
    }

    /**
     * @dev Burn tokens từ address khác (cần approve trước)
     */
    function burnFrom(address account, uint256 amount) public override {
        super.burnFrom(account, amount);
        emit TokensBurned(account, amount);
    }

    /**
     * @dev Override _update để kết hợp Pausable
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
